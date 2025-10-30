import { useState, useCallback, useEffect } from 'react';
import { Contract, parseUnits, formatUnits } from 'ethers';
import { useWallet } from '@/contexts/WalletContext';
import { toast } from 'sonner';
import { BOCZ_TOKEN_ADDRESS } from '@/hooks/useMarketplaceWallet';

// PancakeSwap Router V2 on BSC Mainnet
const PANCAKE_ROUTER_ADDRESS = '0x10ED43C718714eb63d5aA57B78B54704E256024E';

// Token addresses on BSC
export const TOKENS = {
  BNB: {
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // Native BNB
    symbol: 'BNB',
    decimals: 18,
    name: 'BNB',
  },
  BOCZ: {
    address: BOCZ_TOKEN_ADDRESS,
    symbol: 'BOCZ',
    decimals: 18,
    name: 'BOCZ Token',
  },
  USDT: {
    address: '0x55d398326f99059fF775485246999027B3197955',
    symbol: 'USDT',
    decimals: 18,
    name: 'Tether USD',
  },
  BUSD: {
    address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    symbol: 'BUSD',
    decimals: 18,
    name: 'Binance USD',
  },
};

// Wrapped BNB address for router interactions
const WBNB_ADDRESS = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';

const ROUTER_ABI = [
  'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
];

const ERC20_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
  'function decimals() external view returns (uint8)',
];

