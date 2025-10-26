import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, BookOpen, Loader2 } from 'lucide-react';

interface EpubViewerProps {
  fileUrl: string;
  title: string;
}

export const EpubViewer = ({ fileUrl, title }: EpubViewerProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const loadEpub = async () => {
      try {
        setLoading(true);
        setError(null);

        // Dynamically import epub.js
        const ePub = (await import('epubjs')).default;

        // Fetch the EPUB file
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();

        // Create book instance
        const book = ePub(arrayBuffer);

        // Render to container
        if (viewerRef.current) {
          const rendition = book.renderTo(viewerRef.current, {
            width: '100%',
            height: '100%',
            flow: 'paginated',
          });

          await rendition.display();

          // Get total pages (approximate)
          const locations = await book.locations.generate(1024);
          setTotalPages(locations.length);

          // Navigation handlers
          (window as any).epubRendition = rendition;
          (window as any).epubBook = book;
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading EPUB:', err);
        setError('Failed to load EPUB file. Please try downloading instead.');
        setLoading(false);
      }
    };

    if (fileUrl) {
      loadEpub();
    }

    return () => {
      // Cleanup
      if ((window as any).epubRendition) {
        (window as any).epubRendition.destroy();
        delete (window as any).epubRendition;
        delete (window as any).epubBook;
      }
    };
  }, [fileUrl]);

  const nextPage = () => {
    if ((window as any).epubRendition) {
      (window as any).epubRendition.next();
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    }
  };

  const prevPage = () => {
    if ((window as any).epubRendition) {
      (window as any).epubRendition.prev();
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-card border rounded-lg">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading EPUB...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-card border rounded-lg">
        <div className="text-center space-y-4 p-6">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={viewerRef}
        className="bg-card border rounded-lg overflow-hidden"
        style={{ height: '600px', width: '100%' }}
      />
    </div>
  );
};
