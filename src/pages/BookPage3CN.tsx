import { Book } from "@/components/Book";
import { bookContent3CN } from "@/lib/bookContent3CN";

const BookPage3CN = () => {
  return (
    <div className="min-h-screen bg-background">
      <Book content={bookContent3CN} title="CZ之书：第三部分 - 觉醒" />
    </div>
  );
};

export default BookPage3CN;
