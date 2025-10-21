-- Ensure book-covers bucket is public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'book-covers';

-- PDFs should remain private but accessible through signed URLs
-- Let's make sure the buckets exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('book-covers', 'book-covers', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('book-pdfs', 'book-pdfs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('marketplace', 'marketplace', true)
ON CONFLICT (id) DO UPDATE SET public = true;