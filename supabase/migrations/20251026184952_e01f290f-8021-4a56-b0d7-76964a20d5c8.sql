-- Allow buyers to update their own purchase download counts
CREATE POLICY "Buyers can update their own purchase download counts"
ON public.marketplace_purchases
FOR UPDATE
USING (buyer_wallet IS NOT NULL)
WITH CHECK (buyer_wallet IS NOT NULL);