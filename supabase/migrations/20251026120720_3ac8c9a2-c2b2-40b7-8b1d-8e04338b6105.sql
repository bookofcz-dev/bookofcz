-- Add download_count column to track downloads per purchase
ALTER TABLE public.marketplace_purchases 
ADD COLUMN download_count integer NOT NULL DEFAULT 0;

-- Add index for faster queries
CREATE INDEX idx_purchases_buyer_book ON public.marketplace_purchases(buyer_wallet, book_id);