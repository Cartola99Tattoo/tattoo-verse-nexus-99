import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Search, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BlogFilterProps {
  initialValues?: {
    search?: string;
    status?: string;
    category?: string;
    author?: string;
    startDate?: Date;
    endDate?: Date;
    sortBy?: string;
  }
}

interface Category {
  id: string;
  name: string;
}

interface Author {
  id: string;
  first_name: string;
  last_name: string;
}

const BlogFilters: React.FC<BlogFilterProps> = ({ initialValues }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Local state for filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [author, setAuthor] = useState(searchParams.get('author') || '');
  const [startDate, setStartDate] = useState<Date | undefined>(
    searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'published_at:desc');
  
  // Fetch options for dropdowns
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      setLoadingOptions(true);
      
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('blog_categories')
        .select('id, name')
        .order('name');
      
      if (categoriesError) throw categoriesError;
      
      // Fetch authors (unique authors who have written blog posts)
      const { data: authorsData, error: authorsError } = await supabase
        .from('blog_posts')
        .select('profiles:author_id(id, first_name, last_name)')
        .not('author_id', 'is', null);
      
      if (authorsError) throw authorsError;
      
      // Extract unique authors
      const uniqueAuthors = new Map<string, Author>();
      
      authorsData.forEach((post) => {
        if (post.profiles && !uniqueAuthors.has(post.profiles.id)) {
          uniqueAuthors.set(post.profiles.id, {
            id: post.profiles.id,
            first_name: post.profiles.first_name,
            last_name: post.profiles.last_name
          });
        }
      });
      
      setCategories(categoriesData || []);
      setAuthors(Array.from(uniqueAuthors.values()));
    } catch (error) {
      console.error('Error fetching filter options:', error);
    } finally {
      setLoadingOptions(false);
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (search) params.set('search', search);
    if (status && status !== 'all') params.set('status', status);
    if (category) params.set('category', category);
    if (author) params.set('author', author);
    if (startDate) params.set('startDate', startDate.toISOString());
    if (endDate) params.set('endDate', endDate.toISOString());
    if (sortBy) params.set('sortBy', sortBy);
    
    setSearchParams(params);
  };

  const resetFilters = () => {
    setSearch('');
    setStatus('all');
    setCategory('');
    setAuthor('');
    setStartDate(undefined);
    setEndDate(undefined);
    setSortBy('published_at:desc');
    
    setSearchParams({});
  };

  const hasActiveFilters = () => {
    return search || status !== 'all' || category || author || startDate || endDate || sortBy !== 'published_at:desc';
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
        {/* Search Field */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar artigos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        
        {/* Status Filter */}
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="published">Publicados</SelectItem>
            <SelectItem value="draft">Rascunhos</SelectItem>
            <SelectItem value="scheduled">Agendados</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Category Filter */}
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Author Filter */}
        <Select value={author} onValueChange={setAuthor}>
          <SelectTrigger>
            <SelectValue placeholder="Autor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            {authors.map((auth) => (
              <SelectItem key={auth.id} value={auth.id}>
                {`${auth.first_name || ''} ${auth.last_name || ''}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Date Range */}
        <div className="flex space-x-2">
          {/* Start Date */}
          <div className="flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'dd/MM/yy', { locale: ptBR }) : 
                  <span className="text-gray-400">Data inicial</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* End Date */}
          <div className="flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'dd/MM/yy', { locale: ptBR }) : 
                  <span className="text-gray-400">Data final</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) => startDate ? date < startDate : false}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Sort By */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title:asc">Título (A-Z)</SelectItem>
            <SelectItem value="title:desc">Título (Z-A)</SelectItem>
            <SelectItem value="published_at:desc">Data (Mais recente)</SelectItem>
            <SelectItem value="published_at:asc">Data (Mais antiga)</SelectItem>
            <SelectItem value="view_count:desc">Mais visualizados</SelectItem>
            <SelectItem value="view_count:asc">Menos visualizados</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end space-x-2">
        {hasActiveFilters() && (
          <Button variant="outline" onClick={resetFilters}>
            <X className="mr-2 h-4 w-4" />
            Limpar filtros
          </Button>
        )}
        <Button onClick={applyFilters}>
          <Search className="mr-2 h-4 w-4" />
          Filtrar
        </Button>
      </div>
    </div>
  );
};

export default BlogFilters;
