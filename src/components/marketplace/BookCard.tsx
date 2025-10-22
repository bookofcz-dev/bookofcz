import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Download, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Book {
  id: string;
  title: string;
  description: string;
  author: string;
  cover_url: string;
  price_bnb: number;
  category: string;
  average_rating: number;
  review_count: number;
  download_count?: number;
  creator_wallet?: string;
}

interface BookCardProps {
  book: Book;
  account: string;
}

export const BookCard = ({ book, account }: BookCardProps) => {
  return (
    <Link to={`/marketplace/book/${book.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
        <CardContent className="p-4">
          <div className="aspect-[2/3] mb-4 overflow-hidden rounded-md bg-muted relative">
            <img
              src={book.cover_url}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {(!book.creator_wallet || book.creator_wallet === '' || book.creator_wallet === '0x0000000000000000000000000000000000000000') && (
              <div className="absolute top-4 right-4 bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-md font-bold text-sm shadow-lg rotate-12 transform">
                SAMPLE
              </div>
            )}
          </div>
          
          <Badge variant="secondary" className="mb-2 capitalize">
            {book.category}
          </Badge>
          
          <h3 className="font-semibold text-lg mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-2">by {book.author}</p>
          
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {book.description}
          </p>

          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{book.average_rating.toFixed(1)}</span>
            <span>({book.review_count} reviews)</span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            {book.price_bnb === 0 ? 'FREE' : `${book.price_bnb} BNB`}
          </div>
          <Button size="sm" className="gap-2">
            <Eye className="h-4 w-4" />
            View
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};
