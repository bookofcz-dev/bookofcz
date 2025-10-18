import { Book } from "@/components/Book";
import { bookContent } from "@/lib/bookContent";

const BookPage = () => {
  return <Book content={bookContent} title="Book of CZ: Part 1" bookId="book1-en" />;
};

export default BookPage;
