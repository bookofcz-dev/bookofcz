import { Book } from "@/components/Book";
import { bookContentCN } from "@/lib/bookContentCN";

const BookPageCN = () => {
  return <Book content={bookContentCN} title="CZ之书：第一部" />;
};

export default BookPageCN;
