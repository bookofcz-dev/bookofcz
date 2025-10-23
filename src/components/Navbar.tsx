import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import logo from '@/assets/bookofcz-logo.png';

export const Navbar = () => {
  const location = useLocation();
  const { account, connectWallet, disconnectWallet, isConnecting } = useWallet();
  const { isAdmin } = useAdminCheck(account);
  
  const baseNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Audio', path: '#audio' },
    { name: 'Roadmap', path: '#roadmap' },
  ];

  // Add creator dashboard link if wallet is connected
  const navLinks = account 
    ? [...baseNavLinks, { name: 'Creator Dashboard', path: '/creator-dashboard' }]
    : baseNavLinks;

  // Add admin dashboard link if user is admin
  const allNavLinks = isAdmin
    ? [...navLinks, { name: 'Admin Dashboard', path: '/admin-dashboard' }]
    : navLinks;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={logo} alt="Book of CZ" className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {allNavLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-md font-cta text-sm font-medium transition-all duration-300 relative group ${
                  isActive(link.path)
                    ? 'text-primary'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
            {!account ? (
              <Button 
                size="sm" 
                variant="outline" 
                className="ml-4 gap-2"
                onClick={connectWallet}
                disabled={isConnecting}
              >
                <Wallet className="h-4 w-4" />
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            ) : (
              <Button 
                size="sm" 
                variant="outline" 
                className="ml-4 gap-2"
                onClick={disconnectWallet}
              >
                <Wallet className="h-4 w-4" />
                {account.slice(0, 6)}...{account.slice(-4)}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </div>
    </nav>
  );
};
