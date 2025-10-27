-- Fix duplicate wallet sessions issue
-- Make wallet_address unique and consolidate sessions

-- First, remove duplicate wallet sessions, keeping the most recent one
DELETE FROM wallet_sessions ws1
WHERE EXISTS (
  SELECT 1 FROM wallet_sessions ws2
  WHERE LOWER(ws1.wallet_address) = LOWER(ws2.wallet_address)
  AND ws1.created_at < ws2.created_at
);

-- Drop the old unique constraint on user_id
ALTER TABLE wallet_sessions DROP CONSTRAINT IF EXISTS wallet_sessions_user_id_key;

-- Add unique constraint on wallet_address instead
ALTER TABLE wallet_sessions ADD CONSTRAINT wallet_sessions_wallet_address_key 
  UNIQUE (wallet_address);

-- Update the upsert logic to use wallet_address as the conflict target
-- This ensures reconnecting wallets update the same session instead of creating duplicates