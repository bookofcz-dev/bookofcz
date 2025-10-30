import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ChevronDown } from 'lucide-react';
import { TOKENS, Token } from '@/hooks/useSwap';
import { useState } from 'react';

interface TokenSelectorProps {
  selectedToken: Token;
  onSelectToken: (token: Token) => void;
  otherToken?: Token;
}

export const TokenSelector = ({ selectedToken, onSelectToken, otherToken }: TokenSelectorProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (token: Token) => {
    if (token.address !== otherToken?.address) {
      onSelectToken(token);
      setOpen(false);
    }
  };

  const getTokenColor = (symbol: string) => {
    switch (symbol) {
      case 'BNB':
        return 'from-amber-500/20 to-yellow-500/20 border-amber-500/30';
      case 'BOCZ':
        return 'from-primary/20 to-primary/10 border-primary/30';
      case 'USDT':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'BUSD':
        return 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
      default:
        return 'from-muted/20 to-muted/10 border-muted/30';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`h-auto px-4 py-2 gap-2 bg-gradient-to-r ${getTokenColor(selectedToken.symbol)} border-2 hover:brightness-110 transition-all`}
        >
          <span className="font-bold text-base">{selectedToken.symbol}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Token</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-4">
          {Object.values(TOKENS).map((token) => {
            const isDisabled = token.address === otherToken?.address;
            const isSelected = token.address === selectedToken.address;
            
            return (
              <button
                key={token.address}
                onClick={() => handleSelect(token)}
                disabled={isDisabled}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? `bg-gradient-to-r ${getTokenColor(token.symbol)} border-opacity-100`
                    : isDisabled
                    ? 'bg-muted/50 border-muted opacity-50 cursor-not-allowed'
                    : 'border-muted hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-lg">{token.symbol}</div>
                    <div className="text-sm text-muted-foreground">{token.name}</div>
                  </div>
                  {isSelected && (
                    <div className="text-primary font-semibold">✓</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
