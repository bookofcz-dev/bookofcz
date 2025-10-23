import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, Eye } from "lucide-react";
import { Twitter, MessageCircle, Send } from "lucide-react";
import logo from "@/assets/bookofcz-logo.png";
import { useAllBookViews } from "@/hooks/useBookViews";
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 relative overflow-hidden">
        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left: 3D Book Mock */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary blur-3xl opacity-30 group-hover:opacity-50 transition-opacity" />
              <img 
                src={logo} 
                alt="Book of CZ" 
                className="w-full max-w-md relative transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right: Title & CTAs */}
          <div className="text-center md:text-left">
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 gold-shimmer bg-clip-text text-transparent">
              BOOK OF CZ
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-body">
              Discover and submit books documenting the journey of CZ.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Button
                onClick={() => navigate("/marketplace")}
                size="lg"
                variant="gold"
                className="gap-2 font-cta"
              >
                Explore Marketplace
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
      <section className="container mx-auto px-4 py-20 border-t border-border/40">
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto text-center">
          <div>
            <div className="font-heading text-6xl md:text-7xl font-bold text-primary mb-2">50+</div>
            <div className="font-cta text-muted-foreground text-lg">Books Available</div>
          </div>
          <div>
            <div className="font-heading text-6xl md:text-7xl font-bold text-primary mb-2">100+</div>
            <div className="font-cta text-muted-foreground text-lg">Authors</div>
          </div>
          <div>
            <div className="font-heading text-6xl md:text-7xl font-bold text-primary mb-2">200+</div>
            <div className="font-cta text-muted-foreground text-lg">Community Members</div>
          </div>
        </div>
      </section>

      {/* Book of CZ Collection Section */}
      <section id="audio" className="container mx-auto px-4 py-20 border-t border-border/40 mt-20">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6 gold-shimmer bg-clip-text text-transparent">
            BOOK OF CZ COLLECTION
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Explore the complete collection of CZ's journey - from humble beginnings to becoming a crypto legend. 
            Each book tells a unique chapter of innovation, resilience, and vision.
          </p>
          <div className="inline-flex items-center gap-2 bg-card border border-primary/20 rounded-lg px-6 py-3">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-cta font-semibold">12 Books Available • Audio Enabled</span>
          </div>
        </div>
      </section>

      {/* All Book Parts */}
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Part 1 */}
        <div className="py-16 border-t border-border/40">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 gold-shimmer bg-clip-text text-transparent">
            Book of CZ: Part 1: The Beginning
          </h2>
          <p className="text-xl text-muted-foreground mb-2 font-cta">The Extraordinary Journey of Changpeng Zhao</p>
          <p className="text-foreground/80 mb-6 max-w-2xl">
            From humble beginnings to building the world's largest cryptocurrency exchange.
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            <Button onClick={() => navigate("/book")} size="lg" variant="gold">
              <Sparkles className="w-4 h-4" />
              Read Now
            </Button>
            <Button onClick={() => navigate("/book-cn")} size="lg" variant="outline">中文版</Button>
            <Button onClick={() => navigate("/book-es")} size="lg" variant="outline">Español</Button>
          </div>
          <div className="inline-flex items-center gap-2 bg-card border border-primary/20 rounded-lg px-4 py-2">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-sm">{getTotalViews("book1").toLocaleString()} views</span>
          </div>
        </div>

        {/* Part 2 */}
        <div className="py-16 border-t border-border/40">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 gold-shimmer bg-clip-text text-transparent">
            Book of CZ: Part 2: The Return
          </h2>
          <p className="text-xl text-muted-foreground mb-2 font-cta">The Return & Resurgence</p>
          <p className="text-foreground/80 mb-6 max-w-2xl">
            Witness the triumphant return of CZ and the rebirth of Binance Season.
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            <Button onClick={() => navigate("/book2")} size="lg" variant="gold">
              <Sparkles className="w-4 h-4" />
              Read Now
            </Button>
            <Button onClick={() => navigate("/book2-cn")} size="lg" variant="outline">中文版</Button>
            <Button onClick={() => navigate("/book2-es")} size="lg" variant="outline">Español</Button>
          </div>
          <div className="inline-flex items-center gap-2 bg-card border border-primary/20 rounded-lg px-4 py-2">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-sm">{getTotalViews("book2").toLocaleString()} views</span>
          </div>
        </div>

        {/* Part 3 */}
        <div className="py-16 border-t border-border/40">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 gold-shimmer bg-clip-text text-transparent">
            Book of CZ: Part 3: The Awakening
          </h2>
          <p className="text-xl text-muted-foreground mb-2 font-cta">CZ's New Take on Memes</p>
          <p className="text-foreground/80 mb-6 max-w-2xl">
            How $10M+ donation to Giggle Academy transformed CZ's perspective on meme coins.
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            <Button onClick={() => navigate("/book3")} size="lg" variant="gold">
              <Sparkles className="w-4 h-4" />
              Read Now
            </Button>
            <Button onClick={() => navigate("/book3-cn")} size="lg" variant="outline">中文版</Button>
            <Button onClick={() => navigate("/book3-es")} size="lg" variant="outline">Español</Button>
          </div>
          <div className="inline-flex items-center gap-2 bg-card border border-primary/20 rounded-lg px-4 py-2">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-sm">{getTotalViews("book3").toLocaleString()} views</span>
          </div>
        </div>

        {/* Part 4 */}
        <div className="py-16 border-t border-border/40">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 gold-shimmer bg-clip-text text-transparent">
            Book of CZ: Part 4: Wisdom
          </h2>
          <p className="text-xl text-muted-foreground mb-2 font-cta">44 Words of Wisdom</p>
          <p className="text-foreground/80 mb-6 max-w-2xl">
            Inspiring quotes from CZ that guide millions in their crypto journey.
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            <Button onClick={() => navigate("/book4")} size="lg" variant="gold">
              <Sparkles className="w-4 h-4" />
              Read Now
            </Button>
            <Button onClick={() => navigate("/book4-cn")} size="lg" variant="outline">中文版</Button>
            <Button onClick={() => navigate("/book4-es")} size="lg" variant="outline">Español</Button>
          </div>
          <div className="inline-flex items-center gap-2 bg-card border border-primary/20 rounded-lg px-4 py-2">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-sm">{getTotalViews("book4").toLocaleString()} views</span>
          </div>
        </div>

        {/* Part 5 */}
        <div className="py-16 border-t border-border/40">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 gold-shimmer bg-clip-text text-transparent">
            Book of CZ: Part 5: Love Story
          </h2>
          <p className="text-xl text-muted-foreground mb-2 font-cta">The Uncharted Romance of CZ and Yi He</p>
          <p className="text-foreground/80 mb-6 max-w-2xl">
            The partnership that built Binance—both personal and professional.
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            <Button onClick={() => navigate("/book5")} size="lg" variant="gold">
              <Sparkles className="w-4 h-4" />
              Read Now
            </Button>
            <Button onClick={() => navigate("/book5-cn")} size="lg" variant="outline">中文版</Button>
            <Button onClick={() => navigate("/book5-es")} size="lg" variant="outline">Español</Button>
          </div>
          <div className="inline-flex items-center gap-2 bg-card border border-primary/20 rounded-lg px-4 py-2">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-sm">{getTotalViews("book5").toLocaleString()} views</span>
          </div>
        </div>

        {/* Part 6 */}
        <div className="py-16 border-t border-border/40">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 gold-shimmer bg-clip-text text-transparent">
            Book of CZ: Part 6: Killing the FUD
          </h2>
          <p className="text-xl text-muted-foreground mb-2 font-cta">Transparency & Trust</p>
          <p className="text-foreground/80 mb-6 max-w-2xl">
            How CZ's '4' philosophy and Proof of Reserves built unshakeable trust.
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            <Button onClick={() => navigate("/book6")} size="lg" variant="gold">
              <Sparkles className="w-4 h-4" />
              Read Now
            </Button>
            <Button onClick={() => navigate("/book6-cn")} size="lg" variant="outline">中文版</Button>
            <Button onClick={() => navigate("/book6-es")} size="lg" variant="outline">Español</Button>
          </div>
          <div className="inline-flex items-center gap-2 bg-card border border-primary/20 rounded-lg px-4 py-2">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-sm">{getTotalViews("book6").toLocaleString()} views</span>
          </div>
        </div>

        {/* Part 7 */}
        <div className="py-16 border-t border-border/40">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 gold-shimmer bg-clip-text text-transparent">
            Book of CZ: Part 7: Selfies
          </h2>
          <p className="text-xl text-muted-foreground mb-2 font-cta">Moments with the Community</p>
          <p className="text-foreground/80 mb-6 max-w-2xl">
            20 memorable moments showing the human side of crypto.
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            <Button onClick={() => navigate("/book7")} size="lg" variant="gold">
              <Sparkles className="w-4 h-4" />
              Read Now
            </Button>
            <Button onClick={() => navigate("/book7-cn")} size="lg" variant="outline">中文版</Button>
            <Button onClick={() => navigate("/book7-es")} size="lg" variant="outline">Español</Button>
          </div>
          <div className="inline-flex items-center gap-2 bg-card border border-primary/20 rounded-lg px-4 py-2">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-sm">{getTotalViews("book7").toLocaleString()} views</span>
          </div>
        </div>

        {/* Part 8 */}
        <div className="py-16 border-t border-border/40">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 gold-shimmer bg-clip-text text-transparent">
            Book of CZ: Part 8: The CZ Bible
          </h2>
          <p className="text-xl text-muted-foreground mb-2 font-cta">Exclusive Token-Gated Content</p>
          <p className="text-foreground/80 mb-6 max-w-2xl">
            Sacred wisdom and teachings from CZ's journey in cryptocurrency.
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            <Button onClick={() => navigate("/book8")} size="lg" variant="gold">
              <Sparkles className="w-4 h-4" />
              Read Now
            </Button>
            <Button onClick={() => navigate("/book8-cn")} size="lg" variant="outline">中文版</Button>
            <Button onClick={() => navigate("/book8-es")} size="lg" variant="outline">Español</Button>
          </div>
          <div className="inline-flex items-center gap-2 bg-card border border-primary/20 rounded-lg px-4 py-2">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-sm">{getTotalViews("book8").toLocaleString()} views</span>
          </div>
        </div>

        {/* Part 9 */}
        <div className="py-16 border-t border-border/40">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 gold-shimmer bg-clip-text text-transparent">
            Book of CZ: Part 9: Bitcoin Education
          </h2>
          <p className="text-xl text-muted-foreground mb-2 font-cta">Educating People About Bitcoin</p>
          <p className="text-foreground/80 mb-6 max-w-2xl">
            CZ's vision for Bitcoin and the future of financial freedom.
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            <Button onClick={() => navigate("/book9")} size="lg" variant="gold">
              <Sparkles className="w-4 h-4" />
              Read Now
            </Button>
            <Button onClick={() => navigate("/book9-cn")} size="lg" variant="outline">中文版</Button>
            <Button onClick={() => navigate("/book9-es")} size="lg" variant="outline">Español</Button>
          </div>
          <div className="inline-flex items-center gap-2 bg-card border border-primary/20 rounded-lg px-4 py-2">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-sm">{getTotalViews("book9").toLocaleString()} views</span>
          </div>
        </div>

        {/* Part 10 */}
        <div className="py-16 border-t border-border/40">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 gold-shimmer bg-clip-text text-transparent">
            Book of CZ: Part 10: Giggle Academy
          </h2>
          <p className="text-xl text-muted-foreground mb-2 font-cta">Reshaping Education</p>
          <p className="text-foreground/80 mb-6 max-w-2xl">
            Revolutionizing education, making quality learning accessible to everyone.
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            <Button onClick={() => navigate("/book10")} size="lg" variant="gold">
              <Sparkles className="w-4 h-4" />
              Read Now
            </Button>
            <Button onClick={() => navigate("/book10-cn")} size="lg" variant="outline">中文版</Button>
            <Button onClick={() => navigate("/book10-es")} size="lg" variant="outline">Español</Button>
          </div>
          <div className="inline-flex items-center gap-2 bg-card border border-primary/20 rounded-lg px-4 py-2">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-sm">{getTotalViews("book10").toLocaleString()} views</span>
          </div>
        </div>

        {/* Part 11 */}
        <div className="py-16 border-t border-border/40">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 gold-shimmer bg-clip-text text-transparent">
            Book of CZ: Part 11: Bitcoin vs Gold
          </h2>
          <p className="text-xl text-muted-foreground mb-2 font-cta">The Ultimate Debate</p>
          <p className="text-foreground/80 mb-6 max-w-2xl">
            CZ's perspective on Bitcoin versus Gold - the ultimate store of value showdown.
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            <Button onClick={() => navigate("/book11")} size="lg" variant="gold">
              <Sparkles className="w-4 h-4" />
              Read Now
            </Button>
          </div>
          <div className="inline-flex items-center gap-2 bg-card border border-primary/20 rounded-lg px-4 py-2">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-sm">{getTotalViews("book11").toLocaleString()} views</span>
          </div>
        </div>

        {/* Part 12 */}
        <div className="py-16 border-t border-border/40">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 gold-shimmer bg-clip-text text-transparent">
            Book of CZ: Part 12
          </h2>
          <p className="text-xl text-muted-foreground mb-2 font-cta">Pardoned</p>
          <p className="text-foreground/80 mb-6 max-w-2xl">
            The latest chapter in CZ's remarkable journey.
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            <Button onClick={() => navigate("/book12")} size="lg" variant="gold">
              <Sparkles className="w-4 h-4" />
              Read Now
            </Button>
          </div>
          <div className="inline-flex items-center gap-2 bg-card border border-primary/20 rounded-lg px-4 py-2">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-sm">{getTotalViews("book12").toLocaleString()} views</span>
          </div>
        </div>
      </div>

      {/* Roadmap Section */}
      <section id="roadmap" className="container mx-auto px-4 py-20 border-t border-border/40 mt-20">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-center mb-16 gold-shimmer bg-clip-text text-transparent">
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
            <a href="https://x.com/BookOfCZ_BSC" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="X (Twitter)">
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
