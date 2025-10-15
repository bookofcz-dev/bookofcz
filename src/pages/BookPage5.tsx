import { Book } from "@/components/Book";
import { bookContent } from "@/lib/bookContent5";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const BookPage5 = () => {
  return (
    <>
      <div className="fixed top-16 left-0 right-0 z-10 px-4 py-2 bg-background/95 backdrop-blur">
        <Alert className="max-w-4xl mx-auto">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Disclaimer:</strong> This is a fictionalized account inspired by real events. 
            While major milestones (Binance founding July 2017, BSC launch September 2020, October 2025 achievements) 
            are factual, personal details and conversations are creative interpretations.
          </AlertDescription>
        </Alert>
      </div>
      <div className="pt-20">
        <Book content={bookContent} title="Book of CZ: The Partnership" />
      </div>
    </>
  );
};

export default BookPage5;
