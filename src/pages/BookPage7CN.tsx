import { Book } from "@/components/Book";
import { bookContent } from "@/lib/bookContent7CN";
import bookCover from "@/assets/book7-cover.png";

const BookPage7CN = () => {
  return <Book content={bookContent} title="CZ之书：与CZ的自拍" coverImage={bookCover} />;
};

export default BookPage7CN;
