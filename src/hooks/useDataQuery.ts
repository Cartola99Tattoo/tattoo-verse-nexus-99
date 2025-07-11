
import { useState, useEffect } from 'react';
import { handleSupabaseError } from '@/services/serviceFactory';

/**
 * Custom hook for handling data queries with loading and error states
 * This is a generic replacement for useSupabaseQuery that works with any data source
 * 
 * @param queryFn Function that returns a promise with the data
 * @param deps Dependencies array for useEffect (optional)
 * @param executeImmediately Whether to execute the query immediately (defaults to true)
 * @returns Object containing data, loading state, error state, and refresh function
 */
export function useDataQuery<T>(
  queryFn: () => Promise<T>,
  deps: any[] = [],
  executeImmediately: boolean = true
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(executeImmediately);
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
    if (executeImmediately) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const refresh = () => {
    return fetchData();
  };

  return { data, loading, error, refresh };
}

export default useDataQuery;
