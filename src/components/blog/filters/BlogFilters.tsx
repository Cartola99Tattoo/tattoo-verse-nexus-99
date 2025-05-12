
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { BlogFiltersState } from '@/types/blog';
import { useBlogCategories } from '@/hooks/useBlogCategories';
import { useBlogAuthors } from '@/hooks/useBlogAuthors';
import BlogSearchInput from './BlogSearchInput';
import BlogFilterDropdown from './BlogFilterDropdown';
import BlogDateRangePicker from './BlogDateRangePicker';

interface BlogFiltersProps {
  initialValues?: BlogFiltersState;
  onFiltersChange?: (filters: BlogFiltersState) => void;
}

const BlogFilters: React.FC<BlogFiltersProps> = ({ 
  initialValues,
  onFiltersChange 
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter state 
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
  
  // Fetch data for filters
  const { data: categories = [] } = useBlogCategories();
  const { data: authors = [] } = useBlogAuthors();
  
  // Status options
  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
    { value: 'scheduled', label: 'Scheduled' }
  ];
  
  // Sort options
  const sortOptions = [
    { value: 'title:asc', label: 'Title (A-Z)' },
    { value: 'title:desc', label: 'Title (Z-A)' },
    { value: 'published_at:desc', label: 'Date (Newest)' },
    { value: 'published_at:asc', label: 'Date (Oldest)' },
    { value: 'view_count:desc', label: 'Most Viewed' },
    { value: 'view_count:asc', label: 'Least Viewed' }
  ];
  
  // Category options
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map(cat => ({ 
      value: cat.id, 
      label: cat.name 
    }))
  ];
  
  // Author options
  const authorOptions = [
    { value: '', label: 'All Authors' },
    ...authors.map(auth => ({ 
      value: auth.id, 
      label: `${auth.first_name || ''} ${auth.last_name || ''}`.trim() || 'Unnamed Author'
    }))
  ];

  const applyFilters = () => {
    const filters: BlogFiltersState = {
      search: search || undefined,
      status: status === 'all' ? undefined : status as any,
      category: category || undefined,
      author: author || undefined,
      startDate: startDate,
      endDate: endDate,
      sortBy: sortBy || undefined
    };
    
    // Update URL params
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status !== 'all') params.set('status', status);
    if (category) params.set('category', category);
    if (author) params.set('author', author);
    if (startDate) params.set('startDate', startDate.toISOString());
    if (endDate) params.set('endDate', endDate.toISOString());
    if (sortBy) params.set('sortBy', sortBy);
    setSearchParams(params);
    
    // Notify parent component
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
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
    
    if (onFiltersChange) {
      onFiltersChange({});
    }
  };

  const hasActiveFilters = () => {
    return search || status !== 'all' || category || author || startDate || endDate || sortBy !== 'published_at:desc';
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
        {/* Search Field */}
        <BlogSearchInput 
          value={search} 
          onChange={setSearch} 
          placeholder="Buscar artigos..."
        />
        
        {/* Status Filter */}
        <BlogFilterDropdown
          value={status}
          onChange={setStatus}
          options={statusOptions}
          placeholder="Status"
        />
        
        {/* Category Filter */}
        <BlogFilterDropdown
          value={category}
          onChange={setCategory}
          options={categoryOptions}
          placeholder="Category"
        />
        
        {/* Author Filter */}
        <BlogFilterDropdown
          value={author}
          onChange={setAuthor}
          options={authorOptions}
          placeholder="Author"
        />
        
        {/* Date Range */}
        <BlogDateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
        
        {/* Sort By */}
        <BlogFilterDropdown
          value={sortBy}
          onChange={setSortBy}
          options={sortOptions}
          placeholder="Sort By"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        {hasActiveFilters() && (
          <Button variant="outline" onClick={resetFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        )}
        <Button onClick={applyFilters}>
          <Search className="mr-2 h-4 w-4" />
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default BlogFilters;
