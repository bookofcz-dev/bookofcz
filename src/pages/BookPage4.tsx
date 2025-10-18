import { Book } from "@/components/Book";
import { bookContent4 } from "@/lib/bookContent4";
import bookCover from "@/assets/book4-cover.png";

const BookPage4 = () => {
  return (
    <div className="min-h-screen bg-background">
      <Book 
        content={bookContent4} 
        title="Book of CZ: 44 Words of Wisdom" 
        coverImage={bookCover}
        bookId="book4-en"
      />
    </div>
  );
};

export default BookPage4;