export const useSwap = () => {
  const { provider, signer, account, isOnBSC } = useWallet();
  const [fromToken, setFromToken] = useState(TOKENS.BNB);
  const [toToken, setToToken] = useState(TOKENS.BOCZ);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [priceImpact, setPriceImpact] = useState('0');

  // Calculate output amount
  const calculateOutputAmount = useCallback(async () => {
    if (!provider || !fromAmount || parseFloat(fromAmount) <= 0) {
      setToAmount('');
      return;
    }

    setIsCalculating(true);
    try {
      const router = new Contract(PANCAKE_ROUTER_ADDRESS, ROUTER_ABI, provider);
      const amountIn = parseUnits(fromAmount, fromToken.decimals);
      
      // Helper to create token address for path
      const getTokenAddress = (token: typeof TOKENS[keyof typeof TOKENS]) => {
        return token.address === TOKENS.BNB.address ? WBNB_ADDRESS : token.address;
      };

      const fromAddr = getTokenAddress(fromToken);
      const toAddr = getTokenAddress(toToken);

      // Try different paths in order of preference
      const pathsToTry = [
        // Direct path
        [fromAddr, toAddr],
        // Through USDT
        [fromAddr, TOKENS.USDT.address, toAddr],
        // Through BUSD
        [fromAddr, TOKENS.BUSD.address, toAddr],
        // Through BNB (WBNB)
        [fromAddr, WBNB_ADDRESS, toAddr],
      ];

      let amounts;
      let successfulPath;

      for (const path of pathsToTry) {
        // Skip if path has duplicates
        if (new Set(path).size !== path.length) continue;
        
        try {
          amounts = await router.getAmountsOut(amountIn, path);
          successfulPath = path;
          break;
        } catch (e) {
          // Try next path
          continue;
        }
      }

      if (!amounts || !successfulPath) {
        throw new Error('No valid swap route found');
      }

      const outputAmount = formatUnits(amounts[amounts.length - 1], toToken.decimals);
      setToAmount(outputAmount);

      // Calculate price impact (simplified)
      const expectedRate = parseFloat(fromAmount) / parseFloat(outputAmount);
      const impact = Math.abs((expectedRate - 1) * 100);
      setPriceImpact(impact.toFixed(2));
    } catch (error: any) {
      console.error('Error calculating output:', error);
      toast.error('No liquidity available for this token pair');
      setToAmount('');
      setPriceImpact('0');
    } finally {
      setIsCalculating(false);
    }
  }, [provider, fromAmount, fromToken, toToken]);

  // Debounce calculation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (fromAmount) {
        calculateOutputAmount();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [fromAmount, calculateOutputAmount]);

  // Execute swap
  const executeSwap = useCallback(async () => {
    if (!signer || !account || !fromAmount || !toAmount) {
      toast.error('Please connect wallet and enter amounts');
      return;
    }

    if (!isOnBSC) {
      toast.error('Please switch to BSC network');
      return;
    }

    setIsSwapping(true);
    try {
      const router = new Contract(PANCAKE_ROUTER_ADDRESS, ROUTER_ABI, signer);
      const amountIn = parseUnits(fromAmount, fromToken.decimals);
      const slippageMultiplier = 1 - parseFloat(slippage) / 100;
      const amountOutMin = parseUnits(
        (parseFloat(toAmount) * slippageMultiplier).toFixed(toToken.decimals),
        toToken.decimals
      );
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes

      // Helper to create token address for path
      const getTokenAddress = (token: typeof TOKENS[keyof typeof TOKENS]) => {
        return token.address === TOKENS.BNB.address ? WBNB_ADDRESS : token.address;
      };

      const fromAddr = getTokenAddress(fromToken);
      const toAddr = getTokenAddress(toToken);

      // Try to find best path using same logic as calculateOutputAmount
      const pathsToTry = [
        [fromAddr, toAddr],
        [fromAddr, TOKENS.USDT.address, toAddr],
        [fromAddr, TOKENS.BUSD.address, toAddr],
        [fromAddr, WBNB_ADDRESS, toAddr],
      ];

      let path;
      for (const testPath of pathsToTry) {
        if (new Set(testPath).size !== testPath.length) continue;
        try {
          await router.getAmountsOut(amountIn, testPath);
          path = testPath;
          break;
        } catch (e) {
          continue;
        }
      }

      if (!path) {
        throw new Error('No valid swap route found');
      }

      let tx;
      
      // Handle BNB as input (native token)
      if (fromToken.address === TOKENS.BNB.address) {
        tx = await router.swapExactETHForTokens(
          amountOutMin,
          path,
          account,
          deadline,
          { value: amountIn }
        );
      }
      // Handle BNB as output
      else if (toToken.address === TOKENS.BNB.address) {
        // Approve token first
        const tokenContract = new Contract(fromToken.address, ERC20_ABI, signer);
        const allowance = await tokenContract.allowance(account, PANCAKE_ROUTER_ADDRESS);
        
        if (allowance < amountIn) {
          toast.info('Approving token...');
          const approveTx = await tokenContract.approve(PANCAKE_ROUTER_ADDRESS, amountIn);
          await approveTx.wait();
        }

        tx = await router.swapExactTokensForETH(
          amountIn,
          amountOutMin,
          path,
          account,
          deadline
        );
      }
      // Handle token to token swap
      else {
        // Approve token first
        const tokenContract = new Contract(fromToken.address, ERC20_ABI, signer);
        const allowance = await tokenContract.allowance(account, PANCAKE_ROUTER_ADDRESS);
        
        if (allowance < amountIn) {
          toast.info('Approving token...');
          const approveTx = await tokenContract.approve(PANCAKE_ROUTER_ADDRESS, amountIn);
          await approveTx.wait();
        }

        tx = await router.swapExactTokensForTokens(
          amountIn,
          amountOutMin,
          path,
          account,
          deadline
        );
      }

      toast.info('Swap transaction submitted...');
      await tx.wait();
      toast.success('Swap completed successfully!');
      
      // Reset form
      setFromAmount('');
      setToAmount('');
    } catch (error: any) {
      console.error('Swap error:', error);
      if (error.code === 'ACTION_REJECTED') {
        toast.error('Transaction rejected');
      } else {
        toast.error(error.reason || 'Swap failed');
      }
    } finally {
      setIsSwapping(false);
    }
  }, [signer, account, fromAmount, toAmount, fromToken, toToken, slippage, isOnBSC]);

  // Switch tokens
  const switchTokens = useCallback(() => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  }, [fromToken, toToken, fromAmount, toAmount]);

  return {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    slippage,
    isCalculating,
    isSwapping,
    priceImpact,
    setFromToken,
    setToToken,
    setFromAmount,
    setSlippage,
    executeSwap,
    switchTokens,
  };
};
