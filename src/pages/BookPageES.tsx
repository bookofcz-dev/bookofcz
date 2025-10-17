import { Book } from "@/components/Book";
import { bookContent } from "@/lib/bookContentES";

const BookPageES = () => {
  return <Book content={bookContent} title="Libro de CZ: Parte 1" />;
};

export default BookPageES;