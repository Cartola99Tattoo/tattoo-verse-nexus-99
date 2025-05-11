
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1612632337513-873069904c4b?q=80&w=1887&auto=format&fit=crop"
                alt="Estúdio de tatuagem 99Tattoo"
                className="rounded-lg shadow-xl w-full max-w-lg mx-auto"
              />
              <div className="absolute -bottom-6 -right-6 bg-red-500 text-white p-4 rounded-lg shadow-lg hidden md:block">
                <span className="font-bold">10+</span>
                <p className="text-sm">Anos de experiência</p>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 md:pl-12">
            <h2 className="text-3xl font-bold mb-6 text-black">
              Sobre o <span className="text-red-500">99Tattoo</span>
            </h2>
            <p className="text-gray-700 mb-6">
              Somos um estúdio de tatuagem com mais de 10 anos de experiência, 
              dedicados a transformar suas ideias em arte permanente. Nossa equipe 
              é formada por tatuadores profissionais especializados em diversos estilos.
            </p>
            <p className="text-gray-700 mb-6">
              Na 99Tattoo, combinamos criatividade, técnica e os mais altos padrões 
              de segurança para garantir que você saia com uma tatuagem única 
              e que represente exatamente o que você deseja.
            </p>
            <div className="flex flex-wrap gap-6 mb-8">
              <div>
                <p className="text-3xl font-bold text-red-500">5000+</p>
                <p className="text-sm text-gray-600">Tatuagens realizadas</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-500">15+</p>
                <p className="text-sm text-gray-600">Artistas premiados</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-500">98%</p>
                <p className="text-sm text-gray-600">Clientes satisfeitos</p>
              </div>
            </div>
            <Button asChild className="bg-black hover:bg-gray-800 text-white">
              <Link to="/about">Conheça nossa história</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
