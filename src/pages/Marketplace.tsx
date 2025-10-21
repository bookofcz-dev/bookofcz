import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useMarketplaceWallet } from '@/hooks/useMarketplaceWallet';
import { Button } from '@/components/ui/button';
import { Wallet, Upload, Search, BookOpen, Star, TrendingUp } from 'lucide-react';
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';
import { BookGrid } from '@/components/marketplace/BookGrid';
import { UploadBookDialog } from '@/components/marketplace/UploadBookDialog';
import { MarketplaceStats } from '@/components/marketplace/MarketplaceStats';
import logo from '@/assets/bookofcz-logo.png';

export default function Marketplace() {
  const { account, connectWallet, disconnectWallet, isConnecting } = useMarketplaceWallet();
  const [showUpload, setShowUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  return (
    <>
      <Helmet>
        <title>BookofCZ Marketplace - Web3 Digital Books on BSC</title>
        <meta name="description" content="Discover, buy, and sell digital books about crypto, CZ, and Binance on the BookofCZ Web3 marketplace powered by Binance Smart Chain" />
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
          {/* Hero Section */}
          <div className="text-center mb-12 py-12 border-b border-border">
            <div className="flex justify-center mb-6">
              <img src={logo} alt="BookofCZ" className="h-32 w-auto" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              BookofCZ Marketplace
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              The first decentralized marketplace for crypto books on Binance Smart Chain
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {!account ? (
                <Button
                  size="lg"
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="gap-2"
                >
                  <Wallet className="h-5 w-5" />
                  {isConnecting ? 'Connecting...' : 'Connect Wallet to Browse'}
                </Button>
              ) : (
                <>
                  <Button size="lg" className="gap-2">
                    <Search className="h-5 w-5" />
                    Browse Books
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2"
                    onClick={() => setShowUpload(true)}
                  >
                    <Upload className="h-5 w-5" />
                    Upload Your Book
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <MarketplaceStats />

          {/* Categories */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>
            <div className="flex flex-wrap gap-2">
              {['all', 'crypto', 'binance', 'defi', 'nft', 'trading', 'education'].map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat)}
                  className="capitalize"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Featured Books */}
          {account && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold">Featured Books</h2>
              </div>
              <BookGrid
                category={selectedCategory}
                searchQuery={searchQuery}
                account={account}
              />
            </div>
          )}

          {/* How It Works */}
          {!account && (
            <div className="grid md:grid-cols-3 gap-6 my-12">
              <div className="text-center p-6 border rounded-lg bg-card">
                <Wallet className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Connect Wallet</h3>
                <p className="text-muted-foreground">
                  Connect your MetaMask or BSC-compatible wallet to get started
                </p>
              </div>
              <div className="text-center p-6 border rounded-lg bg-card">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Browse & Buy</h3>
                <p className="text-muted-foreground">
                  Discover books and purchase with BNB or stablecoins
                </p>
              </div>
              <div className="text-center p-6 border rounded-lg bg-card">
                <Star className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Rate & Review</h3>
                <p className="text-muted-foreground">
                  Share your thoughts and help the community
                </p>
              </div>
            </div>
          )}
        </main>

        {/* Upload Dialog */}
        <UploadBookDialog
          open={showUpload}
          onOpenChange={setShowUpload}
          creatorWallet={account || ''}
        />
      </div>
    </>
  );
}
