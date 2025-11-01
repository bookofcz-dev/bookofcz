import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWallet } from '@/contexts/WalletContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreateProposalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProposalCreated: () => void;
}

export const CreateProposalDialog = ({ open, onOpenChange, onProposalCreated }: CreateProposalDialogProps) => {
  const { account } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    proposalType: 'platform_feature' as 'book_approval' | 'fee_structure' | 'platform_feature' | 'other',
    votingDurationDays: '7',
    quorumRequired: '1000',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);

    try {
      const votingEndsAt = new Date();
      votingEndsAt.setDate(votingEndsAt.getDate() + parseInt(formData.votingDurationDays));

      const { error } = await supabase
        .from('governance_proposals')
        .insert({
          title: formData.title,
          description: formData.description,
          proposal_type: formData.proposalType,
          created_by: account.toLowerCase(),
          voting_ends_at: votingEndsAt.toISOString(),
          quorum_required: parseFloat(formData.quorumRequired),
          status: 'active',
        });

      if (error) throw error;

      toast.success('Proposal created successfully!');
      onProposalCreated();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        proposalType: 'platform_feature',
        votingDurationDays: '7',
        quorumRequired: '1000',
      });
    } catch (error: any) {
      console.error('Error creating proposal:', error);
      toast.error(error.message || 'Failed to create proposal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Proposal</DialogTitle>
          <DialogDescription>
            Submit a proposal for the community to vote on. Requires admin privileges.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Proposal Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter proposal title"
              required
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your proposal in detail"
              required
              rows={6}
              maxLength={2000}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposalType">Proposal Type</Label>
            <Select
              value={formData.proposalType}
              onValueChange={(value: any) => setFormData({ ...formData, proposalType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="platform_feature">Platform Feature</SelectItem>
                <SelectItem value="book_approval">Book Approval</SelectItem>
                <SelectItem value="fee_structure">Fee Structure</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="votingDuration">Voting Duration (Days)</Label>
              <Input
                id="votingDuration"
                type="number"
                min="1"
                max="30"
                value={formData.votingDurationDays}
                onChange={(e) => setFormData({ ...formData, votingDurationDays: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quorum">Quorum Required (BOCZ)</Label>
              <Input
                id="quorum"
                type="number"
                min="100"
                step="100"
                value={formData.quorumRequired}
                onChange={(e) => setFormData({ ...formData, quorumRequired: e.target.value })}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Proposal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
