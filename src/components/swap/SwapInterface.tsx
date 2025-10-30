import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { BOCZ_TOKEN_ADDRESS } from '@/hooks/useMarketplaceWallet';

export const SwapInterface = () => {
  const { account, connectWallet, isConnecting, isOnBSC, switchToBSC } = useWallet();

  const openPancakeSwap = () => {
    // PancakeSwap URL with BOCZ token pre-filled
    const pancakeSwapUrl = `https://pancakeswap.finance/swap?outputCurrency=${BOCZ_TOKEN_ADDRESS}`;
    window.open(pancakeSwapUrl, '_blank');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="p-6 glass-card">
        <div className="text-center space-y-4 mb-6">
          <h2 className="text-2xl font-heading font-bold">Swap BNB for BOCZ</h2>
          <p className="text-sm text-muted-foreground">
            Trade directly on PancakeSwap with the best rates and deepest liquidity
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">BOCZ Token Address</span>
            </div>
            <div className="font-mono text-xs break-all bg-background p-2 rounded border">
              {BOCZ_TOKEN_ADDRESS}
            </div>
          </div>

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
              onClick={openPancakeSwap}
            >
              Open PancakeSwap
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Note:</strong> You'll be redirected to PancakeSwap where you can
            swap BNB for BOCZ tokens with optimal rates and security.
          </p>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-4">
          Powered by PancakeSwap
        </p>
      </Card>
    </div>
  );
};
