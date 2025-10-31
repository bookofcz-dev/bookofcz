import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { Calendar, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import type { Proposal } from '@/hooks/useGovernance';

interface ProposalCardProps {
  proposal: Proposal;
  onVote?: (proposalId: string) => void;
}

export const ProposalCard = ({ proposal, onVote }: ProposalCardProps) => {
  const totalVotes = Number(proposal.total_votes_for) + Number(proposal.total_votes_against);
  const votesForPercent = totalVotes > 0 ? (Number(proposal.total_votes_for) / totalVotes) * 100 : 50;
  const quorumPercent = totalVotes > 0 ? (totalVotes / Number(proposal.quorum_required)) * 100 : 0;
  const isActive = proposal.status === 'active' && new Date(proposal.voting_ends_at) > new Date();

  const statusColors = {
    active: 'bg-blue-500',
    passed: 'bg-green-500',
    rejected: 'bg-red-500',
    expired: 'bg-gray-500',
  };

  const typeLabels = {
    book_approval: 'Book Approval',
    fee_structure: 'Fee Structure',
    platform_feature: 'Platform Feature',
    other: 'Other',
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{proposal.title}</CardTitle>
            <CardDescription className="text-sm line-clamp-2">
              {proposal.description}
            </CardDescription>
          </div>
          <Badge className={statusColors[proposal.status]}>
            {proposal.status.toUpperCase()}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
          <Badge variant="outline">{typeLabels[proposal.proposal_type]}</Badge>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>Ends {format(new Date(proposal.voting_ends_at), 'MMM dd, yyyy')}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              For: {Number(proposal.total_votes_for).toLocaleString()} BOCZ
            </span>
            <span className="flex items-center gap-1">
              <TrendingDown className="w-4 h-4 text-red-500" />
              Against: {Number(proposal.total_votes_against).toLocaleString()} BOCZ
            </span>
          </div>
          <Progress value={votesForPercent} className="h-2 mb-1" />
          <div className="text-xs text-muted-foreground">
            {votesForPercent.toFixed(1)}% in favor
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Quorum Progress</span>
            <span>{totalVotes.toLocaleString()} / {Number(proposal.quorum_required).toLocaleString()} BOCZ</span>
          </div>
          <Progress value={Math.min(quorumPercent, 100)} className="h-2" />
          <div className="text-xs text-muted-foreground mt-1">
            {quorumPercent >= 100 ? 'Quorum reached' : `${quorumPercent.toFixed(1)}% of quorum`}
          </div>
        </div>

        {isActive && onVote && (
          <Button 
            onClick={() => onVote(proposal.id)} 
            className="w-full"
          >
            Vote Now
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
