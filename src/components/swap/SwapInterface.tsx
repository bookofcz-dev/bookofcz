import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowDownUp, Settings, Info, Zap, Shield, TrendingUp } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useSwap } from '@/hooks/useSwap';
import { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export const SwapInterface = () => {
  const { account, connectWallet, isConnecting, isOnBSC, switchToBSC, provider, signer } = useWallet();
  const {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    slippage,
    isCalculating,
    isSwapping,
    priceImpact,
    exchangeRate,
    setFromAmount,
    setSlippage,
    calculateOutputAmount,
    executeSwap,
  } = useSwap();

  const [balance, setBalance] = useState<string>('0');

  useEffect(() => {
    if (account && provider) {
      provider.getBalance(account).then((bal) => {
        setBalance((parseFloat(bal.toString()) / 1e18).toFixed(6));
      });
    }
  }, [account, provider]);

  useEffect(() => {
    if (fromAmount) {
      calculateOutputAmount(fromAmount);
    }
  }, [fromAmount]);

  const handleSwap = async () => {
    if (!account || !provider || !signer) return;
    await executeSwap(account, provider, signer);
  };

  const handleMaxClick = () => {
    if (balance) {
      // Leave some BNB for gas
      const maxAmount = Math.max(0, parseFloat(balance) - 0.005);
      setFromAmount(maxAmount.toFixed(6));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Main Swap Card */}
      <Card className="p-6 glass-card border-primary/20 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-heading font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              $BOCZ Swap
            </h2>
            <p className="text-xs text-muted-foreground mt-1">Trade BNB for BOCZ instantly</p>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full border-primary/20">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Slippage Tolerance</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[0.1, 0.5, 1.0].map((value) => (
                      <Button
                        key={value}
                        variant={slippage === value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSlippage(value)}
                        className="w-full"
                      >
                        {value}%
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Custom Slippage (%)</Label>
                  <Input
                    type="number"
                    value={slippage}
                    onChange={(e) => setSlippage(parseFloat(e.target.value) || 0.5)}
                    min="0.1"
                    max="50"
                    step="0.1"
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Higher slippage may be needed for large trades
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* From Token */}
        <div className="space-y-2 mb-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">From</span>
            {account && (
              <span className="text-muted-foreground">
                Balance: <span className="font-semibold text-foreground">{balance}</span> {fromToken.symbol}
              </span>
            )}
          </div>
          <div className="relative group">
            <Input
              type="number"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="text-3xl h-20 pr-32 font-bold border-2 transition-all group-hover:border-primary/30"
              step="0.000001"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {account && parseFloat(balance) > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMaxClick}
                  className="h-8 text-xs font-semibold hover:bg-primary/10"
                >
                  MAX
                </Button>
              )}
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 px-4 py-2 rounded-full border border-amber-500/20">
                <span className="font-bold text-amber-600 dark:text-amber-400">{fromToken.symbol}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Switch Button */}
        <div className="flex justify-center -my-3 relative z-10">
          <div className="bg-background p-2 rounded-full border-2 border-primary/20">
            <ArrowDownUp className="h-5 w-5 text-primary" />
          </div>
        </div>

        {/* To Token */}
        <div className="space-y-2 mt-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">To (estimated)</span>
            {isCalculating && <span className="text-xs text-primary animate-pulse">Calculating...</span>}
          </div>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.0"
              value={toAmount}
              readOnly
              className="text-3xl h-20 pr-32 font-bold bg-muted/30 border-2 border-dashed"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="flex items-center gap-2 bg-gradient-to-r from-primary/20 to-primary/10 px-4 py-2 rounded-full border-2 border-primary/30">
                <span className="font-bold text-primary">{toToken.symbol}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price Info */}
        {exchangeRate && toAmount && (
          <div className="mt-4 p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5" />
                Exchange Rate
              </span>
              <span className="font-semibold text-sm">
                1 {fromToken.symbol} = {exchangeRate.toLocaleString()} {toToken.symbol}
              </span>
            </div>
            {priceImpact !== null && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Price Impact</span>
                <span className={`font-semibold text-sm ${priceImpact > 5 ? 'text-destructive' : priceImpact > 2 ? 'text-amber-500' : 'text-green-500'}`}>
                  {priceImpact < 0.01 ? '< 0.01' : priceImpact.toFixed(2)}%
                </span>
              </div>
            )}
            <Separator className="opacity-50" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Minimum Received</span>
              <span className="font-semibold text-sm">
                {(parseFloat(toAmount) * (1 - slippage / 100)).toFixed(2)} {toToken.symbol}
              </span>
            </div>
          </div>
        )}

        {/* Swap Button */}
        <div className="mt-6">
          {!account ? (
            <Button
              className="w-full h-14 text-lg font-semibold"
              size="lg"
              onClick={connectWallet}
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          ) : !isOnBSC ? (
            <Button
              className="w-full h-14 text-lg font-semibold"
              size="lg"
              onClick={switchToBSC}
              variant="destructive"
            >
              Switch to BSC Network
            </Button>
          ) : !fromAmount || parseFloat(fromAmount) <= 0 ? (
            <Button className="w-full h-14 text-lg" size="lg" disabled variant="outline">
              Enter Amount
            </Button>
          ) : isCalculating ? (
            <Button className="w-full h-14 text-lg" size="lg" disabled>
              <span className="animate-pulse">Calculating...</span>
            </Button>
          ) : parseFloat(fromAmount) > parseFloat(balance) ? (
            <Button className="w-full h-14 text-lg" size="lg" disabled variant="destructive">
              Insufficient Balance
            </Button>
          ) : (
            <Button
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              size="lg"
              onClick={handleSwap}
              disabled={isSwapping}
            >
              {isSwapping ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⚡</span>
                  Swapping...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Swap Now
                </span>
              )}
            </Button>
          )}
        </div>

        {/* Warning for high price impact */}
        {priceImpact !== null && priceImpact > 5 && (
          <div className="mt-4 p-3 bg-destructive/10 border-2 border-destructive/30 rounded-lg flex gap-3">
            <Info className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-semibold text-destructive">High Price Impact Warning</p>
              <p className="text-muted-foreground">
                This trade will significantly move the market price. Consider splitting into smaller trades.
              </p>
            </div>
          </div>
        )}

        <Separator className="my-4" />

        {/* Token Info */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">BOCZ Contract</span>
            <code className="bg-muted px-2 py-1 rounded font-mono text-[10px]">
              {toToken.address.slice(0, 8)}...{toToken.address.slice(-6)}
            </code>
          </div>
          <p className="text-xs text-center text-muted-foreground pt-1">
            Powered by PancakeSwap V2 • BSC Mainnet
          </p>
        </div>
      </Card>

      {/* Feature Cards */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3 text-center border-primary/10 hover:border-primary/30 transition-all">
          <Zap className="h-5 w-5 mx-auto mb-1 text-primary" />
          <p className="text-xs font-semibold">Instant</p>
          <p className="text-[10px] text-muted-foreground">Fast trades</p>
        </Card>
        <Card className="p-3 text-center border-primary/10 hover:border-primary/30 transition-all">
          <Shield className="h-5 w-5 mx-auto mb-1 text-primary" />
          <p className="text-xs font-semibold">Secure</p>
          <p className="text-[10px] text-muted-foreground">Audited DEX</p>
        </Card>
        <Card className="p-3 text-center border-primary/10 hover:border-primary/30 transition-all">
          <TrendingUp className="h-5 w-5 mx-auto mb-1 text-primary" />
          <p className="text-xs font-semibold">Best Rate</p>
          <p className="text-[10px] text-muted-foreground">Live pricing</p>
        </Card>
      </div>
    </div>
  );
};
