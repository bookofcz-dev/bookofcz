-- Fix publicly readable purchase data by implementing proper RLS based on JWT claims

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view purchases" ON marketplace_purchases;

-- Create restrictive policies based on wallet authentication

-- Policy 1: Buyers can view their own purchases
CREATE POLICY "Buyers can view own purchases"
ON marketplace_purchases
FOR SELECT
USING (
  LOWER(buyer_wallet) = LOWER(
    COALESCE(
      (current_setting('request.jwt.claims', true)::json->>'wallet_address')::text,
      ''
    )
  )
);

-- Policy 2: Creators can view purchases of their books
CREATE POLICY "Creators can view their book purchases"
ON marketplace_purchases
FOR SELECT
USING (
  book_id IN (
    SELECT id FROM marketplace_books
    WHERE LOWER(creator_wallet) = LOWER(
      COALESCE(
        (current_setting('request.jwt.claims', true)::json->>'wallet_address')::text,
        ''
      )
    )
  )
);

-- Policy 3: Admins can view all purchases
CREATE POLICY "Admins can view all purchases"
ON marketplace_purchases
FOR SELECT
USING (
  has_role(
    COALESCE(
      (current_setting('request.jwt.claims', true)::json->>'wallet_address')::text,
      ''
    ),
    'admin'::app_role
  )
);

-- Update the insert policy to use JWT claims for validation
DROP POLICY IF EXISTS "Anyone can record purchases" ON marketplace_purchases;

CREATE POLICY "Authenticated buyers can record purchases"
ON marketplace_purchases
FOR INSERT
WITH CHECK (
  -- Must have wallet address in JWT claims
  LOWER(buyer_wallet) = LOWER(
    COALESCE(
      (current_setting('request.jwt.claims', true)::json->>'wallet_address')::text,
      ''
    )
  )
  AND buyer_wallet IS NOT NULL 
  AND book_id IS NOT NULL 
  AND transaction_hash IS NOT NULL 
  AND price_paid >= 0 
  AND creator_amount >= 0 
  AND platform_fee >= 0
);

-- Update the update policy to be more restrictive
DROP POLICY IF EXISTS "Buyers can update their own purchase download counts" ON marketplace_purchases;

CREATE POLICY "Buyers can update own purchase download counts"
ON marketplace_purchases
FOR UPDATE
USING (
  LOWER(buyer_wallet) = LOWER(
    COALESCE(
      (current_setting('request.jwt.claims', true)::json->>'wallet_address')::text,
      ''
    )
  )
)
WITH CHECK (
  LOWER(buyer_wallet) = LOWER(
    COALESCE(
      (current_setting('request.jwt.claims', true)::json->>'wallet_address')::text,
      ''
    )
  )
  -- Only allow updating download_count, prevent other field modifications
  AND buyer_wallet = (SELECT buyer_wallet FROM marketplace_purchases WHERE id = marketplace_purchases.id)
  AND book_id = (SELECT book_id FROM marketplace_purchases WHERE id = marketplace_purchases.id)
  AND transaction_hash = (SELECT transaction_hash FROM marketplace_purchases WHERE id = marketplace_purchases.id)
);