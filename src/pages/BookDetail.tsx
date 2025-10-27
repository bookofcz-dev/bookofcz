import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/integrations/supabase/client';
import { useWallet } from '@/contexts/WalletContext';
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';
import { ReviewForm } from '@/components/marketplace/ReviewForm';
import { ReviewList } from '@/components/marketplace/ReviewList';
import { EpubViewer } from '@/components/marketplace/EpubViewer';
import { PdfViewer } from '@/components/marketplace/PdfViewer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, Star, Wallet, ExternalLink, BookOpen, X } from 'lucide-react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { createPurchaseMessage, requestWalletSignature, verifyWalletSignature } from '@/lib/walletSecurity';
import { ethers } from 'ethers';

interface Book {
  id: string;
  title: string;
  description: string;
  author: string;
  cover_url: string;
  pdf_url: string;
  price_usdt: number;
  price_bnb: number; // Legacy field
  category: string;
  average_rating: number;
  review_count: number;
  download_count: number;
  creator_wallet: string;
  isbn?: string;
}

interface Review {
  id: string;
  rating: number;
  review_text: string | null;
  reviewer_wallet: string;
  created_at: string;
}

export default function BookDetail() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { account, connectWallet, disconnectWallet, isConnecting, sendTransaction, sendTokenTransaction, sendUsdtTransaction, getTokenBalance, provider } = useWallet();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'BNB' | 'BOCZ' | 'USDT'>('USDT');
  const [boczBalance, setBoczBalance] = useState<string>('0');
  const [usdtBalance, setUsdtBalance] = useState<string>('0');
  const [boczPriceInBnb, setBoczPriceInBnb] = useState<number>(0);
  const [bnbPriceInUsdt, setBnbPriceInUsdt] = useState<number>(0);
  const [showViewer, setShowViewer] = useState(false);
  const [viewerUrl, setViewerUrl] = useState<string>('');
  const [viewerTitle, setViewerTitle] = useState<string>('');
  const [purchaseData, setPurchaseData] = useState<{ transaction_hash: string; download_count: number } | null>(null);
  
  const DOWNLOAD_LIMIT = 5;
  
  // Calculate conversion rates
  const USDT_TO_BNB_RATE = bnbPriceInUsdt > 0 ? 1 / bnbPriceInUsdt : 0;
  const USDT_TO_BOCZ_RATE = (bnbPriceInUsdt > 0 && boczPriceInBnb > 0) 
    ? (1 / bnbPriceInUsdt) / boczPriceInBnb 
    : 0;

  useEffect(() => {
    fetchBoczPrice();
    fetchBnbPrice();
  }, []);

  useEffect(() => {
    if (bookId) {
      fetchBook();
      fetchReviews();
      if (account) {
        checkPurchase();
        checkReview();
        loadBoczBalance();
        loadUsdtBalance();
      }
    }
  }, [bookId, account]);

  const fetchBoczPrice = async () => {
    try {
      const response = await fetch('https://api.dexscreener.com/latest/dex/pairs/bsc/0x9eed59058fc57c4bbaf92ea706e21d788fb6f278');
      const data = await response.json();
      if (data.pair && data.pair.priceNative) {
        // priceNative is the price in BNB
        setBoczPriceInBnb(parseFloat(data.pair.priceNative));
      }
    } catch (error) {
      console.error('Error fetching BOCZ price:', error);
      // Fallback to a default rate if API fails
      setBoczPriceInBnb(0.000049); // Approximate fallback
    }
  };

  const fetchBnbPrice = async () => {
    try {
      const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT');
      const data = await response.json();
      if (data.price) {
        setBnbPriceInUsdt(parseFloat(data.price));
      }
    } catch (error) {
      console.error('Error fetching BNB price:', error);
      // Fallback to a default rate if API fails
      setBnbPriceInUsdt(600); // Approximate fallback
    }
  };

  const loadBoczBalance = async () => {
    if (account && getTokenBalance) {
      const balance = await getTokenBalance(account);
      setBoczBalance(parseFloat(balance).toFixed(2));
    }
  };

  const loadUsdtBalance = async () => {
    if (account && getTokenBalance) {
      const USDT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955';
      const balance = await getTokenBalance(account, USDT_ADDRESS);
      setUsdtBalance(parseFloat(balance).toFixed(2));
    }
  };

  const fetchBook = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_books')
        .select('*')
        .eq('id', bookId)
        .eq('approval_status', 'approved')
        .single();

      if (error) throw error;
      setBook(data);
    } catch (error) {
      console.error('Error fetching book:', error);
      toast.error('Book not found');
      navigate('/marketplace');
    } finally {
      setLoading(false);
    }
  };

  const checkPurchase = async () => {
    if (!account || !bookId) return;

    try {
      const { data, error } = await supabase
        .from('marketplace_purchases')
        .select('id, transaction_hash, download_count')
        .eq('book_id', bookId)
        .eq('buyer_wallet', account.toLowerCase())
        .maybeSingle();

      if (error) throw error;
      setHasPurchased(!!data);
      if (data) {
        setPurchaseData({
          transaction_hash: data.transaction_hash,
          download_count: data.download_count || 0
        });
      }
    } catch (error) {
      console.error('Error checking purchase:', error);
    }
  };

  const checkReview = async () => {
    if (!account || !bookId) return;

    try {
      const { data, error } = await supabase
        .from('marketplace_reviews')
        .select('id')
        .eq('book_id', bookId)
        .eq('reviewer_wallet', account.toLowerCase())
        .maybeSingle();

      if (error) throw error;
      setHasReviewed(!!data);
    } catch (error) {
      console.error('Error checking review:', error);
    }
  };

  const fetchReviews = async () => {
    if (!bookId) return;

    try {
      const { data, error } = await supabase
        .from('marketplace_reviews')
        .select('*')
        .eq('book_id', bookId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handlePurchase = async () => {
    if (!book || !account || !provider) return;

    setPurchasing(true);
    try {
      const platformWallet = '0x6e22449bEbc5C719fA7ADB39bc2576B9E6F11bd8';
      const bookPriceUSDT = book.price_usdt || book.price_bnb; // Fallback to price_bnb for legacy books
      
      let creatorAmount: string;
      let platformFee: string;
      let totalPrice: string;
      let pricePaidUSDT: number;
      
      if (paymentMethod === 'USDT') {
        // USDT payment: Direct 1:1 with book price, 4% platform fee
        const totalUSDT = bookPriceUSDT;
        const creatorUSDT = totalUSDT * 0.96;
        const platformFeeUSDT = totalUSDT * 0.04;
        
        creatorAmount = creatorUSDT.toFixed(2);
        platformFee = platformFeeUSDT.toFixed(2);
        totalPrice = totalUSDT.toFixed(2);
        pricePaidUSDT = bookPriceUSDT;
        
        console.log(`💵 USDT Payment - Total: ${totalUSDT} USDT (Creator: ${creatorUSDT.toFixed(2)}, Platform Fee: ${platformFeeUSDT.toFixed(2)})`);
      } else if (paymentMethod === 'BNB') {
        // BNB payment: 4% platform fee
        const totalBNB = bookPriceUSDT * USDT_TO_BNB_RATE;
        const creatorBNB = totalBNB * 0.96;
        const platformFeeBNB = totalBNB * 0.04;
        
        creatorAmount = creatorBNB.toFixed(6);
        platformFee = platformFeeBNB.toFixed(6);
        totalPrice = totalBNB.toFixed(6);
        pricePaidUSDT = bookPriceUSDT;
      } else {
        // BOCZ payment: 4% platform fee
        const totalBOCZ = bookPriceUSDT * USDT_TO_BOCZ_RATE;
        const creatorBOCZ = totalBOCZ * 0.96;
        const platformFeeBOCZ = totalBOCZ * 0.04;
        
        creatorAmount = creatorBOCZ.toFixed(0);
        platformFee = platformFeeBOCZ.toFixed(0);
        totalPrice = totalBOCZ.toFixed(0);
        pricePaidUSDT = bookPriceUSDT;
        
        console.log(`💰 BOCZ Payment - Total: ${totalBOCZ.toFixed(0)} $BOCZ (Creator: ${creatorBOCZ.toFixed(0)}, Platform Fee: ${platformFeeBOCZ.toFixed(0)})`);
      }
      
      // Validate recipient addresses
      if (!ethers.isAddress(book.creator_wallet)) {
        throw new Error('Invalid creator wallet address');
      }
      if (!ethers.isAddress(platformWallet)) {
        throw new Error('Invalid platform wallet address');
      }

      // Request wallet signature for verification with timestamp
      const timestamp = Date.now();
      const message = createPurchaseMessage(
        book.id, 
        totalPrice, 
        timestamp, 
        paymentMethod === 'BNB' ? 'BNB' : paymentMethod === 'USDT' ? 'USDT' : '$BOCZ'
      );
      
      toast.info('Please sign the message to verify your purchase...');
      const signature = await requestWalletSignature(provider, message);
      
      // Verify signature freshness (prevent replay attacks)
      const timeSinceSign = Date.now() - timestamp;
      if (timeSinceSign > 60000) { // 1 minute expiry
        throw new Error('Signature expired. Please try again.');
      }
      
      // Verify signature
      const isValid = await verifyWalletSignature(message, signature, account);
      if (!isValid) {
        throw new Error('Signature verification failed');
      }

      // Check if signature was already used (prevent replay attacks)
      const { data: existingSig, error: sigCheckError } = await supabase
        .from('purchase_signatures')
        .select('id')
        .eq('signature', signature)
        .maybeSingle();

      if (sigCheckError) {
        console.error('Error checking signature:', sigCheckError);
      }

      if (existingSig) {
        throw new Error('This signature has already been used');
      }

      // Record signature to prevent replay
      const { error: sigInsertError } = await supabase
        .from('purchase_signatures')
        .insert({
          signature,
          book_id: book.id,
          buyer_wallet: account.toLowerCase(),
          timestamp,
        });

      if (sigInsertError) {
        console.error('Error recording signature:', sigInsertError);
        throw new Error('Failed to record signature');
      }
      
      let creatorTx: any;
      let platformTx: any;

      if (paymentMethod === 'USDT') {
        // Send USDT payment to creator (96%)
        toast.info('Confirm USDT payment to creator...');
        creatorTx = await sendUsdtTransaction(book.creator_wallet, parseFloat(creatorAmount));
        
        toast.info('Processing creator payment...');
        const creatorReceipt = await creatorTx.wait();
        
        if (!creatorReceipt || creatorReceipt.status !== 1) {
          throw new Error('Creator payment failed');
        }

        // Verify USDT token transfer amount on-chain
        const TRANSFER_EVENT_SIGNATURE = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
        const transferLog = creatorReceipt.logs.find(
          log => log.topics[0] === TRANSFER_EVENT_SIGNATURE
        );

        if (!transferLog) {
          throw new Error('Token transfer event not found');
        }

        // Parse transfer amount from event data (USDT has 18 decimals on BSC)
        const actualAmount = ethers.toBigInt(transferLog.data);
        const expectedAmount = ethers.parseUnits(creatorAmount, 18);

        if (actualAmount < expectedAmount) {
          throw new Error(`Insufficient payment: expected ${creatorAmount} USDT`);
        }

        // Send platform fee (4%) in USDT
        if (parseFloat(platformFee) > 0) {
          toast.info('Confirm platform fee...');
          platformTx = await sendUsdtTransaction(platformWallet, parseFloat(platformFee));
          
          toast.info('Processing platform fee...');
          const platformReceipt = await platformTx.wait();
          
          if (!platformReceipt || platformReceipt.status !== 1) {
            throw new Error('Platform fee payment failed');
          }
        } else {
          platformTx = creatorTx;
        }
      } else if (paymentMethod === 'BNB') {
        // Send BNB payment to creator (96%)
        toast.info('Confirm payment to creator...');
        creatorTx = await sendTransaction(book.creator_wallet, creatorAmount);
        
        toast.info('Processing creator payment...');
        const creatorReceipt = await creatorTx.wait();
        
        if (!creatorReceipt || creatorReceipt.status !== 1) {
          throw new Error('Creator payment failed');
        }

        // Verify transaction on-chain
        const txDetails = await provider.getTransaction(creatorTx.hash);
        if (!txDetails) {
          throw new Error('Transaction not found on chain');
        }
        
        // Verify transaction details
        const actualAmount = ethers.formatEther(txDetails.value);
        if (Math.abs(parseFloat(actualAmount) - parseFloat(creatorAmount)) > 0.000001) {
          throw new Error('Transaction amount mismatch');
        }
        
        if (txDetails.to?.toLowerCase() !== book.creator_wallet.toLowerCase()) {
          throw new Error('Transaction recipient mismatch');
        }

        // Send platform fee (4%)
        toast.info('Confirm platform fee...');
        platformTx = await sendTransaction(platformWallet, platformFee);
        
        toast.info('Processing platform fee...');
        const platformReceipt = await platformTx.wait();
        
        if (!platformReceipt || platformReceipt.status !== 1) {
          throw new Error('Platform fee payment failed');
        }
      } else {
        // Send BOCZ token payment to creator (96%)
        console.log(`🪙 Charging ${totalPrice} $BOCZ tokens from wallet (${creatorAmount} to creator, ${platformFee} platform fee)`);
        toast.info(`Confirm payment of ${creatorAmount} $BOCZ tokens to creator...`);
        creatorTx = await sendTokenTransaction(book.creator_wallet, parseFloat(creatorAmount));
        
        toast.info('Processing $BOCZ token payment...');
        const creatorReceipt = await creatorTx.wait();
        
        if (!creatorReceipt || creatorReceipt.status !== 1) {
          throw new Error('Creator payment failed');
        }

        // Verify BOCZ token transfer amount on-chain
        const TRANSFER_EVENT_SIGNATURE = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
        const transferLog = creatorReceipt.logs.find(
          log => log.topics[0] === TRANSFER_EVENT_SIGNATURE
        );

        if (!transferLog) {
          throw new Error('Token transfer event not found');
        }

        // Parse transfer amount from event data
        const actualAmount = ethers.toBigInt(transferLog.data);
        const expectedAmount = ethers.parseUnits(creatorAmount, 18);

        if (actualAmount < expectedAmount) {
          throw new Error(`Insufficient payment: expected ${creatorAmount} $BOCZ`);
        }

        // Send platform fee (4%) in BOCZ to admin wallet
        if (parseFloat(platformFee) > 0) {
          toast.info('Confirm platform fee...');
          platformTx = await sendTokenTransaction(platformWallet, parseFloat(platformFee));
          
          toast.info('Processing platform fee...');
          const platformReceipt = await platformTx.wait();
          
          if (!platformReceipt || platformReceipt.status !== 1) {
            throw new Error('Platform fee payment failed');
          }
        } else {
          platformTx = creatorTx; // Reference tx if no fee
        }
      }

      // Record purchase with verification
      const { error: purchaseError } = await supabase
        .from('marketplace_purchases')
        .insert({
          book_id: book.id,
          buyer_wallet: account.toLowerCase(),
          price_paid: pricePaidUSDT,
          creator_amount: parseFloat(creatorAmount),
          platform_fee: parseFloat(platformFee),
          transaction_hash: creatorTx.hash,
        });

      if (purchaseError) throw purchaseError;

      // Update download count
      const { error: updateError } = await supabase
        .from('marketplace_books')
        .update({ download_count: (book.download_count || 0) + 1 })
        .eq('id', book.id);

      if (updateError) console.error('Error updating download count:', updateError);

      toast.success('Purchase successful! You can now download the book.');
      setHasPurchased(true);
      
      // Refresh balance if paid with BOCZ or USDT
      if (paymentMethod === 'BOCZ') {
        loadBoczBalance();
      } else if (paymentMethod === 'USDT') {
        loadUsdtBalance();
      }
    } catch (error: any) {
      console.error('Error purchasing book:', error);
      toast.error(error.message || 'Purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  const handleDownload = async () => {
    if (!book || !account || !purchaseData) return;

    const bookPrice = book.price_usdt || book.price_bnb;
    if (bookPrice > 0 && !hasPurchased) {
      toast.error('Please purchase the book first');
      return;
    }

    try {
      // Check download limit
      if (purchaseData.download_count >= DOWNLOAD_LIMIT) {
        toast.error(`Download limit reached (${DOWNLOAD_LIMIT} downloads per purchase)`);
        return;
      }

      toast.loading('Generating watermarked file...');
      
      const isEpub = book.pdf_url.toLowerCase().endsWith('.epub');
      const functionName = isEpub ? 'watermark-epub' : 'watermark-pdf';

      // Call watermarking function
      const { data: watermarkData, error: watermarkError } = await supabase.functions.invoke(
        functionName,
        {
          body: {
            bookId: book.id,
            buyerWallet: account,
            transactionHash: purchaseData.transaction_hash,
          }
        }
      );

      if (watermarkError || !watermarkData?.downloadUrl) {
        throw new Error(watermarkError?.message || 'Failed to generate watermarked file');
      }

      // Increment download count
      const { error: updateError } = await supabase
        .from('marketplace_purchases')
        .update({ download_count: purchaseData.download_count + 1 })
        .eq('book_id', book.id)
        .eq('buyer_wallet', account.toLowerCase());

      if (updateError) {
        console.error('Failed to update download count:', updateError);
      }

      // Download the watermarked file
      const link = document.createElement('a');
      link.href = watermarkData.downloadUrl;
      const fileExt = isEpub ? 'epub' : 'pdf';
      link.download = `${book.title}.${fileExt}`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.dismiss();
      toast.success(`Download started! (${purchaseData.download_count + 1}/${DOWNLOAD_LIMIT} downloads used)`);
      
      // Update local state
      setPurchaseData({
        ...purchaseData,
        download_count: purchaseData.download_count + 1
      });
    } catch (error: any) {
      toast.dismiss();
      console.error('Error downloading book:', error);
      toast.error(error.message || 'Failed to download book');
    }
  };

  const handlePreview = async () => {
    if (!book || !account || !purchaseData) return;

    const bookPrice = book.price_usdt || book.price_bnb;
    if (bookPrice > 0 && !hasPurchased) {
      toast.error('Please purchase the book first');
      return;
    }

    try {
      // Extract file path from URL if it's a full URL
      let filePath = book.pdf_url;
      if (filePath.includes('/storage/v1/object/')) {
        const urlParts = filePath.split('/storage/v1/object/public/book-pdfs/');
        if (urlParts.length > 1) {
          filePath = urlParts[1];
        }
      } else if (filePath.startsWith('http')) {
        const match = filePath.match(/book-pdfs\/(.+)$/);
        if (match) {
          filePath = match[1];
        }
      }

      console.log('👁️ Previewing:', filePath);

      // Generate signed URL for the file
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('book-pdfs')
        .createSignedUrl(filePath, 3600);

      if (signedUrlError) {
        console.error('Error creating signed URL:', signedUrlError);
        throw new Error(`Failed to generate preview link: ${signedUrlError.message}`);
      }

      if (!signedUrlData?.signedUrl) {
        throw new Error('No preview URL generated');
      }

      // Show viewer in modal for both EPUB and PDF
      setViewerUrl(signedUrlData.signedUrl);
      setViewerTitle(book.title);
      setShowViewer(true);
    } catch (error: any) {
      console.error('Error previewing book:', error);
      toast.error(error.message || 'Failed to preview book');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MarketplaceHeader
          account={account}
          connectWallet={connectWallet}
          disconnectWallet={disconnectWallet}
          isConnecting={isConnecting}
          onUploadClick={() => setShowUpload(true)}
        />
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!book) return null;

  const bookPrice = book.price_usdt || book.price_bnb;
  const canDownload = bookPrice === 0 || hasPurchased;
  
  // Calculate display prices
  const priceInBNB = bookPrice * USDT_TO_BNB_RATE;
  const priceInBOCZ = bookPrice * USDT_TO_BOCZ_RATE;

  return (
    <>
      <Helmet>
        <title>{book.title} - BOCZ Marketplace</title>
        <meta name="description" content={book.description} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <MarketplaceHeader
          account={account}
          connectWallet={connectWallet}
          disconnectWallet={disconnectWallet}
          isConnecting={isConnecting}
          onUploadClick={() => setShowUpload(true)}
        />

        <main className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => navigate('/marketplace')} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Book Cover */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <img
                    src={book.cover_url}
                    alt={book.title}
                    className="w-full rounded-lg shadow-lg"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Book Details */}
            <div className="space-y-6">
              <div>
                <Badge className="mb-2 capitalize">{book.category}</Badge>
                <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
                <p className="text-xl text-muted-foreground">by {book.author}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{book.average_rating.toFixed(1)}</span>
                </div>
                <span className="text-muted-foreground">
                  ({book.review_count} {book.review_count === 1 ? 'review' : 'reviews'})
                </span>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{book.description}</p>
              </div>

              {book.isbn && (
                <div>
                  <h3 className="font-semibold mb-1">ISBN</h3>
                  <p className="text-muted-foreground font-mono">{book.isbn}</p>
                </div>
              )}

              <Separator />

              {/* Price and Actions */}
              <div className="space-y-4">
                 <div className="space-y-2">
                  <div className="text-4xl font-bold text-primary">
                    {bookPrice === 0 ? 'FREE' : `$${bookPrice.toFixed(2)} USDT`}
                  </div>
                  {bookPrice > 0 && (
                    <>
                      <div className="text-lg text-muted-foreground">
                        {paymentMethod === 'USDT'
                          ? `${bookPrice.toFixed(2)} USDT (incl. 4% fee)`
                          : paymentMethod === 'BNB' 
                          ? `≈ ${priceInBNB.toFixed(4)} BNB (incl. 4% fee)` 
                          : `≈ ${priceInBOCZ.toFixed(0)} $BOCZ (0% fee)`}
                      </div>
                       {paymentMethod === 'BOCZ' && (
                        <div className="space-y-1">
                          <div className="text-sm text-green-600 font-medium">
                            ✓ Save 4% with $BOCZ (no platform fee)
                          </div>
                          {account && (
                            <div className="text-sm text-muted-foreground">
                              Your $BOCZ balance: {boczBalance}
                            </div>
                          )}
                        </div>
                      )}
                      {paymentMethod === 'USDT' && account && (
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">
                            Your USDT balance: {usdtBalance}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Includes 4% platform fee (${(bookPrice * 0.04).toFixed(2)} USDT)
                          </div>
                        </div>
                      )}
                      {paymentMethod === 'BNB' && (
                        <div className="text-sm text-muted-foreground">
                          Includes 4% platform fee (≈ {(priceInBNB * 0.04).toFixed(4)} BNB)
                        </div>
                      )}
                    </>
                  )}
                </div>

                {bookPrice > 0 && account && (
                  <div className="space-y-2">
                    <div className="flex gap-2 p-2 bg-muted rounded-lg">
                      <Button
                        variant={paymentMethod === 'USDT' ? 'default' : 'outline'}
                        onClick={() => setPaymentMethod('USDT')}
                        className="flex-1"
                        size="sm"
                      >
                        Pay with USDT
                      </Button>
                      <Button
                        variant={paymentMethod === 'BNB' ? 'default' : 'outline'}
                        onClick={() => setPaymentMethod('BNB')}
                        className="flex-1"
                        size="sm"
                      >
                        Pay with BNB
                      </Button>
                      <Button
                        variant={paymentMethod === 'BOCZ' ? 'default' : 'outline'}
                        onClick={() => setPaymentMethod('BOCZ')}
                        className="flex-1"
                        size="sm"
                      >
                        Pay with $BOCZ
                      </Button>
                    </div>
                    
                    {paymentMethod === 'BOCZ' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => window.open('https://pancakeswap.finance/swap?outputCurrency=0x701bE97c604A35aB7BCF6C75cA6de3aba0704444', '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Swap to $BOCZ
                      </Button>
                    )}
                  </div>
                )}

                {!account ? (
                  <Button onClick={connectWallet} size="lg" className="w-full">
                    <Wallet className="h-5 w-5 mr-2" />
                    Connect Wallet to {bookPrice === 0 ? 'Download' : 'Purchase'}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    {bookPrice > 0 && !hasPurchased && (
                      <Button
                        onClick={handlePurchase}
                        disabled={purchasing}
                        size="lg"
                        className="w-full"
                      >
                        {purchasing ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Wallet className="h-5 w-5 mr-2" />
                            Purchase for {paymentMethod === 'USDT' 
                              ? `${bookPrice.toFixed(2)} USDT`
                              : paymentMethod === 'BNB' 
                              ? `${priceInBNB.toFixed(4)} BNB` 
                              : `${priceInBOCZ.toFixed(0)} $BOCZ`}
                          </>
                        )}
                      </Button>
                    )}

                    {canDownload && purchaseData && (
                      <>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                          <span>Downloads: {purchaseData.download_count}/{DOWNLOAD_LIMIT}</span>
                          {purchaseData.download_count >= DOWNLOAD_LIMIT && (
                            <Badge variant="destructive" className="text-xs">
                              Limit Reached
                            </Badge>
                          )}
                        </div>
                        <Button 
                          onClick={handleDownload} 
                          size="lg" 
                          className="w-full" 
                          variant="default"
                          disabled={purchaseData.download_count >= DOWNLOAD_LIMIT}
                        >
                          <Download className="h-5 w-5 mr-2" />
                          Download Watermarked
                        </Button>
                      </>
                    )}

                    {canDownload && (
                      <Button onClick={handlePreview} size="lg" className="w-full" variant="outline">
                        <BookOpen className="h-5 w-5 mr-2" />
                        Read in Browser
                      </Button>
                    )}

                    {hasPurchased && (
                      <p className="text-sm text-center text-green-600 font-medium">
                        ✓ You own this book
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="text-xs text-muted-foreground">
                {paymentMethod === 'USDT' ? (
                  <>
                    <p>• 96% goes to creator</p>
                    <p>• 4% platform fee</p>
                    <p>• Direct stablecoin payment</p>
                  </>
                ) : paymentMethod === 'BNB' ? (
                  <>
                    <p>• 96% goes to creator</p>
                    <p>• 4% platform fee</p>
                  </>
                ) : (
                  <>
                    <p>• You pay 4% less with $BOCZ</p>
                    <p>• Creator receives same amount</p>
                    <p>• 0% platform fee</p>
                  </>
                )}
                <p>• Powered by Binance Smart Chain</p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="space-y-6">
            {hasPurchased && !hasReviewed && account && (
              <ReviewForm
                bookId={book.id}
                buyerWallet={account}
                onReviewSubmitted={() => {
                  fetchReviews();
                  fetchBook();
                  setHasReviewed(true);
                }}
              />
            )}

            {hasPurchased && hasReviewed && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">
                    ✓ Thank you for reviewing this book!
                  </p>
                </CardContent>
              </Card>
            )}

            <ReviewList reviews={reviews} />
          </div>
        </main>

        {/* Book Viewer Modal */}
        {showViewer && viewerUrl && book && purchaseData && (
          <div className="fixed inset-0 z-50 bg-background overflow-auto">
            <div className="container mx-auto px-4 py-8">
              <div className="flex justify-between items-center mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowViewer(false);
                    checkPurchase(); // Refresh to show updated download count
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Close Reader
                </Button>
              </div>
              {viewerUrl.toLowerCase().endsWith('.epub') ? (
                <EpubViewer 
                  fileUrl={viewerUrl} 
                  title={viewerTitle}
                  bookId={book.id}
                  buyerWallet={account!}
                  transactionHash={purchaseData.transaction_hash}
                  downloadCount={purchaseData.download_count}
                  downloadLimit={DOWNLOAD_LIMIT}
                />
              ) : (
                <PdfViewer 
                  fileUrl={viewerUrl} 
                  title={viewerTitle}
                  bookId={book.id}
                  buyerWallet={account!}
                  transactionHash={purchaseData.transaction_hash}
                  downloadCount={purchaseData.download_count}
                  downloadLimit={DOWNLOAD_LIMIT}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
