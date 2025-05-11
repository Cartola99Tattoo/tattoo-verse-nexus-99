
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface BlogSearchProps {
  onSearch: (query: string) => void;
  onClear: () => void;
}

const BlogSearch = ({ onSearch, onClear }: BlogSearchProps) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleClear = () => {
    setSearchInput("");
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Buscar no blog..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button type="submit">Buscar</Button>
      {searchInput && (
        <Button 
          variant="outline" 
          type="button" 
          onClick={handleClear}
        >
          Limpar
        </Button>
      )}
    </form>
  );
};

export default BlogSearch;
