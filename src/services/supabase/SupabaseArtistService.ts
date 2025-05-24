
import { supabase } from "@/integrations/supabase/client";
import { IArtistsService, Artist, ArtistsQueryParams, PortfolioItem } from "../interfaces/IArtistsService";

export class SupabaseArtistService implements IArtistsService {
  async fetchArtists(options: ArtistsQueryParams = {}) {
    const { limit = 50, offset = 0, specialties, style, search, status = 'active' } = options;
    
    let query = supabase
      .from('artists')
      .select(`
        *,
        portfolio:artist_portfolio(*)
      `);

    // Apply status filter
    if (status !== 'all') {
      query = query.eq('status', status);
    }

    // Apply search filter
    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
    }

    // Apply style filter
    if (style) {
      query = query.eq('style', style);
    }

    // Apply specialties filter
    if (specialties && specialties.length > 0) {
      query = query.contains('specialties', specialties);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching artists:', error);
      throw new Error(`Erro ao buscar tatuadores: ${error.message}`);
    }

    const artists = data?.map(artist => ({
      ...artist,
      portfolio: artist.portfolio || []
    })) || [];

    return {
      artists,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    };
  }

  async fetchArtistById(id: string | number) {
    const { data, error } = await supabase
      .from('artists')
      .select(`
        *,
        portfolio:artist_portfolio(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      console.error('Error fetching artist:', error);
      throw new Error(`Erro ao buscar tatuador: ${error.message}`);
    }

    return {
      ...data,
      portfolio: data.portfolio || []
    };
  }

  async fetchArtistPortfolio(artistId: string | number, options: {
    limit?: number;
    offset?: number;
    category?: string;
  } = {}) {
    const { limit = 50, offset = 0, category } = options;
    
    let query = supabase
      .from('artist_portfolio')
      .select('*')
      .eq('artist_id', artistId)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching artist portfolio:', error);
      throw new Error(`Erro ao buscar portfólio: ${error.message}`);
    }

    return data || [];
  }

  async createArtist(artistData: Omit<Artist, 'id'>) {
    const { data, error } = await supabase
      .from('artists')
      .insert(artistData)
      .select()
      .single();

    if (error) {
      console.error('Error creating artist:', error);
      throw new Error(`Erro ao criar tatuador: ${error.message}`);
    }

    return data;
  }

  async updateArtist(id: string | number, artistData: Partial<Artist>) {
    const { data, error } = await supabase
      .from('artists')
      .update(artistData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating artist:', error);
      throw new Error(`Erro ao atualizar tatuador: ${error.message}`);
    }

    return data;
  }

  async deleteArtist(id: string | number) {
    const { error } = await supabase
      .from('artists')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting artist:', error);
      throw new Error(`Erro ao deletar tatuador: ${error.message}`);
    }

    return true;
  }

  async addPortfolioItem(artistId: string | number, portfolioData: Omit<PortfolioItem, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('artist_portfolio')
      .insert({
        ...portfolioData,
        artist_id: artistId
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding portfolio item:', error);
      throw new Error(`Erro ao adicionar item ao portfólio: ${error.message}`);
    }

    return data;
  }

  async removePortfolioItem(portfolioId: string | number) {
    const { error } = await supabase
      .from('artist_portfolio')
      .delete()
      .eq('id', portfolioId);

    if (error) {
      console.error('Error removing portfolio item:', error);
      throw new Error(`Erro ao remover item do portfólio: ${error.message}`);
    }

    return true;
  }
}

export const supabaseArtistService = new SupabaseArtistService();
