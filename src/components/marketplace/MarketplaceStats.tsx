import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, BookOpen, Users, DollarSign } from 'lucide-react';

export const MarketplaceStats = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalCreators: 0,
    totalSales: 0,
    totalVolume: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total approved books
      const { count: booksCount } = await supabase
        .from('marketplace_books')
        .select('*', { count: 'exact', head: true })
        .eq('approval_status', 'approved');

      // Get unique creators
      const { data: creatorsData } = await supabase
        .from('marketplace_books')
        .select('creator_wallet')
        .eq('approval_status', 'approved');

      const uniqueCreators = new Set(creatorsData?.map(b => b.creator_wallet) || []).size;

      // Get total sales
      const { count: salesCount } = await supabase
        .from('marketplace_purchases')
        .select('*', { count: 'exact', head: true });

      // Get total volume
      const { data: volumeData } = await supabase
        .from('marketplace_purchases')
        .select('price_paid');

      const totalVolume = volumeData?.reduce((sum, p) => sum + Number(p.price_paid), 0) || 0;

      setStats({
        totalBooks: booksCount || 0,
        totalCreators: uniqueCreators,
        totalSales: salesCount || 0,
        totalVolume: Number(totalVolume.toFixed(4)),
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statItems = [
    {
      icon: BookOpen,
      label: 'Total Books',
      value: stats.totalBooks,
      suffix: '',
    },
    {
      icon: Users,
      label: 'Creators',
      value: stats.totalCreators,
      suffix: '',
    },
    {
      icon: TrendingUp,
      label: 'Total Sales',
      value: stats.totalSales,
      suffix: '',
    },
    {
      icon: DollarSign,
      label: 'Volume',
      value: stats.totalVolume,
      suffix: ' BNB',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {statItems.map((stat, index) => (
        <div
          key={index}
          className="bg-card border rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
        >
          <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
          <div className="text-3xl font-bold mb-1">
            {stat.value}{stat.suffix}
          </div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};
