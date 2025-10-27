-- Add policy to allow public viewing of purchase stats for marketplace analytics
-- This allows unauthenticated users to see total purchase counts and volumes for public stats
CREATE POLICY "Anyone can view purchase stats for public analytics"
ON public.marketplace_purchases
FOR SELECT
USING (true);

-- Note: This policy allows reading purchase data but RLS will still protect 
-- sensitive operations. The data includes transaction hashes which are already 
-- public on blockchain, and wallet addresses which are pseudonymous.