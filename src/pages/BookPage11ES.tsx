import { Book } from "@/components/Book";
import { bookContent11ES } from "@/lib/bookContent11ES";
import bookCover from "@/assets/book11-cover.png";

const BookPage11ES = () => {
  return (
    <div className="min-h-screen bg-background">
      <Book 
        content={bookContent11ES} 
        title="Libro de CZ 11: Bitcoin vs Oro - El Debate Definitivo" 
        coverImage={bookCover}
        bookId="book11-es"
      />
    </div>
  );
};

export default BookPage11ES;
