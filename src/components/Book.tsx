import { useState } from "react";
import { ChevronLeft, ChevronRight, BookOpen, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bookContent } from "@/lib/bookContent";
import { useNavigate } from "react-router-dom";

export const Book = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const totalPages = bookContent.length;
  const leftPage = currentPage;
  const rightPage = currentPage + 1;

  const nextPage = () => {
    if (currentPage < totalPages - 2) {
      setCurrentPage(currentPage + 2);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 2);
    }
  };

  const goToPage = (pageNum: number) => {
    const evenPage = Math.floor(pageNum / 2) * 2;
    setCurrentPage(evenPage);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-4 left-4 z-20">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/")}
          className="gap-2"
        >
          <Home className="w-4 h-4" />
          Back to Cover
        </Button>
      </div>

      <div className="w-full max-w-7xl">
        {/* Book Container */}
        <div className="relative perspective-[2000px]">
          <div
            className={`book-container ${isOpen ? "open" : ""} mx-auto transition-transform duration-700`}
            style={{
              transformStyle: "preserve-3d",
              transform: isOpen ? "rotateY(0deg)" : "rotateY(-5deg)",
            }}
          >
            {/* Book Spine Shadow */}
            <div className="absolute left-1/2 top-0 w-12 h-full bg-gradient-to-r from-black/60 to-transparent -translate-x-1/2 z-10 pointer-events-none" />

            {/* Left Page */}
            <div className="book-page left-page bg-card border-r border-border shadow-2xl">
              <div className="p-8 h-full flex flex-col">
                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                  <div className="page-number text-muted-foreground text-sm mb-4">
                    Page {leftPage + 1}
                  </div>
                  {leftPage < totalPages && (
                    <>
                      <h2 className="text-2xl font-bold text-primary mb-4">
                        {bookContent[leftPage].title}
                      </h2>
                      {bookContent[leftPage].chapter && (
                        <div className="text-sm text-accent font-semibold mb-2">
                          {bookContent[leftPage].chapter}
                        </div>
                      )}
                      <div className="text-foreground leading-relaxed whitespace-pre-line">
                        {bookContent[leftPage].content}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Page */}
            <div className="book-page right-page bg-card border-l border-border shadow-2xl">
              <div className="p-8 h-full flex flex-col">
                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                  <div className="page-number text-muted-foreground text-sm mb-4">
                    Page {rightPage + 1}
                  </div>
                  {rightPage < totalPages && (
                    <>
                      <h2 className="text-2xl font-bold text-primary mb-4">
                        {bookContent[rightPage].title}
                      </h2>
                      {bookContent[rightPage].chapter && (
                        <div className="text-sm text-accent font-semibold mb-2">
                          {bookContent[rightPage].chapter}
                        </div>
                      )}
                      <div className="text-foreground leading-relaxed whitespace-pre-line">
                        {bookContent[rightPage].content}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-center items-center gap-6 mt-8">
          <Button
            onClick={prevPage}
            disabled={currentPage === 0}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-foreground font-medium">
              {currentPage + 1}-{Math.min(currentPage + 2, totalPages)} of {totalPages}
            </span>
          </div>

          <Button
            onClick={nextPage}
            disabled={currentPage >= totalPages - 2}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Chapter Navigation */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {bookContent
            .filter((page) => page.chapter)
            .map((page, idx) => {
              const pageIndex = bookContent.indexOf(page);
              return (
                <Button
                  key={idx}
                  onClick={() => goToPage(pageIndex)}
                  variant={currentPage === pageIndex ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                >
                  {page.chapter}
                </Button>
              );
            })}
        </div>
      </div>

      <style>{`
        .book-page {
          width: 45%;
          height: 700px;
          position: absolute;
          top: 0;
          background: linear-gradient(to bottom, hsl(var(--card)), hsl(var(--card)));
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .left-page {
          left: 0;
          border-radius: 0.75rem 0 0 0.75rem;
        }

        .right-page {
          right: 0;
          border-radius: 0 0.75rem 0.75rem 0;
        }

        .book-container {
          position: relative;
          width: 90%;
          height: 700px;
          margin: 0 auto;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: hsl(var(--muted));
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--primary));
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--accent));
        }
      `}</style>
    </div>
  );
};
