-- Update the update_book_as_creator function to handle price_usdt
DROP FUNCTION IF EXISTS public.update_book_as_creator(uuid, text, text, text, text, text, numeric, text, text, text);

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
  _pdf_url text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
  
  -- Update book (excluding approval_status)
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
    updated_at = now()
  WHERE id = _book_id;
END;
$function$;