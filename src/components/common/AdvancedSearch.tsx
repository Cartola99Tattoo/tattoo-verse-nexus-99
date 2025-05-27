
import { useState, useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SearchFilter {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number';
  options?: { value: string; label: string }[];
}

interface AdvancedSearchProps {
  filters: SearchFilter[];
  onSearch: (searchTerm: string, activeFilters: Record<string, any>) => void;
  placeholder?: string;
  className?: string;
}

export const AdvancedSearch = ({
  filters,
  onSearch,
  placeholder = "Buscar...",
  className = ""
}: AdvancedSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = useCallback(() => {
    onSearch(searchTerm, activeFilters);
  }, [searchTerm, activeFilters, onSearch]);

  const handleFilterChange = useCallback((key: string, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const removeFilter = useCallback((key: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveFilters({});
    setSearchTerm('');
    onSearch('', {});
  }, [onSearch]);

  const activeFilterCount = useMemo(() => {
    return Object.keys(activeFilters).filter(key => activeFilters[key]).length;
  }, [activeFilters]);

  const renderFilter = (filter: SearchFilter) => {
    switch (filter.type) {
      case 'select':
        return (
          <Select
            value={activeFilters[filter.key] || ''}
            onValueChange={(value) => handleFilterChange(filter.key, value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Selecionar ${filter.label}`} />
            </SelectTrigger>
            <SelectContent>
              {filter.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'date':
        return (
          <Input
            type="date"
            value={activeFilters[filter.key] || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            placeholder={filter.label}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={activeFilters[filter.key] || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            placeholder={filter.label}
          />
        );

      default:
        return (
          <Input
            value={activeFilters[filter.key] || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            placeholder={filter.label}
          />
        );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main search bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="pl-10"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {activeFilterCount > 0 && (
            <Badge variant="destructive" className="ml-2 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
        <Button onClick={handleSearch} className="btn-gradient">
          Buscar
        </Button>
      </div>

      {/* Active filters display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600">Filtros ativos:</span>
          {Object.entries(activeFilters).map(([key, value]) => {
            if (!value) return null;
            const filter = filters.find(f => f.key === key);
            return (
              <Badge key={key} variant="secondary" className="flex items-center gap-1">
                {filter?.label}: {value}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeFilter(key)}
                />
              </Badge>
            );
          })}
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Limpar tudo
          </Button>
        </div>
      )}

      {/* Advanced filters panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filters.map(filter => (
                <div key={filter.key}>
                  <label className="block text-sm font-medium mb-1">
                    {filter.label}
                  </label>
                  {renderFilter(filter)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedSearch;
