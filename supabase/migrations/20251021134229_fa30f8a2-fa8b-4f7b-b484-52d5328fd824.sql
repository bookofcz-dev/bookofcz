-- Add unique constraint to prevent duplicate purchases
ALTER TABLE marketplace_purchases DROP CONSTRAINT IF EXISTS unique_buyer_book_purchase;
ALTER TABLE marketplace_purchases ADD CONSTRAINT unique_buyer_book_purchase 
UNIQUE (buyer_wallet, book_id);

-- Add unique constraint to prevent duplicate reviews
ALTER TABLE marketplace_reviews DROP CONSTRAINT IF EXISTS unique_reviewer_book;
ALTER TABLE marketplace_reviews ADD CONSTRAINT unique_reviewer_book 
UNIQUE (reviewer_wallet, book_id);

-- Add check constraint for valid ratings
ALTER TABLE marketplace_reviews DROP CONSTRAINT IF EXISTS valid_rating_range;
ALTER TABLE marketplace_reviews ADD CONSTRAINT valid_rating_range 
CHECK (rating >= 1 AND rating <= 5);

-- Add check constraint for valid prices
ALTER TABLE marketplace_books DROP CONSTRAINT IF EXISTS valid_book_price;
ALTER TABLE marketplace_books ADD CONSTRAINT valid_book_price 
CHECK (price_bnb >= 0 AND price_bnb <= 1000);

-- Add check constraint for purchase amounts
ALTER TABLE marketplace_purchases DROP CONSTRAINT IF EXISTS valid_purchase_amounts;
ALTER TABLE marketplace_purchases ADD CONSTRAINT valid_purchase_amounts 
CHECK (
  price_paid > 0 
  AND creator_amount > 0 
  AND platform_fee > 0
  AND (creator_amount + platform_fee) = price_paid
);