
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface BlogErrorStateProps {
  onRetry: () => void;
}

const BlogErrorState = ({ onRetry }: BlogErrorStateProps) => {
  return (
    <Card className="w-full border-red-200 bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center text-red-500 mb-2">
          <AlertCircle className="mr-2 h-5 w-5" />
          <CardTitle>Não foi possível carregar os artigos</CardTitle>
        </div>
        <CardDescription>
          Ocorreu um problema ao carregar os artigos do blog. Isso pode ser devido a problemas
          de conexão ou o servidor pode estar temporariamente indisponível.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-gray-600">
        <p>Você pode:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Verificar sua conexão com a internet</li>
          <li>Atualizar a página</li>
          <li>Tentar novamente em alguns instantes</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="mr-2 flex items-center gap-2"
          onClick={onRetry}
        >
          <RefreshCw size={16} />
          Tentar novamente
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BlogErrorState;
