import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';

const BSC_CHAIN_ID = '0x38'; // BSC Mainnet = 56 (0x38 in hex)
const BSC_TESTNET_CHAIN_ID = '0x61'; // BSC Testnet = 97 (0x61 in hex)
const BSC_RPC_URL = 'https://bsc-dataseed.binance.org/';

// Platform fee wallet (4% goes here)
export const PLATFORM_WALLET = '0x0000000000000000000000000000000000000000'; // Replace with actual platform wallet

export const useMarketplaceWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          setAccount(null);
          setSigner(null);
        } else {
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = (newChainId: string) => {
        setChainId(newChainId);
        if (newChainId !== BSC_CHAIN_ID && newChainId !== BSC_TESTNET_CHAIN_ID) {
          toast({
            title: "Wrong Network",
            description: "Please switch to Binance Smart Chain",
            variant: "destructive",
          });
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [toast]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to use the marketplace",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(browserProvider);

      // Request account access
      const accounts = await browserProvider.send('eth_requestAccounts', []);
      const account = accounts[0];
      setAccount(account);

      // Get signer
      const signer = await browserProvider.getSigner();
      setSigner(signer);

      // Check network
      const network = await browserProvider.getNetwork();
      const currentChainId = '0x' + network.chainId.toString(16);
      setChainId(currentChainId);

      if (currentChainId !== BSC_CHAIN_ID && currentChainId !== BSC_TESTNET_CHAIN_ID) {
        await switchToBSC();
      } else {
        toast({
          title: "Wallet Connected",
          description: `Connected to ${account.slice(0, 6)}...${account.slice(-4)}`,
        });
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const switchToBSC = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BSC_CHAIN_ID }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: BSC_CHAIN_ID,
                chainName: 'Binance Smart Chain',
                nativeCurrency: {
                  name: 'BNB',
                  symbol: 'BNB',
                  decimals: 18,
                },
                rpcUrls: [BSC_RPC_URL],
                blockExplorerUrls: ['https://bscscan.com/'],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding BSC network:', addError);
          throw addError;
        }
      } else {
        throw switchError;
      }
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const sendTransaction = async (to: string, valueInBNB: string) => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }

    const tx = await signer.sendTransaction({
      to,
      value: ethers.parseEther(valueInBNB),
    });

    return tx;
  };

  return {
    account,
    provider,
    signer,
    isConnecting,
    chainId,
    connectWallet,
    disconnectWallet,
    switchToBSC,
    sendTransaction,
    isOnBSC: chainId === BSC_CHAIN_ID || chainId === BSC_TESTNET_CHAIN_ID,
  };
};

// Extend window type for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
