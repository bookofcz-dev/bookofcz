-- Fix close_expired_proposals function to properly cast status values
CREATE OR REPLACE FUNCTION public.close_expired_proposals()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.governance_proposals
  SET status = CASE
    WHEN total_votes_for + total_votes_against < quorum_required THEN 'expired'::proposal_status
    WHEN total_votes_for > total_votes_against THEN 'passed'::proposal_status
    ELSE 'rejected'::proposal_status
  END
  WHERE status = 'active'::proposal_status
  AND voting_ends_at < now();
END;
$function$;