-- Add title column to governance_proposals table
ALTER TABLE public.governance_proposals
ADD COLUMN IF NOT EXISTS title TEXT NOT NULL DEFAULT '';

-- Update title constraint to not allow empty strings
ALTER TABLE public.governance_proposals
ADD CONSTRAINT title_not_empty CHECK (LENGTH(TRIM(title)) > 0);