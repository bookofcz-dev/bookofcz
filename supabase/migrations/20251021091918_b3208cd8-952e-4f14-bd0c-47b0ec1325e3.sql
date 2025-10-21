-- Fix search_path security issue
CREATE OR REPLACE FUNCTION public.lowercase_wallet_address()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.wallet_address = LOWER(NEW.wallet_address);
  RETURN NEW;
END;
$$;