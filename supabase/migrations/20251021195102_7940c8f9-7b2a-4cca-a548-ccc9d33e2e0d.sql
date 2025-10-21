-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Anyone can record purchases" ON marketplace_purchases;

-- Create new policy that allows free books (0 price)
CREATE POLICY "Anyone can record purchases"
ON marketplace_purchases
FOR INSERT
WITH CHECK (
  buyer_wallet IS NOT NULL 
  AND book_id IS NOT NULL 
  AND transaction_hash IS NOT NULL 
  AND price_paid >= 0
  AND creator_amount >= 0
  AND platform_fee >= 0
);