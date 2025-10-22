import { createContext, useContext, ReactNode } from 'react';
import { useMarketplaceWallet } from '@/hooks/useMarketplaceWallet';
import type { ethers } from 'ethers';

interface WalletContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  isConnecting: boolean;
  chainId: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToBSC: () => Promise<void>;
  sendTransaction: (to: string, valueInBNB: string) => Promise<any>;
  sendTokenTransaction: (to: string, amount: number) => Promise<any>;
  getTokenBalance: (walletAddress: string) => Promise<string>;
  isOnBSC: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const wallet = useMarketplaceWallet();
  
  return (
    <WalletContext.Provider value={wallet}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
