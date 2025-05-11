
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface BlogErrorStateProps {
  onRetry: () => void;
}

const BlogErrorState = ({ onRetry }: BlogErrorStateProps) => {
  return (
    <div className="text-center py-8 bg-white rounded-lg shadow-md">
      <p className="text-red-500 mb-4">
        Ocorreu um erro ao carregar os artigos. Por favor, tente novamente.
      </p>
      <Button 
        variant="outline" 
        className="mt-2 flex items-center gap-2"
        onClick={onRetry}
      >
        <RefreshCw size={16} />
        Tentar novamente
      </Button>
    </div>
  );
};

export default BlogErrorState;
