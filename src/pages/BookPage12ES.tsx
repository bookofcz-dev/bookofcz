import { Book } from "@/components/Book";
import { bookContent12ES } from "@/lib/bookContent12ES";
import bookCover from "@/assets/book12-cover.png";

const BookPage12ES = () => {
  return (
    <div className="min-h-screen bg-background">
      <Book 
        content={bookContent12ES} 
        title="Libro de CZ 12: El Perdón de CZ - Una Historia de Redención" 
        coverImage={bookCover}
        bookId="book12-es"
      />
    </div>
  );
};

export default BookPage12ES;
