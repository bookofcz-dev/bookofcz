-- Fix marketplace_reviews RLS policies for Web3 authentication
-- Remove the broken UPDATE policy that relies on JWT claims

DROP POLICY IF EXISTS "Reviewers can update own reviews" ON public.marketplace_reviews;

-- Reviews are immutable once submitted (standard practice for review systems)
-- This prevents tampering and maintains review integrity
CREATE POLICY "Reviews cannot be updated"
  ON public.marketplace_reviews
  FOR UPDATE
  USING (false);

-- Add helpful comment
COMMENT ON TABLE public.marketplace_reviews IS 'Reviews are immutable once submitted. Only verified buyers (those who purchased the book) can submit reviews.';