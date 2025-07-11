
import { useState, useCallback } from 'react';
import { useDataQuery } from './useDataQuery';
import { getArtistsService } from '@/services/serviceFactory';
import { Artist, ArtistsQueryParams, PortfolioItem } from '@/services/interfaces/IArtistsService';

/**
 * Custom hook for fetching and managing artists data
 */
export function useArtists(initialParams?: ArtistsQueryParams) {
  const [queryParams, setQueryParams] = useState<ArtistsQueryParams>(initialParams || {});
  const artistsService = getArtistsService();
  
  // Fetch artists with the current query parameters
  const { 
    data: artistsData, 
    loading: isLoading, 
    error,
    refresh
  } = useDataQuery(
    () => artistsService.fetchArtists(queryParams),
    [queryParams]
  );
  
  // Function to fetch a single artist by ID - memoized to prevent re-renders
  const fetchArtistById = useCallback(async (id: string | number) => {
    return await artistsService.fetchArtistById(id);
  }, [artistsService]);
  
  // Function to fetch portfolio items for an artist - memoized to prevent re-renders
  const fetchArtistPortfolio = useCallback(async (
    artistId: string | number, 
    options?: { limit?: number; offset?: number; category?: string; }
  ) => {
    return await artistsService.fetchArtistPortfolio(artistId, options);
  }, [artistsService]);
  
  // Update query parameters - memoized to prevent re-renders
  const updateQueryParams = useCallback((newParams: Partial<ArtistsQueryParams>) => {
    setQueryParams(prev => ({ ...prev, ...newParams }));
  }, []);
  
  return {
    artists: artistsData?.artists || [],
    totalArtists: artistsData?.total || 0,
    totalPages: artistsData?.totalPages || 0,
    isLoading,
    error,
    queryParams,
    updateQueryParams,
    refresh,
    fetchArtistById,
    fetchArtistPortfolio
  };
}

export default useArtists;
