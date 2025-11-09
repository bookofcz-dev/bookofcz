-- Fix wallet_sessions SELECT policy to allow querying by user_id
DROP POLICY IF EXISTS "Users can view own sessions" ON public.wallet_sessions;

CREATE POLICY "Users can view own sessions by user_id"
ON public.wallet_sessions
FOR SELECT
TO authenticated, anon
USING (
  user_id = auth.uid()
);