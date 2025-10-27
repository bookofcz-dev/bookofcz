-- Create a secure wallet authentication system

-- Drop the insecure policies
DROP POLICY IF EXISTS "Authenticated buyers can record purchases" ON public.marketplace_purchases;
DROP POLICY IF EXISTS "Buyers can view own purchases" ON public.marketplace_purchases;
DROP POLICY IF EXISTS "Buyers can update own purchase download counts" ON public.marketplace_purchases;

-- Create a table to map auth users to wallet addresses
CREATE TABLE IF NOT EXISTS public.wallet_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_address text NOT NULL,
  signature text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on wallet_sessions
ALTER TABLE public.wallet_sessions ENABLE ROW LEVEL SECURITY;

-- Users can insert their own wallet session
CREATE POLICY "Users can create own wallet session"
ON public.wallet_sessions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own wallet session
CREATE POLICY "Users can view own wallet session"
ON public.wallet_sessions
FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own wallet session
CREATE POLICY "Users can update own wallet session"
ON public.wallet_sessions
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create a security definer function to get wallet address for current user
CREATE OR REPLACE FUNCTION public.get_user_wallet()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT wallet_address
  FROM public.wallet_sessions
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;

-- Create RLS policies using the secure function
CREATE POLICY "Authenticated buyers can record purchases"
ON public.marketplace_purchases
FOR INSERT
WITH CHECK (
  buyer_wallet IS NOT NULL 
  AND book_id IS NOT NULL 
  AND transaction_hash IS NOT NULL
  AND price_paid >= 0
  AND creator_amount >= 0
  AND platform_fee >= 0
  AND lower(buyer_wallet) = lower(COALESCE(get_user_wallet(), ''))
);

CREATE POLICY "Buyers can view own purchases"
ON public.marketplace_purchases
FOR SELECT
USING (
  lower(buyer_wallet) = lower(COALESCE(get_user_wallet(), ''))
);

CREATE POLICY "Buyers can update own purchase download counts"
ON public.marketplace_purchases
FOR UPDATE
USING (
  lower(buyer_wallet) = lower(COALESCE(get_user_wallet(), ''))
)
WITH CHECK (
  lower(buyer_wallet) = lower(COALESCE(get_user_wallet(), ''))
  AND buyer_wallet = (SELECT buyer_wallet FROM marketplace_purchases WHERE id = marketplace_purchases.id)
  AND book_id = (SELECT book_id FROM marketplace_purchases WHERE id = marketplace_purchases.id)
  AND transaction_hash = (SELECT transaction_hash FROM marketplace_purchases WHERE id = marketplace_purchases.id)
);

-- Add trigger to auto-lowercase wallet addresses
CREATE TRIGGER lowercase_wallet_address_trigger
BEFORE INSERT OR UPDATE ON public.wallet_sessions
FOR EACH ROW
EXECUTE FUNCTION public.lowercase_wallet_address();