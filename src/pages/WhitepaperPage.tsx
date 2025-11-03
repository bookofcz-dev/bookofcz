import { useState } from "react";
import { bookContent } from "@/lib/bookContent13";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

const WhitepaperPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleNextPage = () => {
    if (currentPage < bookContent.length - 1 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary">
              $BOCZ Whitepaper
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The complete technical and strategic documentation for the Book of CZ ecosystem
          </p>
        </div>

        {/* Book Container */}
        <div className="max-w-6xl mx-auto perspective-1000">
          <div className="relative bg-gradient-to-br from-black via-neutral-900 to-black border-2 border-primary/30 rounded-lg shadow-2xl overflow-hidden">
            {/* Golden accents */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            
            {/* Page Content */}
            <div className={`min-h-[600px] p-8 md:p-12 transition-all duration-600 ${
              isFlipping ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}>
              <div className="max-w-4xl mx-auto">
                {/* Chapter Badge */}
                {bookContent[currentPage].chapter && (
                  <div className="inline-block mb-6 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
                    <span className="text-sm font-cta text-primary">
                      {bookContent[currentPage].chapter}
                    </span>
                  </div>
                )}
                
                {/* Title */}
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 text-primary">
                  {bookContent[currentPage].title}
                </h2>
                
                {/* Content */}
                <div className="prose prose-invert prose-lg max-w-none">
                  <div className="text-foreground/90 leading-relaxed whitespace-pre-wrap font-body">
                    {bookContent[currentPage].content}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="border-t border-primary/20 bg-black/40 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                <Button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0 || isFlipping}
                  variant="outline"
                  className="gap-2 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground font-cta">
                    Page {currentPage + 1} of {bookContent.length}
                  </span>
                  <div className="flex gap-1">
                    {bookContent.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          idx === currentPage 
                            ? 'bg-primary w-6' 
                            : 'bg-primary/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <Button
                  onClick={handleNextPage}
                  disabled={currentPage === bookContent.length - 1 || isFlipping}
                  variant="gold"
                  className="gap-2 disabled:opacity-30"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="max-w-4xl mx-auto mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {bookContent.map((page, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (!isFlipping) {
                  setIsFlipping(true);
                  setTimeout(() => {
                    setCurrentPage(idx);
                    setIsFlipping(false);
                  }, 300);
                }
              }}
              className={`p-3 text-left rounded-lg border transition-all ${
                idx === currentPage
                  ? 'bg-primary/10 border-primary/50 shadow-lg'
                  : 'bg-card border-border/40 hover:border-primary/30'
              }`}
            >
              <div className="text-xs text-primary font-cta mb-1">
                {page.chapter}
              </div>
              <div className="text-sm font-semibold text-foreground line-clamp-1">
                {page.title}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhitepaperPage;
