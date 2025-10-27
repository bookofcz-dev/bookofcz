-- Backfill wallet_sessions for existing buyers who made purchases before the secure auth system
-- This ensures their libraries show up immediately

DO $$
DECLARE
  buyer_record RECORD;
  anonymous_user_id uuid;
BEGIN
  -- For each unique buyer wallet that doesn't have a wallet_session
  FOR buyer_record IN 
    SELECT DISTINCT LOWER(buyer_wallet) as wallet_address
    FROM marketplace_purchases
    WHERE LOWER(buyer_wallet) NOT IN (
      SELECT LOWER(wallet_address) 
      FROM wallet_sessions
    )
  LOOP
    -- Create an anonymous user for this wallet
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      confirmation_token,
      is_anonymous
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      buyer_record.wallet_address || '@wallet.bookofcz.local',
      crypt('', gen_salt('bf')),
      now(),
      now(),
      now(),
      '',
      true
    )
    RETURNING id INTO anonymous_user_id;

    -- Create wallet session for this user
    INSERT INTO wallet_sessions (
      user_id,
      wallet_address,
      signature,
      created_at,
      updated_at
    ) VALUES (
      anonymous_user_id,
      buyer_record.wallet_address,
      'backfilled_' || buyer_record.wallet_address,
      now(),
      now()
    );

    RAISE NOTICE 'Created wallet session for buyer: %', buyer_record.wallet_address;
  END LOOP;
END $$;