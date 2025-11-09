-- Fix marketplace_purchases UPDATE policy to work with wallet_sessions
DROP POLICY IF EXISTS "Buyers can update own purchase download counts" ON public.marketplace_purchases;

CREATE POLICY "Buyers can update own purchase download counts"
ON public.marketplace_purchases
FOR UPDATE
TO authenticated, anon
USING (
  lower(buyer_wallet) = (
    SELECT lower(wallet_address)
    FROM public.wallet_sessions
    WHERE user_id = auth.uid()
    LIMIT 1
  )
)
WITH CHECK (
  lower(buyer_wallet) = (
    SELECT lower(wallet_address)
    FROM public.wallet_sessions
    WHERE user_id = auth.uid()
    LIMIT 1
  )
  -- Only allow updating download_count
  AND buyer_wallet = (SELECT buyer_wallet FROM marketplace_purchases WHERE id = id)
  AND book_id = (SELECT book_id FROM marketplace_purchases WHERE id = id)
  AND transaction_hash = (SELECT transaction_hash FROM marketplace_purchases WHERE id = id)
);