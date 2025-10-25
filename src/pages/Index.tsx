import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, Eye, Volume2 } from "lucide-react";
import { Twitter, MessageCircle, Send } from "lucide-react";
import logo from "@/assets/book-of-cz-hero.png";
import book1Cover from "@/assets/book1-cover.png";
import book2Cover from "@/assets/book2-cover.png";
import book3Cover from "@/assets/book3-cover.png";
import book4Cover from "@/assets/book4-cover.png";
import book5Cover from "@/assets/book5-cover.png";
import book6Cover from "@/assets/book6-cover.png";
import book7Cover from "@/assets/book7-cover.png";
import book8Cover from "@/assets/book8-cover.png";
import book9Cover from "@/assets/book9-cover.png";
import book10Cover from "@/assets/book10-cover.png";
import book11Cover from "@/assets/book11-cover.png";
import book12Cover from "@/assets/book12-cover.png";
import { useAllBookViews } from "@/hooks/useBookViews";
import { useHomeStats } from "@/hooks/useHomeStats";
import { FeaturedBooks } from "@/components/FeaturedBooks";
import { Navbar } from "@/components/Navbar";

const Index = () => {
  const navigate = useNavigate();
  const { bookViews } = useAllBookViews();

  const getBookViews = (bookId: string) => {
    return bookViews[bookId] || 0;
  };

  const getTotalViews = (baseId: string) => {
    return getBookViews(`${baseId}-en`) + getBookViews(`${baseId}-cn`) + getBookViews(`${baseId}-es`);
  };

  // Book collection for dynamic count
  const bookCollection = [
    { id: 1, route: "/book", hasTranslations: true },
    { id: 2, route: "/book2", hasTranslations: true },
    { id: 3, route: "/book3", hasTranslations: true },
    { id: 4, route: "/book4", hasTranslations: true },
    { id: 5, route: "/book5", hasTranslations: true },
    { id: 6, route: "/book6", hasTranslations: true },
    { id: 7, route: "/book7", hasTranslations: true },
    { id: 8, route: "/book8", hasTranslations: true },
    { id: 9, route: "/book9", hasTranslations: true },
    { id: 10, route: "/book10", hasTranslations: true },
    { id: 11, route: "/book11", hasTranslations: true },
    { id: 12, route: "/book12", hasTranslations: true },
  ];

  const homeStats = useHomeStats(bookCollection.length);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 relative overflow-hidden">
        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 md:w-96 h-64 md:h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-64 md:w-96 h-64 md:h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-7xl mx-auto">
          {/* Left: 3D Book Mock */}
          <div className="flex justify-center order-1 md:order-none">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary blur-3xl opacity-30 group-hover:opacity-50 transition-opacity animate-pulse" />
              <img 
                src={logo} 
                alt="Book of CZ" 
                className="w-full max-w-[280px] md:max-w-md relative transform group-hover:scale-105 transition-transform duration-500 animate-[float_6s_ease-in-out_infinite]"
                style={{
                  filter: 'drop-shadow(0 25px 50px rgba(217, 162, 65, 0.5))'
                }}
              />
            </div>
          </div>

          {/* Right: Title & CTAs */}
          <div className="text-center md:text-left order-2 md:order-none">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 gold-shimmer bg-clip-text text-transparent">
              BOOK OF CZ
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 md:mb-8 font-body px-4 md:px-0">
              Discover and submit books documenting the journey of CZ.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 justify-center md:justify-start px-4 md:px-0">
              <Button
                onClick={() => navigate("/marketplace")}
                size="lg"
                variant="gold"
                className="gap-2 font-cta"
              >
                Explore Marketplace
              </Button>
              <Button
                onClick={() => {
                  const element = document.getElementById('collection');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                size="lg"
                variant="outline"
                className="gap-2 font-cta"
              >
                <BookOpen className="w-4 h-4" />
                Book of CZ Collection
              </Button>
              <Button
                onClick={() => navigate("/marketplace")}
                size="lg"
                variant="outline"
                className="gap-2 font-cta"
              >
                Submit Your Book
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="container mx-auto px-4 py-16 border-t border-border/40">
        <h2 className="font-heading text-4xl font-bold text-center mb-12 gold-glow">
          FEATURED BOOKS
        </h2>
        <FeaturedBooks bookViews={bookViews} />
      </section>

      {/* Powered By Section */}
      <section className="container mx-auto px-4 py-16 border-t border-border/40">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          <span className="text-muted-foreground font-cta text-lg">POWERED BY</span>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full" />
            <span className="font-cta font-semibold text-xl">BNB</span>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-full" />
            <span className="font-cta font-semibold text-xl">BOCZ</span>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full" />
            <span className="font-cta font-semibold text-xl">USDT</span>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border/40">
        <blockquote className="max-w-4xl mx-auto text-center">
          <p className="font-heading text-2xl md:text-4xl italic text-foreground/90 mb-4">
            "A valuable resource for anyone interested in CZ's impact on crypto world."
          </p>
        </blockquote>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 border-t border-border/40">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto text-center">
          <div>
            <div className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold text-primary mb-2">
              {homeStats.totalBooks}
            </div>
            <div className="font-cta text-muted-foreground text-base md:text-lg">
              Books Available
              <div className="text-xs mt-1">
                ({bookCollection.length} Book of CZ + {homeStats.totalBooks - bookCollection.length} Marketplace)
              </div>
            </div>
          </div>
          <div>
            <div className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold text-primary mb-2">
              {homeStats.totalAuthors}+
            </div>
            <div className="font-cta text-muted-foreground text-base md:text-lg">Authors</div>
          </div>
          <div>
            <div className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold text-primary mb-2">
              {homeStats.totalCommunity}+
            </div>
            <div className="font-cta text-muted-foreground text-base md:text-lg">Community Members</div>
          </div>
        </div>
      </section>

      {/* Book of CZ Collection Section */}
      <section id="collection" className="container mx-auto px-4 py-12 md:py-20 border-t border-border/40 mt-12 md:mt-20">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6 gold-shimmer bg-clip-text text-transparent px-4">
            BOOK OF CZ COLLECTION
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 md:mb-8 px-4">
            Explore the complete collection of CZ's journey - from humble beginnings to becoming a crypto legend. 
            Each book tells a unique chapter of innovation, resilience, and vision.
          </p>
          <div className="inline-flex items-center gap-2 bg-card border border-primary/20 rounded-lg px-4 md:px-6 py-2 md:py-3">
            <BookOpen className="h-4 md:h-5 w-4 md:w-5 text-primary" />
            <span className="font-cta font-semibold text-sm md:text-base">{bookCollection.length} Books Available • Audio Enabled</span>
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Part 1 */}
          <div className="group relative bg-card border border-border/40 rounded-lg overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(217,162,65,0.2)]">
            <div className="aspect-[3/4] bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
              <img 
                src={book1Cover} 
                alt="Book 1 Cover" 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <h3 className="font-heading text-xl font-bold mb-2 gold-shimmer bg-clip-text text-transparent">Who is CZ?</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">From humble beginnings to building the world's largest cryptocurrency exchange.</p>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-3 w-3 text-primary" />
                <span className="text-xs text-muted-foreground">{getTotalViews("book1").toLocaleString()} views</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => navigate("/book")} size="sm" variant="gold" className="flex-1">
                  <Sparkles className="w-3 h-3" />
                  Read
                </Button>
                <Button onClick={() => navigate("/book")} size="sm" variant="outline">
                  <Volume2 className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex gap-2 mt-2">
                <Button onClick={() => navigate("/book-cn")} size="sm" variant="outline" className="flex-1 text-xs">中文</Button>
                <Button onClick={() => navigate("/book-es")} size="sm" variant="outline" className="flex-1 text-xs">ES</Button>
              </div>
            </div>
          </div>

          {/* Part 2 */}
          <div className="group relative bg-card border border-border/40 rounded-lg overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(217,162,65,0.2)]">
            <div className="aspect-[3/4] bg-gradient-to-br from-accent/5 to-primary/5 flex items-center justify-center p-4">
              <img 
                src={book2Cover} 
                alt="Book 2 Cover" 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <h3 className="font-heading text-xl font-bold mb-2 gold-shimmer bg-clip-text text-transparent">The Return</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">Witness the triumphant return of CZ and the rebirth of Binance Season.</p>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-3 w-3 text-primary" />
                <span className="text-xs text-muted-foreground">{getTotalViews("book2").toLocaleString()} views</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => navigate("/book2")} size="sm" variant="gold" className="flex-1">
                  <Sparkles className="w-3 h-3" />
                  Read
                </Button>
                <Button onClick={() => navigate("/book2")} size="sm" variant="outline">
                  <Volume2 className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex gap-2 mt-2">
                <Button onClick={() => navigate("/book2-cn")} size="sm" variant="outline" className="flex-1 text-xs">中文</Button>
                <Button onClick={() => navigate("/book2-es")} size="sm" variant="outline" className="flex-1 text-xs">ES</Button>
              </div>
            </div>
          </div>

          {/* Part 3 */}
          <div className="group relative bg-card border border-border/40 rounded-lg overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(217,162,65,0.2)]">
            <div className="aspect-[3/4] bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
              <img 
                src={book3Cover} 
                alt="Book 3 Cover" 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <h3 className="font-heading text-xl font-bold mb-2 gold-shimmer bg-clip-text text-transparent">The Awakening</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">How $10M+ donation to Giggle Academy transformed CZ's perspective on meme coins.</p>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-3 w-3 text-primary" />
                <span className="text-xs text-muted-foreground">{getTotalViews("book3").toLocaleString()} views</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => navigate("/book3")} size="sm" variant="gold" className="flex-1">
                  <Sparkles className="w-3 h-3" />
                  Read
                </Button>
                <Button onClick={() => navigate("/book3")} size="sm" variant="outline">
                  <Volume2 className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex gap-2 mt-2">
                <Button onClick={() => navigate("/book3-cn")} size="sm" variant="outline" className="flex-1 text-xs">中文</Button>
                <Button onClick={() => navigate("/book3-es")} size="sm" variant="outline" className="flex-1 text-xs">ES</Button>
              </div>
            </div>
          </div>

          {/* Part 4 */}
          <div className="group relative bg-card border border-border/40 rounded-lg overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(217,162,65,0.2)]">
            <div className="aspect-[2/3] bg-gradient-to-br from-accent/5 to-primary/5 p-4 flex items-center justify-center">
              <img src={book4Cover} alt="Book 4 Cover" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-6">
              <h3 className="font-heading text-xl font-bold mb-2 gold-shimmer bg-clip-text text-transparent">44 Wisdom</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">Inspiring quotes from CZ that guide millions in their crypto journey.</p>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-3 w-3 text-primary" />
                <span className="text-xs text-muted-foreground">{getTotalViews("book4").toLocaleString()} views</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => navigate("/book4")} size="sm" variant="gold" className="flex-1">
                  <Sparkles className="w-3 h-3" />
                  Read
                </Button>
                <Button onClick={() => navigate("/book4")} size="sm" variant="outline">
                  <Volume2 className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex gap-2 mt-2">
                <Button onClick={() => navigate("/book4-cn")} size="sm" variant="outline" className="flex-1 text-xs">中文</Button>
                <Button onClick={() => navigate("/book4-es")} size="sm" variant="outline" className="flex-1 text-xs">ES</Button>
              </div>
            </div>
          </div>

          {/* Part 5 */}
          <div className="group relative bg-card border border-border/40 rounded-lg overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(217,162,65,0.2)]">
            <div className="aspect-[2/3] bg-gradient-to-br from-primary/5 to-accent/5 p-4 flex items-center justify-center">
              <img src={book5Cover} alt="Book 5 Cover" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-6">
              <h3 className="font-heading text-xl font-bold mb-2 gold-shimmer bg-clip-text text-transparent">Love Story</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">The uncharted romance of CZ and Yi He - the partnership that built Binance.</p>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-3 w-3 text-primary" />
                <span className="text-xs text-muted-foreground">{getTotalViews("book5").toLocaleString()} views</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => navigate("/book5")} size="sm" variant="gold" className="flex-1">
                  <Sparkles className="w-3 h-3" />
                  Read
                </Button>
                <Button onClick={() => navigate("/book5")} size="sm" variant="outline">
                  <Volume2 className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex gap-2 mt-2">
                <Button onClick={() => navigate("/book5-cn")} size="sm" variant="outline" className="flex-1 text-xs">中文</Button>
                <Button onClick={() => navigate("/book5-es")} size="sm" variant="outline" className="flex-1 text-xs">ES</Button>
              </div>
            </div>
          </div>

          {/* Part 6 */}
          <div className="group relative bg-card border border-border/40 rounded-lg overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(217,162,65,0.2)]">
            <div className="aspect-[2/3] bg-gradient-to-br from-accent/5 to-primary/5 p-4 flex items-center justify-center">
              <img src={book6Cover} alt="Book 6 Cover" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-6">
              <h3 className="font-heading text-xl font-bold mb-2 gold-shimmer bg-clip-text text-transparent">Killing FUD</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">How CZ's '4' philosophy and Proof of Reserves built unshakeable trust.</p>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-3 w-3 text-primary" />
                <span className="text-xs text-muted-foreground">{getTotalViews("book6").toLocaleString()} views</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => navigate("/book6")} size="sm" variant="gold" className="flex-1">
                  <Sparkles className="w-3 h-3" />
                  Read
                </Button>
                <Button onClick={() => navigate("/book6")} size="sm" variant="outline">
                  <Volume2 className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex gap-2 mt-2">
                <Button onClick={() => navigate("/book6-cn")} size="sm" variant="outline" className="flex-1 text-xs">中文</Button>
                <Button onClick={() => navigate("/book6-es")} size="sm" variant="outline" className="flex-1 text-xs">ES</Button>
              </div>
            </div>
          </div>

          {/* Part 7 */}
          <div className="group relative bg-card border border-border/40 rounded-lg overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(217,162,65,0.2)]">
            <div className="aspect-[2/3] bg-gradient-to-br from-primary/5 to-accent/5 p-4 flex items-center justify-center">
              <img src={book7Cover} alt="Book 7 Cover" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-6">
              <h3 className="font-heading text-xl font-bold mb-2 gold-shimmer bg-clip-text text-transparent">Selfies</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">20 memorable moments showing the human side of crypto.</p>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-3 w-3 text-primary" />
                <span className="text-xs text-muted-foreground">{getTotalViews("book7").toLocaleString()} views</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => navigate("/book7")} size="sm" variant="gold" className="flex-1">
                  <Sparkles className="w-3 h-3" />
                  Read
                </Button>
                <Button onClick={() => navigate("/book7")} size="sm" variant="outline">
                  <Volume2 className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex gap-2 mt-2">
                <Button onClick={() => navigate("/book7-cn")} size="sm" variant="outline" className="flex-1 text-xs">中文</Button>
                <Button onClick={() => navigate("/book7-es")} size="sm" variant="outline" className="flex-1 text-xs">ES</Button>
              </div>
            </div>
          </div>

          {/* Part 8 */}
          <div className="group relative bg-card border border-border/40 rounded-lg overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(217,162,65,0.2)]">
            <div className="aspect-[2/3] bg-gradient-to-br from-accent/5 to-primary/5 p-4 flex items-center justify-center">
              <img src={book8Cover} alt="Book 8 Cover" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-6">
              <h3 className="font-heading text-xl font-bold mb-2 gold-shimmer bg-clip-text text-transparent">CZ Bible</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">Sacred wisdom and teachings from CZ's journey in cryptocurrency.</p>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-3 w-3 text-primary" />
                <span className="text-xs text-muted-foreground">{getTotalViews("book8").toLocaleString()} views</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => navigate("/book8")} size="sm" variant="gold" className="flex-1">
                  <Sparkles className="w-3 h-3" />
                  Read
                </Button>
                <Button onClick={() => navigate("/book8")} size="sm" variant="outline">
                  <Volume2 className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex gap-2 mt-2">
                <Button onClick={() => navigate("/book8-cn")} size="sm" variant="outline" className="flex-1 text-xs">中文</Button>
                <Button onClick={() => navigate("/book8-es")} size="sm" variant="outline" className="flex-1 text-xs">ES</Button>
              </div>
            </div>
          </div>

          {/* Part 9 */}
          <div className="group relative bg-card border border-border/40 rounded-lg overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(217,162,65,0.2)]">
            <div className="aspect-[2/3] bg-gradient-to-br from-primary/5 to-accent/5 p-4 flex items-center justify-center">
              <img src={book9Cover} alt="Book 9 Cover" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-6">
              <h3 className="font-heading text-xl font-bold mb-2 gold-shimmer bg-clip-text text-transparent">Bitcoin Ed</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">CZ's vision for Bitcoin and the future of financial freedom.</p>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-3 w-3 text-primary" />
                <span className="text-xs text-muted-foreground">{getTotalViews("book9").toLocaleString()} views</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => navigate("/book9")} size="sm" variant="gold" className="flex-1">
                  <Sparkles className="w-3 h-3" />
                  Read
                </Button>
                <Button onClick={() => navigate("/book9")} size="sm" variant="outline">
                  <Volume2 className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex gap-2 mt-2">
                <Button onClick={() => navigate("/book9-cn")} size="sm" variant="outline" className="flex-1 text-xs">中文</Button>
                <Button onClick={() => navigate("/book9-es")} size="sm" variant="outline" className="flex-1 text-xs">ES</Button>
              </div>
            </div>
          </div>

          {/* Part 10 */}
          <div className="group relative bg-card border border-border/40 rounded-lg overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(217,162,65,0.2)]">
            <div className="aspect-[2/3] bg-gradient-to-br from-accent/5 to-primary/5 p-4 flex items-center justify-center">
              <img src={book10Cover} alt="Book 10 Cover" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-6">
              <h3 className="font-heading text-xl font-bold mb-2 gold-shimmer bg-clip-text text-transparent">Giggle Academy</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">Revolutionizing education, making quality learning accessible to everyone.</p>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-3 w-3 text-primary" />
                <span className="text-xs text-muted-foreground">{getTotalViews("book10").toLocaleString()} views</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => navigate("/book10")} size="sm" variant="gold" className="flex-1">
                  <Sparkles className="w-3 h-3" />
                  Read
                </Button>
                <Button onClick={() => navigate("/book10")} size="sm" variant="outline">
                  <Volume2 className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex gap-2 mt-2">
                <Button onClick={() => navigate("/book10-cn")} size="sm" variant="outline" className="flex-1 text-xs">中文</Button>
                <Button onClick={() => navigate("/book10-es")} size="sm" variant="outline" className="flex-1 text-xs">ES</Button>
              </div>
            </div>
          </div>

          {/* Part 11 */}
          <div className="group relative bg-card border border-border/40 rounded-lg overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(217,162,65,0.2)]">
            <div className="aspect-[2/3] bg-gradient-to-br from-primary/5 to-accent/5 p-4 flex items-center justify-center">
              <img src={book11Cover} alt="Book 11 Cover" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-6">
              <h3 className="font-heading text-xl font-bold mb-2 gold-shimmer bg-clip-text text-transparent">Bitcoin vs Gold</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">CZ's perspective on Bitcoin versus Gold - the ultimate store of value showdown.</p>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-3 w-3 text-primary" />
                <span className="text-xs text-muted-foreground">{getTotalViews("book11").toLocaleString()} views</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => navigate("/book11")} size="sm" variant="gold" className="flex-1">
                  <Sparkles className="w-3 h-3" />
                  Read
                </Button>
                <Button onClick={() => navigate("/book11")} size="sm" variant="outline">
                  <Volume2 className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex gap-2 mt-2">
                <Button onClick={() => navigate("/book11-cn")} size="sm" variant="outline" className="flex-1 text-xs">中文</Button>
                <Button onClick={() => navigate("/book11-es")} size="sm" variant="outline" className="flex-1 text-xs">ES</Button>
              </div>
            </div>
          </div>

          {/* Part 12 */}
          <div className="group relative bg-card border border-border/40 rounded-lg overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(217,162,65,0.2)]">
            <div className="aspect-[2/3] bg-gradient-to-br from-accent/5 to-primary/5 p-4 flex items-center justify-center">
              <img src={book12Cover} alt="Book 12 Cover" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-6">
              <h3 className="font-heading text-xl font-bold mb-2 gold-shimmer bg-clip-text text-transparent">CZ's Pardon</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">The latest chapter in CZ's remarkable journey - a story of redemption.</p>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-3 w-3 text-primary" />
                <span className="text-xs text-muted-foreground">{getTotalViews("book12").toLocaleString()} views</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => navigate("/book12")} size="sm" variant="gold" className="flex-1">
                  <Sparkles className="w-3 h-3" />
                  Read
                </Button>
                <Button onClick={() => navigate("/book12")} size="sm" variant="outline">
                  <Volume2 className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex gap-2 mt-2">
                <Button onClick={() => navigate("/book12-cn")} size="sm" variant="outline" className="flex-1 text-xs">中文</Button>
                <Button onClick={() => navigate("/book12-es")} size="sm" variant="outline" className="flex-1 text-xs">ES</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="container mx-auto px-4 py-12 md:py-20 border-t border-border/40 mt-12 md:mt-20">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 md:mb-16 gold-shimmer bg-clip-text text-transparent px-4">
          ROADMAP
        </h2>
        
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Q4 2025 */}
          <div className="relative pl-8 border-l-2 border-primary">
            <div className="absolute -left-3 top-0 w-6 h-6 bg-primary rounded-full border-4 border-background" />
            <div className="mb-2">
              <span className="inline-block bg-primary/20 text-primary px-4 py-1 rounded-full text-sm font-cta font-semibold">
                Q4 2025
              </span>
            </div>
            <ul className="space-y-3 mt-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-foreground/80">Release Book of CZ books regularly</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-foreground/80">Go Live of $BOCZ Marketplace with full Integration</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-foreground/80">Accept USDT, BOCZ, and BNB as payment in the Marketplace</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-foreground/80">Listings in Coingecko and CoinmarketCap</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-foreground/80">CEX Listings</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-foreground/80">Support CZ in marketing his upcoming book</span>
              </li>
            </ul>
          </div>

          {/* Q1-Q2 2026 */}
          <div className="relative pl-8 border-l-2 border-primary">
            <div className="absolute -left-3 top-0 w-6 h-6 bg-primary rounded-full border-4 border-background" />
            <div className="mb-2">
              <span className="inline-block bg-primary/20 text-primary px-4 py-1 rounded-full text-sm font-cta font-semibold">
                Q1-Q2 2026
              </span>
            </div>
            <ul className="space-y-3 mt-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-foreground/80">Product Market Fit for the BOCZ Marketplace and Books collection</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-foreground/80">Reach up to 1000 Authors onboarded</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-foreground/80">Reach up to 1000 Books uploaded</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-foreground/80">Reach up to 1000 BNB Trading Volume onsite</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-foreground/80">Grow Holders to 1000 to 10000 Holders</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-foreground/80">Increase Global Recognition</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-foreground/80">1 Billion Copies Sold of CZ Book</span>
              </li>
            </ul>
          </div>

          {/* Q3-Q4 2026 */}
          <div className="relative pl-8 border-l-2 border-primary">
            <div className="absolute -left-3 top-0 w-6 h-6 bg-primary rounded-full border-4 border-background" />
            <div className="mb-2">
              <span className="inline-block bg-primary/20 text-primary px-4 py-1 rounded-full text-sm font-cta font-semibold">
                Q3-Q4 2026
              </span>
            </div>
            <ul className="space-y-3 mt-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-foreground/80">Launch Multi-chain support for broader accessibility</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-foreground/80">Introduce NFT collections for exclusive book editions</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-foreground/80">Expand to 10,000+ Active Authors and Creators</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-foreground/80">Reach 50,000+ Holders globally</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-foreground/80">Achieve 10,000 BNB Trading Volume milestone</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-foreground/80">Launch BOCZ Mobile App for iOS and Android</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-foreground/80">Establish Strategic Partnerships with major publishing houses</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-foreground/80">Host First Annual BOCZ Book Summit</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-border/40 mt-20">
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-6">
            <a href="https://x.com/BOCZ_BookOfCZ" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="X (Twitter)">
              <Twitter className="h-6 w-6" />
            </a>
            <a href="https://x.com/i/communities/1977777558855766270" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="X Community">
              <MessageCircle className="h-6 w-6" />
            </a>
            <a href="https://t.me/BOCZ_BookOfCZ" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Telegram">
              <Send className="h-6 w-6" />
            </a>
          </div>
          <p className="text-sm text-muted-foreground font-body">
            © 2025 Book of CZ. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
