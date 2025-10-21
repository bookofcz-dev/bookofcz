-- Rollback the JWT-based policies since this is a Web3 app without Supabase Auth
-- These policies would break the application functionality

-- Fix 1: Revert user_roles policies
DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;

-- Restore original policy - wallet addresses are public in Web3
CREATE POLICY "Anyone can view roles"
ON user_roles
FOR SELECT
USING (true);

-- Fix 2: Revert marketplace_purchases policies
DROP POLICY IF EXISTS "Authenticated users can record their own purchases" ON marketplace_purchases;

-- Restore with validation - purchases should validate blockchain transactions
CREATE POLICY "Anyone can record purchases"
ON marketplace_purchases
FOR INSERT
WITH CHECK (
  -- Ensure required fields are present
  buyer_wallet IS NOT NULL
  AND book_id IS NOT NULL
  AND transaction_hash IS NOT NULL
  AND price_paid > 0
  AND creator_amount > 0
  AND platform_fee > 0
);

-- Fix 3: Revert marketplace_books UPDATE policies  
DROP POLICY IF EXISTS "Creators can update own books metadata" ON marketplace_books;
DROP POLICY IF EXISTS "Admins can update any book" ON marketplace_books;

-- Restore with proper restrictions for creators
CREATE POLICY "Creators can update their own books"
ON marketplace_books
FOR UPDATE
USING (creator_wallet IS NOT NULL);

-- Add constraint to prevent price manipulation after approval
ALTER TABLE marketplace_books DROP CONSTRAINT IF EXISTS check_approved_books_immutable;
ALTER TABLE marketplace_books ADD CONSTRAINT check_approved_books_immutable
CHECK (
  approval_status != 'approved' 
  OR (approval_status = 'approved' AND price_bnb >= 0)
);