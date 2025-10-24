import { BrowserProvider } from 'ethers';

/**
 * Verify that a wallet signature is valid for the given message and address
 * This adds cryptographic proof that the user controls the wallet
 */
export async function verifyWalletSignature(
  message: string,
  signature: string,
  expectedAddress: string
): Promise<boolean> {
  try {
    const { verifyMessage } = await import('ethers');
    const recoveredAddress = verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
}

/**
 * Request user to sign a message proving they control their wallet
 */
export async function requestWalletSignature(
  provider: BrowserProvider,
  message: string
): Promise<string> {
  const signer = await provider.getSigner();
  return await signer.signMessage(message);
}

/**
 * Create a standardized message for purchase verification
 */
export function createPurchaseMessage(
  bookId: string,
  price: string | number,
  timestamp: number,
  currency: string = 'USDT'
): string {
  return `BookofCZ Purchase Verification\n\nBook ID: ${bookId}\nPrice: ${price} ${currency}\nTimestamp: ${timestamp}\n\nI confirm this purchase from my wallet.`;
}

/**
 * Create a standardized message for book update verification
 */
export function createBookUpdateMessage(
  bookId: string,
  action: string,
  timestamp: number
): string {
  return `BookofCZ Book Update\n\nBook ID: ${bookId}\nAction: ${action}\nTimestamp: ${timestamp}\n\nI authorize this change from my creator wallet.`;
}

/**
 * Create a standardized message for review verification
 */
export function createReviewMessage(
  bookId: string,
  rating: number,
  timestamp: number
): string {
  return `BookofCZ Review Submission\n\nBook ID: ${bookId}\nRating: ${rating}/5\nTimestamp: ${timestamp}\n\nI confirm this review from my wallet.`;
}