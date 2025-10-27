-- Remove the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view purchase stats for public analytics" ON public.marketplace_purchases;

-- Create a secure function that returns only aggregate stats (no sensitive buyer data)
CREATE OR REPLACE FUNCTION public.get_marketplace_stats()
RETURNS TABLE (
  total_sales bigint,
  usdt_volume numeric,
  bnb_volume numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_sales,
    COALESCE(SUM(CASE WHEN b.price_bnb = 0 THEN p.price_paid ELSE 0 END), 0)::numeric as usdt_volume,
    COALESCE(SUM(CASE WHEN b.price_bnb > 0 THEN p.price_paid ELSE 0 END), 0)::numeric as bnb_volume
  FROM marketplace_purchases p
  LEFT JOIN marketplace_books b ON p.book_id = b.id;
END;
$$;