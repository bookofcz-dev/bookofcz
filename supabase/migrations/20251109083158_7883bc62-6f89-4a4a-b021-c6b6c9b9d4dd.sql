-- Fix marketplace_purchases SELECT policies to work with wallet_sessions
DROP POLICY IF EXISTS "Users can view own purchases" ON public.marketplace_purchases;
DROP POLICY IF EXISTS "Creators can view their book purchases" ON public.marketplace_purchases;

-- Allow users to view their own purchases based on wallet_sessions
CREATE POLICY "Users can view own purchases by wallet"
ON public.marketplace_purchases
FOR SELECT
TO authenticated, anon
USING (
  lower(buyer_wallet) = (
    SELECT lower(wallet_address)
    FROM public.wallet_sessions
    WHERE user_id = auth.uid()
    LIMIT 1
  )
);

-- Allow creators to view purchases of their books
CREATE POLICY "Creators can view book purchases by wallet"
ON public.marketplace_purchases
FOR SELECT
TO authenticated, anon
USING (
  book_id IN (
    SELECT id
    FROM public.marketplace_books
    WHERE lower(creator_wallet) = (
      SELECT lower(wallet_address)
      FROM public.wallet_sessions
      WHERE user_id = auth.uid()
      LIMIT 1
    )
  )
);