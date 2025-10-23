import { Book } from "@/components/Book";
import { bookContent11 } from "@/lib/bookContent11";
import bookCover from "@/assets/book11-cover.png";

const BookPage11 = () => {
  return (
    <div className="min-h-screen bg-background">
      <Book 
        content={bookContent11} 
        title="Book of CZ 11: Bitcoin vs Gold - The Ultimate Debate" 
        coverImage={bookCover}
        bookId="book11-en"
      />
    </div>
  );
};

export default BookPage11;
