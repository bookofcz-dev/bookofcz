import { Book } from "@/components/Book";
import { bookContent4CN } from "@/lib/bookContent4CN";

const BookPage4CN = () => {
  return (
    <div className="min-h-screen bg-background">
      <Book content={bookContent4CN} title="CZ的44句智慧之言" />
    </div>
  );
};

export default BookPage4CN;
