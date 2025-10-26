import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react';

interface PdfViewerProps {
  fileUrl: string;
  title: string;
}

export const PdfViewer = ({ fileUrl, title }: PdfViewerProps) => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `${title}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold">{title}</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-[600px] bg-card border rounded-lg">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading PDF...</p>
          </div>
        </div>
      )}

      <iframe
        src={`${fileUrl}#page=${page}`}
        className="w-full bg-card border rounded-lg"
        style={{ height: '600px', display: loading ? 'none' : 'block' }}
        onLoad={() => setLoading(false)}
        title={title}
      />
    </div>
  );
};
