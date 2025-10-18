import { Book } from "@/components/Book";
import { bookContent4CN } from "@/lib/bookContent4CN";
import bookCover from "@/assets/book4-cover.png";

const BookPage4CN = () => {
  return (
    <div className="min-h-screen bg-background">
      <Book 
        content={bookContent4CN} 
        title="CZ的44句智慧之言" 
        coverImage={bookCover}
        bookId="book4-cn"
      />
    </div>
  );
};

export default BookPage4CN;
