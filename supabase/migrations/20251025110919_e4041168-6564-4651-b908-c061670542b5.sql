-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "Buyers can view own purchases" ON marketplace_purchases;

-- Create a new policy that allows viewing purchases by wallet address
-- This is safe since blockchain transactions are public data anyway
CREATE POLICY "Anyone can view purchases"
ON marketplace_purchases
FOR SELECT
USING (true);

-- Add helpful comment
COMMENT ON POLICY "Anyone can view purchases" ON marketplace_purchases IS 
'Allows viewing all purchases since wallet addresses and blockchain transactions are public data';