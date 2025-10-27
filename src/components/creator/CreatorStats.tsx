import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, DollarSign, Download, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Book {
  id: string;
  price_bnb: number;
  approval_status: string;
  average_rating: number;
  review_count: number;
  download_count: number;
}

interface CreatorStatsProps {
  books: Book[];
}

export const CreatorStats = ({ books }: CreatorStatsProps) => {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    const fetchEarnings = async () => {
      if (books.length === 0) return;

      const bookIds = books.map(b => b.id);
      
      const { data, error } = await supabase
        .from('marketplace_purchases')
        .select('creator_amount, book_id')
        .in('book_id', bookIds);

      if (error) {
        console.error('Error fetching earnings:', error);
        return;
      }

      const earnings = data?.reduce((sum, p) => sum + Number(p.creator_amount), 0) || 0;
      setTotalEarnings(earnings);
      setTotalSales(data?.length || 0);
    };

    fetchEarnings();
  }, [books]);

  const approvedBooks = books.filter(b => b.approval_status === 'approved').length;
  const avgRating = books.length > 0
    ? books.reduce((sum, b) => sum + (b.average_rating || 0), 0) / books.length
    : 0;

  const stats = [
    {
      title: 'Total Books',
      value: books.length.toString(),
      subtitle: `${approvedBooks} approved`,
      icon: BookOpen,
      color: 'text-blue-500',
    },
    {
      title: 'Total Sales',
      value: totalSales.toString(),
      subtitle: 'All time',
      icon: Download,
      color: 'text-green-500',
    },
    {
      title: 'Total Earnings',
      value: `${totalEarnings.toFixed(2)} USDT`,
      subtitle: 'After 4% platform fee',
      icon: DollarSign,
      color: 'text-yellow-500',
    },
    {
      title: 'Average Rating',
      value: avgRating > 0 ? avgRating.toFixed(1) : 'N/A',
      subtitle: `${books.reduce((sum, b) => sum + (b.review_count || 0), 0)} reviews`,
      icon: Star,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
