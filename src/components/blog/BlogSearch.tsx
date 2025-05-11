
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2 } from "lucide-react";

interface BlogSearchProps {
  value?: string;
  onSearch: (query: string) => void;
  onClear: () => void;
}

const BlogSearch = ({ value = '', onSearch, onClear }: BlogSearchProps) => {
  const [searchQuery, setSearchQuery] = useState(value);
  const [isSearching, setIsSearching] = useState(false);
  
  useEffect(() => {
    setSearchQuery(value);
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      setIsSearching(true);
      onSearch(trimmedQuery);
      
      // Simulação de "busca" para melhor feedback do usuário
      setTimeout(() => setIsSearching(false), 500);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    onClear();
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="text"
          placeholder="Pesquisar no blog..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-24"
          disabled={isSearching}
        />
        <div className="absolute right-1 top-1 flex items-center">
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={handleClear}
              className="h-8 w-8"
              disabled={isSearching}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Limpar pesquisa</span>
            </Button>
          )}
          <Button 
            type="submit" 
            variant="ghost" 
            size="sm" 
            className="h-8"
            disabled={isSearching}
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-1" />
            )}
            {isSearching ? "Buscando..." : "Buscar"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BlogSearch;
