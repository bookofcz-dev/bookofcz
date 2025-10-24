-- Add price_usdt column and migrate existing data
ALTER TABLE public.marketplace_books 
ADD COLUMN IF NOT EXISTS price_usdt numeric DEFAULT 0 NOT NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.marketplace_books.price_usdt IS 'Book price set by creator in USDT';
COMMENT ON COLUMN public.marketplace_books.price_bnb IS 'Legacy field - kept for backward compatibility';

-- Update existing books: assume current BNB prices are actually USDT prices
-- This is a data migration step
UPDATE public.marketplace_books 
SET price_usdt = price_bnb 
WHERE price_usdt = 0;