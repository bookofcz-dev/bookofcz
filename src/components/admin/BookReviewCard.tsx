import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, ExternalLink, Shield, AlertTriangle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWallet } from '@/contexts/WalletContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Book {
  id: string;
  title: string;
  description: string;
  author: string;
  cover_url: string;
  pdf_url: string;
  price_usdt: number;
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

interface SecurityReport {
  safe: boolean;
  score: number;
  issues: Array<{
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    message: string;
  }>;
  metadata: {
    fileSize: number;
    isPDFValid: boolean;
    hasJavaScript: boolean;
    hasEmbeddedFiles: boolean;
    hasExternalLinks: boolean;
    isEncrypted: boolean;
  };
}

export const BookReviewCard = ({ book, onStatusChange }: BookReviewCardProps) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [securityReport, setSecurityReport] = useState<SecurityReport | null>(null);
  const { account } = useWallet();

  const handleScanPdf = async () => {
    setScanning(true);
    setSecurityReport(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('scan-pdf-security', {
        body: { pdfUrl: book.pdf_url }
      });

      if (error) throw error;

      setSecurityReport(data);
      
      if (data.safe) {
        toast.success(`Security scan passed! Score: ${data.score}/100`);
      } else {
        toast.error(`Security issues detected! Score: ${data.score}/100`);
      }
    } catch (error: any) {
      console.error('Error scanning PDF:', error);
      toast.error('Failed to scan PDF: ' + error.message);
    } finally {
      setScanning(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      // Handle three URL formats:
      // 1. Full URL: https://xxx.supabase.co/storage/v1/object/public/bucket/path
      // 2. Relative URL: /storage/v1/object/public/bucket/path
      // 3. Just path: uuid/filename
      let bucket: string;
      let path: string;

      const fullUrlMatch = book.pdf_url.match(/https?:\/\/[^\/]+\/storage\/v1\/object\/public\/([^/]+)\/(.+)/);
      const relativeUrlMatch = book.pdf_url.match(/^\/storage\/v1\/object\/public\/([^/]+)\/(.+)/);
      
      if (fullUrlMatch) {
        [, bucket, path] = fullUrlMatch;
      } else if (relativeUrlMatch) {
        [, bucket, path] = relativeUrlMatch;
      } else {
        // Assume it's just a path in marketplace bucket
        bucket = 'marketplace';
        path = book.pdf_url;
      }
      
      // Download file from storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${book.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('PDF downloaded successfully');
    } catch (error: any) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF: ' + error.message);
    }
  };

  const handleApprove = async () => {
    if (!account) {
      toast.error('Please connect your wallet');
      return;
    }

    setProcessing(true);
    try {
      const { error } = await supabase.rpc('update_book_approval_status', {
        _book_id: book.id,
        _approval_status: 'approved',
        _rejection_reason: null,
        _admin_wallet: account.toLowerCase(),
      });

      if (error) throw error;
      
      toast.success('Book approved successfully!');
      onStatusChange();
    } catch (error: any) {
      console.error('Error approving book:', error);
      toast.error(error.message || 'Failed to approve book');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!account) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    if (rejectionReason.length > 500) {
      toast.error('Rejection reason must be less than 500 characters');
      return;
    }

    setProcessing(true);
    try {
      const { error } = await supabase.rpc('update_book_approval_status', {
        _book_id: book.id,
        _approval_status: 'rejected',
        _rejection_reason: rejectionReason,
        _admin_wallet: account.toLowerCase(),
      });

      if (error) throw error;
      
      toast.success('Book rejected');
      onStatusChange();
    } catch (error: any) {
      console.error('Error rejecting book:', error);
      toast.error(error.message || 'Failed to reject book');
    } finally {
      setProcessing(false);
      setRejectionReason('');
    }
  };

  const handleDelete = async () => {
    if (!account) {
      toast.error('Please connect your wallet');
      return;
    }

    setProcessing(true);
    try {
      // Use secure function to delete the book
      const { error } = await supabase.rpc('delete_book_as_admin', {
        _book_id: book.id,
        _admin_wallet: account.toLowerCase(),
      });

      if (error) throw error;
      
      toast.success('Book deleted successfully');
      onStatusChange();
    } catch (error: any) {
      console.error('Error deleting book:', error);
      toast.error(error.message || 'Failed to delete book');
    } finally {
      setProcessing(false);
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
              <p className="text-sm font-semibold">${(book.price_usdt || book.price_bnb).toFixed(2)} USDT</p>
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

        <div className="flex gap-2 flex-wrap">
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
            onClick={handleDownloadPdf}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button
            variant={securityReport?.safe === false ? "destructive" : "outline"}
            size="sm"
            onClick={handleScanPdf}
            disabled={scanning}
          >
            <Shield className="h-4 w-4 mr-2" />
            {scanning ? 'Scanning...' : 'Security Scan'}
          </Button>
        </div>

        {securityReport && (
          <div className="mt-4 space-y-3">
            <Alert variant={securityReport.safe ? "default" : "destructive"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold mb-2">
                  Security Score: {securityReport.score}/100 - {securityReport.safe ? 'Safe' : 'Issues Detected'}
                </div>
                <div className="text-xs space-y-1">
                  <div>File Size: {(securityReport.metadata.fileSize / 1024 / 1024).toFixed(2)}MB</div>
                  <div>Valid PDF: {securityReport.metadata.isPDFValid ? '✓' : '✗'}</div>
                  {securityReport.metadata.hasJavaScript && <div>⚠️ Contains JavaScript</div>}
                  {securityReport.metadata.hasEmbeddedFiles && <div>⚠️ Contains embedded files</div>}
                  {securityReport.metadata.isEncrypted && <div>🔒 Encrypted/Password protected</div>}
                </div>
              </AlertDescription>
            </Alert>

            {securityReport.issues.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold">Security Issues:</p>
                {securityReport.issues.map((issue, idx) => (
                  <Alert 
                    key={idx} 
                    variant={issue.severity === 'critical' || issue.severity === 'high' ? 'destructive' : 'default'}
                  >
                    <AlertDescription className="text-xs">
                      <span className="font-semibold">[{issue.severity.toUpperCase()}] {issue.category}:</span> {issue.message}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </div>
        )}

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

        {book.approval_status === 'approved' && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={processing}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Book
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete "{book.title}" from the marketplace.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardContent>
    </Card>
  );
};
