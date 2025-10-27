-- Fix review spam prevention by adding one-review-per-purchase check
DROP POLICY IF EXISTS "Verified buyers can review" ON marketplace_reviews;

CREATE POLICY "Verified buyers can submit one review per book"
ON marketplace_reviews
FOR INSERT
WITH CHECK (
  -- Must have purchased the book
  EXISTS (
    SELECT 1 FROM marketplace_purchases
    WHERE book_id = marketplace_reviews.book_id
    AND buyer_wallet = marketplace_reviews.reviewer_wallet
  )
  -- Must not have already reviewed this book
  AND NOT EXISTS (
    SELECT 1 FROM marketplace_reviews existing
    WHERE existing.book_id = marketplace_reviews.book_id
    AND existing.reviewer_wallet = marketplace_reviews.reviewer_wallet
  )
);