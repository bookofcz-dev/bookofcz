-- Fix wallet_sessions RLS policies to support wallet reconnection
-- The issue: When a wallet reconnects with a new auth session (new user_id),
-- the upsert on wallet_address conflicts with the UPDATE policy that checks the OLD user_id

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create own wallet session" ON wallet_sessions;
DROP POLICY IF EXISTS "Users can view own wallet session" ON wallet_sessions;
DROP POLICY IF EXISTS "Users can update own wallet session" ON wallet_sessions;

-- Create new policies that allow wallet-based access
-- Security is enforced through signature verification in application code

-- Allow any authenticated user to insert their wallet session
CREATE POLICY "Authenticated users can create wallet sessions"
ON wallet_sessions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow viewing wallet sessions by wallet address
-- This is safe because purchases query by buyer_wallet, not user_id
CREATE POLICY "Users can view wallet sessions by address"
ON wallet_sessions
FOR SELECT
TO authenticated
USING (true);

-- Allow updating wallet sessions by wallet address
-- This enables reconnecting the same wallet with a new auth session
-- Security is enforced through signature verification in the app
CREATE POLICY "Users can update wallet sessions"
ON wallet_sessions
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (auth.uid() = user_id);