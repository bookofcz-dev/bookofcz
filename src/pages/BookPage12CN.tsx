import { Book } from "@/components/Book";
import { bookContent12CN } from "@/lib/bookContent12CN";
import bookCover from "@/assets/book12-cover.png";

const BookPage12CN = () => {
  return (
    <div className="min-h-screen bg-background">
      <Book 
        content={bookContent12CN} 
        title="CZ之书 12：CZ的赦免 - 救赎故事" 
        coverImage={bookCover}
        bookId="book12-cn"
      />
    </div>
  );
};

export default BookPage12CN;
