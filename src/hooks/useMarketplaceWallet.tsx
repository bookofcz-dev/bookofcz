import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';

const BSC_CHAIN_ID = '0x38'; // BSC Mainnet = 56 (0x38 in hex)
const BSC_TESTNET_CHAIN_ID = '0x61'; // BSC Testnet = 97 (0x61 in hex)
const BSC_RPC_URLS = [
  'https://bsc-dataseed1.binance.org',
  'https://bsc-dataseed2.binance.org',
  'https://bsc-dataseed3.binance.org',
  'https://bsc-dataseed4.binance.org',
];

// Platform fee wallet (4% goes here)
export const PLATFORM_WALLET = '0x6e22449bEbc5C719fA7ADB39bc2576B9E6F11bd8';

// BOCZ Token contract address
export const BOCZ_TOKEN_ADDRESS = '0x701bE97c604A35aB7BCF6C75cA6de3aba0704444';

// USDT Token contract address on BSC
export const USDT_TOKEN_ADDRESS = '0x55d398326f99059fF775485246999027B3197955';

// Minimal ERC20 ABI for token operations
const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

export const useMarketplaceWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts: string[]) => {
      console.log('🔄 Accounts changed event:', accounts);
      
      if (accounts.length === 0) {
        // Wallet disconnected
        console.log('❌ Wallet disconnected');
        localStorage.removeItem('walletConnected');
        setAccount(null);
        setProvider(null);
        setSigner(null);
        setChainId(null);
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected",
        });
      } else {
        // Account switched - update state with new account
        const newAccount = accounts[0].toLowerCase();
        console.log('🔄 Switching to new account:', newAccount);
        
        try {
          const browserProvider = new ethers.BrowserProvider(window.ethereum);
          const newSigner = await browserProvider.getSigner();
          const signerAddress = (await newSigner.getAddress()).toLowerCase();
          
          const network = await browserProvider.getNetwork();
          const currentChainId = '0x' + network.chainId.toString(16);
          
          console.log('✅ Updated to new account:', signerAddress);
          
          localStorage.setItem('walletConnected', signerAddress);
          setAccount(signerAddress);
          setProvider(browserProvider);
          setSigner(newSigner);
          setChainId(currentChainId);
          
          toast({
            title: "Account Switched",
            description: `Switched to ${signerAddress.slice(0, 6)}...${signerAddress.slice(-4)}`,
          });
        } catch (error) {
          console.error('❌ Error updating account:', error);
          localStorage.removeItem('walletConnected');
          setAccount(null);
          setProvider(null);
          setSigner(null);
          setChainId(null);
        }
      }
    };

    const handleChainChanged = async (newChainId: string) => {
      console.log('🔄 Chain changed:', newChainId);
      
      try {
        // Update chain ID without reloading
        setChainId(newChainId);
        
        // Update provider and signer with new network
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const newSigner = await browserProvider.getSigner();
        
        setProvider(browserProvider);
        setSigner(newSigner);
        
        toast({
          title: "Network Changed",
          description: "Your wallet network has been updated",
        });
      } catch (error) {
        console.error('❌ Error handling chain change:', error);
      }
    };

    // Set up event listeners
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    // Auto-reconnect if wallet was previously connected
    const reconnectWallet = async () => {
      const wasConnected = localStorage.getItem('walletConnected');
      if (wasConnected) {
        console.log('🔄 Auto-reconnecting wallet...');
        try {
          const browserProvider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await browserProvider.listAccounts();
          
          if (accounts.length > 0) {
            const signer = await browserProvider.getSigner();
            const signerAddress = (await signer.getAddress()).toLowerCase();
            
            const network = await browserProvider.getNetwork();
            const currentChainId = '0x' + network.chainId.toString(16);
            
            setAccount(signerAddress);
            setProvider(browserProvider);
            setSigner(signer);
            setChainId(currentChainId);
            
            console.log('✅ Auto-reconnected to:', signerAddress);
          }
        } catch (error) {
          console.error('❌ Auto-reconnect failed:', error);
          localStorage.removeItem('walletConnected');
        }
      }
    };
    
    reconnectWallet();
    console.log('👂 Wallet event listeners ready');

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
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
      console.log('🔌 Requesting wallet connection...');
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      
      // Request accounts - this will show account picker if multiple accounts
      const accounts = await browserProvider.send('eth_requestAccounts', []);
      console.log('📋 Available accounts:', accounts);
      
      // Get signer for the selected account
      const signer = await browserProvider.getSigner();
      const signerAddress = (await signer.getAddress()).toLowerCase();
      
      console.log('✅ Connected to wallet:', signerAddress);

      // Check network
      const network = await browserProvider.getNetwork();
      const currentChainId = '0x' + network.chainId.toString(16);

      // Set all state at once
      localStorage.setItem('walletConnected', signerAddress);
      setAccount(signerAddress);
      setProvider(browserProvider);
      setSigner(signer);
      setChainId(currentChainId);

      if (currentChainId !== BSC_CHAIN_ID && currentChainId !== BSC_TESTNET_CHAIN_ID) {
        await switchToBSC();
      } else {
        toast({
          title: "Wallet Connected",
          description: `Connected to ${signerAddress.slice(0, 6)}...${signerAddress.slice(-4)}`,
        });
      }
    } catch (error: any) {
      console.error('❌ Error connecting wallet:', error);
      // Clear state on error
      localStorage.removeItem('walletConnected');
      setAccount(null);
      setProvider(null);
      setSigner(null);
      setChainId(null);
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
      // Try to switch first - fastest for users who already have BSC
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BSC_CHAIN_ID }],
      });
    } catch (switchError: any) {
      // If network doesn't exist (4902), add it with correct RPC URLs
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
                rpcUrls: BSC_RPC_URLS,
                blockExplorerUrls: ['https://bscscan.com/'],
              },
            ],
          });
        } catch (addError) {
          console.error('Error adding BSC network:', addError);
          throw addError;
        }
      } else {
        console.error('Error switching to BSC network:', switchError);
        throw switchError;
      }
    }
  };

  const disconnectWallet = () => {
    console.log('🔌 Manually disconnecting wallet');
    localStorage.removeItem('walletConnected');
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected from the app",
    });
  };

  const sendTransaction = async (to: string, valueInBNB: string) => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }

    // Validate recipient address
    if (!ethers.isAddress(to)) {
      throw new Error('Invalid recipient address');
    }

    // Validate amount
    const value = ethers.parseEther(valueInBNB);
    if (value <= 0n) {
      throw new Error('Invalid transaction amount');
    }

    const tx = await signer.sendTransaction({
      to,
      value,
    });

    return tx;
  };

  const sendTokenTransaction = async (to: string, amount: number) => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }

    // Validate recipient address
    if (!ethers.isAddress(to)) {
      throw new Error('Invalid recipient address');
    }

    try {
      // This charges BOCZ tokens from the connected wallet, NOT BNB or USDT
      console.log(`🪙 Initiating BOCZ token transfer: ${amount} $BOCZ to ${to}`);
      const tokenContract = new ethers.Contract(BOCZ_TOKEN_ADDRESS, ERC20_ABI, signer);
      
      // Get token decimals
      const decimals = await tokenContract.decimals();
      const tokenAmount = ethers.parseUnits(amount.toString(), decimals);

      // Send token transfer
      const tx = await tokenContract.transfer(to, tokenAmount);

      return tx;
    } catch (error: any) {
      console.error('Token transaction error:', error);
      throw new Error(error.message || 'Failed to send token transaction');
    }
  };

  const sendUsdtTransaction = async (to: string, amount: number) => {
    if (!signer) {
      throw new Error('Wallet not connected');
    }

    // Validate recipient address
    if (!ethers.isAddress(to)) {
      throw new Error('Invalid recipient address');
    }

    try {
      console.log(`💵 Initiating USDT transfer: ${amount} USDT to ${to}`);
      const tokenContract = new ethers.Contract(USDT_TOKEN_ADDRESS, ERC20_ABI, signer);
      
      // USDT has 18 decimals on BSC
      const decimals = await tokenContract.decimals();
      const tokenAmount = ethers.parseUnits(amount.toString(), decimals);

      // Send token transfer
      const tx = await tokenContract.transfer(to, tokenAmount);

      return tx;
    } catch (error: any) {
      console.error('USDT transaction error:', error);
      throw new Error(error.message || 'Failed to send USDT transaction');
    }
  };

  const getTokenBalance = async (walletAddress: string, tokenAddress: string = BOCZ_TOKEN_ADDRESS) => {
    try {
      // Use public BSC RPC for read-only operations to avoid API key requirements
      const publicProvider = new ethers.JsonRpcProvider(BSC_RPC_URLS[0]);
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, publicProvider);
      const balance = await tokenContract.balanceOf(walletAddress);
      const decimals = await tokenContract.decimals();
      return ethers.formatUnits(balance, decimals);
    } catch (error) {
      console.error('Error fetching token balance:', error);
      return '0';
    }
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
    sendTokenTransaction,
    sendUsdtTransaction,
    getTokenBalance,
    isOnBSC: chainId === BSC_CHAIN_ID || chainId === BSC_TESTNET_CHAIN_ID,
  };
};

// Extend window type for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
