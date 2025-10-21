-- Create marketplace books table
CREATE TABLE public.marketplace_books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_wallet TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_url TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  ipfs_hash TEXT,
  price_bnb DECIMAL(18, 8) NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  tags TEXT[],
  isbn TEXT,
  publication_date DATE,
  approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.marketplace_books ENABLE ROW LEVEL SECURITY;

-- Public can view approved books
CREATE POLICY "Anyone can view approved books"
ON public.marketplace_books
FOR SELECT
USING (approval_status = 'approved');

-- Creators can view their own books
CREATE POLICY "Creators can view own books"
ON public.marketplace_books
FOR SELECT
USING (creator_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Creators can insert their own books
CREATE POLICY "Creators can upload books"
ON public.marketplace_books
FOR INSERT
WITH CHECK (creator_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Creators can update their own books
CREATE POLICY "Creators can update own books"
ON public.marketplace_books
FOR UPDATE
USING (creator_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Create purchases table
CREATE TABLE public.marketplace_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES public.marketplace_books(id) ON DELETE CASCADE,
  buyer_wallet TEXT NOT NULL,
  transaction_hash TEXT NOT NULL UNIQUE,
  price_paid DECIMAL(18, 8) NOT NULL,
  platform_fee DECIMAL(18, 8) NOT NULL,
  creator_amount DECIMAL(18, 8) NOT NULL,
  purchase_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.marketplace_purchases ENABLE ROW LEVEL SECURITY;

-- Buyers can view their own purchases
CREATE POLICY "Buyers can view own purchases"
ON public.marketplace_purchases
FOR SELECT
USING (buyer_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Anyone can insert purchases (for recording transactions)
CREATE POLICY "Anyone can record purchases"
ON public.marketplace_purchases
FOR INSERT
WITH CHECK (true);

-- Create reviews table
CREATE TABLE public.marketplace_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id UUID NOT NULL REFERENCES public.marketplace_books(id) ON DELETE CASCADE,
  reviewer_wallet TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(book_id, reviewer_wallet)
);

-- Enable RLS
ALTER TABLE public.marketplace_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view reviews
CREATE POLICY "Anyone can view reviews"
ON public.marketplace_reviews
FOR SELECT
USING (true);

-- Verified buyers can insert reviews
CREATE POLICY "Verified buyers can review"
ON public.marketplace_reviews
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.marketplace_purchases
    WHERE book_id = marketplace_reviews.book_id
    AND buyer_wallet = marketplace_reviews.reviewer_wallet
  )
);

-- Reviewers can update their own reviews
CREATE POLICY "Reviewers can update own reviews"
ON public.marketplace_reviews
FOR UPDATE
USING (reviewer_wallet = current_setting('request.jwt.claims', true)::json->>'wallet_address');

-- Create function to update book ratings
CREATE OR REPLACE FUNCTION public.update_book_ratings()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.marketplace_books
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM public.marketplace_reviews
      WHERE book_id = NEW.book_id
    ),
    review_count = (
      SELECT COUNT(*)
      FROM public.marketplace_reviews
      WHERE book_id = NEW.book_id
    ),
    updated_at = now()
  WHERE id = NEW.book_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for rating updates
CREATE TRIGGER update_book_ratings_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.marketplace_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_book_ratings();

-- Create indexes for better performance
CREATE INDEX idx_marketplace_books_creator ON public.marketplace_books(creator_wallet);
CREATE INDEX idx_marketplace_books_status ON public.marketplace_books(approval_status);
CREATE INDEX idx_marketplace_books_category ON public.marketplace_books(category);
CREATE INDEX idx_marketplace_purchases_buyer ON public.marketplace_purchases(buyer_wallet);
CREATE INDEX idx_marketplace_purchases_book ON public.marketplace_purchases(book_id);
CREATE INDEX idx_marketplace_reviews_book ON public.marketplace_reviews(book_id);

-- Create storage bucket for book covers and PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('marketplace', 'marketplace', false);

-- Storage policies for marketplace bucket
CREATE POLICY "Authenticated users can upload to marketplace"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'marketplace' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view marketplace files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'marketplace');

CREATE POLICY "Users can update their own uploads"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'marketplace' AND auth.uid()::text = (storage.foldername(name))[1]);