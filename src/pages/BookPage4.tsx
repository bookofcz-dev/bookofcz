import { Book } from "@/components/Book";
import { bookContent4 } from "@/lib/bookContent4";

const BookPage4 = () => {
  return (
    <div className="min-h-screen bg-background">
      <Book content={bookContent4} title="44 Words of Wisdom from CZ" />
    </div>
  );
};

export default BookPage4;
