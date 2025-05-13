
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ArtistsQueryParams } from "@/services/interfaces/IArtistsService";

// Common styles for tattoo specialty options
const specialties = [
  "Realismo", 
  "Blackwork", 
  "Aquarela", 
  "Geométrico", 
  "Old School",
  "Minimalista",
  "Tribal",
  "Oriental"
];

interface ArtistsSidebarProps {
  queryParams: ArtistsQueryParams;
  onUpdateParams: (params: Partial<ArtistsQueryParams>) => void;
  totalResults: number;
  isLoading?: boolean;
}

const ArtistsSidebar = ({ 
  queryParams, 
  onUpdateParams,
  totalResults,
  isLoading = false
}: ArtistsSidebarProps) => {
  const [searchInput, setSearchInput] = useState(queryParams.search || "");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateParams({ search: searchInput });
  };
  
  const toggleSpecialty = (specialty: string) => {
    const currentSpecialties = queryParams.specialties || [];
    
    if (currentSpecialties.includes(specialty)) {
      onUpdateParams({ 
        specialties: currentSpecialties.filter(s => s !== specialty) 
      });
    } else {
      onUpdateParams({ 
        specialties: [...currentSpecialties, specialty] 
      });
    }
  };
  
  const clearFilters = () => {
    setSearchInput("");
    onUpdateParams({ 
      search: undefined, 
      specialties: [], 
      style: undefined 
    });
  };
  
  const hasActiveFilters = (
    !!queryParams.search || 
    !!queryParams.style ||
    (queryParams.specialties && queryParams.specialties.length > 0)
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Buscar tatuadores</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="search"
              placeholder="Nome do tatuador..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              <Search className="h-4 w-4" />
              <span className="sr-only">Buscar</span>
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Specialties */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Especialidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {specialties.map((specialty) => {
              const isActive = queryParams.specialties?.includes(specialty);
              
              return (
                <Badge
                  key={specialty}
                  variant={isActive ? "default" : "outline"}
                  className={`cursor-pointer ${isActive ? "bg-primary" : "hover:bg-primary/10"} ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
                  onClick={() => !isLoading && toggleSpecialty(specialty)}
                >
                  {specialty}
                </Badge>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Results summary and clear filters */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-gray-500">
          {totalResults} tatuador{totalResults !== 1 ? 'es' : ''} encontrado{totalResults !== 1 ? 's' : ''}
        </p>
        
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearFilters}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Limpar filtros
          </Button>
        )}
      </div>
    </div>
  );
};

export default ArtistsSidebar;
