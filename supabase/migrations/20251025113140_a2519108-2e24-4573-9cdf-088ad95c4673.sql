-- Add is_public column to marketplace_books
ALTER TABLE public.marketplace_books
ADD COLUMN is_public boolean NOT NULL DEFAULT true;

-- Add comment to explain the column
COMMENT ON COLUMN public.marketplace_books.is_public IS 'Whether the book is publicly visible in marketplace or private to creator only';

-- Update the update_book_as_creator function to allow updating is_public
CREATE OR REPLACE FUNCTION public.update_book_as_creator(
  _book_id uuid,
  _creator_wallet text,
  _title text,
  _author text,
  _description text,
  _category text,
  _price_usdt numeric,
  _isbn text,
  _cover_url text,
  _pdf_url text,
  _is_public boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _existing_creator text;
BEGIN
  -- Normalize wallet address to lowercase
  _creator_wallet := LOWER(_creator_wallet);
  
  -- Get existing creator wallet
  SELECT creator_wallet INTO _existing_creator
  FROM public.marketplace_books
  WHERE id = _book_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Book not found';
  END IF;
  
  -- Verify creator ownership
  IF LOWER(_existing_creator) != _creator_wallet THEN
    RAISE EXCEPTION 'Unauthorized: Only book creator can update';
  END IF;
  
  -- Validate inputs
  IF _title IS NULL OR LENGTH(TRIM(_title)) = 0 THEN
    RAISE EXCEPTION 'Title cannot be empty';
  END IF;
  
  IF _price_usdt < 0 THEN
    RAISE EXCEPTION 'Price cannot be negative';
  END IF;
  
  -- Update book (including is_public)
  UPDATE public.marketplace_books
  SET 
    title = _title,
    author = _author,
    description = _description,
    category = _category,
    price_usdt = _price_usdt,
    price_bnb = 0,
    isbn = _isbn,
    cover_url = COALESCE(_cover_url, cover_url),
    pdf_url = COALESCE(_pdf_url, pdf_url),
    is_public = _is_public,
    updated_at = now()
  WHERE id = _book_id;
END;
$$;