import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWallet } from '@/contexts/WalletContext';
import { toast } from 'sonner';

export interface Proposal {
  id: string;
  title: string;
  description: string;
  proposal_type: 'book_approval' | 'fee_structure' | 'platform_feature' | 'other';
  created_by: string;
  created_at: string;
  voting_ends_at: string;
  status: 'active' | 'passed' | 'rejected' | 'expired';
  total_votes_for: number;
  total_votes_against: number;
  quorum_required: number;
  metadata?: any;
}

export interface Vote {
  id: string;
  proposal_id: string;
  voter_wallet: string;
  vote_power: number;
  vote_for: boolean;
  created_at: string;
}

export const useGovernance = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { account, getTokenBalance } = useWallet();

  const fetchProposals = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('governance_proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProposals(data || []);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      toast.error('Failed to load proposals');
    } finally {
      setIsLoading(false);
    }
  };

  const getProposal = async (id: string): Promise<Proposal | null> => {
    try {
      const { data, error } = await supabase
        .from('governance_proposals')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching proposal:', error);
      return null;
    }
  };

  const getProposalVotes = async (proposalId: string): Promise<Vote[]> => {
    try {
      const { data, error } = await supabase
        .from('governance_votes')
        .select('*')
        .eq('proposal_id', proposalId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching votes:', error);
      return [];
    }
  };

  const hasVoted = async (proposalId: string, wallet: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('governance_votes')
        .select('id')
        .eq('proposal_id', proposalId)
        .eq('voter_wallet', wallet.toLowerCase())
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking vote status:', error);
      return false;
    }
  };

  const submitVote = async (
    proposalId: string,
    voteFor: boolean,
    transactionHash: string
  ): Promise<boolean> => {
    if (!account) {
      toast.error('Please connect your wallet');
      return false;
    }

    try {
      // Get BOCZ balance as voting power
      const balance = await getTokenBalance(account);
      const votePower = parseFloat(balance);

      if (votePower === 0) {
        toast.error('You need BOCZ tokens to vote');
        return false;
      }

      // Check if already voted
      const alreadyVoted = await hasVoted(proposalId, account);
      if (alreadyVoted) {
        toast.error('You have already voted on this proposal');
        return false;
      }

      const { error } = await supabase
        .from('governance_votes')
        .insert({
          proposal_id: proposalId,
          voter_wallet: account.toLowerCase(),
          vote_power: votePower,
          vote_for: voteFor,
          transaction_hash: transactionHash,
        });

      if (error) throw error;

      toast.success('Vote submitted successfully!');
      await fetchProposals();
      return true;
    } catch (error: any) {
      console.error('Error submitting vote:', error);
      toast.error(error.message || 'Failed to submit vote');
      return false;
    }
  };

  useEffect(() => {
    fetchProposals();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('governance_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'governance_proposals',
        },
        () => {
          fetchProposals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    proposals,
    isLoading,
    fetchProposals,
    getProposal,
    getProposalVotes,
    hasVoted,
    submitVote,
  };
};
