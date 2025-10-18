-- Fix search_path for increment_book_view function
CREATE OR REPLACE FUNCTION public.increment_book_view(book_identifier TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.book_views (book_id, view_count)
  VALUES (book_identifier, 1)
  ON CONFLICT (book_id)
  DO UPDATE SET 
    view_count = book_views.view_count + 1,
    updated_at = now();
END;
$$;