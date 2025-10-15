import { useState } from "react";
import { Book } from "@/components/Book";
import { bookContent } from "@/lib/bookContent6";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import bookCover from "@/assets/book5-cover.png";

const BookPage6 = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  if (!showDisclaimer) {
    return <Book content={bookContent} title="Book of CZ: Killing the FUD" coverImage={bookCover} />;
  }

  return (
    <>
      <div className="fixed top-16 left-0 right-0 z-10 px-4 py-2 bg-background/95 backdrop-blur">
        <Alert className="max-w-4xl mx-auto relative">
          <Info className="h-4 w-4" />
          <AlertDescription className="pr-8">
            <strong>Disclaimer:</strong> This is a fictionalized account inspired by real events. 
            While major milestones (CZ's "4" tweet January 2023, Proof of Reserves implementation, 
            FUD response strategies) are factual, personal details and conversations are creative interpretations.
          </AlertDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={() => setShowDisclaimer(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      </div>
      <div className="pt-20">
        <Book content={bookContent} title="Book of CZ: Killing the FUD" coverImage={bookCover} />
      </div>
    </>
  );
};

export default BookPage6;
