import { useState, useEffect } from 'react';
import { BrowserProvider, Contract, formatUnits } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const TOKEN_ADDRESS = '0x701bE97c604A35aB7BCF6C75cA6de3aba0704444';
const REQUIRED_BALANCE = 44444;
const BSC_CHAIN_ID = '0x38'; // 56 in hex

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)'
];

export const useTokenGate = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [tokenBalance, setTokenBalance] = useState<string>('0');

  const checkBalance = async (provider: BrowserProvider, address: string) => {
    try {
      const contract = new Contract(TOKEN_ADDRESS, ERC20_ABI, provider);
      const balance = await contract.balanceOf(address);
      const decimals = await contract.decimals();
      const formattedBalance = formatUnits(balance, decimals);
      
      setTokenBalance(parseFloat(formattedBalance).toFixed(2));
      
      const hasRequiredBalance = parseFloat(formattedBalance) >= REQUIRED_BALANCE;
      setHasAccess(hasRequiredBalance);
      
      return hasRequiredBalance;
    } catch (err) {
      console.error('Error checking balance:', err);
      setError('Failed to verify token balance');
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

      if (network.chainId !== 56n) {
        const switched = await switchToBSC(provider);
        if (!switched) {
          setIsLoading(false);
          return;
        }
      }

      const accounts = await provider.send('eth_requestAccounts', []);
      const address = accounts[0];
      
      setWalletAddress(address);
      setIsConnected(true);

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
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
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
