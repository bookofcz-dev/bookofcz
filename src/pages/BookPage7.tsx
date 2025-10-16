import { Book } from "@/components/Book";
import { bookContent } from "@/lib/bookContent7";
import bookCover from "@/assets/book7-cover.png";

const BookPage7 = () => {
  return <Book content={bookContent} title="Book of CZ: Selfies with CZ" coverImage={bookCover} />;
};

export default BookPage7;
