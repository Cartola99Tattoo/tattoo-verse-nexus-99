
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import useArtists from "@/hooks/useArtists";

const ArtistsSection = () => {
  const { artists, isLoading, updateQueryParams } = useArtists();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Carregar todos os artistas quando o componente for montado
    updateQueryParams({ limit: 9 });
    setLoaded(true);
  }, [updateQueryParams]);

  if (isLoading && !loaded) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <p>Carregando tatuadores...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-4">
            Nossos <span className="text-red-500">Tatuadores Talentosos</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Conheça nossa equipe de tatuadores profissionais, cada um com seu estilo único 
            e anos de experiência para criar a arte perfeita para você.
          </p>
        </div>

        {artists && artists.length > 0 ? (
          <div className="relative px-4 md:px-10">
            <Carousel
              opts={{
                align: "start",
                loop: true
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {artists.map((artist) => (
                  <CarouselItem key={artist.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:translate-y-[-5px] h-full">
                      <div className="h-64 overflow-hidden">
                        <img
                          src={artist.avatar_url || "https://images.unsplash.com/photo-1567008732142-53d03a7e23e1?q=80&w=2073&auto=format&fit=crop"}
                          alt={`${artist.first_name} ${artist.last_name}`}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-1">{`${artist.first_name} ${artist.last_name}`}</h3>
                        <p className="text-red-500 font-semibold mb-3">Especialidade: {artist.style}</p>
                        <p className="text-gray-600 mb-4 line-clamp-3">{artist.bio}</p>
                        <Link 
                          to={`/artists/${artist.id}`}
                          className="text-black font-medium hover:text-red-500 inline-flex items-center"
                        >
                          Ver portfolio
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2" />
              </div>
            </Carousel>
          </div>
        ) : (
          <div className="text-center py-10">
            <p>Nenhum tatuador encontrado</p>
          </div>
        )}

        <div className="text-center mt-10">
          <Button asChild className="bg-black hover:bg-gray-800 text-white">
            <Link to="/artists">Ver Todos os Tatuadores</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ArtistsSection;
