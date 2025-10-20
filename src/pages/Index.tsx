import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, Eye } from "lucide-react";
import { X } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAllBookViews } from "@/hooks/useBookViews";
import { FeaturedBooks } from "@/components/FeaturedBooks";

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Book logo with glow effect */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary blur-2xl opacity-50 animate-pulse" />
            <img src={logo} alt="Book of CZ Logo" className="w-96 h-96 relative" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
          Book of CZ
        </h1>

        {/* Description */}
        <p className="text-lg text-muted-foreground mb-4 animate-fade-in">
          A collection of mini books about CZ, Binance, and crypto in general.
        </p>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-4 animate-fade-in">
          The Extraordinary Journey of Changpeng Zhao
        </p>

        {/* Community Links & Contract Address */}
        <div className="mb-12 space-y-4 max-w-2xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <Button
              onClick={() => window.open("https://www.dextools.io/app/en/bnb/pair-explorer/0x9eed59058fc57c4bbaf92ea706e21d788fb6f278?t=1760721277896", "_blank")}
              variant="outline"
              size="lg"
              className="gap-2 hover:scale-105 transition-all duration-300"
            >
              <BookOpen className="w-4 h-4" />
              Dextools
            </Button>
            <Button
              onClick={() => window.open("https://t.me/BOCZ_BookOfCZ", "_blank")}
              variant="outline"
              size="lg"
              className="gap-2 hover:scale-105 transition-all duration-300"
            >
              <X className="w-4 h-4" />
              Telegram
            </Button>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Contract Address (CA)</p>
            <code className="text-sm text-foreground font-mono break-all">
              0x701bE97c604A35aB7BCF6C75cA6de3aba0704444
            </code>
          </div>
        </div>

        {/* Featured Books Section */}
        <FeaturedBooks bookViews={bookViews} />

        {/* Part 1 Section */}
        <div className="mt-24 pt-16 border-t border-border/50">
          <div className="mb-8">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Book of CZ: Part 1
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              The Beginning
            </p>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">
              From humble beginnings to building the world's largest cryptocurrency exchange. An interactive 100-page chronicle of ambition, innovation, and resilience.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mb-4">
          <Button
            onClick={() => navigate("/book")}
            size="lg"
            className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/50"
          >
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Open Book of CZ Part 1
            <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </Button>
          <Button
            onClick={() => navigate("/book-cn")}
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg"
          >
            中文版
          </Button>
          <Button
            onClick={() => navigate("/book-es")}
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg"
          >
              Español
            </Button>
          </div>
          
          {/* View Counter */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2 shadow-lg">
              <Eye className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{getTotalViews("book1").toLocaleString()} views</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">100</div>
            <div className="text-sm text-muted-foreground">Pages</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">6</div>
            <div className="text-sm text-muted-foreground">Chapters</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">1</div>
            <div className="text-sm text-muted-foreground">Legend</div>
          </div>
        </div>
      </div>

        {/* Part 2 Preview Section */}
        <div className="mt-24 pt-16 border-t border-border/50">
          <div className="mb-8">
            <div className="inline-block px-4 py-2 bg-accent rounded-full text-accent-foreground text-sm font-semibold mb-4 animate-pulse">
              Now Available
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
              Book of CZ: Part 2
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              The Return & Resurgence
            </p>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">
              Witness the triumphant return of CZ and the rebirth of Binance Season. 
              From adversity to ascendancy, experience the resurgence that echoes the 
              legendary bull run of 2021. The story continues...
            </p>

            {/* CTA Buttons for Part 2 */}
            <div className="flex flex-wrap gap-4 justify-center mb-4">
              <Button
                onClick={() => navigate("/book2")}
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg border-accent hover:bg-accent/10"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Read Part 2
                <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Button>
              <Button
                onClick={() => navigate("/book2-cn")}
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg"
              >
                中文版
              </Button>
              <Button
                onClick={() => navigate("/book2-es")}
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Español
              </Button>
            </div>
            
            {/* View Counter */}
            <div className="flex justify-center">
              <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2 shadow-lg">
                <Eye className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">{getTotalViews("book2").toLocaleString()} views</span>
              </div>
            </div>
          </div>

          {/* Part 2 Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">44</div>
              <div className="text-sm text-muted-foreground">Pages</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">4</div>
              <div className="text-sm text-muted-foreground">Chapters</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">1</div>
              <div className="text-sm text-muted-foreground">Movement</div>
            </div>
          </div>
        </div>

        {/* Part 3 Preview Section */}
        <div className="mt-24 pt-16 border-t border-border/50">
          <div className="mb-8">
            <div className="inline-block px-4 py-2 bg-accent rounded-full text-accent-foreground text-sm font-semibold mb-4 animate-pulse">
              Now Available
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Book of CZ: Part 3
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              The Awakening: CZ's new take on Memes
            </p>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">
              Witness CZ's transformative journey as $GIGGLE donates over $10M USD to his 
              company Giggle Academy, fundamentally shifting his perspective on meme coins. 
              From skeptic to believer, discover how the power of community-driven projects 
              changed everything. This is the story CZ himself is writing in the Book of CZ.
            </p>

            {/* CTA Buttons for Part 3 */}
            <div className="flex flex-wrap gap-4 justify-center mb-4">
              <Button
                onClick={() => navigate("/book3")}
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg border-accent hover:bg-accent/10"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Read Part 3
                <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Button>
              <Button
                onClick={() => navigate("/book3-cn")}
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg"
              >
                中文版
              </Button>
              <Button
                onClick={() => navigate("/book3-es")}
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Español
              </Button>
            </div>
            
            {/* View Counter */}
            <div className="flex justify-center mb-12">
              <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2 shadow-lg">
                <Eye className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">{getTotalViews("book3").toLocaleString()} views</span>
              </div>
            </div>

            {/* Part 3 Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">44</div>
                <div className="text-sm text-muted-foreground">Pages</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">$10M+</div>
                <div className="text-sm text-muted-foreground">Donated</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">1</div>
                <div className="text-sm text-muted-foreground">Revolution</div>
              </div>
            </div>
          </div>
        </div>

        {/* Part 4 Preview Section */}
        <div className="mt-24 pt-16 border-t border-border/50">
          <div className="mb-8">
            <div className="inline-block px-4 py-2 bg-primary rounded-full text-primary-foreground text-sm font-semibold mb-4 animate-pulse">
              Preview Available
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Book of CZ: 44 Words of Wisdom
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              Inspiring Quotes from the Crypto Legend
            </p>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">
              A collection of 44 inspiring quotes coming from CZ himself that can help people 
              in their journey to crypto. Discover the wisdom, philosophy, and mindset that 
              built a revolution and inspired millions worldwide.
            </p>

            {/* CTA Buttons for Part 4 */}
            <div className="flex flex-wrap gap-4 justify-center mb-4">
              <Button
                onClick={() => navigate("/book4")}
                size="lg"
                className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/50"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Read the Wisdom
                <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Button>
              <Button
                onClick={() => navigate("/book4-cn")}
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg"
              >
                中文版
              </Button>
              <Button
                onClick={() => navigate("/book4-es")}
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Español
              </Button>
            </div>
            
            {/* View Counter */}
            <div className="flex justify-center">
              <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2 shadow-lg">
                <Eye className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{getTotalViews("book4").toLocaleString()} views</span>
              </div>
            </div>
          </div>

          {/* Part 4 Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">44</div>
              <div className="text-sm text-muted-foreground">Quotes</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">∞</div>
              <div className="text-sm text-muted-foreground">Wisdom</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">1</div>
              <div className="text-sm text-muted-foreground">Legend</div>
            </div>
          </div>
        </div>

        {/* Part 5 Preview Section */}
        <div className="mt-24 pt-16 border-t border-border/50">
          <div className="mb-8">
            <div className="inline-block px-4 py-2 bg-accent rounded-full text-accent-foreground text-sm font-semibold mb-4 animate-pulse">
              Now Available
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
              Book of CZ: Part 5
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              The Uncharted Romance of CZ and Yi He
            </p>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">
              Discover the untold story of CZ and Yi He's partnership—both personal and professional. 
              From their first meeting to building Binance together, witness how their shared vision 
              and mutual respect created the world's largest crypto exchange. Experience the BSC 
              journey reaching new ATHs in October 2025. A love story of innovation, trust, and triumph.
            </p>

            {/* CTA Buttons for Part 5 */}
            <div className="flex flex-wrap gap-4 justify-center mb-4">
              <Button
                onClick={() => navigate("/book5")}
                size="lg"
                className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-accent/50"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Read Their Story
                <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Button>
              <Button
                onClick={() => navigate("/book5-cn")}
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg"
              >
                中文版
              </Button>
              <Button
                onClick={() => navigate("/book5-es")}
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Español
              </Button>
            </div>
            
            {/* View Counter */}
            <div className="flex justify-center">
              <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2 shadow-lg">
                <Eye className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">{getTotalViews("book5").toLocaleString()} views</span>
              </div>
            </div>
          </div>

          {/* Part 5 Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">44</div>
              <div className="text-sm text-muted-foreground">Pages</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">ATH</div>
              <div className="text-sm text-muted-foreground">Oct 2025</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">2</div>
              <div className="text-sm text-muted-foreground">Legends</div>
            </div>
          </div>
        </div>

        {/* Part 6 Preview Section */}
        <div className="mt-24 pt-16 border-t border-border/50">
          <div className="mb-8">
            <div className="inline-block px-4 py-2 bg-primary rounded-full text-primary-foreground text-sm font-semibold mb-4 animate-pulse">
              Now Available
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Book of CZ: Part 6
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              Killing the FUD
            </p>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">
              Experience CZ's legendary "4" philosophy in action. From the genesis of his New Year's 
              resolution to systematic FUD-fighting strategies, discover how Binance pioneered Proof 
              of Reserves and transformed transparency in crypto. Witness how CZ and Yi He's complementary 
              approaches built trust through data, not PR—making FUD irrelevant through relentless building.
            </p>

            {/* CTA Buttons for Part 6 */}
            <div className="flex flex-wrap gap-4 justify-center mb-4">
              <Button
                onClick={() => navigate("/book6")}
                size="lg"
                className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/50"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Read the Battle
                <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Button>
              <Button
                onClick={() => navigate("/book6-cn")}
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg"
              >
                中文版
              </Button>
              <Button
                onClick={() => navigate("/book6-es")}
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Español
              </Button>
            </div>
            
            {/* View Counter */}
            <div className="flex justify-center">
              <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2 shadow-lg">
                <Eye className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{getTotalViews("book6").toLocaleString()} views</span>
              </div>
            </div>
          </div>

          {/* Part 6 Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">44</div>
              <div className="text-sm text-muted-foreground">Pages</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">100%+</div>
              <div className="text-sm text-muted-foreground">PoR</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">4</div>
              <div className="text-sm text-muted-foreground">Philosophy</div>
            </div>
          </div>
        </div>

        {/* Part 7 Preview Section */}
        <div className="mt-24 pt-16 border-t border-border/50">
          <div className="mb-8">
            <div className="inline-block px-4 py-2 bg-accent rounded-full text-accent-foreground text-sm font-semibold mb-4 animate-pulse">
              Preview Available
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent">
              Book of CZ: Selfies with CZ
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              A Collection of Moments with the Community
            </p>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">
              From medical settings to conferences, from casual meetups to official events, 
              these selfies tell stories of connection, community, and the human side of crypto. 
              Experience 10 memorable moments from the CZ community, with more coming soon!
            </p>

            {/* CTA Buttons for Part 7 */}
            <div className="flex flex-wrap gap-4 justify-center mb-4">
              <Button
                onClick={() => navigate("/book7")}
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg border-accent hover:bg-accent/10"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                View Selfies
                <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Button>
              <Button
                onClick={() => navigate("/book7-cn")}
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg"
              >
                中文版
              </Button>
              <Button
                onClick={() => navigate("/book7-es")}
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Español
              </Button>
            </div>
            
            {/* View Counter */}
            <div className="flex justify-center">
              <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2 shadow-lg">
                <Eye className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">{getTotalViews("book7").toLocaleString()} views</span>
              </div>
            </div>
          </div>

          {/* Part 7 Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">20</div>
              <div className="text-sm text-muted-foreground">Selfies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">44</div>
              <div className="text-sm text-muted-foreground">Goal</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">∞</div>
              <div className="text-sm text-muted-foreground">Community</div>
            </div>
          </div>
        </div>

        {/* Part 8 - CZ Bible (Token Gated) */}
        <div className="mt-24 pt-16 border-t border-border/50">
          <div className="mb-8">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-primary to-accent rounded-full text-primary-foreground text-sm font-semibold mb-4 animate-pulse">
              🔒 Exclusive - Token Gated
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Book of CZ: Part 8
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              The CZ Bible 📖
            </p>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">
              A sacred collection of wisdom, teachings, and insights from CZ's journey 
              in the world of cryptocurrency and beyond. This exclusive chapter is 
              token-gated and requires holding Book of CZ tokens on BSC.
            </p>

            {/* CTA Buttons for Part 8 */}
            <div className="flex flex-wrap gap-4 justify-center mb-4">
              <Button
                onClick={() => navigate("/book8")}
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg border-primary hover:bg-primary/10"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Unlock the Bible
                <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Button>
              <Button
                onClick={() => navigate("/book8-cn")}
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg"
              >
                中文版
              </Button>
              <Button
                onClick={() => navigate("/book8-es")}
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Español
              </Button>
            </div>
            
            {/* View Counter */}
            <div className="flex justify-center">
              <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2 shadow-lg">
                <Eye className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{getTotalViews("book8").toLocaleString()} views</span>
              </div>
            </div>
          </div>

          {/* Part 8 Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">🔐</div>
              <div className="text-sm text-muted-foreground">Token Gated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">44,444</div>
              <div className="text-sm text-muted-foreground">Min. Tokens</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">BSC</div>
              <div className="text-sm text-muted-foreground">Network</div>
            </div>
          </div>
        </div>

        {/* Part 9 - Educating People About Bitcoin */}
        <div className="mt-24 pt-16 border-t border-border/50">
          <div className="mb-8">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-white text-sm font-semibold mb-4 animate-pulse">
              ₿ New Release
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Book of CZ: Part 9
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              Educating People About Bitcoin
            </p>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">
              CZ's vision for Bitcoin and the future of financial freedom. A comprehensive 
              guide exploring why Bitcoin matters, how it works, and why educating people 
              about it is one of the most important missions of our time.
            </p>

            {/* CTA Buttons for Part 9 */}
            <div className="flex flex-wrap gap-4 justify-center mb-4">
              <Button
                onClick={() => navigate("/book9")}
                size="lg"
                className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-orange-500/50 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Learn About Bitcoin
                <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Button>
              <Button
                onClick={() => navigate("/book9-cn")}
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg"
              >
                中文版
              </Button>
              <Button
                onClick={() => navigate("/book9-es")}
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Español
              </Button>
            </div>
            
            {/* View Counter */}
            <div className="flex justify-center">
              <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2 shadow-lg">
                <Eye className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">{getTotalViews("book9").toLocaleString()} views</span>
              </div>
            </div>
          </div>

          {/* Part 9 Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">44</div>
              <div className="text-sm text-muted-foreground">Pages</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">₿</div>
              <div className="text-sm text-muted-foreground">Bitcoin Focus</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">💡</div>
              <div className="text-sm text-muted-foreground">Education</div>
            </div>
          </div>
        </div>

        {/* Part 10 - Giggle Academy */}
        <div className="mt-24 pt-16 border-t border-border/50">
          <div className="mb-8">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-yellow-500 rounded-full text-white text-sm font-semibold mb-4 animate-pulse">
              🎓 Educational Revolution
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent">
              Book of CZ: Part 10
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              Reshaping Education with CZ's Giggle Academy
            </p>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto mb-8">
              Discover how CZ is revolutionizing education through Giggle Academy, making 
              quality learning accessible to everyone, everywhere. From his vision to the 
              platform's innovative features, witness how one man's commitment to education 
              is creating a lasting legacy that transcends cryptocurrency.
            </p>

            {/* CTA Buttons for Part 10 */}
            <div className="flex flex-wrap gap-4 justify-center mb-4">
              <Button
                onClick={() => navigate("/book10")}
                size="lg"
                className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 bg-gradient-to-r from-blue-500 to-yellow-500 hover:from-blue-600 hover:to-yellow-600"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Explore Giggle Academy
                <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Button>
              <Button
                onClick={() => navigate("/book10-cn")}
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg"
              >
                中文版
              </Button>
              <Button
                onClick={() => navigate("/book10-es")}
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Español
              </Button>
            </div>
            
            {/* View Counter */}
            <div className="flex justify-center">
              <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2 shadow-lg">
                <Eye className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">{getTotalViews("book10").toLocaleString()} views</span>
              </div>
            </div>
          </div>

          {/* Part 10 Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500 mb-2">44</div>
              <div className="text-sm text-muted-foreground">Pages</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-500 mb-2">🌍</div>
              <div className="text-sm text-muted-foreground">Global Impact</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500 mb-2">🎓</div>
              <div className="text-sm text-muted-foreground">Free Education</div>
            </div>
          </div>
        </div>

        {/* Social Link */}
        <div className="mt-12 flex justify-center">
          <a
            href="https://x.com/BOCZ_BookOfCZ"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
          >
            <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Follow us on X</span>
          </a>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              Support: <a href="mailto:support@bookofcz.live" className="text-primary hover:underline">support@bookofcz.live</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
