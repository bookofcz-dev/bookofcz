import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAdminCheck = (walletAddress: string | null) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!walletAddress) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Normalize to lowercase for comparison
        const normalizedAddress = walletAddress.toLowerCase();
        
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('wallet_address', normalizedAddress)
          .eq('role', 'admin')
          .maybeSingle();

        if (error) throw error;
        console.log('Admin check result:', { walletAddress: normalizedAddress, data, isAdmin: !!data });
        setIsAdmin(!!data);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [walletAddress]);

  return { isAdmin, loading };
};
