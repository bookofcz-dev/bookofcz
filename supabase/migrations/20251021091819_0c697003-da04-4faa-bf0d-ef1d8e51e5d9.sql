-- Update wallet address to lowercase for consistency
UPDATE public.user_roles 
SET wallet_address = LOWER(wallet_address) 
WHERE wallet_address = '0x6e22449bEbc5C719fA7ADB39bc2576B9E6F11bd8';

-- Create a function to automatically lowercase wallet addresses
CREATE OR REPLACE FUNCTION public.lowercase_wallet_address()
RETURNS TRIGGER AS $$
BEGIN
  NEW.wallet_address = LOWER(NEW.wallet_address);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to marketplace_books
CREATE TRIGGER lowercase_creator_wallet
  BEFORE INSERT OR UPDATE ON public.marketplace_books
  FOR EACH ROW
  EXECUTE FUNCTION public.lowercase_wallet_address();

-- Add trigger to user_roles  
CREATE TRIGGER lowercase_user_roles_wallet
  BEFORE INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.lowercase_wallet_address();