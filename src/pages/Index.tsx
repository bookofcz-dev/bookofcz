import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles } from "lucide-react";
import { X } from "lucide-react";
import logo from "@/assets/logo.png";

const Index = () => {
  const navigate = useNavigate();

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

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-4 animate-fade-in">
          The Extraordinary Journey of Changpeng Zhao
        </p>

        <p className="text-lg text-foreground/80 mb-12 max-w-2xl mx-auto animate-fade-in">
          From humble beginnings to building the world's largest cryptocurrency exchange.
          An interactive 100-page chronicle of ambition, innovation, and resilience.
        </p>

        {/* CTA Button */}
        <Button
          onClick={() => navigate("/book")}
          size="lg"
          className="text-lg px-8 py-6 gap-3 group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/50"
        >
          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          Open the Book
          <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </Button>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
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

            {/* CTA Button for Part 2 */}
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
      </div>
    </div>
  );
};

export default Index;
