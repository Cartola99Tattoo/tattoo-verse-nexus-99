
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import useArtists from "@/hooks/useArtists";

const ArtistsSection = () => {
  const { artists, isLoading, updateQueryParams } = useArtists();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    updateQueryParams({ limit: 9 });
    setLoaded(true);
  }, [updateQueryParams]);

  if (isLoading && !loaded) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-transparent to-red-900/10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nossos{" "}
            <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
              Tatuadores Talentosos
            </span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
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
                    <Card variant="tattooDark" className="h-full overflow-hidden group">
                      <div className="h-64 overflow-hidden relative">
                        <img
                          src={artist.avatar_url || "https://images.unsplash.com/photo-1567008732142-53d03a7e23e1?q=80&w=2073&auto=format&fit=crop"}
                          alt={`${artist.first_name} ${artist.last_name}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-1 text-white">
                          {`${artist.first_name} ${artist.last_name}`}
                        </h3>
                        <p className="text-red-400 font-semibold mb-3">
                          Especialidade: {artist.style}
                        </p>
                        <p className="text-gray-300 mb-4 line-clamp-3">
                          {artist.bio}
                        </p>
                        <Button asChild variant="tattoo" className="w-full">
                          <Link to={`/artists/${artist.id}`}>
                            Ver Portfolio
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white border-red-600" />
                <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white border-red-600" />
              </div>
            </Carousel>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-400">Nenhum tatuador encontrado</p>
          </div>
        )}

        <div className="text-center mt-10">
          <Button asChild variant="tattoo" size="lg" className="font-bold">
            <Link to="/artists">Ver Todos os Tatuadores</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ArtistsSection;
