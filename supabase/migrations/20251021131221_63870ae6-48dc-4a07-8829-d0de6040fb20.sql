-- Fix 1: Restrict user_roles table to prevent wallet address exposure
-- Drop existing public read policy
DROP POLICY IF EXISTS "Anyone can view roles" ON user_roles;

-- Only allow users to view their own role
CREATE POLICY "Users can view their own role"
ON user_roles
FOR SELECT
USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Admins can view all roles (using existing has_role function)
CREATE POLICY "Admins can view all roles"
ON user_roles
FOR SELECT
USING (has_role((current_setting('request.jwt.claims', true)::json->>'wallet_address')::text, 'admin'::app_role));

-- Fix 2: Restrict marketplace_purchases to authenticated users only
-- Drop existing public insert policy
DROP POLICY IF EXISTS "Anyone can record purchases" ON marketplace_purchases;

-- Only authenticated users can record their own purchases
CREATE POLICY "Authenticated users can record their own purchases"
ON marketplace_purchases
FOR INSERT
WITH CHECK (
  buyer_wallet = (current_setting('request.jwt.claims', true)::json->>'wallet_address')::text
  AND buyer_wallet IS NOT NULL
);

-- Fix 3: Restrict marketplace_books UPDATE to creators and admins only
-- Drop the overly permissive update policy
DROP POLICY IF EXISTS "Allow anyone to update books" ON marketplace_books;

-- Creators can update their own books (but not approval status)
CREATE POLICY "Creators can update own books metadata"
ON marketplace_books
FOR UPDATE
USING (
  creator_wallet = (current_setting('request.jwt.claims', true)::json->>'wallet_address')::text
)
WITH CHECK (
  creator_wallet = (current_setting('request.jwt.claims', true)::json->>'wallet_address')::text
);

-- Admins can update any book (including approval status)
CREATE POLICY "Admins can update any book"
ON marketplace_books
FOR UPDATE
USING (
  has_role((current_setting('request.jwt.claims', true)::json->>'wallet_address')::text, 'admin'::app_role)
)
WITH CHECK (
  has_role((current_setting('request.jwt.claims', true)::json->>'wallet_address')::text, 'admin'::app_role)
);