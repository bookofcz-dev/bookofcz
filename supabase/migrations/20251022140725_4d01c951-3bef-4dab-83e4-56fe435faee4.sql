-- Drop the existing check constraint that blocks free books
ALTER TABLE public.marketplace_purchases
DROP CONSTRAINT IF EXISTS valid_purchase_amounts;

-- Add updated constraint that allows free books (amounts can be 0 or greater)
ALTER TABLE public.marketplace_purchases
ADD CONSTRAINT valid_purchase_amounts CHECK (
  price_paid >= 0 
  AND creator_amount >= 0 
  AND platform_fee >= 0 
  AND (creator_amount + platform_fee) = price_paid
);