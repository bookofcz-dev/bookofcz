import { Book } from "@/components/Book";
import { bookContent10ES } from "@/lib/bookContent10ES";
import bookCover from "@/assets/book10-cover.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wallet, CheckCircle2 } from "lucide-react";
import { useTokenGate } from "@/hooks/useTokenGate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BookPage10ES = () => {
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
          Volver a la Colección
        </Button>

        {!hasAccess && (
          <Card className="max-w-2xl mx-auto mb-8 border-2 border-primary/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Wallet className="w-6 h-6" />
                Contenido Protegido por Tokens
              </CardTitle>
              <CardDescription>
                Este libro requiere tener tokens del Libro de CZ en BSC
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isConnected ? (
                <>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Requisitos:
                    </p>
                    <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                      <li>Saldo Mínimo: {requiredBalance.toLocaleString()} tokens</li>
                      <li>Red: BSC (BNB Smart Chain)</li>
                      <li className="font-mono text-xs">Token: 0x701bE97c604A35aB7BCF6C75cA6de3aba0704444</li>
                    </ul>
                  </div>
                  <Button
                    onClick={connectWallet}
                    disabled={isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? "Conectando..." : "Conectar Billetera"}
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Billetera Conectada:</p>
                    <p className="text-xs font-mono bg-muted p-2 rounded">
                      {walletAddress}
                    </p>
                    <p className="text-sm font-medium">Tu Saldo:</p>
                    <p className="text-lg font-bold text-primary">
                      {parseFloat(tokenBalance).toLocaleString()} tokens
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Requerido: {requiredBalance.toLocaleString()} tokens
                    </p>
                  </div>
                  <Button
                    onClick={disconnectWallet}
                    variant="outline"
                    className="w-full"
                  >
                    Desconectar
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
                  <p className="font-semibold">¡Acceso Concedido!</p>
                  <p className="text-sm text-muted-foreground">
                    Tienes {parseFloat(tokenBalance).toLocaleString()} tokens
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {hasAccess && (
          <Book content={bookContent10ES} coverImage={bookCover} title="Libro de CZ 10: Remodelando la Educación con Giggle de CZ" />
        )}
      </div>
    </div>
  );
};

export default BookPage10ES;
