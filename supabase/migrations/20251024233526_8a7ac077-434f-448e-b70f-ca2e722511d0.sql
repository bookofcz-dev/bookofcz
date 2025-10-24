-- Drop the existing check constraint that incorrectly validates cross-currency amounts
ALTER TABLE public.marketplace_purchases
DROP CONSTRAINT IF EXISTS valid_purchase_amounts;

-- Add updated constraint that only validates non-negative amounts
-- We cannot validate the sum since price_paid is in USDT while creator_amount and platform_fee 
-- are in the payment currency (BNB or BOCZ)
ALTER TABLE public.marketplace_purchases
ADD CONSTRAINT valid_purchase_amounts CHECK (
  price_paid >= 0 
  AND creator_amount >= 0 
  AND platform_fee >= 0
);