import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/integrations/supabase/client';
import { useWallet } from '@/contexts/WalletContext';
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink, Loader2, BookOpen, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

interface PurchasedBook {
  id: string;
  title: string;
  description: string;
  author: string;
  cover_url: string;
  pdf_url: string;
  category: string;
  price_paid: number;
  purchase_date: string;
}

export default function MyLibrary() {
  const navigate = useNavigate();
  const { account, connectWallet, disconnectWallet, isConnecting } = useWallet();
  const [books, setBooks] = useState<PurchasedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    if (account) {
      fetchPurchasedBooks();
    } else {
      setLoading(false);
    }
  }, [account]);

  const fetchPurchasedBooks = async () => {
    if (!account) return;

    setLoading(true);
    try {
      // Fetch purchases with book details
      const { data, error } = await supabase
        .from('marketplace_purchases')
        .select(`
          price_paid,
          purchase_date,
          marketplace_books (
            id,
            title,
            description,
            author,
            cover_url,
            pdf_url,
            category
          )
        `)
        .eq('buyer_wallet', account.toLowerCase())
        .order('purchase_date', { ascending: false });

      if (error) throw error;

      // Transform the data to flat structure
      const purchasedBooks = data
        .filter(purchase => purchase.marketplace_books)
        .map(purchase => ({
          id: purchase.marketplace_books.id,
          title: purchase.marketplace_books.title,
          description: purchase.marketplace_books.description,
          author: purchase.marketplace_books.author,
          cover_url: purchase.marketplace_books.cover_url,
          pdf_url: purchase.marketplace_books.pdf_url,
          category: purchase.marketplace_books.category,
          price_paid: purchase.price_paid,
          purchase_date: purchase.purchase_date,
        }));

      setBooks(purchasedBooks);
    } catch (error) {
      console.error('Error fetching purchased books:', error);
      toast.error('Failed to load your library');
    } finally {
      setLoading(false);
    }
  };

  const getFilePath = (pdfUrl: string): string => {
    let filePath = pdfUrl;
    
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
    
    return filePath;
  };

  const handleDownload = async (book: PurchasedBook) => {
    try {
      const filePath = getFilePath(book.pdf_url);
      console.log('📥 Downloading:', filePath);

      // Generate signed URL for secure PDF download (1 hour expiry)
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('book-pdfs')
        .createSignedUrl(filePath, 3600);

      if (signedUrlError) {
        console.error('Error creating signed URL:', signedUrlError);
        throw new Error(`Failed to generate download link: ${signedUrlError.message}`);
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
      
      toast.success('Download started!');
    } catch (error: any) {
      console.error('Error downloading book:', error);
      toast.error(error.message || 'Failed to download book');
    }
  };

  const handlePreview = async (book: PurchasedBook) => {
    try {
      const filePath = getFilePath(book.pdf_url);
      console.log('👁️ Previewing:', filePath);

      // Generate signed URL for secure PDF preview (1 hour expiry)
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

      window.open(signedUrlData.signedUrl, '_blank');
      toast.success('Preview opened in new tab');
    } catch (error: any) {
      console.error('Error previewing book:', error);
      toast.error(error.message || 'Failed to preview book');
    }
  };

  if (!account) {
    return (
      <>
        <Helmet>
          <title>My Library - BOCZ Marketplace</title>
          <meta name="description" content="Access your purchased books" />
        </Helmet>

        <div className="min-h-screen bg-background">
          <MarketplaceHeader
            account={account}
            connectWallet={connectWallet}
            disconnectWallet={disconnectWallet}
            isConnecting={isConnecting}
            onUploadClick={() => setShowUpload(true)}
          />

          <main className="container mx-auto px-4 py-16">
            <div className="text-center max-w-md mx-auto">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h1 className="text-3xl font-bold mb-4">My Library</h1>
              <p className="text-muted-foreground mb-6">
                Connect your wallet to access your purchased books
              </p>
              <Button onClick={connectWallet} size="lg">
                Connect Wallet
              </Button>
            </div>
          </main>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Helmet>
          <title>My Library - BOCZ Marketplace</title>
        </Helmet>

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
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Library - BOCZ Marketplace</title>
        <meta name="description" content="Access your purchased books" />
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My Library</h1>
            <p className="text-muted-foreground">
              Access and download your purchased books
            </p>
          </div>

          {books.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">No books yet</h2>
              <p className="text-muted-foreground mb-6">
                Start building your library by purchasing books from the marketplace
              </p>
              <Button onClick={() => navigate('/marketplace')} size="lg">
                Browse Marketplace
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                {books.length} {books.length === 1 ? 'book' : 'books'} in your library
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {books.map((book) => (
                  <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <img
                        src={book.cover_url}
                        alt={book.title}
                        className="object-cover w-full h-full"
                      />
                      <Badge className="absolute top-2 right-2 capitalize">
                        {book.category}
                      </Badge>
                    </div>
                    
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-1 mb-1">
                          {book.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          by {book.author}
                        </p>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {book.description}
                      </p>

                      <div className="text-xs text-muted-foreground">
                        Purchased: {new Date(book.purchase_date).toLocaleDateString()}
                      </div>

                      <div className="space-y-2 pt-2">
                        <Button
                          onClick={() => handleDownload(book)}
                          size="sm"
                          className="w-full"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        
                        <Button
                          onClick={() => handlePreview(book)}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
