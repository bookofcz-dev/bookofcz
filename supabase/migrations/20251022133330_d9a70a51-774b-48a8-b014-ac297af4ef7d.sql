-- Make book-pdfs bucket private to prevent unauthorized access
UPDATE storage.buckets 
SET public = false 
WHERE name = 'book-pdfs';

-- Add RLS policy to allow only purchasers to access PDFs
CREATE POLICY "Only purchasers can access PDFs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'book-pdfs' AND
  EXISTS (
    SELECT 1 
    FROM marketplace_purchases 
    WHERE marketplace_purchases.book_id::text = (storage.foldername(name))[1]
    AND marketplace_purchases.buyer_wallet = (current_setting('request.jwt.claims', true)::json->>'wallet_address')
  )
);

-- Create table to track used signatures and prevent replay attacks
CREATE TABLE IF NOT EXISTS purchase_signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signature text NOT NULL UNIQUE,
  book_id uuid NOT NULL,
  buyer_wallet text NOT NULL,
  timestamp bigint NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on purchase_signatures
ALTER TABLE purchase_signatures ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert signatures (validated in application logic)
CREATE POLICY "Allow signature recording"
ON purchase_signatures FOR INSERT
WITH CHECK (true);

-- Allow viewing own signatures
CREATE POLICY "View own signatures"
ON purchase_signatures FOR SELECT
USING (buyer_wallet = (current_setting('request.jwt.claims', true)::json->>'wallet_address'));

-- Add index for faster lookups
CREATE INDEX idx_purchase_signatures_signature ON purchase_signatures(signature);
CREATE INDEX idx_purchase_signatures_wallet ON purchase_signatures(buyer_wallet);