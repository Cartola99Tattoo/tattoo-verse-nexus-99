
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductCategory } from '@/types';

export const useProducts = (options?: {
  category_id?: string;
  tags?: string[];
  search?: string;
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  const [totalCount, setTotalCount] = useState<number>(0);
  
  const fetchProductsCount = async () => {
    let query = supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'available');
      
    if (options?.category_id) {
      query = query.eq('category_id', options.category_id);
    }
    
    if (options?.tags && options.tags.length > 0) {
      query = query.contains('tags', options.tags);
    }
    
    if (options?.search) {
      query = query.ilike('name', `%${options.search}%`);
    }
    
    const { count, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return count || 0;
  };
  
  const fetchProducts = async () => {
    let query = supabase
      .from('products')
      .select(`
        *,
        artist:artists(*),
        category:product_categories(*)
      `)
      .eq('status', 'available');
      
    if (options?.category_id) {
      query = query.eq('category_id', options.category_id);
    }
    
    if (options?.tags && options.tags.length > 0) {
      query = query.contains('tags', options.tags);
    }
    
    if (options?.search) {
      query = query.ilike('name', `%${options.search}%`);
    }
    
    if (options?.sortBy) {
      query = query.order(options.sortBy, { ascending: options.sortOrder === 'asc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.page && options?.limit) {
      const from = (options.page - 1) * options.limit;
      query = query.range(from, from + options.limit - 1);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return data as Product[];
  };
  
  const { data: products, isLoading, error, refetch } = useQuery({
    queryKey: ['products', options],
    queryFn: fetchProducts
  });
  
  useEffect(() => {
    fetchProductsCount().then(count => setTotalCount(count));
  }, [options?.category_id, options?.tags, options?.search]);
  
  return { products, isLoading, error, refetch, totalCount };
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          artist:artists(*),
          category:product_categories(*)
        `)
        .eq('id', id)
        .single();
        
      if (error) {
        throw error;
      }
      
      return data as Product;
    },
    enabled: !!id
  });
};

export const useProductCategories = () => {
  return useQuery({
    queryKey: ['productCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .order('name');
        
      if (error) {
        throw error;
      }
      
      return data as ProductCategory[];
    }
  });
};
