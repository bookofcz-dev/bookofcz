import { Book } from "@/components/Book";
import { bookContent10ES } from "@/lib/bookContent10ES";
import bookCover from "@/assets/book10-cover.png";

const BookPage10ES = () => {
  return <Book content={bookContent10ES} coverImage={bookCover} title="Libro de CZ 10: Remodelando la Educación con Giggle de CZ" />;
};

export default BookPage10ES;
