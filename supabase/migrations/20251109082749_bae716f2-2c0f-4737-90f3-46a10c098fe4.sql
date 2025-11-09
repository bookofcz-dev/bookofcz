-- Create security definer function to insert wallet sessions
-- This bypasses RLS and ensures inserts work reliably
CREATE OR REPLACE FUNCTION public.create_wallet_session(
  _user_id uuid,
  _wallet_address text,
  _signature text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify the calling user matches the user_id being inserted
  IF auth.uid() != _user_id THEN
    RAISE EXCEPTION 'Unauthorized: user_id mismatch';
  END IF;

  -- Upsert wallet session
  INSERT INTO public.wallet_sessions (user_id, wallet_address, signature, updated_at)
  VALUES (_user_id, LOWER(_wallet_address), _signature, now())
  ON CONFLICT (wallet_address)
  DO UPDATE SET
    user_id = EXCLUDED.user_id,
    signature = EXCLUDED.signature,
    updated_at = now();
END;
$$;