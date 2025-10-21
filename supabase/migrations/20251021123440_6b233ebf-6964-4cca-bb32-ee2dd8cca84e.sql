-- Drop all existing policies
DROP POLICY IF EXISTS "Public can upload book covers" ON storage.objects;
DROP POLICY IF EXISTS "Public can view book covers" ON storage.objects;
DROP POLICY IF EXISTS "Public can update book covers" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete book covers" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload book PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Public can view book PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Public can update book PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete book PDFs" ON storage.objects;

-- Create policies that work for anonymous users (no authentication required)
-- Book covers bucket policies
CREATE POLICY "Allow all operations on book covers"
ON storage.objects
FOR ALL
USING (bucket_id = 'book-covers')
WITH CHECK (bucket_id = 'book-covers');

-- Book PDFs bucket policies  
CREATE POLICY "Allow all operations on book PDFs"
ON storage.objects
FOR ALL
USING (bucket_id = 'book-pdfs')
WITH CHECK (bucket_id = 'book-pdfs');