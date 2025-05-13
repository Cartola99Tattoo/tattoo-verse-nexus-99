
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ArtistCard from "@/components/artists/ArtistCard";
import ArtistsSidebar from "@/components/artists/ArtistsSidebar";
import useArtists from "@/hooks/useArtists";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { Loader2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 9;

const Artists = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get initial values from URL parameters
  const initialPage = parseInt(searchParams.get('page') || '1');
  const initialSearch = searchParams.get('search') || undefined;
  const initialStyle = searchParams.get('style') || undefined;
  const initialSpecialties = searchParams.get('specialties')?.split(',').filter(Boolean) || [];
  
  // Initialize the query params for artists
  const initialQueryParams = {
    limit: ITEMS_PER_PAGE,
    offset: (initialPage - 1) * ITEMS_PER_PAGE,
    search: initialSearch,
    style: initialStyle,
    specialties: initialSpecialties
  };
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  // Use our custom hook to fetch artists
  const { 
    artists, 
    totalArtists, 
    totalPages, 
    isLoading, 
    error, 
    queryParams, 
    updateQueryParams,
    refresh
  } = useArtists(initialQueryParams);
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }
    
    if (queryParams.search) {
      params.set('search', queryParams.search);
    }
    
    if (queryParams.style) {
      params.set('style', queryParams.style);
    }
    
    if (queryParams.specialties && queryParams.specialties.length > 0) {
      params.set('specialties', queryParams.specialties.join(','));
    }
    
    setSearchParams(params);
  }, [currentPage, queryParams, setSearchParams]);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [queryParams.search, queryParams.style, queryParams.specialties]);
  
  // Update offset when page changes
  useEffect(() => {
    updateQueryParams({ 
      offset: (currentPage - 1) * ITEMS_PER_PAGE 
    });
  }, [currentPage, updateQueryParams]);
  
  // Generate pagination items
  const generatePaginationItems = () => {
    let items = [];
    const maxVisiblePages = 5;
    
    // Start and end page calculation
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages && startPage > 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Add first page
    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink
            onClick={() => setCurrentPage(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      // Add ellipsis if needed
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <span className="px-4">...</span>
          </PaginationItem>
        );
      }
    }
    
    // Add pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => setCurrentPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add ellipsis and last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <span className="px-4">...</span>
          </PaginationItem>
        );
      }
      
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            onClick={() => setCurrentPage(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  return (
    <Layout>
      <Helmet>
        <title>Tatuadores | 99Tattoo</title>
        <meta name="description" content="Conheça os tatuadores da 99Tattoo. Encontre o artista perfeito para sua próxima tatuagem." />
      </Helmet>
      
      {/* Hero section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Conheça nossos <span className="text-red-500">Tatuadores</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Artistas talentosos e experientes para criar a tatuagem dos seus sonhos.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with filters */}
          <div className="lg:w-1/4">
            <div className="lg:sticky lg:top-24">
              <ArtistsSidebar 
                queryParams={queryParams} 
                onUpdateParams={updateQueryParams}
                totalResults={totalArtists}
              />
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:w-3/4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-red-500 mb-4" />
                <p className="text-lg text-gray-600">Carregando tatuadores...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold mb-2 text-red-500">Erro ao carregar tatuadores</h3>
                <p className="text-gray-600 mb-4">Ocorreu um erro ao carregar a lista de tatuadores.</p>
                <Button onClick={() => refresh()}>Tentar novamente</Button>
              </div>
            ) : artists.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {artists.map((artist) => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                        
                        {generatePaginationItems()}
                        
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border">
                <h3 className="text-xl font-bold mb-2">Nenhum tatuador encontrado</h3>
                <p className="text-gray-600 mb-4">
                  Não encontramos tatuadores que correspondam aos filtros aplicados.
                </p>
                <Button onClick={() => updateQueryParams({
                  search: undefined,
                  specialties: [],
                  style: undefined
                })}>
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* CTA section */}
      <div className="bg-red-50 py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para fazer sua tatuagem?</h2>
          <p className="text-gray-600 mb-6">
            Entre em contato conosco e agende uma consulta com um de nossos tatuadores.
          </p>
          <div className="flex justify-center">
            <Button size="lg" className="bg-red-500 hover:bg-red-600">
              Agendar consulta
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Artists;
