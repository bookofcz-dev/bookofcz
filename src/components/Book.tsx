import { useState } from "react";
import { ChevronLeft, ChevronRight, BookOpen, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookPage } from "@/lib/bookContent";
import { useNavigate } from "react-router-dom";

interface BookProps {
  content: BookPage[];
  title?: string;
  coverImage?: string;
}

export const Book = ({ content, title = "Book of CZ", coverImage }: BookProps) => {
  const [currentPage, setCurrentPage] = useState(coverImage ? -1 : 0);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const totalPages = content.length;
  const showCover = coverImage && currentPage === -1;
  const leftPage = currentPage;
  const rightPage = currentPage + 1;

  const nextPage = () => {
    if (showCover) {
      setCurrentPage(0);
    } else if (currentPage < totalPages - 2) {
      setCurrentPage(currentPage + 2);
    }
  };

  const prevPage = () => {
    if (currentPage === 0 && coverImage) {
      setCurrentPage(-1);
    } else if (currentPage > 0) {
      setCurrentPage(currentPage - 2);
    }
  };

  const goToPage = (pageNum: number) => {
    const evenPage = Math.floor(pageNum / 2) * 2;
    setCurrentPage(evenPage);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-2 md:p-4 relative">
      <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/")}
          className="gap-2"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Cover</span>
        </Button>
      </div>

      <div className="w-full max-w-7xl mt-12 md:mt-0">
        {/* Book Container */}
        <div className="relative md:perspective-[2000px]">
          <div
            className={`book-container ${isOpen ? "open" : ""} mx-auto transition-transform duration-700`}
            style={{
              transformStyle: "preserve-3d",
              transform: isOpen ? "rotateY(0deg)" : "rotateY(-5deg)",
            }}
          >
            {/* Book Spine Shadow - Desktop Only */}
            <div className="hidden md:block absolute left-1/2 top-0 w-12 h-full bg-gradient-to-r from-black/60 to-transparent -translate-x-1/2 z-10 pointer-events-none" />

            {/* Cover or Left Page */}
            <div className="book-page left-page bg-card border-r md:border-r border-border shadow-2xl">
              {showCover ? (
                <div className="h-full flex items-center justify-center p-4">
                  <img 
                    src={coverImage} 
                    alt="Book Cover" 
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div 
                  className="p-4 md:p-8 h-full flex flex-col relative"
                  style={content[leftPage]?.backgroundImage ? {
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${content[leftPage].backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  } : {}}
                >
                  <div className="flex-1 overflow-y-auto pr-2 md:pr-4 custom-scrollbar relative z-10">
                    <div className={`page-number text-xs md:text-sm mb-2 md:mb-4 ${content[leftPage]?.backgroundImage ? 'text-white/80' : 'text-muted-foreground'}`}>
                      Page {leftPage + 1}
                    </div>
                    {leftPage < totalPages && (
                      <>
                        <h2 className={`${content[leftPage].title === 'Quote 1' || content[leftPage].title === 'Quote 2' || content[leftPage].title === 'Quote 3' || content[leftPage].title === 'Quote 4' || content[leftPage].title === 'Quote 5' || content[leftPage].title === 'Quote 6' || content[leftPage].title === 'Quote 7' || content[leftPage].title === 'Quote 8' ? 'text-2xl md:text-4xl' : 'text-lg md:text-2xl'} font-bold mb-2 md:mb-4 ${content[leftPage]?.backgroundImage ? 'text-yellow-400' : content[leftPage].title.startsWith('Quote') ? 'text-yellow-400' : 'text-primary'}`}>
                          {content[leftPage].title}
                        </h2>
                        {content[leftPage].chapter && (
                          <div className={`text-xs md:text-sm font-semibold mb-2 ${content[leftPage]?.backgroundImage ? 'text-white/90' : 'text-accent'}`}>
                            {content[leftPage].chapter}
                          </div>
                        )}
                        {content[leftPage].image && (
                          <img 
                            src={content[leftPage].image} 
                            alt={content[leftPage].title}
                            className="w-full h-auto rounded-lg mb-4 object-contain"
                          />
                        )}
                        <div className={`${content[leftPage].title === 'Quote 1' || content[leftPage].title === 'Quote 2' || content[leftPage].title === 'Quote 3' || content[leftPage].title === 'Quote 4' || content[leftPage].title === 'Quote 5' || content[leftPage].title === 'Quote 6' || content[leftPage].title === 'Quote 7' || content[leftPage].title === 'Quote 8' ? 'text-lg md:text-2xl font-semibold tracking-wide' : 'text-sm md:text-base'} leading-relaxed whitespace-pre-line ${content[leftPage]?.backgroundImage ? 'text-yellow-100/95' : content[leftPage].title.startsWith('Quote') ? 'text-yellow-400' : 'text-foreground'}`}>
                          {content[leftPage].content}
                        </div>
                        {content[leftPage].link && (
                          <a
                            href={content[leftPage].link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 mt-4 transition-colors text-sm font-medium ${content[leftPage]?.backgroundImage ? 'text-white hover:text-white/80' : 'text-primary hover:text-accent'}`}
                          >
                            View on X →
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Page */}
            <div className="book-page right-page bg-card border-l md:border-l border-border shadow-2xl">
              {showCover ? (
                <div className="h-full flex items-center justify-center p-8 text-center">
                  <div>
                    <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4">{title}</h1>
                    <p className="text-muted-foreground">Click next to start reading</p>
                  </div>
                </div>
              ) : (
                <div 
                  className="p-4 md:p-8 h-full flex flex-col relative"
                  style={content[rightPage]?.backgroundImage ? {
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${content[rightPage].backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  } : {}}
                >
                  <div className="flex-1 overflow-y-auto pr-2 md:pr-4 custom-scrollbar relative z-10">
                    <div className={`page-number text-xs md:text-sm mb-2 md:mb-4 ${content[rightPage]?.backgroundImage ? 'text-white/80' : 'text-muted-foreground'}`}>
                      Page {rightPage + 1}
                    </div>
                    {rightPage < totalPages && (
                      <>
                        <h2 className={`${content[rightPage].title === 'Quote 1' || content[rightPage].title === 'Quote 2' || content[rightPage].title === 'Quote 3' || content[rightPage].title === 'Quote 4' || content[rightPage].title === 'Quote 5' || content[rightPage].title === 'Quote 6' || content[rightPage].title === 'Quote 7' || content[rightPage].title === 'Quote 8' ? 'text-2xl md:text-4xl' : 'text-lg md:text-2xl'} font-bold mb-2 md:mb-4 ${content[rightPage]?.backgroundImage ? 'text-yellow-400' : content[rightPage].title.startsWith('Quote') ? 'text-yellow-400' : 'text-primary'}`}>
                          {content[rightPage].title}
                        </h2>
                        {content[rightPage].chapter && (
                          <div className={`text-xs md:text-sm font-semibold mb-2 ${content[rightPage]?.backgroundImage ? 'text-white/90' : 'text-accent'}`}>
                            {content[rightPage].chapter}
                          </div>
                        )}
                        {content[rightPage].image && (
                          <img 
                            src={content[rightPage].image} 
                            alt={content[rightPage].title}
                            className="w-full h-auto rounded-lg mb-4 object-contain"
                          />
                        )}
                        <div className={`${content[rightPage].title === 'Quote 1' || content[rightPage].title === 'Quote 2' || content[rightPage].title === 'Quote 3' || content[rightPage].title === 'Quote 4' || content[rightPage].title === 'Quote 5' || content[rightPage].title === 'Quote 6' || content[rightPage].title === 'Quote 7' || content[rightPage].title === 'Quote 8' ? 'text-lg md:text-2xl font-semibold tracking-wide' : 'text-sm md:text-base'} leading-relaxed whitespace-pre-line ${content[rightPage]?.backgroundImage ? 'text-yellow-100/95' : content[rightPage].title.startsWith('Quote') ? 'text-yellow-400' : 'text-foreground'}`}>
                          {content[rightPage].content}
                        </div>
                        {content[rightPage].link && (
                          <a
                            href={content[rightPage].link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 mt-4 transition-colors text-sm font-medium ${content[rightPage]?.backgroundImage ? 'text-white hover:text-white/80' : 'text-primary hover:text-accent'}`}
                          >
                            View on X →
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-center items-center gap-2 md:gap-6 mt-4 md:mt-8">
          <Button
            onClick={prevPage}
            disabled={currentPage === -1 || (currentPage === 0 && !coverImage)}
            variant="outline"
            size="sm"
            className="gap-1 md:gap-2"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          <div className="flex items-center gap-1 md:gap-2">
            <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-primary" />
            <span className="text-xs md:text-base text-foreground font-medium">
              {showCover ? "Cover" : `${currentPage + 1}-${Math.min(currentPage + 2, totalPages)} of ${totalPages}`}
            </span>
          </div>

          <Button
            onClick={nextPage}
            disabled={!showCover && currentPage >= totalPages - 2}
            variant="outline"
            size="sm"
            className="gap-1 md:gap-2"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </div>

        {/* Chapter Navigation */}
        <div className="mt-4 md:mt-8 flex flex-wrap justify-center gap-1 md:gap-2 px-2">
          {content
            .filter((page) => page.chapter)
            .map((page, idx) => {
              const pageIndex = content.indexOf(page);
              return (
                <Button
                  key={idx}
                  onClick={() => goToPage(pageIndex)}
                  variant={currentPage === pageIndex ? "default" : "outline"}
                  size="sm"
                  className="text-[10px] md:text-xs px-2 py-1"
                >
                  {page.chapter}
                </Button>
              );
            })}
        </div>
      </div>

      <style>{`
        .book-page {
          background: linear-gradient(to bottom, hsl(var(--card)), hsl(var(--card)));
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Mobile: Stack pages vertically */
        @media (max-width: 768px) {
          .book-page {
            width: 100%;
            min-height: 500px;
            height: auto;
            position: relative;
            border-radius: 0.75rem;
            margin-bottom: 1rem;
          }

          .left-page {
            display: block;
          }

          .right-page {
            display: block;
          }

          .book-container {
            position: relative;
            width: 100%;
            height: auto;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
        }

        /* Desktop: Side by side pages */
        @media (min-width: 769px) {
          .book-page {
            width: 45%;
            height: 700px;
            position: absolute;
            top: 0;
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
