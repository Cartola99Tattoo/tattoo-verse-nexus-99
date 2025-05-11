
import React from "react";
import { Button } from "@/components/ui/button";

interface BlogEmptyStateProps {
  searchQuery?: string;
  onClearSearch: () => void;
}

const BlogEmptyState = ({ searchQuery, onClearSearch }: BlogEmptyStateProps) => {
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-700">
        Nenhum artigo encontrado
      </h3>
      {searchQuery && (
        <p className="mt-2 text-gray-500">
          Não encontramos resultados para "{searchQuery}"
        </p>
      )}
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={onClearSearch}
      >
        Ver todos os artigos
      </Button>
    </div>
  );
};

export default BlogEmptyState;
