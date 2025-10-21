import { Button } from '@/components/ui/button';
import { Wallet, LogOut, Upload, Home, LayoutDashboard, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import logo from '@/assets/bookofcz-logo.png';

interface MarketplaceHeaderProps {
  account: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
  isConnecting: boolean;
  onUploadClick: () => void;
}

export const MarketplaceHeader = ({
  account,
  connectWallet,
  disconnectWallet,
  isConnecting,
  onUploadClick,
}: MarketplaceHeaderProps) => {
  const navigate = useNavigate();
  const { isAdmin } = useAdminCheck(account);
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/marketplace" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={logo} alt="BookofCZ" className="h-10 w-auto" />
            <div>
              <h1 className="text-xl font-bold">BOCZ</h1>
              <p className="text-xs text-muted-foreground">Web3 Marketplace</p>
            </div>
          </Link>

          <nav className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                <span className="hidden md:inline">Home</span>
              </Button>
            </Link>

            {account && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={onUploadClick}
                >
                  <Upload className="h-4 w-4" />
                  <span className="hidden md:inline">Upload</span>
                </Button>
                {isAdmin && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => navigate('/admin')}
                  >
                    <Shield className="h-4 w-4" />
                    <span className="hidden md:inline">Admin</span>
                  </Button>
                )}
              </>
            )}

            {account ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:block px-3 py-1.5 bg-primary/10 rounded-md text-sm font-mono">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnectWallet}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline">Disconnect</span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={connectWallet}
                disabled={isConnecting}
                size="sm"
                className="gap-2"
              >
                <Wallet className="h-4 w-4" />
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
