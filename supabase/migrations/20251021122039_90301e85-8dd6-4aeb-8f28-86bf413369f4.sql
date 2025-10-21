-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('book-covers', 'book-covers', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('book-pdfs', 'book-pdfs', false)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can upload book covers" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view book covers" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload book PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view their uploaded PDFs" ON storage.objects;

-- Allow anyone to upload book covers (public bucket)
CREATE POLICY "Anyone can upload book covers"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'book-covers');

-- Allow anyone to view book covers
CREATE POLICY "Anyone can view book covers"
ON storage.objects
FOR SELECT
USING (bucket_id = 'book-covers');

-- Allow anyone to upload book PDFs
CREATE POLICY "Anyone can upload book PDFs"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'book-pdfs');

-- Allow anyone to view book PDFs (needed for downloads after purchase)
CREATE POLICY "Anyone can view book PDFs"
ON storage.objects
FOR SELECT
USING (bucket_id = 'book-pdfs');

-- Update marketplace_books policies to not require JWT
DROP POLICY IF EXISTS "Creators can upload books" ON marketplace_books;
DROP POLICY IF EXISTS "Creators can view own books" ON marketplace_books;
DROP POLICY IF EXISTS "Creators can update own books" ON marketplace_books;

-- Allow anyone to insert books (Web3 wallet-based, validation happens in app)
CREATE POLICY "Anyone can upload books"
ON marketplace_books
FOR INSERT
WITH CHECK (true);

-- Allow creators to view their own books by wallet address
CREATE POLICY "Creators can view own books"
ON marketplace_books
FOR SELECT
USING (creator_wallet IS NOT NULL);

-- Allow creators to update their own books
CREATE POLICY "Anyone can update books"
ON marketplace_books
FOR UPDATE
USING (true);

-- Keep the existing policy for viewing approved books
-- "Anyone can view approved books" already exists