import { Book } from "@/components/Book";
import { bookContent12 } from "@/lib/bookContent12";
import bookCover from "@/assets/book12-cover.png";

const BookPage12 = () => {
  return (
    <div className="min-h-screen bg-background">
      <Book 
        content={bookContent12} 
        title="Book of CZ 12: CZ's Pardon - A Story of Redemption" 
        coverImage={bookCover}
        bookId="book12-en"
      />
    </div>
  );
};

export default BookPage12;
