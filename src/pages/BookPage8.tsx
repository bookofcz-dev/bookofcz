import { Book } from "@/components/Book";
import { bookContent, title, coverImage } from "@/lib/bookContent8";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTokenGate } from "@/hooks/useTokenGate";
import { Wallet, Lock, CheckCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const BookPage8 = () => {
  const navigate = useNavigate();
  const {
    isConnected,
    hasAccess,
    isLoading,
    error,
    walletAddress,
    tokenBalance,
    connectWallet,
    disconnectWallet,
    requiredBalance
  } = useTokenGate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => navigate("/")} 
          variant="ghost"
          className="mb-6"
        >
          ← Back to Collection
        </Button>

        {!hasAccess && (
          <Card className="max-w-2xl mx-auto mb-8 p-8 text-center">
            <div className="flex justify-center mb-4">
              <Lock className="w-16 h-16 text-primary" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Token Gated Content</h2>
            
            <p className="text-muted-foreground mb-6">
              This book requires verification of token ownership on Binance Smart Chain
            </p>

            <div className="bg-muted rounded-lg p-4 mb-6 text-left">
              <p className="font-semibold mb-2">Requirements:</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Token: 0x701bE97c604A35aB7BCF6C75cA6de3aba0704444</li>
                <li>• Network: BSC (BNB Smart Chain)</li>
                <li>• Minimum Balance: {requiredBalance.toLocaleString()} tokens</li>
              </ul>
            </div>

            {!isConnected ? (
              <Button 
                onClick={connectWallet} 
                disabled={isLoading}
                size="lg"
                className="w-full max-w-xs"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Connected Wallet</p>
                  <p className="font-mono text-sm">{walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}</p>
                  <p className="text-sm text-muted-foreground mt-2">Your Balance: {tokenBalance} tokens</p>
                </div>
                
                {!hasAccess && (
                  <p className="text-destructive text-sm">
                    Insufficient token balance. You need at least {requiredBalance.toLocaleString()} tokens.
                  </p>
                )}
                
                <Button 
                  onClick={disconnectWallet}
                  variant="outline"
                  size="sm"
                >
                  Disconnect
                </Button>
              </div>
            )}

            {error && (
              <p className="text-destructive text-sm mt-4">{error}</p>
            )}
          </Card>
        )}

        {hasAccess && (
          <div className="mb-6 flex items-center justify-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Access Granted</span>
          </div>
        )}

        <Book content={bookContent} title={title} coverImage={coverImage} bookId="book8-en" />
      </div>
    </div>
  );
};

export default BookPage8;
