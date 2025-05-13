
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Instagram, Facebook, Mail, Phone, Map } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useDataQuery } from "@/hooks/useDataQuery";
import { getArtistsService } from "@/services/serviceFactory";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Artist, PortfolioItem } from "@/services/interfaces/IArtistsService";
import ArtistPortfolio from "@/components/artists/ArtistPortfolio";

const ArtistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const artistsService = getArtistsService();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  
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
          <>
            {/* Artist header */}
            <div className="flex flex-col md:flex-row gap-8 mb-12 animate-fade-in">
              {/* Avatar column */}
              <div className="md:w-1/3">
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
                        <svg 
                          key={i}
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-5 w-5 ${i < Math.floor(artist.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path 
                            fillRule="evenodd" 
                            d="M10 15.585l6.146 3.628-1.638-7.021L20 7.329l-7.055-.602L10 0 7.055 6.726 0 7.329l5.492 4.863L3.854 19.213 10 15.585z" 
                          />
                        </svg>
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
                  
                  {/* Contact info */}
                  {artist.contact && (
                    <div className="w-full">
                      <h3 className="font-bold mb-3 text-gray-700 text-center">Contato</h3>
                      <div className="space-y-3">
                        {artist.contact.instagram && (
                          <a 
                            href={`https://instagram.com/${artist.contact.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
                          >
                            <Instagram className="h-5 w-5 text-pink-600" />
                            <span>{artist.contact.instagram}</span>
                          </a>
                        )}
                        
                        {artist.contact.facebook && (
                          <a 
                            href={`https://facebook.com/${artist.contact.facebook}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
                          >
                            <Facebook className="h-5 w-5 text-blue-600" />
                            <span>{artist.contact.facebook}</span>
                          </a>
                        )}
                        
                        {artist.contact.email && (
                          <a 
                            href={`mailto:${artist.contact.email}`}
                            className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
                          >
                            <Mail className="h-5 w-5 text-gray-600" />
                            <span>{artist.contact.email}</span>
                          </a>
                        )}
                        
                        {artist.contact.phone && (
                          <a 
                            href={`tel:${artist.contact.phone}`}
                            className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
                          >
                            <Phone className="h-5 w-5 text-green-600" />
                            <span>{artist.contact.phone}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* CTA Button */}
                  <div className="mt-6 w-full">
                    <Button className="w-full bg-red-500 hover:bg-red-600">
                      Agendar com {artist.first_name}
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Info column */}
              <div className="md:w-2/3">
                <h1 className="text-3xl font-bold mb-2">{fullName}</h1>
                <div className="flex items-center mb-6">
                  <Badge variant="secondary" className="mr-2">{artist.style}</Badge>
                  <div className="flex items-center text-gray-500">
                    <Map className="h-4 w-4 mr-1" />
                    <span className="text-sm">São Paulo, SP</span>
                  </div>
                </div>
                
                <Tabs defaultValue="about" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="about">Sobre</TabsTrigger>
                    <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="about">
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
                  </TabsContent>
                  
                  <TabsContent value="portfolio">
                    <h2 className="text-xl font-bold mb-4">Portfólio de Trabalhos</h2>
                    <ArtistPortfolio 
                      portfolio={portfolio} 
                      artistName={fullName} 
                      isLoading={isLoadingPortfolio} 
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </>
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
