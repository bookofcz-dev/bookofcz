-- Drop the previous policy as it won't work with wallet auth
DROP POLICY IF EXISTS "Admins can delete books" ON public.marketplace_books;

-- Create a secure function for admins to delete books
CREATE OR REPLACE FUNCTION public.delete_book_as_admin(
  _book_id uuid,
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
  
  -- Delete the book
  DELETE FROM public.marketplace_books
  WHERE id = _book_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Book not found';
  END IF;
END;
$$;