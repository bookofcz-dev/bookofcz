-- First, check if we need to enable RLS on storage.objects (it should be enabled by default)
-- Drop all existing policies for book-covers and book-pdfs to start fresh
DROP POLICY IF EXISTS "Anyone can upload book covers" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view book covers" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload book PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view book PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update book covers" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update book PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete book covers" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete book PDFs" ON storage.objects;

-- Create comprehensive policies for book-covers bucket (public)
CREATE POLICY "Public can upload book covers"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'book-covers');

CREATE POLICY "Public can view book covers"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'book-covers');

CREATE POLICY "Public can update book covers"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'book-covers')
WITH CHECK (bucket_id = 'book-covers');

CREATE POLICY "Public can delete book covers"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'book-covers');

-- Create comprehensive policies for book-pdfs bucket (private but uploadable)
CREATE POLICY "Public can upload book PDFs"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'book-pdfs');

CREATE POLICY "Public can view book PDFs"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'book-pdfs');

CREATE POLICY "Public can update book PDFs"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'book-pdfs')
WITH CHECK (bucket_id = 'book-pdfs');

CREATE POLICY "Public can delete book PDFs"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'book-pdfs');