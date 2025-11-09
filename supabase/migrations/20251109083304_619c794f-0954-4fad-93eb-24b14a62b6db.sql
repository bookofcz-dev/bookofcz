-- Fix admin policy for marketplace_purchases to work with wallet_sessions
DROP POLICY IF EXISTS "Admins can view all purchases" ON public.marketplace_purchases;

CREATE POLICY "Admins can view all purchases by wallet"
ON public.marketplace_purchases
FOR SELECT
TO authenticated, anon
USING (
  has_role(
    (SELECT wallet_address FROM public.wallet_sessions WHERE user_id = auth.uid() LIMIT 1),
    'admin'::app_role
  )
);