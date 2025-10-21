import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/integrations/supabase/client';
import { useMarketplaceWallet } from '@/hooks/useMarketplaceWallet';
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';
import { CreatorStats } from '@/components/creator/CreatorStats';
import { CreatorBookCard } from '@/components/creator/CreatorBookCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Upload } from 'lucide-react';
import { UploadBookDialog } from '@/components/marketplace/UploadBookDialog';

interface Book {
  id: string;
  title: string;
  description: string;
  author: string;
  cover_url: string;
  pdf_url: string;
  price_bnb: number;
  category: string;
  creator_wallet: string;
  approval_status: string;
  created_at: string;
  average_rating: number;
  review_count: number;
  download_count: number;
  rejection_reason?: string;
}

export default function CreatorDashboard() {
  const navigate = useNavigate();
  const { account, connectWallet, disconnectWallet, isConnecting } = useMarketplaceWallet();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    if (account) {
      fetchMyBooks();
    } else {
      setLoading(false);
    }
  }, [account, activeTab]);

  const fetchMyBooks = async () => {
    if (!account) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('marketplace_books')
        .select('*')
        .eq('creator_wallet', account)
        .order('created_at', { ascending: false });

      if (activeTab !== 'all') {
        query = query.eq('approval_status', activeTab);
      }

      const { data, error } = await query;
      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <>
        <Helmet>
          <title>Creator Dashboard - BOCZ Marketplace</title>
        </Helmet>

        <div className="min-h-screen bg-background">
          <MarketplaceHeader
            account={account}
            connectWallet={connectWallet}
            disconnectWallet={disconnectWallet}
            isConnecting={isConnecting}
            onUploadClick={() => setShowUpload(true)}
          />

          <main className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl font-bold mb-4">Creator Dashboard</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Connect your wallet to manage your books and track your earnings
            </p>
            <Button onClick={connectWallet} disabled={isConnecting} size="lg">
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Creator Dashboard - BOCZ Marketplace</title>
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Creator Dashboard</h1>
              <p className="text-muted-foreground">Manage your books and track performance</p>
            </div>
            <Button onClick={() => setShowUpload(true)} size="lg">
              <Upload className="h-5 w-5 mr-2" />
              Upload New Book
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="mb-8">
            <CreatorStats books={books} />
          </div>

          {/* Books List */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Books ({books.length})</TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({books.filter(b => b.approval_status === 'approved').length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({books.filter(b => b.approval_status === 'pending').length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({books.filter(b => b.approval_status === 'rejected').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : books.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No books yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by uploading your first book to the marketplace
                  </p>
                  <Button onClick={() => setShowUpload(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Your First Book
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {books.map((book) => (
                    <CreatorBookCard key={book.id} book={book} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>

        <UploadBookDialog
          open={showUpload}
          onOpenChange={setShowUpload}
          creatorWallet={account}
        />
      </div>
    </>
  );
}
