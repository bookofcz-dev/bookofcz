import { Book } from "@/components/Book";
import { bookContent11CN } from "@/lib/bookContent11CN";
import bookCover from "@/assets/book11-cover.png";

const BookPage11CN = () => {
  return (
    <div className="min-h-screen bg-background">
      <Book 
        content={bookContent11CN} 
        title="CZ之书 11：比特币 vs 黄金 - 终极辩论" 
        coverImage={bookCover}
        bookId="book11-cn"
      />
    </div>
  );
};

export default BookPage11CN;
