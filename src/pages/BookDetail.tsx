import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/integrations/supabase/client';
import { useMarketplaceWallet } from '@/hooks/useMarketplaceWallet';
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, Star, Wallet, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  description: string;
  author: string;
  cover_url: string;
  pdf_url: string;
  price_bnb: number;
  category: string;
  average_rating: number;
  review_count: number;
  download_count: number;
  creator_wallet: string;
  isbn?: string;
}

export default function BookDetail() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { account, connectWallet, disconnectWallet, isConnecting, sendTransaction } = useMarketplaceWallet();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    if (bookId) {
      fetchBook();
      if (account) {
        checkPurchase();
      }
    }
  }, [bookId, account]);

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

  const handlePurchase = async () => {
    if (!book || !account) return;

    setPurchasing(true);
    try {
      const platformWallet = '0x6e22449bEbc5C719fA7ADB39bc2576B9E6F11bd8';
      const creatorAmount = (book.price_bnb * 0.96).toFixed(6);
      const platformFee = (book.price_bnb * 0.04).toFixed(6);
      
      // Send payment to creator (96%)
      toast.info('Confirm payment to creator...');
      const creatorTx = await sendTransaction(book.creator_wallet, creatorAmount);
      
      toast.info('Processing creator payment...');
      await creatorTx.wait();

      // Send platform fee (4%)
      toast.info('Confirm platform fee...');
      const platformTx = await sendTransaction(platformWallet, platformFee);
      
      toast.info('Processing platform fee...');
      await platformTx.wait();

      // Record purchase
      const { error: purchaseError } = await supabase
        .from('marketplace_purchases')
        .insert({
          book_id: book.id,
          buyer_wallet: account.toLowerCase(),
          price_paid: book.price_bnb,
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
    } catch (error: any) {
      console.error('Error purchasing book:', error);
      toast.error(error.message || 'Purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  const handleDownload = async () => {
    if (!book) return;

    if (book.price_bnb > 0 && !hasPurchased) {
      toast.error('Please purchase the book first');
      return;
    }

    try {
      // Update download count for free books
      if (book.price_bnb === 0) {
        const { error } = await supabase
          .from('marketplace_books')
          .update({ download_count: (book.download_count || 0) + 1 })
          .eq('id', book.id);

        if (error) console.error('Error updating download count:', error);
      }

      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = book.pdf_url;
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

  const canDownload = book.price_bnb === 0 || hasPurchased;

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
                <div className="text-4xl font-bold text-primary">
                  {book.price_bnb === 0 ? 'FREE' : `${book.price_bnb} BNB`}
                </div>

                {!account ? (
                  <Button onClick={connectWallet} size="lg" className="w-full">
                    <Wallet className="h-5 w-5 mr-2" />
                    Connect Wallet to {book.price_bnb === 0 ? 'Download' : 'Purchase'}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    {book.price_bnb > 0 && !hasPurchased && (
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
                            Purchase for {book.price_bnb} BNB
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
                <p>• 96% goes to creator</p>
                <p>• 4% platform fee</p>
                <p>• Powered by Binance Smart Chain</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
