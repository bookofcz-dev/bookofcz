import { Book } from "@/components/Book";
import { bookContent10 } from "@/lib/bookContent10";
import bookCover from "@/assets/book10-cover.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wallet, CheckCircle2 } from "lucide-react";
import { useTokenGate } from "@/hooks/useTokenGate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BookPage10 = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate("/")}
          variant="ghost"
          className="mb-8 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Collection
        </Button>

        {!hasAccess && (
          <Card className="max-w-2xl mx-auto mb-8 border-2 border-primary/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Wallet className="w-6 h-6" />
                Token Gated Content
              </CardTitle>
              <CardDescription>
                This book requires holding Book of CZ tokens on BSC
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isConnected ? (
                <>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Requirements:
                    </p>
                    <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                      <li>Minimum Balance: {requiredBalance.toLocaleString()} tokens</li>
                      <li>Network: BSC (BNB Smart Chain)</li>
                      <li className="font-mono text-xs">Token: 0x701bE97c604A35aB7BCF6C75cA6de3aba0704444</li>
                    </ul>
                  </div>
                  <Button
                    onClick={connectWallet}
                    disabled={isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? "Connecting..." : "Connect Wallet"}
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Connected Wallet:</p>
                    <p className="text-xs font-mono bg-muted p-2 rounded">
                      {walletAddress}
                    </p>
                    <p className="text-sm font-medium">Your Balance:</p>
                    <p className="text-lg font-bold text-primary">
                      {parseFloat(tokenBalance).toLocaleString()} tokens
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Required: {requiredBalance.toLocaleString()} tokens
                    </p>
                  </div>
                  <Button
                    onClick={disconnectWallet}
                    variant="outline"
                    className="w-full"
                  >
                    Disconnect
                  </Button>
                </>
              )}
              {error && (
                <p className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                  {error}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {hasAccess && (
          <Card className="max-w-2xl mx-auto mb-8 border-2 border-green-500/20 bg-green-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-6 h-6" />
                <div>
                  <p className="font-semibold">Access Granted!</p>
                  <p className="text-sm text-muted-foreground">
                    You hold {parseFloat(tokenBalance).toLocaleString()} tokens
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Book content={bookContent10} coverImage={bookCover} title="Book of CZ 10: Reshaping Education with CZ's Giggle" />
      </div>
    </div>
  );
};

export default BookPage10;
