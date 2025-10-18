import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useBookViews = (bookId?: string) => {
  const [viewCount, setViewCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch view count for a specific book
  useEffect(() => {
    if (!bookId) {
      setIsLoading(false);
      return;
    }

    const fetchViewCount = async () => {
      try {
        const { data, error } = await supabase
          .from("book_views")
          .select("view_count")
          .eq("book_id", bookId)
          .maybeSingle();

        if (error) throw error;
        setViewCount(data?.view_count || 0);
      } catch (error) {
        console.error("Error fetching view count:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchViewCount();
  }, [bookId]);

  // Increment view count
  const incrementView = async (bookIdentifier: string) => {
    try {
      const { error } = await supabase.rpc("increment_book_view", {
        book_identifier: bookIdentifier,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  return { viewCount, isLoading, incrementView };
};

// Hook to fetch all book views
export const useAllBookViews = () => {
  const [bookViews, setBookViews] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllViews = async () => {
      try {
        const { data, error } = await supabase
          .from("book_views")
          .select("book_id, view_count");

        if (error) throw error;

        const viewsMap: Record<string, number> = {};
        data?.forEach((item) => {
          viewsMap[item.book_id] = item.view_count;
        });
        setBookViews(viewsMap);
      } catch (error) {
        console.error("Error fetching all views:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllViews();
  }, []);

  return { bookViews, isLoading };
};
