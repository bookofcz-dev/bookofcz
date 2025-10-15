import { Book } from "@/components/Book";
import { bookContent } from "@/lib/bookContent6";
import bookCover from "@/assets/book6-cover.png";

const BookPage6 = () => {
  return <Book content={bookContent} title="Book of CZ: Killing the FUD" coverImage={bookCover} />;
};

export default BookPage6;
