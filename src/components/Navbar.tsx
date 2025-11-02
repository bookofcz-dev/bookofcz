import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Wallet, Menu, X } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { useState } from 'react';
import logo from '@/assets/bookofcz-logo.png';

export const Navbar = () => {
  const location = useLocation();
  const { account, connectWallet, disconnectWallet, isConnecting } = useWallet();
  const { isAdmin } = useAdminCheck(account);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const baseNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Whitepaper', path: '/whitepaper' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Swap', path: '/swap' },
    { name: 'Governance', path: '/governance' },
    { name: 'Audio', path: '/#collection' },
    { name: 'Roadmap', path: '/#roadmap' },
  ];

  // Add links if wallet is connected
  const navLinks = account 
    ? [
        ...baseNavLinks, 
        { name: 'My Library', path: '/my-library' },
        { name: 'Creator Dashboard', path: '/marketplace/dashboard' }
      ]
    : baseNavLinks;

  // Add admin dashboard link if user is admin
  const allNavLinks = isAdmin
    ? [...navLinks, { name: 'Admin Dashboard', path: '/admin' }]
    : navLinks;

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    // Handle hash links - navigate to home page if not already there
    if (path.includes('#')) {
      const hash = path.split('#')[1];
      if (location.pathname !== '/') {
        // Let React Router navigate to home, then scroll will happen
        setMobileMenuOpen(false);
        // After navigation, scroll to element
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        // Already on home page, just scroll
        e.preventDefault();
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        setMobileMenuOpen(false);
      }
    } else {
      setMobileMenuOpen(false);
    }
  };

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
                onClick={(e) => handleNavClick(e, link.path)}
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

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-4 mt-8">
                <div className="flex items-center gap-3 mb-4">
                  <img src={logo} alt="Book of CZ" className="h-8 w-auto" />
                </div>
                
                {allNavLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={(e) => handleNavClick(e, link.path)}
                    className={`px-4 py-3 rounded-md font-cta text-base font-medium transition-all ${
                      isActive(link.path)
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="mt-4 pt-4 border-t border-border">
                  {!account ? (
                    <Button 
                      className="w-full gap-2"
                      onClick={() => {
                        connectWallet();
                        setMobileMenuOpen(false);
                      }}
                      disabled={isConnecting}
                    >
                      <Wallet className="h-4 w-4" />
                      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                    </Button>
                  ) : (
                    <Button 
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => {
                        disconnectWallet();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Wallet className="h-4 w-4" />
                      {account.slice(0, 6)}...{account.slice(-4)}
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
