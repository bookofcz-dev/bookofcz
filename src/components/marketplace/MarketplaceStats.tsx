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
  const [bnbPrice, setBnbPrice] = useState<number>(0);

  useEffect(() => {
    fetchBnbPrice();
    fetchStats();
  }, []);

  const fetchBnbPrice = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd'
      );
      const data = await response.json();
      const price = data.binancecoin?.usd || 600;
      console.log('📊 BNB Price fetched:', price);
      setBnbPrice(price);
    } catch (error) {
      console.error('Error fetching BNB price:', error);
      setBnbPrice(600); // Fallback price
    }
  };

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

      // Get purchases with book data to determine currency
      const { data: purchasesWithBooks } = await supabase
        .from('marketplace_purchases')
        .select('price_paid, marketplace_books(price_bnb, price_usdt)');

      console.log('📦 Purchases with books:', purchasesWithBooks);

      // Calculate separate volumes for BNB and USDT
      let usdtVolume = 0;
      let bnbVolume = 0;

      purchasesWithBooks?.forEach((purchase: any) => {
        const book = purchase.marketplace_books;
        const pricePaid = Number(purchase.price_paid);
        
        console.log('💰 Processing purchase:', { pricePaid, book });
        
        // If book has price_bnb = 0, it's a USDT purchase
        if (book && Number(book.price_bnb) === 0) {
          console.log('  → USDT purchase');
          usdtVolume += pricePaid;
        } else {
          console.log('  → BNB purchase');
          // Otherwise it's a BNB purchase
          bnbVolume += pricePaid;
        }
      });

      console.log('💵 USDT Volume:', usdtVolume);
      console.log('💎 BNB Volume:', bnbVolume);
      console.log('💱 BNB Price:', bnbPrice);

      // Convert USDT volume to BNB and add to BNB volume counter
      const usdtInBnb = bnbPrice > 0 ? usdtVolume / bnbPrice : 0;
      console.log('💱 USDT in BNB:', usdtInBnb);
      const totalBnbVolume = bnbVolume + usdtInBnb;
      console.log('💎 Total BNB Volume:', totalBnbVolume);

      setStats({
        totalBooks: booksCount || 0,
        totalCreators: uniqueCreators,
        totalSales: salesCount || 0,
        totalVolume: Number(usdtVolume.toFixed(2)),
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
