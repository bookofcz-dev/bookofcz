-- Create secure function for admin approval updates
CREATE OR REPLACE FUNCTION public.update_book_approval_status(
  _book_id uuid,
  _approval_status text,
  _rejection_reason text,
  _admin_wallet text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Normalize wallet address to lowercase
  _admin_wallet := LOWER(_admin_wallet);
  
  -- Check if caller is admin
  IF NOT has_role(_admin_wallet, 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Admin role required';
  END IF;
  
  -- Validate approval status
  IF _approval_status NOT IN ('pending', 'approved', 'rejected') THEN
    RAISE EXCEPTION 'Invalid approval status';
  END IF;
  
  -- Update book
  UPDATE public.marketplace_books
  SET 
    approval_status = _approval_status,
    rejection_reason = _rejection_reason,
    updated_at = now()
  WHERE id = _book_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Book not found';
  END IF;
END;
$$;

-- Create secure function for creator book updates
CREATE OR REPLACE FUNCTION public.update_book_as_creator(
  _book_id uuid,
  _creator_wallet text,
  _title text,
  _author text,
  _description text,
  _category text,
  _price_bnb numeric,
  _isbn text,
  _cover_url text,
  _pdf_url text
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
  
  IF _price_bnb < 0 THEN
    RAISE EXCEPTION 'Price cannot be negative';
  END IF;
  
  -- Update book (excluding approval_status)
  UPDATE public.marketplace_books
  SET 
    title = _title,
    author = _author,
    description = _description,
    category = _category,
    price_bnb = _price_bnb,
    isbn = _isbn,
    cover_url = COALESCE(_cover_url, cover_url),
    pdf_url = COALESCE(_pdf_url, pdf_url),
    updated_at = now()
  WHERE id = _book_id;
END;
$$;

-- Drop existing problematic update policy
DROP POLICY IF EXISTS "Creators can update their own books" ON public.marketplace_books;

-- Create restrictive RLS policy - no direct updates allowed
CREATE POLICY "No direct updates allowed"
ON public.marketplace_books
FOR UPDATE
USING (false);