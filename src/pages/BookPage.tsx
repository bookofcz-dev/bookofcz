import { Book } from "@/components/Book";
import { bookContent } from "@/lib/bookContent";

const BookPage = () => {
  return <Book content={bookContent} title="Book of CZ: Part 1" />;
};

export default BookPage;
