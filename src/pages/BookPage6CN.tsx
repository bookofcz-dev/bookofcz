import { Book } from "@/components/Book";
import { bookContent } from "@/lib/bookContent6CN";
import bookCover from "@/assets/book6-cover.png";

const BookPage6CN = () => {
  return <Book content={bookContent} title="CZ之书：击杀FUD" coverImage={bookCover} bookId="book6-cn" />;
};

export default BookPage6CN;
