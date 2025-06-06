import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Map, Star } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getArtistsService } from "@/services/serviceFactory";
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
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Erro ao carregar informações</h2>
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
    );
  }

  return (
    <>
      <Helmet>
        <title>{isLoading ? 'Carregando...' : `${fullName} | 99Tattoo`}</title>
        <meta 
          name="description" 
          content={artist?.bio?.substring(0, 160) || 'Detalhes do tatuador na 99Tattoo.'} 
        />
      </Helmet>
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-16">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            asChild
            className="text-white hover:bg-white/10 mb-6"
          >
            <Link to="/artists">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para todos os tatuadores
            </Link>
          </Button>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-white mb-4" />
              <p className="text-lg text-red-100">Carregando informações do tatuador...</p>
            </div>
          ) : artist ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 flex flex-col items-center">
                <div className="relative mb-6 w-64 h-64">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 blur-2xl opacity-20 rounded-full"></div>
                  <Avatar className="w-full h-full border-4 border-white shadow-2xl">
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
                
                {artist.rating && (
                  <div className="flex items-center mb-4 bg-white px-4 py-2 rounded-full shadow-lg">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(artist.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="ml-2 font-bold text-red-600">{artist.rating}</span>
                    {artist.total_reviews && (
                      <span className="text-sm text-gray-500 ml-1">
                        ({artist.total_reviews} avaliações)
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{fullName}</h1>
                <div className="flex items-center mb-6">
                  <Badge className="mr-2 bg-white text-red-600 hover:bg-red-50">{artist.style}</Badge>
                  <div className="flex items-center text-red-100">
                    <Map className="h-4 w-4 mr-1" />
                    <span>São Paulo, SP</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-bold mb-3 text-white text-lg">Especialidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {artist.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button 
                  className="bg-white text-red-600 hover:bg-red-50 shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Entrar em contato
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {artist && (
          <div className="animate-fade-in space-y-12">
            {/* Biography */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold mb-6 text-red-600">Sobre {artist.first_name}</h2>
                <div className="prose prose-lg max-w-full">
                  {artist.bio.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                  
                  <h3 className="text-xl font-bold mt-8 mb-3 text-red-600">Estilo de trabalho</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {artist.first_name} é especialista em <strong className="text-red-600">{artist.style}</strong> e tem um 
                    trabalho reconhecido pelas técnicas de <strong className="text-red-600">{artist.specialties.join(", ")}</strong>.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Portfolio Section */}
            <div>
              <h2 className="text-3xl font-bold mb-6 border-b-2 border-red-200 pb-2 text-red-600">Portfólio de Trabalhos</h2>
              
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
                        className="aspect-square rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg hover:shadow-xl"
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
                          className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                        />
                        <div className="absolute top-2 right-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="bg-white text-gray-900 rounded-full shadow-lg"
                            onClick={() => setSelectedImage(null)}
                          >
                            <span className="sr-only">Fechar</span>
                            ✕
                          </Button>
                        </div>
                        <div className="bg-white p-4 rounded-b-lg shadow-lg">
                          <h3 className="font-bold text-red-600">{selectedImage.category || 'Trabalho'} por {fullName}</h3>
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
        )}
      </div>
    </>
  );
};

export default ArtistDetail;
