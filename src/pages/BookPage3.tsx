import { Book } from "@/components/Book";
import { bookContent3 } from "@/lib/bookContent3";

const BookPage3 = () => {
  return (
    <div className="min-h-screen bg-background">
      <Book content={bookContent3} title="Book of CZ: Part 3 - The Awakening" />
    </div>
  );
};

export default BookPage3;
