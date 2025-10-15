import { useState } from "react";
import { Book } from "@/components/Book";
import { bookContent } from "@/lib/bookContent6CN";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import bookCover from "@/assets/book6-cover.png";

const BookPage6CN = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  if (!showDisclaimer) {
    return <Book content={bookContent} title="CZ之书：击杀FUD" coverImage={bookCover} />;
  }

  return (
    <>
      <div className="fixed top-16 left-0 right-0 z-10 px-4 py-2 bg-background/95 backdrop-blur">
        <Alert className="max-w-4xl mx-auto relative">
          <Info className="h-4 w-4" />
          <AlertDescription className="pr-8">
            <strong>免责声明：</strong>这是根据真实事件改编的虚构故事。
            虽然主要里程碑（CZ于2023年1月发布"4"推文、储备证明实施、FUD回应策略）是事实，
            但个人细节和对话是创意性诠释。
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
        <Book content={bookContent} title="CZ之书：击杀FUD" coverImage={bookCover} />
      </div>
    </>
  );
};

export default BookPage6CN;
