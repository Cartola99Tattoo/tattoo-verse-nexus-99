
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ArtistInfoProps {
  id: number;
  name: string;
  avatar: string;
  bio: string;
}

const ArtistInfo = ({ id, name, avatar, bio }: ArtistInfoProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <div className="md:w-1/3 flex flex-col items-center">
        <img 
          src={avatar} 
          alt={name} 
          className="w-48 h-48 rounded-full object-cover mb-4"
        />
        <h3 className="text-xl font-bold mb-2 text-center">{name}</h3>
        <Button 
          asChild
          variant="outline"
          className="w-full"
        >
          <Link to={`/artists/${id}`}>Ver perfil completo</Link>
        </Button>
      </div>
      
      <div className="md:w-2/3">
        <h4 className="text-lg font-semibold mb-3">Sobre o Artista</h4>
        <p className="text-gray-700">{bio}</p>
        
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-3">Especialidades</h4>
          <div className="flex flex-wrap gap-2">
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Realismo</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Aquarela</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Geométrico</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistInfo;
