import { Helmet } from 'react-helmet';
import { Navbar } from '@/components/Navbar';
import { SwapInterface } from '@/components/swap/SwapInterface';
import { ArrowRightLeft, Shield, Zap, TrendingUp } from 'lucide-react';

const Swap = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Helmet>
        <title>Token Swap | BookofCZ - Exchange BNB, BOCZ & More on BSC</title>
        <meta
          name="description"
          content="Swap tokens seamlessly on Binance Smart Chain. Exchange BNB, BOCZ, USDT and BUSD with low fees powered by PancakeSwap."
        />
        <meta name="keywords" content="token swap, BSC, BNB, BOCZ, PancakeSwap, DeFi, cryptocurrency exchange" />
      </Helmet>

      <Navbar />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <ArrowRightLeft className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold">
            Token Swap
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Exchange tokens seamlessly on Binance Smart Chain with low fees and deep liquidity
          </p>
        </div>

        {/* Swap Interface */}
        <SwapInterface />

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-6 rounded-lg bg-card border border-border text-center space-y-3">
            <div className="flex justify-center">
              <div className="p-3 bg-primary/10 rounded-full">
                <Zap className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="font-heading font-bold text-lg">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">
              Execute swaps in seconds with instant confirmations on BSC
            </p>
          </div>

          <div className="p-6 rounded-lg bg-card border border-border text-center space-y-3">
            <div className="flex justify-center">
              <div className="p-3 bg-primary/10 rounded-full">
                <Shield className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="font-heading font-bold text-lg">Secure & Safe</h3>
            <p className="text-sm text-muted-foreground">
              Non-custodial swaps powered by audited PancakeSwap smart contracts
            </p>
          </div>

          <div className="p-6 rounded-lg bg-card border border-border text-center space-y-3">
            <div className="flex justify-center">
              <div className="p-3 bg-primary/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
            <h3 className="font-heading font-bold text-lg">Best Rates</h3>
            <p className="text-sm text-muted-foreground">
              Access deep liquidity pools for optimal swap rates
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-16 max-w-3xl mx-auto space-y-6">
          <div className="p-6 rounded-lg bg-muted/50 border border-border">
            <h2 className="font-heading font-bold text-xl mb-3">How It Works</h2>
            <ol className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="font-bold text-primary">1.</span>
                <span>Connect your wallet and ensure you're on BSC network</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">2.</span>
                <span>Select tokens and enter the amount you want to swap</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">3.</span>
                <span>Review the swap details including price impact and slippage</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-primary">4.</span>
                <span>Confirm the transaction in your wallet and receive your tokens</span>
              </li>
            </ol>
          </div>

          <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
            <h3 className="font-heading font-bold text-lg mb-2">About BOCZ Token</h3>
            <p className="text-sm text-muted-foreground">
              BOCZ is the native utility token of the BookofCZ marketplace. Use BOCZ to purchase digital books,
              participate in governance, and enjoy discounts on marketplace fees. Swap your BNB or other tokens
              to BOCZ now to start exploring the world's first Web3 book marketplace!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Swap;
