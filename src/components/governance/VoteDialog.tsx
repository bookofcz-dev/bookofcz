import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ThumbsUp, ThumbsDown, Wallet } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useGovernance, type Proposal } from '@/hooks/useGovernance';
import { toast } from 'sonner';

interface VoteDialogProps {
  proposal: Proposal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VoteDialog = ({ proposal, open, onOpenChange }: VoteDialogProps) => {
  const [voteChoice, setVoteChoice] = useState<'for' | 'against'>('for');
  const [isVoting, setIsVoting] = useState(false);
  const { account, connectWallet, getTokenBalance } = useWallet();
  const { submitVote } = useGovernance();
  const [boczBalance, setBoczBalance] = useState<string>('0');

  const handleConnect = async () => {
    await connectWallet();
  };

  // Fetch balance when dialog opens or account changes
  useEffect(() => {
    if (account && open) {
      getTokenBalance(account).then(setBoczBalance);
    }
  }, [account, open, getTokenBalance]);

  const handleVote = async () => {
    if (!proposal || !account) return;

    setIsVoting(true);
    try {
      // Create a mock transaction to get a hash (in production, this would be a real vote transaction)
      const balance = await getTokenBalance(account);
      if (parseFloat(balance) === 0) {
        toast.error('You need BOCZ tokens to vote');
        setIsVoting(false);
        return;
      }

      // Generate a transaction hash (in production, send a small transaction or use signature)
      const txHash = `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`;
      
      const success = await submitVote(
        proposal.id,
        voteChoice === 'for',
        txHash
      );

      if (success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Vote error:', error);
      toast.error('Failed to submit vote');
    } finally {
      setIsVoting(false);
    }
  };

  if (!proposal) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Vote on Proposal</DialogTitle>
          <DialogDescription>
            Your voting power is based on your BOCZ token balance
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{proposal.title}</h3>
            <p className="text-sm text-muted-foreground">{proposal.description}</p>
          </div>

          {!account ? (
            <Button onClick={handleConnect} className="w-full">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet to Vote
            </Button>
          ) : (
            <>
              <div className="bg-muted p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Your Voting Power</div>
                <div className="text-2xl font-bold">{parseFloat(boczBalance).toLocaleString()} BOCZ</div>
              </div>

              <RadioGroup value={voteChoice} onValueChange={(value) => setVoteChoice(value as 'for' | 'against')}>
                <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted">
                  <RadioGroupItem value="for" id="for" />
                  <Label htmlFor="for" className="flex items-center gap-2 cursor-pointer flex-1">
                    <ThumbsUp className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-semibold">Vote For</div>
                      <div className="text-sm text-muted-foreground">Support this proposal</div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted">
                  <RadioGroupItem value="against" id="against" />
                  <Label htmlFor="against" className="flex items-center gap-2 cursor-pointer flex-1">
                    <ThumbsDown className="w-5 h-5 text-red-500" />
                    <div>
                      <div className="font-semibold">Vote Against</div>
                      <div className="text-sm text-muted-foreground">Oppose this proposal</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              <Button 
                onClick={handleVote} 
                disabled={isVoting || parseFloat(boczBalance) === 0}
                className="w-full"
              >
                {isVoting ? 'Submitting Vote...' : 'Submit Vote'}
              </Button>

              {parseFloat(boczBalance) === 0 && (
                <p className="text-sm text-destructive text-center">
                  You need BOCZ tokens to vote. Visit the Swap page to acquire tokens.
                </p>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
