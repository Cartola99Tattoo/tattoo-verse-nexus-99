
import React from "react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";
import TattooArtistPortfolio from "@/components/tattoo-artists/TattooArtistPortfolio";

const TattooArtistsPortfolio = () => {
  // Mock artist ID - em produção viria do contexto de autenticação
  const currentArtistId = "artist_1";

  return (
    <TattooArtistLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-16">
          <h1 className="text-5xl font-bold mb-6">
            Meu 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600"> Portfólio</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Gerencie e showcaseie seus trabalhos para atrair novos clientes e construir sua reputação profissional
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <TattooArtistPortfolio artistId={currentArtistId} />
        </div>
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistsPortfolio;
