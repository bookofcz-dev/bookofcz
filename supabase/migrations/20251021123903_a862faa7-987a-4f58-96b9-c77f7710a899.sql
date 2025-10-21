-- Create a new function for marketplace_books that uses creator_wallet
CREATE OR REPLACE FUNCTION public.lowercase_creator_wallet()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.creator_wallet = LOWER(NEW.creator_wallet);
  RETURN NEW;
END;
$$;

-- Drop any existing triggers on marketplace_books
DROP TRIGGER IF EXISTS lowercase_creator_wallet_trigger ON marketplace_books;

-- Create the trigger for marketplace_books
CREATE TRIGGER lowercase_creator_wallet_trigger
BEFORE INSERT OR UPDATE ON marketplace_books
FOR EACH ROW
EXECUTE FUNCTION lowercase_creator_wallet();