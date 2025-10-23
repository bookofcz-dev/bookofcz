import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Wallet, Upload, Search, BookOpen, Star, TrendingUp } from 'lucide-react';
import { BookGrid } from '@/components/marketplace/BookGrid';
import { UploadBookDialog } from '@/components/marketplace/UploadBookDialog';
import { MarketplaceStats } from '@/components/marketplace/MarketplaceStats';
import { Navbar } from '@/components/Navbar';
import logo from '@/assets/bookofcz-logo.png';

export default function Marketplace() {
  const { account, connectWallet, disconnectWallet, isConnecting } = useWallet();
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
        <Navbar />

        <main className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16 py-16 border-b border-border/40">
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary blur-2xl opacity-30 group-hover:opacity-50 transition-opacity" />
                <img src={logo} alt="BookofCZ" className="h-40 w-auto relative" />
              </div>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 gold-shimmer bg-clip-text text-transparent">
              BOCZ Marketplace
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 font-body">
              The first decentralized marketplace for crypto books on Binance Smart Chain
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {!account ? (
                <Button
                  size="lg"
                  variant="gold"
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="gap-2 font-cta"
                >
                  <Wallet className="h-5 w-5" />
                  {isConnecting ? 'Connecting...' : 'Connect Wallet to Browse'}
                </Button>
              ) : (
                <>
                  <Button size="lg" variant="gold" className="gap-2 font-cta">
                    <Search className="h-5 w-5" />
                    Browse Books
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 font-cta"
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
          <div className="mb-12">
            <h2 className="font-heading text-3xl font-bold mb-6 gold-glow">Browse by Category</h2>
            <div className="flex flex-wrap gap-3">
              {['all', 'crypto', 'binance', 'defi', 'nft', 'trading', 'education'].map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'gold' : 'outline'}
                  onClick={() => setSelectedCategory(cat)}
                  className="capitalize font-cta"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Featured Books */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="h-8 w-8 text-primary" />
              <h2 className="font-heading text-4xl font-bold gold-glow">Featured Books</h2>
            </div>
            <BookGrid
              category={selectedCategory}
              searchQuery={searchQuery}
              account={account}
            />
          </div>

          {/* How It Works */}
          <div className="grid md:grid-cols-3 gap-8 py-16 border-t border-border/40">
            <div className="text-center p-8 border-2 border-primary/20 rounded-2xl bg-card hover:shadow-gold-glow transition-all">
              <Wallet className="h-16 w-16 mx-auto mb-6 text-primary" />
              <h3 className="font-heading text-2xl font-semibold mb-3">Connect Wallet</h3>
              <p className="text-muted-foreground font-body">
                Connect your MetaMask or BSC-compatible wallet to get started
              </p>
            </div>
            <div className="text-center p-8 border-2 border-primary/20 rounded-2xl bg-card hover:shadow-gold-glow transition-all">
              <BookOpen className="h-16 w-16 mx-auto mb-6 text-primary" />
              <h3 className="font-heading text-2xl font-semibold mb-3">Browse & Buy</h3>
              <p className="text-muted-foreground font-body">
                Discover books and purchase with BNB or stablecoins
              </p>
            </div>
            <div className="text-center p-8 border-2 border-primary/20 rounded-2xl bg-card hover:shadow-gold-glow transition-all">
              <Star className="h-16 w-16 mx-auto mb-6 text-primary" />
              <h3 className="font-heading text-2xl font-semibold mb-3">Rate & Review</h3>
              <p className="text-muted-foreground font-body">
                Share your thoughts and help the community
              </p>
            </div>
          </div>
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
