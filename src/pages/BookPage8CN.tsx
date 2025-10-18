import { Book } from "@/components/Book";
import { bookContent, title, coverImage } from "@/lib/bookContent8CN";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTokenGate } from "@/hooks/useTokenGate";
import { Wallet, Lock, CheckCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const BookPage8CN = () => {
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
          ← 返回合集
        </Button>

        {!hasAccess && (
          <Card className="max-w-2xl mx-auto mb-8 p-8 text-center">
            <div className="flex justify-center mb-4">
              <Lock className="w-16 h-16 text-primary" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">代币门控内容</h2>
            
            <p className="text-muted-foreground mb-6">
              本书需要验证您在币安智能链上的代币持有量
            </p>

            <div className="bg-muted rounded-lg p-4 mb-6 text-left">
              <p className="font-semibold mb-2">要求：</p>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 代币：0x701bE97c604A35aB7BCF6C75cA6de3aba0704444</li>
                <li>• 网络：BSC（币安智能链）</li>
                <li>• 最低余额：{requiredBalance.toLocaleString()} 代币</li>
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
                    连接中...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    连接钱包
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">已连接钱包</p>
                  <p className="font-mono text-sm">{walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}</p>
                  <p className="text-sm text-muted-foreground mt-2">您的余额：{tokenBalance} 代币</p>
                </div>
                
                {!hasAccess && (
                  <p className="text-destructive text-sm">
                    代币余额不足。您至少需要 {requiredBalance.toLocaleString()} 代币。
                  </p>
                )}
                
                <Button 
                  onClick={disconnectWallet}
                  variant="outline"
                  size="sm"
                >
                  断开连接
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
            <span className="font-semibold">已授权访问</span>
          </div>
        )}

        <Book content={bookContent} title={title} coverImage={coverImage} bookId="book8-cn" />
      </div>
    </div>
  );
};

export default BookPage8CN;
