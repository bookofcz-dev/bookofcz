import { Book } from "@/components/Book";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { bookContent, title, coverImage } from "@/lib/bookContent9ES";

const BookPage9ES = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate("/")}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a la Colección
        </Button>
        <Book content={bookContent} title={title} coverImage={coverImage} bookId="book9-es" />
      </div>
    </div>
  );
};

export default BookPage9ES;