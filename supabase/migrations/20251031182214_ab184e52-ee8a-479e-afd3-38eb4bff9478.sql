-- Create enum for proposal types
CREATE TYPE public.proposal_type AS ENUM ('book_approval', 'fee_structure', 'platform_feature', 'other');

-- Create enum for proposal status
CREATE TYPE public.proposal_status AS ENUM ('active', 'passed', 'rejected', 'expired');

-- Create governance proposals table
CREATE TABLE public.governance_proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  proposal_type proposal_type NOT NULL,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  voting_ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status proposal_status NOT NULL DEFAULT 'active',
  total_votes_for NUMERIC NOT NULL DEFAULT 0,
  total_votes_against NUMERIC NOT NULL DEFAULT 0,
  quorum_required NUMERIC NOT NULL DEFAULT 1000,
  metadata JSONB,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create governance votes table
CREATE TABLE public.governance_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES public.governance_proposals(id) ON DELETE CASCADE,
  voter_wallet TEXT NOT NULL,
  vote_power NUMERIC NOT NULL,
  vote_for BOOLEAN NOT NULL,
  transaction_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(proposal_id, voter_wallet)
);

-- Enable RLS
ALTER TABLE public.governance_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.governance_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for proposals
CREATE POLICY "Anyone can view proposals"
ON public.governance_proposals
FOR SELECT
USING (true);

CREATE POLICY "Admins can create proposals"
ON public.governance_proposals
FOR INSERT
WITH CHECK (has_role(created_by, 'admin'));

CREATE POLICY "Admins can update proposals"
ON public.governance_proposals
FOR UPDATE
USING (has_role(created_by, 'admin'));

-- RLS Policies for votes
CREATE POLICY "Anyone can view votes"
ON public.governance_votes
FOR SELECT
USING (true);

CREATE POLICY "BOCZ holders can vote"
ON public.governance_votes
FOR INSERT
WITH CHECK (
  voter_wallet IS NOT NULL 
  AND vote_power > 0
  AND EXISTS (
    SELECT 1 FROM public.governance_proposals 
    WHERE id = proposal_id 
    AND status = 'active' 
    AND voting_ends_at > now()
  )
);

-- Trigger to update proposal vote counts
CREATE OR REPLACE FUNCTION public.update_proposal_votes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.governance_proposals
  SET 
    total_votes_for = (
      SELECT COALESCE(SUM(vote_power), 0)
      FROM public.governance_votes
      WHERE proposal_id = NEW.proposal_id AND vote_for = true
    ),
    total_votes_against = (
      SELECT COALESCE(SUM(vote_power), 0)
      FROM public.governance_votes
      WHERE proposal_id = NEW.proposal_id AND vote_for = false
    ),
    updated_at = now()
  WHERE id = NEW.proposal_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_proposal_votes_trigger
AFTER INSERT ON public.governance_votes
FOR EACH ROW
EXECUTE FUNCTION public.update_proposal_votes();

-- Function to close expired proposals
CREATE OR REPLACE FUNCTION public.close_expired_proposals()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.governance_proposals
  SET status = CASE
    WHEN total_votes_for + total_votes_against < quorum_required THEN 'expired'
    WHEN total_votes_for > total_votes_against THEN 'passed'
    ELSE 'rejected'
  END
  WHERE status = 'active' 
  AND voting_ends_at < now();
END;
$$;

-- Add indexes for performance
CREATE INDEX idx_governance_proposals_status ON public.governance_proposals(status);
CREATE INDEX idx_governance_proposals_voting_ends ON public.governance_proposals(voting_ends_at);
CREATE INDEX idx_governance_votes_proposal ON public.governance_votes(proposal_id);
CREATE INDEX idx_governance_votes_wallet ON public.governance_votes(voter_wallet);