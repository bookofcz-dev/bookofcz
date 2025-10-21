-- Drop all existing policies on marketplace_books
DROP POLICY IF EXISTS "Anyone can upload books" ON marketplace_books;
DROP POLICY IF EXISTS "Creators can view own books" ON marketplace_books;
DROP POLICY IF EXISTS "Anyone can update books" ON marketplace_books;
DROP POLICY IF EXISTS "Anyone can view approved books" ON marketplace_books;
DROP POLICY IF EXISTS "Creators can upload books" ON marketplace_books;
DROP POLICY IF EXISTS "Creators can update own books" ON marketplace_books;

-- Recreate policies with correct field names (creator_wallet not wallet_address)
CREATE POLICY "Allow anyone to insert books"
ON marketplace_books
FOR INSERT
WITH CHECK (creator_wallet IS NOT NULL);

CREATE POLICY "Allow viewing approved books"
ON marketplace_books
FOR SELECT
USING (approval_status = 'approved');

CREATE POLICY "Allow creators to view own books"
ON marketplace_books
FOR SELECT
USING (creator_wallet IS NOT NULL);

CREATE POLICY "Allow anyone to update books"
ON marketplace_books
FOR UPDATE
USING (true);