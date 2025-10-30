import { useState } from 'react';
import { ethers } from 'ethers';
import { toast } from '@/hooks/use-toast';

export const BOCZ_TOKEN_ADDRESS = '0x701bE97c604A35aB7BCF6C75cA6de3aba0704444';

export const TOKENS = {
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
};

// PancakeSwap Router V2 on BSC
const PANCAKE_ROUTER_ADDRESS = '0x10ED43C718714eb63d5aA57B78B54704E256024E';
const WBNB_ADDRESS = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';

const ROUTER_ABI = [
  'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
  'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
];

export const useSwap = () => {
  const [fromToken] = useState(TOKENS.BNB);
  const [toToken] = useState(TOKENS.BOCZ);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [priceImpact, setPriceImpact] = useState<number | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

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

      const amountIn = ethers.parseEther(amount);
      const path = [WBNB_ADDRESS, toToken.address];

      // Get amounts out from PancakeSwap
      const amounts = await routerContract.getAmountsOut(amountIn, path);
      const amountOut = amounts[1];
      const outputAmount = ethers.formatEther(amountOut);
      
      setToAmount(outputAmount);

      // Calculate exchange rate
      const rate = parseFloat(outputAmount) / parseFloat(amount);
      setExchangeRate(rate);

      // Calculate price impact
      const smallAmountIn = ethers.parseEther('0.001');
      const smallAmounts = await routerContract.getAmountsOut(smallAmountIn, path);
      const smallAmountOut = smallAmounts[1];
      const spotRate = parseFloat(ethers.formatEther(smallAmountOut)) / 0.001;
      
      const impact = ((spotRate - rate) / spotRate) * 100;
      setPriceImpact(Math.max(0, impact));

    } catch (error: any) {
      console.error('Error calculating output amount:', error);
      toast({
        title: "Calculation Error",
        description: "Unable to fetch price from PancakeSwap",
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
      // Check BNB balance
      const balance = await provider.getBalance(walletAddress);
      const amountIn = ethers.parseEther(fromAmount);
      
      if (balance < amountIn) {
        toast({
          title: "Insufficient Balance",
          description: "You don't have enough BNB for this swap",
          variant: "destructive",
        });
        return;
      }

      const routerContract = new ethers.Contract(
        PANCAKE_ROUTER_ADDRESS,
        ROUTER_ABI,
        signer
      );

      // Calculate minimum amount out with slippage
      const amountOutMin = ethers.parseEther(toAmount);
      const slippageMultiplier = (100 - slippage) / 100;
      const minAmountOut = (amountOutMin * BigInt(Math.floor(slippageMultiplier * 1000))) / BigInt(1000);

      const path = [WBNB_ADDRESS, toToken.address];
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes

      toast({
        title: "Swap Initiated",
        description: "Please confirm the transaction in your wallet",
      });

      // Execute swap
      const tx = await routerContract.swapExactETHForTokens(
        minAmountOut,
        path,
        walletAddress,
        deadline,
        { value: amountIn }
      );

      toast({
        title: "Transaction Submitted",
        description: "Waiting for confirmation...",
      });

      await tx.wait();

      toast({
        title: "Swap Successful! 🎉",
        description: `Swapped ${fromAmount} BNB for ${parseFloat(toAmount).toFixed(2)} BOCZ`,
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
    setFromAmount,
    setSlippage,
    calculateOutputAmount,
    executeSwap,
  };
};
