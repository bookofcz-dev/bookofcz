import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface Book {
  id: string;
  title: string;
  description: string;
  author: string;
  cover_url: string;
  pdf_url: string;
  price_bnb: number;
  category: string;
  creator_wallet: string;
  approval_status: string;
  created_at: string;
  isbn?: string;
}

interface BookReviewCardProps {
  book: Book;
  onStatusChange: () => void;
}

export const BookReviewCard = ({ book, onStatusChange }: BookReviewCardProps) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>('');

  const handleViewPdf = async () => {
    try {
      // Extract the path from the full URL
      const urlParts = book.pdf_url.split('/storage/v1/object/public/');
      if (urlParts.length < 2) {
        toast.error('Invalid PDF URL');
        return;
      }
      
      const [bucketAndPath] = urlParts[1].split('/').slice(0, 1);
      const path = urlParts[1].substring(bucketAndPath.length + 1);
      
      // Get signed URL for secure access
      const { data, error } = await supabase.storage
        .from(bucketAndPath)
        .createSignedUrl(path, 3600); // 1 hour expiry

      if (error) {
        // Fallback to direct URL if signed URL fails
        window.open(book.pdf_url, '_blank');
        return;
      }

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (error) {
      console.error('Error viewing PDF:', error);
      // Fallback to direct URL
      window.open(book.pdf_url, '_blank');
    }
  };

  const handleApprove = async () => {
    setProcessing(true);
    try {
      const { error } = await supabase
        .from('marketplace_books')
        .update({ 
          approval_status: 'approved',
          rejection_reason: null 
        })
        .eq('id', book.id);

      if (error) throw error;
      
      toast.success('Book approved successfully!');
      onStatusChange();
    } catch (error) {
      console.error('Error approving book:', error);
      toast.error('Failed to approve book');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setProcessing(true);
    try {
      const { error } = await supabase
        .from('marketplace_books')
        .update({ 
          approval_status: 'rejected',
          rejection_reason: rejectionReason 
        })
        .eq('id', book.id);

      if (error) throw error;
      
      toast.success('Book rejected');
      onStatusChange();
    } catch (error) {
      console.error('Error rejecting book:', error);
      toast.error('Failed to reject book');
    } finally {
      setProcessing(false);
      setRejectionReason('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4">
            <img 
              src={book.cover_url} 
              alt={book.title}
              className="w-24 h-32 object-cover rounded"
            />
            <div>
              <CardTitle className="mb-2">{book.title}</CardTitle>
              <p className="text-sm text-muted-foreground mb-1">by {book.author}</p>
              <Badge variant="outline" className="mb-2">{book.category}</Badge>
              <p className="text-sm font-semibold">{book.price_bnb} BNB</p>
              {book.isbn && (
                <p className="text-xs text-muted-foreground mt-1">ISBN: {book.isbn}</p>
              )}
            </div>
          </div>
          <Badge variant={
            book.approval_status === 'approved' ? 'default' :
            book.approval_status === 'rejected' ? 'destructive' : 'secondary'
          }>
            {book.approval_status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm mb-2"><strong>Description:</strong></p>
          <p className="text-sm text-muted-foreground">{book.description}</p>
        </div>
        
        <div>
          <p className="text-sm mb-1"><strong>Creator Wallet:</strong></p>
          <p className="text-xs font-mono text-muted-foreground">{book.creator_wallet}</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <a href={book.cover_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Cover
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewPdf}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View PDF
          </Button>
        </div>

        {book.approval_status === 'pending' && (
          <>
            <Textarea
              placeholder="Rejection reason (optional)"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[80px]"
            />
            
            <div className="flex gap-2">
              <Button
                onClick={handleApprove}
                disabled={processing}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                onClick={handleReject}
                disabled={processing}
                variant="destructive"
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
