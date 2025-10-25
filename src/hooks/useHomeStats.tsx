import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useHomeStats = (boczCollectionCount: number) => {
  const [stats, setStats] = useState({
    totalBooks: boczCollectionCount,
    totalAuthors: 0,
    totalCommunity: 0,
  });

  useEffect(() => {
    fetchStats();
  }, [boczCollectionCount]);

  const fetchStats = async () => {
    try {
      // Get total approved marketplace books
      const { count: marketplaceBooksCount } = await supabase
        .from('marketplace_books')
        .select('*', { count: 'exact', head: true })
        .eq('approval_status', 'approved')
        .eq('is_public', true);

      // Get unique creators from marketplace
      const { data: creatorsData } = await supabase
        .from('marketplace_books')
        .select('creator_wallet')
        .eq('approval_status', 'approved')
        .eq('is_public', true);

      const uniqueCreators = new Set(creatorsData?.map(b => b.creator_wallet) || []).size;

      // Get total purchases to estimate community size
      const { count: purchasesCount } = await supabase
        .from('marketplace_purchases')
        .select('*', { count: 'exact', head: true });

      // Social media community counts
      const xFollowers = 500;
      const telegramMembers = 800;
      const xCommunityMembers = 160;
      const socialMediaTotal = xFollowers + telegramMembers + xCommunityMembers;

      setStats({
        totalBooks: (marketplaceBooksCount || 0) + boczCollectionCount,
        totalAuthors: uniqueCreators,
        totalCommunity: socialMediaTotal + (purchasesCount || 0),
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return stats;
};
