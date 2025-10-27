import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, BookOpen, Users, DollarSign } from 'lucide-react';

export const MarketplaceStats = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalCreators: 0,
    totalSales: 0,
    totalVolume: 0,
    bnbVolume: 0,
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
        .eq('approval_status', 'approved')
        .eq('is_public', true);

      // Get unique creators
      const { data: creatorsData } = await supabase
        .from('marketplace_books')
        .select('creator_wallet')
        .eq('approval_status', 'approved')
        .eq('is_public', true);

      const uniqueCreators = new Set(creatorsData?.map(b => b.creator_wallet) || []).size;

      // Get aggregate stats using secure function (bypasses RLS for public stats)
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_marketplace_stats');

      if (statsError) {
        console.error('Error fetching marketplace stats:', statsError);
      }

      const purchaseStats = statsData?.[0] || { total_sales: 0, usdt_volume: 0, bnb_volume: 0 };

      // Fetch BNB price for conversion display
      let bnbPrice = 600; // fallback
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd'
        );
        const data = await response.json();
        bnbPrice = data.binancecoin?.usd || 600;
      } catch (error) {
        console.error('Error fetching BNB price:', error);
      }

      // Convert USDT volume to BNB for the BNB volume display
      const usdtInBnb = bnbPrice > 0 ? Number(purchaseStats.usdt_volume) / bnbPrice : 0;
      const totalBnbVolume = Number(purchaseStats.bnb_volume) + usdtInBnb;

      setStats({
        totalBooks: booksCount || 0,
        totalCreators: uniqueCreators,
        totalSales: Number(purchaseStats.total_sales) || 0,
        totalVolume: Number(Number(purchaseStats.usdt_volume).toFixed(2)),
        bnbVolume: Number(totalBnbVolume.toFixed(4)),
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
      label: 'USDT Volume',
      value: stats.totalVolume,
      suffix: ' USDT',
    },
    {
      icon: DollarSign,
      label: 'BNB Volume',
      value: stats.bnbVolume,
      suffix: ' BNB',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
      {statItems.map((stat, index) => (
        <div
          key={index}
          className="bg-card border rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
        >
          <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
          <div className="text-3xl font-bold mb-1">
            {stat.label === 'BNB Volume' ? stat.value.toFixed(4) : stat.value}{stat.suffix}
          </div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};
