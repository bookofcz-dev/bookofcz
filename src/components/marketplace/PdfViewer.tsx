import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  fileUrl: string;
  title: string;
  bookId: string;
  buyerWallet: string;
  transactionHash: string;
  downloadCount: number;
  downloadLimit: number;
}

export const PdfViewer = ({ 
  fileUrl, 
  title, 
  bookId, 
  buyerWallet, 
  transactionHash,
  downloadCount,
  downloadLimit 
}: PdfViewerProps) => {
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [downloading, setDownloading] = useState(false);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const handleDownload = async () => {
    if (downloadCount >= downloadLimit) {
      toast.error(`Download limit reached (${downloadLimit} downloads per purchase)`);
      return;
    }

    try {
      setDownloading(true);
      toast.loading('Generating watermarked file...');

      // Call watermarking function
      const { data: watermarkData, error: watermarkError } = await supabase.functions.invoke(
        'watermark-pdf',
        {
          body: {
            bookId,
            buyerWallet,
            transactionHash,
          }
        }
      );

      if (watermarkError || !watermarkData?.downloadUrl) {
        throw new Error(watermarkError?.message || 'Failed to generate watermarked file');
      }

      // Increment download count
      const { error: updateError } = await supabase
        .from('marketplace_purchases')
        .update({ download_count: downloadCount + 1 })
        .eq('book_id', bookId)
        .eq('buyer_wallet', buyerWallet.toLowerCase());

      if (updateError) {
        console.error('Failed to update download count:', updateError);
      }

      // Download the watermarked file
      const link = document.createElement('a');
      link.href = watermarkData.downloadUrl;
      link.download = `${title}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.dismiss();
      toast.success(`Download started! (${downloadCount + 1}/${downloadLimit} downloads used)`);
    } catch (error: any) {
      toast.dismiss();
      console.error('Error downloading book:', error);
      toast.error(error.message || 'Failed to download book');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {pageNumber} / {numPages || '?'}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={downloading || downloadCount >= downloadLimit}
          >
            <Download className="h-4 w-4 mr-2" />
            Download ({downloadCount}/{downloadLimit})
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-[600px] bg-card border rounded-lg">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading PDF...</p>
          </div>
        </div>
      )}

      <div className="bg-card border rounded-lg overflow-auto" style={{ height: '600px' }}>
        <div className="flex justify-center p-4">
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={null}
            error={
              <div className="text-center p-8">
                <p className="text-destructive">Failed to load PDF. Please try downloading instead.</p>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              width={800}
            />
          </Document>
        </div>
      </div>
    </div>
  );
};
