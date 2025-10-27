import { supabase } from '@/integrations/supabase/client';
import { BrowserProvider } from 'ethers';

/**
 * Create a Supabase auth session for a connected wallet
 * This enables JWT-based authentication for wallet users
 */
export async function createWalletAuthSession(
  walletAddress: string,
  provider: BrowserProvider
): Promise<{ success: boolean; error?: string }> {
  try {
    // Sign a message to prove wallet ownership
    const message = `Authenticate to BookofCZ Marketplace\nWallet: ${walletAddress}\nTimestamp: ${Date.now()}`;
    const signer = await provider.getSigner();
    const signature = await signer.signMessage(message);
    
    console.log('🔐 Creating auth session for wallet:', walletAddress);

    // Create anonymous Supabase session
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
    
    if (authError) {
      console.error('Failed to create auth session:', authError);
      return { success: false, error: authError.message };
    }

    // Store wallet address in user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: { 
        wallet_address: walletAddress.toLowerCase(),
        wallet_signature: signature,
        auth_timestamp: Date.now()
      }
    });

    if (updateError) {
      console.error('Failed to update user metadata:', updateError);
      return { success: false, error: updateError.message };
    }

    console.log('✅ Wallet auth session created successfully');
    return { success: true };
  } catch (error) {
    console.error('Error creating wallet auth session:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create auth session' 
    };
  }
}

/**
 * Sign out from Supabase session
 */
export async function signOutWalletAuth(): Promise<void> {
  try {
    await supabase.auth.signOut();
    console.log('🔓 Wallet auth session ended');
  } catch (error) {
    console.error('Error signing out:', error);
  }
}

/**
 * Get current auth session and verify wallet address matches
 */
export async function verifyWalletAuthSession(
  walletAddress: string
): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return false;
    }

    const storedWallet = session.user.user_metadata?.wallet_address;
    return storedWallet?.toLowerCase() === walletAddress.toLowerCase();
  } catch (error) {
    console.error('Error verifying auth session:', error);
    return false;
  }
}
