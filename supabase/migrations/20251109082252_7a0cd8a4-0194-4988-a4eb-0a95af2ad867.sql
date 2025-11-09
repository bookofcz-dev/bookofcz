-- Fix wallet_sessions RLS policy to properly handle anonymous auth
DROP POLICY IF EXISTS "Authenticated users can create wallet sessions" ON public.wallet_sessions;

-- Create new policy that allows anonymous users to create sessions
CREATE POLICY "Users can create own wallet sessions"
ON public.wallet_sessions
FOR INSERT
TO authenticated, anon
WITH CHECK (
  auth.uid() = user_id
);

-- Update existing update policy to also allow anon users
DROP POLICY IF EXISTS "Users can update wallet sessions" ON public.wallet_sessions;

CREATE POLICY "Users can update own wallet sessions"
ON public.wallet_sessions
FOR UPDATE
TO authenticated, anon
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);