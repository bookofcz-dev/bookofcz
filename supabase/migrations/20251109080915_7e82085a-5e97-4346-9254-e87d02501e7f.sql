-- Fix RLS policy for purchase_signatures to work with wallet_sessions
DROP POLICY IF EXISTS "Users can record own signatures" ON public.purchase_signatures;

-- Create new policy that checks wallet_sessions table
CREATE POLICY "Users can record own signatures"
ON public.purchase_signatures
FOR INSERT
TO authenticated
WITH CHECK (
  lower(buyer_wallet) = (
    SELECT lower(wallet_address)
    FROM public.wallet_sessions
    WHERE user_id = auth.uid()
    LIMIT 1
  )
);