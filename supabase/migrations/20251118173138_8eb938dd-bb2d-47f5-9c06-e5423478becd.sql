-- Update book categories to include new options
-- First, we need to handle the category column which is currently just text
-- We'll keep it as text to allow flexibility

-- Add a comment to document the valid categories
COMMENT ON COLUMN public.marketplace_books.category IS 'Valid categories: fiction, non-fiction, business-finance, self-help-motivation, travel, technology, education, health-wellness, biographies, entrepreneurship, mindset-psychology, kids-teens, art-creativity, comics-graphic-novels, religion-philosophy, crypto, binance, defi, nft, trading';

-- Update any existing books with old categories to ensure they're still valid
-- (No changes needed as we're keeping all existing categories)