import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, DollarSign, Download, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Book {
  id: string;
  price_bnb: number;
  price_usdt: number;
  approval_status: string;
  average_rating: number;
  review_count: number;
  download_count: number;
}

interface CreatorStatsProps {
  books: Book[];
}

export const CreatorStats = ({ books }: CreatorStatsProps) => {
  const [totalEarnings, setTotalEarnings] = useState({ bnb: 0, usdt: 0, bocz: 0 });
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    const fetchEarnings = async () => {
      if (books.length === 0) return;

      const bookIds = books.map(b => b.id);
      
      const { data: purchases, error } = await supabase
        .from('marketplace_purchases')
        .select('creator_amount, book_id')
        .in('book_id', bookIds);

      if (error) {
        console.error('Error fetching earnings:', error);
        return;
      }

      // Infer currency from purchase amounts
      // BNB amounts are typically < 1, USDT amounts are typically > 1
      let bnbTotal = 0;
      let usdtTotal = 0;
      let boczTotal = 0;

      purchases?.forEach(purchase => {
        const amount = Number(purchase.creator_amount);
        if (amount < 1 && amount > 0) {
          // Likely BNB (small decimal amounts)
          bnbTotal += amount;
        } else if (amount >= 1) {
          // Likely USDT (amounts over 1)
          usdtTotal += amount;
        }
        // BOCZ would be handled here if implemented
      });

      setTotalEarnings({ bnb: bnbTotal, usdt: usdtTotal, bocz: boczTotal });
      setTotalSales(purchases?.length || 0);
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
      title: 'BNB Earnings',
      value: totalEarnings.bnb > 0 ? `${totalEarnings.bnb.toFixed(4)} BNB` : '0.0000 BNB',
      subtitle: 'After 4% platform fee',
      icon: DollarSign,
      color: 'text-yellow-500',
    },
    {
      title: 'USDT Earnings',
      value: totalEarnings.usdt > 0 ? `${totalEarnings.usdt.toFixed(2)} USDT` : '0.00 USDT',
      subtitle: 'After 4% platform fee',
      icon: DollarSign,
      color: 'text-green-500',
    },
    {
      title: 'BOCZ Earnings',
      value: totalEarnings.bocz > 0 ? `${totalEarnings.bocz.toFixed(2)} BOCZ` : '0.00 BOCZ',
      subtitle: 'After 4% platform fee',
      icon: DollarSign,
      color: 'text-purple-500',
    },
    {
      title: 'Total Earnings (USDT)',
      value: `${totalEarnings.usdt.toFixed(2)} USDT`,
      subtitle: 'USDT + BOCZ combined',
      icon: DollarSign,
      color: 'text-primary',
    },
    {
      title: 'Average Rating',
      value: avgRating > 0 ? avgRating.toFixed(1) : 'N/A',
      subtitle: `${books.reduce((sum, b) => sum + (b.review_count || 0), 0)} reviews`,
      icon: Star,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
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
