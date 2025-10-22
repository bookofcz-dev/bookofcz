import { useState, useEffect } from 'react';
import { BrowserProvider, Contract, formatUnits, isAddress, getAddress } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Immutable constants - Token address with checksum validation
const TOKEN_ADDRESS = '0x701bE97c604A35aB7BCF6C75cA6de3aba0704444' as const;
const REQUIRED_BALANCE = 44444 as const;
const BSC_CHAIN_ID = '0x38' as const; // 56 in hex
const BSC_CHAIN_ID_DECIMAL = 56n as const;

// Minimal read-only ERC20 ABI - only view functions, no state changes
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)'
] as const;

export const useTokenGate = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string>('0');

  const checkBalance = async (provider: BrowserProvider, address: string) => {
    try {
      // Validate address format before making any calls
      if (!isAddress(address)) {
        setError('Invalid wallet address format');
        return false;
      }

      // Use checksummed address for security
      const checksummedAddress = getAddress(address);
      
      // Create contract instance with read-only access
      const contract = new Contract(TOKEN_ADDRESS, ERC20_ABI, provider);
      
      // Read token balance - view function, no state changes
      const balance = await contract.balanceOf(checksummedAddress);
      const decimals = await contract.decimals();
      
      // Validate returned values are numbers
      if (typeof balance !== 'bigint' || typeof decimals !== 'bigint') {
        setError('Invalid response from token contract');
        return false;
      }
      
      const formattedBalance = formatUnits(balance, decimals);
      const numericBalance = parseFloat(formattedBalance);
      
      // Validate parsed balance is a valid number
      if (isNaN(numericBalance) || !isFinite(numericBalance)) {
        setError('Invalid token balance');
        return false;
      }
      
      setTokenBalance(numericBalance.toFixed(2));
      
      const hasRequiredBalance = numericBalance >= REQUIRED_BALANCE;
      setHasAccess(hasRequiredBalance);
      
      return hasRequiredBalance;
    } catch (err) {
      // Don't log error details in production for security
      setError('Failed to verify token balance. Please try again.');
      return false;
    }
  };

  const switchToBSC = async (provider: BrowserProvider) => {
    try {
      await provider.send('wallet_switchEthereumChain', [{ chainId: BSC_CHAIN_ID }]);
      return true;
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await provider.send('wallet_addEthereumChain', [{
            chainId: BSC_CHAIN_ID,
            chainName: 'BNB Smart Chain',
            nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
            rpcUrls: ['https://bsc-dataseed.binance.org/'],
            blockExplorerUrls: ['https://bscscan.com/']
          }]);
          return true;
        } catch (addError) {
          setError('Failed to add BSC network');
          return false;
        }
      }
      setError('Failed to switch to BSC network');
      return false;
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!window.ethereum) {
        setError('Please install MetaMask or another Web3 wallet');
        setIsLoading(false);
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      // Verify we're on BSC network
      if (network.chainId !== BSC_CHAIN_ID_DECIMAL) {
        const switched = await switchToBSC(provider);
        if (!switched) {
          setIsLoading(false);
          return;
        }
        // Re-fetch provider after network switch
        const newProvider = new BrowserProvider(window.ethereum);
        const newNetwork = await newProvider.getNetwork();
        if (newNetwork.chainId !== BSC_CHAIN_ID_DECIMAL) {
          setError('Network switch failed. Please manually switch to BSC.');
          setIsLoading(false);
          return;
        }
      }

      // Request account access - user must approve
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (!accounts || accounts.length === 0) {
        setError('No accounts found. Please check your wallet.');
        setIsLoading(false);
        return;
      }
      
      const address = accounts[0];
      
      // Validate address format
      if (!isAddress(address)) {
        setError('Invalid address received from wallet');
        setIsLoading(false);
        return;
      }
      
      setWalletAddress(address);
      setIsConnected(true);

      // Perform read-only balance check
      await checkBalance(provider, address);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setHasAccess(false);
    setWalletAddress(null);
    setTokenBalance('0');
    setError(null);
  };

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          // Wallet disconnected
          disconnectWallet();
        } else {
          // Account switched - re-check balance for new account
          const newAddress = accounts[0];
          setWalletAddress(newAddress);
          setIsConnected(true);
          
          try {
            const provider = new BrowserProvider(window.ethereum);
            await checkBalance(provider, newAddress);
          } catch (err) {
            setError('Failed to check balance for new account');
          }
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  return {
    isConnected,
    hasAccess,
    isLoading,
    error,
    walletAddress,
    tokenBalance,
    connectWallet,
    disconnectWallet,
    requiredBalance: REQUIRED_BALANCE
  };
};
