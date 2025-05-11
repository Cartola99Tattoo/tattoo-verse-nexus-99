
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const artistsData = [
  {
    id: 1,
    name: "Mariana Silva",
    specialty: "Realismo",
    image: "https://images.unsplash.com/photo-1567008732142-53d03a7e23e1?q=80&w=2073&auto=format&fit=crop",
    bio: "Especialista em realismo e retratos, com 8 anos de experiência.",
  },
  {
    id: 2,
    name: "Rafael Costa",
    specialty: "Blackwork",
    image: "https://images.unsplash.com/photo-1568605145234-7700e76cfa4b?q=80&w=1964&auto=format&fit=crop",
    bio: "Mestre em técnicas de blackwork e geometria, tatuador há 12 anos.",
  },
  {
    id: 3,
    name: "Juliana Mendes",
    specialty: "Aquarela",
    image: "https://images.unsplash.com/photo-1630236350627-1c68462dd3c9?q=80&w=1964&auto=format&fit=crop",
    bio: "Especializada em técnicas de aquarela e minimalismo, 6 anos de carreira.",
  },
];

const ArtistsSection = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-4">
            Nossos Artistas <span className="text-red-500">Tatuadores</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Conheça nossa equipe de tatuadores profissionais, cada um com seu estilo único 
            e anos de experiência para criar a arte perfeita para você.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {artistsData.map((artist) => (
            <div
              key={artist.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:translate-y-[-5px]"
            >
              <div className="h-80 overflow-hidden">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{artist.name}</h3>
                <p className="text-red-500 font-semibold mb-3">Especialidade: {artist.specialty}</p>
                <p className="text-gray-600 mb-4">{artist.bio}</p>
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
          ))}
        </div>

        <div className="text-center mt-10">
          <Button asChild className="bg-black hover:bg-gray-800 text-white">
            <Link to="/artists">Ver Todos os Artistas</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ArtistsSection;
