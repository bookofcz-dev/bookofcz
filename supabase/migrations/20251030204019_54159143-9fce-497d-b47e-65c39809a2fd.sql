-- Add server-side validation for review text length
-- Enforce 1000 character limit at database level

ALTER TABLE public.marketplace_reviews
ADD CONSTRAINT review_text_max_length 
CHECK (review_text IS NULL OR LENGTH(review_text) <= 1000);