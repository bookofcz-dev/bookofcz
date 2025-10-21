import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, ExternalLink, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMarketplaceWallet } from '@/hooks/useMarketplaceWallet';

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
  const { account } = useMarketplaceWallet();

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
      // Extract bucket and path from URL
      const urlMatch = book.pdf_url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)/);
      if (!urlMatch) {
        toast.error('Invalid PDF URL format');
        return;
      }

      const [, bucket, path] = urlMatch;
      
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
      </CardContent>
    </Card>
  );
};
