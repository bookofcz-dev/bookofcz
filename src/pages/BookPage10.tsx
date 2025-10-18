import { Book } from "@/components/Book";
import { bookContent10 } from "@/lib/bookContent10";
import bookCover from "@/assets/book10-cover.png";

const BookPage10 = () => {
  return <Book content={bookContent10} coverImage={bookCover} title="Book of CZ 10: Reshaping Education with CZ's Giggle" />;
};

export default BookPage10;
