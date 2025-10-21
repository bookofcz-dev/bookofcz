-- Add download_count to marketplace_books if it doesn't exist
ALTER TABLE marketplace_books 
ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0;