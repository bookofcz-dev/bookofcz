import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/integrations/supabase/client';
import { useWallet } from '@/contexts/WalletContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { BookReviewCard } from '@/components/admin/BookReviewCard';
import { PlatformStats } from '@/components/admin/PlatformStats';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Loader2 } from 'lucide-react';
import logo from '@/assets/bookofcz-logo.png';

interface Book {
  id: string;
  title: string;
  description: string;
  author: string;
  cover_url: string;
  pdf_url: string;
  price_usdt: number;
  price_bnb: number;
  category: string;
  creator_wallet: string;
  approval_status: string;
  created_at: string;
  isbn?: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { account, connectWallet, isConnecting } = useWallet();
  const { isAdmin, loading: adminLoading } = useAdminCheck(account);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    if (isAdmin) {
      fetchBooks();
    }
  }, [isAdmin, activeTab]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('marketplace_books')
        .select('*')
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

  if (adminLoading || (account && !isAdmin && loading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <img src={logo} alt="BookofCZ" className="h-24 w-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-6">Connect your admin wallet to access the dashboard</p>
        <Button onClick={connectWallet} disabled={isConnecting} size="lg">
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      </div>
    );
  }

  if (account && !adminLoading && !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <img src={logo} alt="BookofCZ" className="h-24 w-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4 text-destructive">Access Denied</h1>
        <p className="text-muted-foreground mb-6">You don't have admin privileges</p>
        <Button onClick={() => navigate('/marketplace')}>Go to Marketplace</Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - BOCZ Marketplace</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/marketplace')}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <img src={logo} alt="BookofCZ" className="h-12 w-auto" />
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              </div>
              <p className="text-sm text-muted-foreground font-mono">
                {account?.slice(0, 6)}...{account?.slice(-4)}
              </p>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <PlatformStats />
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="all">All Books</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : books.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No books found</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {books.map((book) => (
                    <BookReviewCard
                      key={book.id}
                      book={book}
                      onStatusChange={fetchBooks}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}
