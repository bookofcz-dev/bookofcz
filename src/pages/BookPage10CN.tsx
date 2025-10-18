import { Book } from "@/components/Book";
import { bookContent10CN } from "@/lib/bookContent10CN";
import bookCover from "@/assets/book10-cover.png";

const BookPage10CN = () => {
  return <Book content={bookContent10CN} coverImage={bookCover} title="CZ之书10：用CZ的Giggle重塑教育" />;
};

export default BookPage10CN;
