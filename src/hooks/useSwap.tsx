import { useState } from 'react';
import { ethers } from 'ethers';
import { toast } from '@/hooks/use-toast';

export const BOCZ_TOKEN_ADDRESS = '0x701bE97c604A35aB7BCF6C75cA6de3aba0704444';

export type Token = {
  address: string;
  symbol: string;
  decimals: number;
  name: string;
};

export const TOKENS: Record<string, Token> = {
  BNB: {
    address: 'BNB',
    symbol: 'BNB',
    decimals: 18,
    name: 'Binance Coin',
  },
  BOCZ: {
    address: BOCZ_TOKEN_ADDRESS,
    symbol: 'BOCZ',
    decimals: 18,
    name: 'Book of CZ',
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

// PancakeSwap Router V2 on BSC
const PANCAKE_ROUTER_ADDRESS = '0x10ED43C718714eb63d5aA57B78B54704E256024E';
const WBNB_ADDRESS = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';

const ROUTER_ABI = [
  'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
  'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
];

const ERC20_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
];

export const useSwap = () => {
  const [fromToken, setFromToken] = useState<Token>(TOKENS.BNB);
  const [toToken, setToToken] = useState<Token>(TOKENS.BOCZ);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [priceImpact, setPriceImpact] = useState<number | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const buildPath = (from: Token, to: Token): string[] => {
    const path: string[] = [];
    
    // From token
    if (from.address === 'BNB') {
      path.push(WBNB_ADDRESS);
    } else {
      path.push(from.address);
    }
    
    // To token
    if (to.address === 'BNB') {
      path.push(WBNB_ADDRESS);
    } else {
      path.push(to.address);
    }
    
    return path;
  };

  const calculateOutputAmount = async (amount: string) => {
    if (!amount || parseFloat(amount) <= 0) {
      setToAmount('');
      setPriceImpact(null);
      setExchangeRate(null);
      return;
    }

    setIsCalculating(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const routerContract = new ethers.Contract(
        PANCAKE_ROUTER_ADDRESS,
        ROUTER_ABI,
        provider
      );

      const amountIn = ethers.parseUnits(amount, fromToken.decimals);
      const path = buildPath(fromToken, toToken);

      // Get amounts out from PancakeSwap
      const amounts = await routerContract.getAmountsOut(amountIn, path);
      const amountOut = amounts[1];
      const outputAmount = ethers.formatUnits(amountOut, toToken.decimals);
      
      setToAmount(outputAmount);

      // Calculate exchange rate
      const rate = parseFloat(outputAmount) / parseFloat(amount);
      setExchangeRate(rate);

      // Calculate price impact
      const smallAmountIn = ethers.parseUnits('0.001', fromToken.decimals);
      const smallAmounts = await routerContract.getAmountsOut(smallAmountIn, path);
      const smallAmountOut = smallAmounts[1];
      const spotRate = parseFloat(ethers.formatUnits(smallAmountOut, toToken.decimals)) / 0.001;
      
      const impact = ((spotRate - rate) / spotRate) * 100;
      setPriceImpact(Math.max(0, impact));

    } catch (error: any) {
      console.error('Error calculating output amount:', error);
      toast({
        title: "Calculation Error",
        description: "Unable to fetch price. Check if liquidity exists for this pair.",
        variant: "destructive",
      });
      setToAmount('');
      setPriceImpact(null);
      setExchangeRate(null);
    } finally {
      setIsCalculating(false);
    }
  };

  const executeSwap = async (walletAddress: string, provider: ethers.BrowserProvider, signer: ethers.Signer) => {
    if (!fromAmount || !toAmount) {
      toast({
        title: "Invalid Amount",
        description: "Please enter an amount to swap",
        variant: "destructive",
      });
      return;
    }

    setIsSwapping(true);
    try {
      const routerContract = new ethers.Contract(
        PANCAKE_ROUTER_ADDRESS,
        ROUTER_ABI,
        signer
      );

      const amountIn = ethers.parseUnits(fromAmount, fromToken.decimals);
      const amountOutParsed = ethers.parseUnits(toAmount, toToken.decimals);
      const slippageMultiplier = (100 - slippage) / 100;
      const minAmountOut = (amountOutParsed * BigInt(Math.floor(slippageMultiplier * 1000))) / BigInt(1000);

      const path = buildPath(fromToken, toToken);
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes

      toast({
        title: "Swap Initiated",
        description: "Please confirm the transaction in your wallet",
      });

      let tx;

      // BNB to Token
      if (fromToken.address === 'BNB') {
        tx = await routerContract.swapExactETHForTokens(
          minAmountOut,
          path,
          walletAddress,
          deadline,
          { value: amountIn }
        );
      }
      // Token to BNB
      else if (toToken.address === 'BNB') {
        // Check and approve if needed
        const tokenContract = new ethers.Contract(fromToken.address, ERC20_ABI, signer);
        const allowance = await tokenContract.allowance(walletAddress, PANCAKE_ROUTER_ADDRESS);
        
        if (allowance < amountIn) {
          toast({
            title: "Approval Required",
            description: "Please approve token spending",
          });
          const approveTx = await tokenContract.approve(PANCAKE_ROUTER_ADDRESS, amountIn);
          await approveTx.wait();
        }

        tx = await routerContract.swapExactTokensForETH(
          amountIn,
          minAmountOut,
          path,
          walletAddress,
          deadline
        );
      }
      // Token to Token
      else {
        // Check and approve if needed
        const tokenContract = new ethers.Contract(fromToken.address, ERC20_ABI, signer);
        const allowance = await tokenContract.allowance(walletAddress, PANCAKE_ROUTER_ADDRESS);
        
        if (allowance < amountIn) {
          toast({
            title: "Approval Required",
            description: "Please approve token spending",
          });
          const approveTx = await tokenContract.approve(PANCAKE_ROUTER_ADDRESS, amountIn);
          await approveTx.wait();
        }

        tx = await routerContract.swapExactTokensForTokens(
          amountIn,
          minAmountOut,
          path,
          walletAddress,
          deadline
        );
      }

      toast({
        title: "Transaction Submitted",
        description: "Waiting for confirmation...",
      });

      await tx.wait();

      toast({
        title: "Swap Successful! 🎉",
        description: `Swapped ${fromAmount} ${fromToken.symbol} for ${parseFloat(toAmount).toFixed(4)} ${toToken.symbol}`,
      });

      // Reset form
      setFromAmount('');
      setToAmount('');
      setPriceImpact(null);
      setExchangeRate(null);

    } catch (error: any) {
      console.error('Swap error:', error);
      
      let errorMessage = "Failed to execute swap";
      if (error.code === 'ACTION_REJECTED') {
        errorMessage = "Transaction was rejected";
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = "Insufficient funds for gas";
      }

      toast({
        title: "Swap Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSwapping(false);
    }
  };

  return {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    slippage,
    isCalculating,
    isSwapping,
    priceImpact,
    exchangeRate,
    setFromToken,
    setToToken,
    setFromAmount,
    setSlippage,
    calculateOutputAmount,
    executeSwap,
    switchTokens,
  };
};
