import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProposalCard } from '@/components/governance/ProposalCard';
import { VoteDialog } from '@/components/governance/VoteDialog';
import { useGovernance, type Proposal } from '@/hooks/useGovernance';
import { Vote, TrendingUp, CheckCircle2, XCircle, Clock } from 'lucide-react';

const Governance = () => {
  const { proposals, isLoading } = useGovernance();
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [voteDialogOpen, setVoteDialogOpen] = useState(false);

  const handleVote = (proposalId: string) => {
    const proposal = proposals.find(p => p.id === proposalId);
    if (proposal) {
      setSelectedProposal(proposal);
      setVoteDialogOpen(true);
    }
  };

  const activeProposals = proposals.filter(p => p.status === 'active');
  const passedProposals = proposals.filter(p => p.status === 'passed');
  const rejectedProposals = proposals.filter(p => p.status === 'rejected');
  const expiredProposals = proposals.filter(p => p.status === 'expired');

  return (
    <>
      <Helmet>
        <title>Governance - BookofCZ</title>
        <meta name="description" content="Vote on marketplace decisions with your BOCZ tokens" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8 mt-20">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Vote className="w-12 h-12 text-primary" />
                <h1 className="text-4xl md:text-5xl font-bold">BOCZ Governance</h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Your voice matters. Vote on marketplace decisions with your BOCZ tokens.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-card border rounded-lg p-6 text-center">
                <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-3xl font-bold">{activeProposals.length}</div>
                <div className="text-sm text-muted-foreground">Active Proposals</div>
              </div>
              <div className="bg-card border rounded-lg p-6 text-center">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-3xl font-bold">{passedProposals.length}</div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </div>
              <div className="bg-card border rounded-lg p-6 text-center">
                <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-3xl font-bold">{rejectedProposals.length}</div>
                <div className="text-sm text-muted-foreground">Rejected</div>
              </div>
              <div className="bg-card border rounded-lg p-6 text-center">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold">{proposals.length}</div>
                <div className="text-sm text-muted-foreground">Total Proposals</div>
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-lg mb-2">How Governance Works</h3>
              <ul className="space-y-2 text-sm">
                <li>• Your voting power is based on your BOCZ token balance</li>
                <li>• Each proposal requires a minimum quorum to pass</li>
                <li>• You can only vote once per proposal</li>
                <li>• Proposals automatically close when the voting period ends</li>
              </ul>
            </div>

            {/* Proposals Tabs */}
            <Tabs defaultValue="active" className="space-y-6">
              <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
                <TabsTrigger value="active">Active ({activeProposals.length})</TabsTrigger>
                <TabsTrigger value="passed">Passed ({passedProposals.length})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({rejectedProposals.length})</TabsTrigger>
                <TabsTrigger value="expired">Expired ({expiredProposals.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-12">Loading proposals...</div>
                ) : activeProposals.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No active proposals at the moment
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {activeProposals.map((proposal) => (
                      <ProposalCard
                        key={proposal.id}
                        proposal={proposal}
                        onVote={handleVote}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="passed" className="space-y-4">
                {passedProposals.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No passed proposals yet
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {passedProposals.map((proposal) => (
                      <ProposalCard key={proposal.id} proposal={proposal} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="rejected" className="space-y-4">
                {rejectedProposals.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No rejected proposals
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {rejectedProposals.map((proposal) => (
                      <ProposalCard key={proposal.id} proposal={proposal} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="expired" className="space-y-4">
                {expiredProposals.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No expired proposals
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {expiredProposals.map((proposal) => (
                      <ProposalCard key={proposal.id} proposal={proposal} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <VoteDialog
          proposal={selectedProposal}
          open={voteDialogOpen}
          onOpenChange={setVoteDialogOpen}
        />
      </div>
    </>
  );
};

export default Governance;
