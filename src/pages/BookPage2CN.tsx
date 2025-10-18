import { Book } from "@/components/Book";
import { bookContent2CN } from "@/lib/bookContent2CN";

const BookPage2CN = () => {
  return <Book content={bookContent2CN} title="CZ之书：第二部" bookId="book2-cn" />;
};

export default BookPage2CN;
