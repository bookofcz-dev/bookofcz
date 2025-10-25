import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, TrendingUp, Eye } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Book {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  route: string;
  views: number;
  badge: string;
  gradient: string;
}

interface FeaturedBooksProps {
  bookViews: Record<string, number>;
}

export const FeaturedBooks = ({ bookViews }: FeaturedBooksProps) => {
  const navigate = useNavigate();

  const getTotalViews = (baseId: string) => {
    return (
      (bookViews[`${baseId}-en`] || 0) +
      (bookViews[`${baseId}-cn`] || 0) +
      (bookViews[`${baseId}-es`] || 0)
    );
  };

  const books: Book[] = [
    {
      id: "book1",
      title: "Part 1: The Beginning",
      subtitle: "The Extraordinary Journey of Changpeng Zhao",
      description: "From humble beginnings to building the world's largest cryptocurrency exchange.",
      route: "/book",
      views: getTotalViews("book1"),
      badge: "Original",
      gradient: "from-primary to-accent",
    },
    {
      id: "book2",
      title: "Part 2: The Return",
      subtitle: "The Return & Resurgence",
      description: "Witness the triumphant return of CZ and the rebirth of Binance Season.",
      route: "/book2",
      views: getTotalViews("book2"),
      badge: "Popular",
      gradient: "from-accent to-primary",
    },
    {
      id: "book3",
      title: "Part 3: The Awakening",
      subtitle: "CZ's New Take on Memes",
      description: "How $10M+ donation to Giggle Academy transformed CZ's perspective on meme coins.",
      route: "/book3",
      views: getTotalViews("book3"),
      badge: "Revolution",
      gradient: "from-primary via-accent to-primary",
    },
    {
      id: "book4",
      title: "Part 4: Wisdom",
      subtitle: "44 Words of Wisdom",
      description: "Inspiring quotes from CZ that guide millions in their crypto journey.",
      route: "/book4",
      views: getTotalViews("book4"),
      badge: "Wisdom",
      gradient: "from-primary to-accent",
    },
    {
      id: "book5",
      title: "Part 5: Love Story",
      subtitle: "The Uncharted Romance of CZ and Yi He",
      description: "The partnership that built Binance—both personal and professional.",
      route: "/book5",
      views: getTotalViews("book5"),
      badge: "Romance",
      gradient: "from-accent to-primary",
    },
    {
      id: "book6",
      title: "Part 6: Killing the FUD",
      subtitle: "Transparency & Trust",
      description: "How CZ's '4' philosophy and Proof of Reserves built unshakeable trust.",
      route: "/book6",
      views: getTotalViews("book6"),
      badge: "Battle",
      gradient: "from-primary to-accent",
    },
    {
      id: "book7",
      title: "Part 7: Selfies",
      subtitle: "Moments with the Community",
      description: "20 memorable moments showing the human side of crypto.",
      route: "/book7",
      views: getTotalViews("book7"),
      badge: "Community",
      gradient: "from-accent to-primary",
    },
    {
      id: "book8",
      title: "Part 8: The CZ Bible",
      subtitle: "Exclusive Token-Gated Content",
      description: "Sacred wisdom and teachings from CZ's journey in cryptocurrency.",
      route: "/book8",
      views: getTotalViews("book8"),
      badge: "Exclusive 🔒",
      gradient: "from-primary via-accent to-primary",
    },
    {
      id: "book9",
      title: "Part 9: Bitcoin Education",
      subtitle: "Educating People About Bitcoin",
      description: "CZ's vision for Bitcoin and the future of financial freedom.",
      route: "/book9",
      views: getTotalViews("book9"),
      badge: "₿ Education",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      id: "book10",
      title: "Part 10: Giggle Academy",
      subtitle: "Reshaping Education",
      description: "Revolutionizing education, making quality learning accessible to everyone.",
      route: "/book10",
      views: getTotalViews("book10"),
      badge: "🎓 Legacy",
      gradient: "from-blue-500 to-yellow-500",
    },
    {
      id: "book11",
      title: "Part 11: Bitcoin vs Gold",
      subtitle: "The Ultimate Debate",
      description: "CZ's perspective on Bitcoin versus Gold - the ultimate store of value showdown.",
      route: "/book11",
      views: getTotalViews("book11"),
      badge: "⚡ Debate",
      gradient: "from-yellow-500 via-orange-500 to-yellow-600",
    },
    {
      id: "book12",
      title: "Part 12: Binance Coin (BNB)",
      subtitle: "The Rise of BNB",
      description: "The evolution of BNB from utility token to ecosystem powerhouse.",
      route: "/book12",
      views: getTotalViews("book12"),
      badge: "🚀 BNB",
      gradient: "from-yellow-500 to-yellow-600",
    },
  ];

  const topBooks = books
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return (
    <div className="mt-16 mb-24">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent rounded-full text-primary-foreground text-sm font-semibold mb-4 animate-pulse">
          <TrendingUp className="w-4 h-4" />
          Most Viewed
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Featured Books
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover the most popular chapters of CZ's journey
        </p>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-6xl mx-auto"
      >
        <CarouselContent className="-ml-4">
          {topBooks.map((book, index) => (
            <CarouselItem key={book.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <Card 
                className="group relative overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 h-full cursor-pointer"
                onClick={() => navigate(book.route)}
              >
                {/* Rank Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-lg shadow-lg">
                    #{index + 1}
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${book.gradient} text-white text-xs font-semibold shadow-lg`}>
                    {book.badge}
                  </div>
                </div>

                {/* Gradient Background Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${book.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`} />

                <CardContent className="p-6 pt-16 flex flex-col h-full relative z-10">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground mb-3">
                      {book.subtitle}
                    </p>
                    <p className="text-sm text-muted-foreground/80 mb-4 line-clamp-3">
                      {book.description}
                    </p>
                  </div>

                  {/* Views Counter */}
                  <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-muted rounded-lg">
                    <Eye className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">
                      {book.views.toLocaleString()} views
                    </span>
                  </div>

                  {/* CTA Button */}
                  <div className="w-full gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm flex items-center justify-center group-hover:bg-primary/90 transition-colors">
                    <BookOpen className="w-4 h-4" />
                    Read Now
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
};
