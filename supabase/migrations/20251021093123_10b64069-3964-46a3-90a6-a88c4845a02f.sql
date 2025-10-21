-- Add missing columns to marketplace_purchases table
ALTER TABLE marketplace_purchases 
ADD COLUMN IF NOT EXISTS creator_amount NUMERIC DEFAULT 0;

-- Ensure correct column names (rename if needed)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'marketplace_purchases' 
    AND column_name = 'creator_amount'
  ) THEN
    ALTER TABLE marketplace_purchases 
    ADD COLUMN creator_amount NUMERIC DEFAULT 0;
  END IF;
END $$;