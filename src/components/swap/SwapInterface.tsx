import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDownUp, Settings, AlertCircle } from 'lucide-react';
import { useSwap, TOKENS } from '@/hooks/useSwap';
import { useWallet } from '@/contexts/WalletContext';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export const SwapInterface = () => {
  const {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    slippage,
    isCalculating,
    isSwapping,
    priceImpact,
    setFromToken,
    setToToken,
    setFromAmount,
    setSlippage,
    executeSwap,
    switchTokens,
  } = useSwap();

  const { account, connectWallet, isConnecting, isOnBSC, switchToBSC } = useWallet();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const tokenList = Object.values(TOKENS);

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="p-6 glass-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-bold">Swap Tokens</h2>
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Swap Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="slippage">Slippage Tolerance (%)</Label>
                  <Input
                    id="slippage"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="50"
                    value={slippage}
                    onChange={(e) => setSlippage(e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Your transaction will revert if price changes unfavorably by more than this percentage.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSlippage('0.1')}>0.1%</Button>
                  <Button size="sm" variant="outline" onClick={() => setSlippage('0.5')}>0.5%</Button>
                  <Button size="sm" variant="outline" onClick={() => setSlippage('1')}>1%</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          {/* From Token */}
          <div className="space-y-2">
            <Label>From</Label>
            <div className="flex gap-2">
              <Select
                value={fromToken.address}
                onValueChange={(value) => {
                  const token = tokenList.find(t => t.address === value);
                  if (token) setFromToken(token);
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tokenList.map((token) => (
                    <SelectItem key={token.address} value={token.address}>
                      {token.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {/* Switch Button */}
          <div className="flex justify-center py-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={switchTokens}
              className="rounded-full hover:bg-muted"
            >
              <ArrowDownUp className="h-5 w-5" />
            </Button>
          </div>

          {/* To Token */}
          <div className="space-y-2">
            <Label>To</Label>
            <div className="flex gap-2">
              <Select
                value={toToken.address}
                onValueChange={(value) => {
                  const token = tokenList.find(t => t.address === value);
                  if (token) setToToken(token);
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tokenList.map((token) => (
                    <SelectItem key={token.address} value={token.address}>
                      {token.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="text"
                placeholder="0.0"
                value={isCalculating ? 'Calculating...' : toAmount}
                disabled
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Price Impact Warning */}
        {parseFloat(priceImpact) > 5 && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">High Price Impact</p>
              <p className="text-xs text-muted-foreground">
                Price impact is {priceImpact}%. Your transaction may result in significant slippage.
              </p>
            </div>
          </div>
        )}

        {/* Swap Details */}
        {toAmount && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price Impact</span>
              <span className={parseFloat(priceImpact) > 5 ? 'text-destructive' : ''}>
                {priceImpact}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Slippage Tolerance</span>
              <span>{slippage}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Minimum Received</span>
              <span>
                {(parseFloat(toAmount) * (1 - parseFloat(slippage) / 100)).toFixed(6)} {toToken.symbol}
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6">
          {!account ? (
            <Button
              className="w-full"
              size="lg"
              onClick={connectWallet}
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          ) : !isOnBSC ? (
            <Button
              className="w-full"
              size="lg"
              onClick={switchToBSC}
              variant="destructive"
            >
              Switch to BSC Network
            </Button>
          ) : (
            <Button
              className="w-full"
              size="lg"
              onClick={executeSwap}
              disabled={isSwapping || !fromAmount || !toAmount || isCalculating}
            >
              {isSwapping ? 'Swapping...' : 'Swap'}
            </Button>
          )}
        </div>

        {/* Powered by PancakeSwap */}
        <p className="text-xs text-center text-muted-foreground mt-4">
          Powered by PancakeSwap
        </p>
      </Card>
    </div>
  );
};
