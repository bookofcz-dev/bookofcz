import { Book } from "@/components/Book";
import { bookContent10CN } from "@/lib/bookContent10CN";
import bookCover from "@/assets/book10-cover.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wallet, CheckCircle2 } from "lucide-react";
import { useTokenGate } from "@/hooks/useTokenGate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BookPage10CN = () => {
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
          返回合集
        </Button>

        {!hasAccess && (
          <Card className="max-w-2xl mx-auto mb-8 border-2 border-primary/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Wallet className="w-6 h-6" />
                代币门控内容
              </CardTitle>
              <CardDescription>
                此书需要在BSC上持有CZ之书代币
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isConnected ? (
                <>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      要求：
                    </p>
                    <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                      <li>最低余额：{requiredBalance.toLocaleString()} 代币</li>
                      <li>网络：BSC（币安智能链）</li>
                      <li className="font-mono text-xs">代币：0x701bE97c604A35aB7BCF6C75cA6de3aba0704444</li>
                    </ul>
                  </div>
                  <Button
                    onClick={connectWallet}
                    disabled={isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? "连接中..." : "连接钱包"}
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">已连接钱包：</p>
                    <p className="text-xs font-mono bg-muted p-2 rounded">
                      {walletAddress}
                    </p>
                    <p className="text-sm font-medium">您的余额：</p>
                    <p className="text-lg font-bold text-primary">
                      {parseFloat(tokenBalance).toLocaleString()} 代币
                    </p>
                    <p className="text-sm text-muted-foreground">
                      需要：{requiredBalance.toLocaleString()} 代币
                    </p>
                  </div>
                  <Button
                    onClick={disconnectWallet}
                    variant="outline"
                    className="w-full"
                  >
                    断开连接
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
                  <p className="font-semibold">访问已授权！</p>
                  <p className="text-sm text-muted-foreground">
                    您持有 {parseFloat(tokenBalance).toLocaleString()} 代币
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {hasAccess && (
          <Book content={bookContent10CN} coverImage={bookCover} title="CZ之书10：用CZ的Giggle重塑教育" bookId="book10-cn" />
        )}
      </div>
    </div>
  );
};

export default BookPage10CN;
