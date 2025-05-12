
import { useState, useEffect } from 'react';
import { handleSupabaseError } from '@/services/supabaseService';

/**
 * Custom hook for handling Supabase queries with loading and error states
 * @param queryFn Function that returns a promise with the data
 * @param deps Dependencies array for useEffect (optional)
 * @returns Object containing data, loading state, error state, and refresh function
 */
export function useSupabaseQuery<T>(
  queryFn: () => Promise<T>,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await queryFn();
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      handleSupabaseError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const refresh = () => {
    return fetchData();
  };

  return { data, loading, error, refresh };
}

export default useSupabaseQuery;
