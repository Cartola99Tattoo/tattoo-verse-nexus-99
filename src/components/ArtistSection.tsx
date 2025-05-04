
import React from 'react';

interface Artist {
  name: string;
  role: string;
  specialties: string[];
  image: string;
}

const ArtistSection: React.FC = () => {
  const artists: Artist[] = [
    {
      name: "Alex Mercer",
      role: "Tatuador Principal",
      specialties: ["Realismo", "Blackwork"],
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Julia Santos",
      role: "Especialista em Colorido",
      specialties: ["Aquarela", "New School"],
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Marco Rocha",
      role: "Mestre em Linhas Finas",
      specialties: ["Minimalista", "Geométrico"],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <section id="artistas" className="py-20 tech-pattern">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nossos <span className="text-tattoo-red">Artistas</span></h2>
          <div className="red-line mx-auto w-24 my-4"></div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Conheça os talentosos artistas por trás das criações do 99Tattoo. 
            Cada um possui um estilo único e especialidades distintas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {artists.map((artist, index) => (
            <div 
              key={index} 
              className="bg-tattoo-darkgray rounded-lg overflow-hidden futuristic-border group"
            >
              <div className="relative h-72 overflow-hidden">
                <img 
                  src={artist.image} 
                  alt={artist.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tattoo-black to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">{artist.name}</h3>
                <p className="text-tattoo-red mb-3">{artist.role}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {artist.specialties.map((specialty, i) => (
                    <span 
                      key={i} 
                      className="bg-tattoo-black px-3 py-1 rounded text-xs text-gray-300"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                <button className="w-full bg-transparent border border-tattoo-red text-tattoo-red py-2 rounded transition-all duration-300 hover:bg-tattoo-red hover:text-white">
                  Ver Portfolio
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-tattoo-red px-6 py-3 rounded futuristic-border hover:bg-tattoo-red/80 transition-all duration-300">
            Ver Todos os Artistas
          </button>
        </div>
      </div>
    </section>
  );
};

export default ArtistSection;
