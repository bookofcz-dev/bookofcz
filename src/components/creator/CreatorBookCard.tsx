import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, ExternalLink, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Book {
  id: string;
  title: string;
  description: string;
  author: string;
  cover_url: string;
  pdf_url: string;
  price_usdt: number;
  price_bnb: number;
  category: string;
  creator_wallet: string;
  approval_status: string;
  created_at: string;
  average_rating: number;
  review_count: number;
  download_count: number;
  rejection_reason?: string;
  is_public: boolean;
}

interface CreatorBookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
}

export const CreatorBookCard = ({ book, onEdit }: CreatorBookCardProps) => {
  const [actualEarnings, setActualEarnings] = useState(0);
  const [actualSales, setActualSales] = useState(0);

  useEffect(() => {
    const fetchBookEarnings = async () => {
      const { data, error } = await supabase
        .from('marketplace_purchases')
        .select('creator_amount')
        .eq('book_id', book.id);

      if (error) {
        console.error('Error fetching book earnings:', error);
        return;
      }

      const earnings = data?.reduce((sum, p) => sum + Number(p.creator_amount), 0) || 0;
      setActualEarnings(earnings);
      setActualSales(data?.length || 0);
    };

    fetchBookEarnings();
  }, [book.id]);

  const priceUSDT = book.price_usdt || book.price_bnb;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4">
            <img 
              src={book.cover_url} 
              alt={book.title}
              className="w-20 h-28 object-cover rounded"
            />
            <div className="flex-1">
              <CardTitle className="text-lg mb-1">{book.title}</CardTitle>
              <p className="text-sm text-muted-foreground mb-2">by {book.author}</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{book.category}</Badge>
                <Badge variant={
                  book.approval_status === 'approved' ? 'default' :
                  book.approval_status === 'rejected' ? 'destructive' : 'secondary'
                }>
                  {book.approval_status}
                </Badge>
                <Badge variant={book.is_public ? 'default' : 'secondary'} className="gap-1">
                  {book.is_public ? (
                    <>
                      <Eye className="h-3 w-3" />
                      Public
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3" />
                      Private
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Price</p>
            <p className="font-semibold">{priceUSDT} USDT</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Sales</p>
            <p className="font-semibold">{actualSales}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Rating</p>
            <p className="font-semibold">
              {book.average_rating > 0 ? `${book.average_rating.toFixed(1)} ⭐` : 'No ratings'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Earnings</p>
            <p className="font-semibold text-primary">{actualEarnings.toFixed(2)} USDT</p>
          </div>
        </div>

        {book.rejection_reason && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded">
            <p className="text-sm font-semibold text-destructive mb-1">Rejection Reason:</p>
            <p className="text-sm text-muted-foreground">{book.rejection_reason}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(book)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={book.cover_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Files
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
