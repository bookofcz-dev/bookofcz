-- Fix RLS policies to properly check wallet address from JWT user_metadata

-- Drop existing policies on marketplace_purchases
DROP POLICY IF EXISTS "Authenticated buyers can record purchases" ON public.marketplace_purchases;
DROP POLICY IF EXISTS "Buyers can view own purchases" ON public.marketplace_purchases;
DROP POLICY IF EXISTS "Buyers can update own purchase download counts" ON public.marketplace_purchases;

-- Create new policies that check user_metadata in JWT
CREATE POLICY "Authenticated buyers can record purchases"
ON public.marketplace_purchases
FOR INSERT
WITH CHECK (
  buyer_wallet IS NOT NULL 
  AND book_id IS NOT NULL 
  AND transaction_hash IS NOT NULL
  AND price_paid >= 0
  AND creator_amount >= 0
  AND platform_fee >= 0
  AND lower(buyer_wallet) = lower(COALESCE(
    (auth.jwt() -> 'user_metadata' ->> 'wallet_address'),
    ''
  ))
);

CREATE POLICY "Buyers can view own purchases"
ON public.marketplace_purchases
FOR SELECT
USING (
  lower(buyer_wallet) = lower(COALESCE(
    (auth.jwt() -> 'user_metadata' ->> 'wallet_address'),
    ''
  ))
);

CREATE POLICY "Buyers can update own purchase download counts"
ON public.marketplace_purchases
FOR UPDATE
USING (
  lower(buyer_wallet) = lower(COALESCE(
    (auth.jwt() -> 'user_metadata' ->> 'wallet_address'),
    ''
  ))
)
WITH CHECK (
  lower(buyer_wallet) = lower(COALESCE(
    (auth.jwt() -> 'user_metadata' ->> 'wallet_address'),
    ''
  ))
  AND buyer_wallet = (SELECT buyer_wallet FROM marketplace_purchases WHERE id = marketplace_purchases.id)
  AND book_id = (SELECT book_id FROM marketplace_purchases WHERE id = marketplace_purchases.id)
  AND transaction_hash = (SELECT transaction_hash FROM marketplace_purchases WHERE id = marketplace_purchases.id)
);