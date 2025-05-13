
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Map, Star } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getArtistsService } from "@/services/serviceFactory";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Artist, PortfolioItem } from "@/services/interfaces/IArtistsService";
import ArtistContactForm from "@/components/artists/ArtistContactForm";

const ArtistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const artistsService = getArtistsService();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(null);
  
  // Fetch artist details
  const { 
    data: artistData, 
    loading: isLoadingArtist, 
    error: artistError,
    refresh: refreshArtist
  } = useDataQuery<Artist | null>(
    () => artistsService.fetchArtistById(id || ''),
    [id]
  );
  
  // Fetch artist portfolio
  const {
    data: portfolioData,
    loading: isLoadingPortfolio,
    error: portfolioError,
    refresh: refreshPortfolio
  } = useDataQuery<PortfolioItem[]>(
    () => artistsService.fetchArtistPortfolio(id || ''),
    [id, artistData]
  );
  
  // Update state when data is loaded
  useEffect(() => {
    if (artistData) {
      setArtist(artistData);
    }
  }, [artistData]);
  
  useEffect(() => {
    if (portfolioData) {
      setPortfolio(portfolioData);
    }
  }, [portfolioData]);
  
  // Build full name and initials
  const fullName = artist 
    ? `${artist.first_name} ${artist.last_name}` 
    : 'Carregando...';
    
  const initials = artist 
    ? `${artist.first_name.charAt(0)}${artist.last_name.charAt(0)}` 
    : '';
  
  // Handle errors
  const hasError = artistError || portfolioError;
  const isLoading = isLoadingArtist;
  
  if (hasError) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-500">Erro ao carregar informações</h2>
          <p className="text-gray-600 mb-6">
            Não foi possível carregar os detalhes deste tatuador.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => {
              refreshArtist();
              refreshPortfolio();
            }}>
              Tentar novamente
            </Button>
            <Button variant="outline" asChild>
              <Link to="/artists">Voltar para lista</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{isLoading ? 'Carregando...' : `${fullName} | 99Tattoo`}</title>
        <meta 
          name="description" 
          content={artist?.bio?.substring(0, 160) || 'Detalhes do tatuador na 99Tattoo.'} 
        />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        {/* Back button */}
        <div className="mb-6">
          <Button variant="outline" asChild className="flex items-center gap-2">
            <Link to="/artists">
              <ArrowLeft className="h-4 w-4" />
              Voltar para todos os tatuadores
            </Link>
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-red-500 mb-4" />
            <p className="text-lg text-gray-600">Carregando informações do tatuador...</p>
          </div>
        ) : artist ? (
          <div className="animate-fade-in space-y-12">
            {/* Artist header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Avatar column */}
              <div className="md:col-span-1">
                <div className="flex flex-col items-center">
                  <div className="relative mb-6 w-64 h-64">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 blur-2xl opacity-20 rounded-full"></div>
                    <Avatar className="w-full h-full border-4 border-white shadow-lg">
                      <AvatarImage 
                        src={artist.avatar_url} 
                        alt={fullName}
                        className="w-full h-full object-cover" 
                      />
                      <AvatarFallback className="text-6xl bg-gray-200">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  {/* Rating */}
                  {artist.rating && (
                    <div className="flex items-center mb-4 bg-white px-4 py-2 rounded-full shadow-sm">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i}
                          className={`h-5 w-5 ${i < Math.floor(artist.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="ml-2 font-bold">{artist.rating}</span>
                      {artist.total_reviews && (
                        <span className="text-sm text-gray-500 ml-1">
                          ({artist.total_reviews} avaliações)
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Specialties */}
                  <div className="mb-6 text-center">
                    <h3 className="font-bold mb-2 text-gray-700">Especialidades</h3>
                    <div className="flex flex-wrap justify-center gap-2">
                      {artist.specialties.map((specialty, idx) => (
                        <Badge key={idx} className="bg-red-100 text-red-800 hover:bg-red-200">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div className="flex items-center mb-6 text-gray-600">
                    <Map className="h-4 w-4 mr-2" />
                    <span>São Paulo, SP</span>
                  </div>
                  
                  {/* CTA Button */}
                  <div className="w-full mt-4">
                    <Button className="w-full bg-red-500 hover:bg-red-600" 
                      onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}>
                      Entrar em contato
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Info column */}
              <div className="md:col-span-2">
                <h1 className="text-3xl font-bold mb-4">{fullName}</h1>
                <div className="flex items-center mb-4">
                  <Badge variant="secondary" className="mr-2">{artist.style}</Badge>
                </div>
                
                <div className="prose prose-lg max-w-full">
                  <h2 className="text-xl font-bold mb-4">Sobre {artist.first_name}</h2>
                  
                  {artist.bio.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                  
                  <h3 className="text-lg font-bold mt-8 mb-3">Estilo de trabalho</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {artist.first_name} é especialista em <strong>{artist.style}</strong> e tem um 
                    trabalho reconhecido pelas técnicas de {artist.specialties.join(", ")}.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Portfolio Section */}
            <div>
              <h2 className="text-2xl font-bold mb-6 border-b pb-2">Portfólio de Trabalhos</h2>
              
              {isLoadingPortfolio ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[...Array(9)].map((_, index) => (
                    <div key={index} className="aspect-square bg-gray-200 animate-pulse rounded-md"></div>
                  ))}
                </div>
              ) : portfolio.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {portfolio.slice(0, 9).map((item) => (
                      <div 
                        key={item.id}
                        className="aspect-square rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-all hover:scale-[1.02] shadow-md"
                        onClick={() => setSelectedImage(item)}
                      >
                        <img 
                          src={item.image_url} 
                          alt={item.description || `Trabalho de ${fullName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Image Modal */}
                  {selectedImage && (
                    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
                      <div className="max-w-4xl max-h-[90vh] relative" onClick={e => e.stopPropagation()}>
                        <img 
                          src={selectedImage.image_url} 
                          alt={selectedImage.description || `Trabalho de ${fullName}`}
                          className="max-w-full max-h-[80vh] object-contain rounded-lg"
                        />
                        <div className="absolute top-2 right-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="bg-white text-gray-900 rounded-full"
                            onClick={() => setSelectedImage(null)}
                          >
                            <span className="sr-only">Fechar</span>
                            ✕
                          </Button>
                        </div>
                        <div className="bg-white p-4 rounded-b-lg">
                          <h3 className="font-bold">{selectedImage.category || 'Trabalho'} por {fullName}</h3>
                          {selectedImage.description && <p className="text-gray-600">{selectedImage.description}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Este tatuador ainda não possui fotos em seu portfólio.</p>
                </div>
              )}
            </div>
            
            {/* Contact Form Section */}
            <div id="contact-form" className="max-w-2xl mx-auto">
              <ArtistContactForm artistName={artist.first_name} artistId={artist.id} />
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Tatuador não encontrado</h2>
            <p className="text-gray-600 mb-6">
              Não foi possível encontrar o tatuador solicitado.
            </p>
            <Button asChild>
              <Link to="/artists">Ver todos os tatuadores</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ArtistDetail;
