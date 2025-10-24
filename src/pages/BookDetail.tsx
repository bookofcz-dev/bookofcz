import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/integrations/supabase/client';
import { useWallet } from '@/contexts/WalletContext';
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';
import { ReviewForm } from '@/components/marketplace/ReviewForm';
import { ReviewList } from '@/components/marketplace/ReviewList';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, Star, Wallet, ExternalLink } from 'lucide-react';
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
  const { account, connectWallet, disconnectWallet, isConnecting, sendTransaction, sendTokenTransaction, getTokenBalance, provider } = useWallet();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'BNB' | 'BOCZ'>('BNB');
  const [boczBalance, setBoczBalance] = useState<string>('0');
  const [boczPriceInBnb, setBoczPriceInBnb] = useState<number>(0);
  const [bnbPriceInUsdt, setBnbPriceInUsdt] = useState<number>(0);
  
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
        .select('id')
        .eq('book_id', bookId)
        .eq('buyer_wallet', account.toLowerCase())
        .maybeSingle();

      if (error) throw error;
      setHasPurchased(!!data);
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
      
      if (paymentMethod === 'BNB') {
        // BNB payment: 4% platform fee
        const totalBNB = bookPriceUSDT * USDT_TO_BNB_RATE;
        const creatorBNB = totalBNB * 0.96;
        const platformFeeBNB = totalBNB * 0.04;
        
        creatorAmount = creatorBNB.toFixed(6);
        platformFee = platformFeeBNB.toFixed(6);
        totalPrice = totalBNB.toFixed(6);
        pricePaidUSDT = bookPriceUSDT;
      } else {
        // BOCZ payment: 0% platform fee
        const totalBOCZ = bookPriceUSDT * USDT_TO_BOCZ_RATE;
        
        creatorAmount = totalBOCZ.toFixed(0);
        platformFee = '0';
        totalPrice = totalBOCZ.toFixed(0);
        pricePaidUSDT = bookPriceUSDT; // No fee, so price is the same
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
      const message = createPurchaseMessage(book.id, pricePaidUSDT, timestamp);
      
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

      if (paymentMethod === 'BNB') {
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
        // Send BOCZ token payment to creator (100% - no platform fee)
        toast.info('Confirm $BOCZ payment to creator...');
        creatorTx = await sendTokenTransaction(book.creator_wallet, parseFloat(creatorAmount));
        
        toast.info('Processing creator payment...');
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

        // No platform fee for BOCZ payments
        platformTx = creatorTx; // Just use same tx for reference
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
      
      // Refresh BOCZ balance if paid with BOCZ
      if (paymentMethod === 'BOCZ') {
        loadBoczBalance();
      }
    } catch (error: any) {
      console.error('Error purchasing book:', error);
      toast.error(error.message || 'Purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  const handleDownload = async () => {
    if (!book || !account) return;

    const bookPrice = book.price_usdt || book.price_bnb;
    if (bookPrice > 0 && !hasPurchased) {
      toast.error('Please purchase the book first');
      return;
    }

    try {
      // For free books, create a purchase record if it doesn't exist
      if (bookPrice === 0 && !hasPurchased) {
        const { error: purchaseError } = await supabase
          .from('marketplace_purchases')
          .insert({
            book_id: book.id,
            buyer_wallet: account.toLowerCase(),
            price_paid: 0,
            creator_amount: 0,
            platform_fee: 0,
            transaction_hash: `free-download-${Date.now()}`,
          });

        if (purchaseError && !purchaseError.message.includes('duplicate')) {
          throw purchaseError;
        }

        setHasPurchased(true);
      }

      // Update download count
      const { error } = await supabase
        .from('marketplace_books')
        .update({ download_count: (book.download_count || 0) + 1 })
        .eq('id', book.id);

      if (error) console.error('Error updating download count:', error);

      // Generate signed URL for secure PDF download (1 hour expiry)
      // Use the stored path directly (no need to extract, it's already a relative path)
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('book-pdfs')
        .createSignedUrl(book.pdf_url, 3600);

      if (signedUrlError) {
        console.error('Error creating signed URL:', signedUrlError);
        throw new Error('Failed to generate download link');
      }

      if (!signedUrlData?.signedUrl) {
        throw new Error('No download URL generated');
      }

      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = signedUrlData.signedUrl;
      link.download = `${book.title}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download started...');
    } catch (error) {
      console.error('Error downloading book:', error);
      toast.error('Failed to download book');
    }
  };

  const handlePreview = () => {
    if (!book) return;
    window.open(book.pdf_url, '_blank');
    toast.info('Preview opened in new tab');
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
                        {paymentMethod === 'BNB' 
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
                      {paymentMethod === 'BNB' && (
                        <div className="text-sm text-muted-foreground">
                          Includes 4% platform fee (≈ {(priceInBNB * 0.04).toFixed(4)} BNB)
                        </div>
                      )}
                    </>
                  )}
                </div>

                {bookPrice > 0 && account && (
                  <div className="flex gap-2 p-2 bg-muted rounded-lg">
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
                            Purchase for {paymentMethod === 'BNB' 
                              ? `${priceInBNB.toFixed(4)} BNB` 
                              : `${priceInBOCZ.toFixed(0)} $BOCZ`}
                          </>
                        )}
                      </Button>
                    )}

                    {canDownload && (
                      <Button onClick={handleDownload} size="lg" className="w-full" variant="default">
                        <Download className="h-5 w-5 mr-2" />
                        Download Book
                      </Button>
                    )}

                    <Button onClick={handlePreview} size="lg" className="w-full" variant="outline">
                      <ExternalLink className="h-5 w-5 mr-2" />
                      Preview Book
                    </Button>

                    {hasPurchased && (
                      <p className="text-sm text-center text-green-600 font-medium">
                        ✓ You own this book
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="text-xs text-muted-foreground">
                {paymentMethod === 'BNB' ? (
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
      </div>
    </>
  );
}
