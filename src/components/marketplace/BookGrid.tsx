import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BookCard } from './BookCard';
import { Loader2 } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  description: string;
  author: string;
  cover_url: string;
  price_usdt: number;
  price_bnb: number;
  category: string;
  average_rating: number;
  review_count: number;
  creator_wallet: string;
}

interface BookGridProps {
  category: string;
  searchQuery: string;
  account: string | null;
}

export const BookGrid = ({ category, searchQuery, account }: BookGridProps) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, [category, searchQuery]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('marketplace_books')
        .select('*')
        .eq('approval_status', 'approved')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (category !== 'all') {
        query = query.eq('category', category);
      }

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No books found in this category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} account={account || ''} />
      ))}
    </div>
  );
};
