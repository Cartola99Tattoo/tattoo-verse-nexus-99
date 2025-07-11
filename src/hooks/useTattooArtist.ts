
import { useState, useEffect } from 'react';
import { getTattooArtistService } from '@/services/serviceFactory';
import { TattooArtistPortfolioItem, TattooArtistBlogPost, ProfessionalProduct, ConsultingService } from '@/services/interfaces/ITattooArtistService';

export const useTattooArtistPortfolio = (artistId: string) => {
  const [portfolioItems, setPortfolioItems] = useState<TattooArtistPortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      const items = await getTattooArtistService().getPortfolioItems(artistId);
      setPortfolioItems(items);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar portfólio');
      console.error('Portfolio loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (artistId) {
      loadPortfolio();
    }
  }, [artistId]);

  const addPortfolioItem = async (itemData: Omit<TattooArtistPortfolioItem, 'id' | 'artist_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newItem = await getTattooArtistService().createPortfolioItem(artistId, itemData);
      setPortfolioItems(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError('Erro ao adicionar item');
      throw err;
    }
  };

  const updatePortfolioItem = async (itemId: string, updates: Partial<TattooArtistPortfolioItem>) => {
    try {
      const updatedItem = await getTattooArtistService().updatePortfolioItem(itemId, updates);
      setPortfolioItems(prev => prev.map(item => item.id === itemId ? updatedItem : item));
      return updatedItem;
    } catch (err) {
      setError('Erro ao atualizar item');
      throw err;
    }
  };

  const deletePortfolioItem = async (itemId: string) => {
    try {
      await getTattooArtistService().deletePortfolioItem(itemId);
      setPortfolioItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      setError('Erro ao deletar item');
      throw err;
    }
  };

  return {
    portfolioItems,
    loading,
    error,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    refresh: loadPortfolio
  };
};

export const useTattooArtistBlog = (artistId?: string) => {
  const [blogPosts, setBlogPosts] = useState<TattooArtistBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBlogPosts = async () => {
    try {
      setLoading(true);
      const posts = await getTattooArtistService().getBlogPosts(artistId);
      setBlogPosts(posts);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar blog posts');
      console.error('Blog loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogPosts();
  }, [artistId]);

  return {
    blogPosts,
    loading,
    error,
    refresh: loadBlogPosts
  };
};

export const useProfessionalProducts = (category?: string) => {
  const [products, setProducts] = useState<ProfessionalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productList = await getTattooArtistService().getProfessionalProducts(category);
      setProducts(productList);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar produtos');
      console.error('Products loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [category]);

  return {
    products,
    loading,
    error,
    refresh: loadProducts
  };
};

export const useConsultingServices = () => {
  const [services, setServices] = useState<ConsultingService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadServices = async () => {
    try {
      setLoading(true);
      const serviceList = await getTattooArtistService().getConsultingServices();
      setServices(serviceList);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar serviços');
      console.error('Services loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const requestConsulting = async (serviceId: string, clientData: any) => {
    try {
      return await getTattooArtistService().requestConsulting(serviceId, clientData);
    } catch (err) {
      setError('Erro ao solicitar consultoria');
      throw err;
    }
  };

  return {
    services,
    loading,
    error,
    requestConsulting,
    refresh: loadServices
  };
};
