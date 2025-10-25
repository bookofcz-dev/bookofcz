import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, TrendingUp, BookOpen, Users } from 'lucide-react';

export const PlatformStats = () => {
  const [stats, setStats] = useState({
    totalFees: 0,
    totalSales: 0,
    totalBooks: 0,
    totalCreators: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total platform fees
      const { data: feesData } = await supabase
        .from('marketplace_purchases')
        .select('platform_fee');

      const totalFees = feesData?.reduce((sum, p) => sum + Number(p.platform_fee), 0) || 0;

      // Get total sales count
      const { count: salesCount } = await supabase
        .from('marketplace_purchases')
        .select('*', { count: 'exact', head: true });

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

      setStats({
        totalFees: Number(totalFees.toFixed(4)),
        totalSales: salesCount || 0,
        totalBooks: booksCount || 0,
        totalCreators: uniqueCreators,
      });
    } catch (error) {
      console.error('Error fetching platform stats:', error);
    }
  };

  const statItems = [
    {
      icon: DollarSign,
      label: 'Platform Fees Earned',
      value: stats.totalFees,
      suffix: ' BNB',
      color: 'text-green-600',
    },
    {
      icon: TrendingUp,
      label: 'Total Sales',
      value: stats.totalSales,
      suffix: '',
      color: 'text-blue-600',
    },
    {
      icon: BookOpen,
      label: 'Total Books',
      value: stats.totalBooks,
      suffix: '',
      color: 'text-purple-600',
    },
    {
      icon: Users,
      label: 'Total Creators',
      value: stats.totalCreators,
      suffix: '',
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.label}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stat.value}{stat.suffix}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
