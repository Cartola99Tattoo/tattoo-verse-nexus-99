
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <Card variant="tattoo" className="relative overflow-hidden">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1612632337513-873069904c4b?q=80&w=1887&auto=format&fit=crop"
                  alt="Estúdio de tatuagem 99Tattoo"
                  className="rounded-lg w-full max-w-lg mx-auto"
                />
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-lg shadow-red-glow hidden md:block">
                  <span className="font-bold text-2xl">10+</span>
                  <p className="text-sm font-medium">Anos de experiência</p>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">
              Sobre o{" "}
              <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                99Tattoo
              </span>
            </h2>
            <p className="text-gray-700 mb-6 text-lg leading-relaxed">
              Somos um estúdio de tatuagem com mais de 10 anos de experiência, 
              dedicados a transformar suas ideias em arte permanente. Nossa equipe 
              é formada por tatuadores profissionais especializados em diversos estilos.
            </p>
            <p className="text-gray-700 mb-8 text-lg leading-relaxed">
              Na 99Tattoo, combinamos criatividade, técnica e os mais altos padrões 
              de segurança para garantir que você saia com uma tatuagem única 
              e que represente exatamente o que você deseja.
            </p>
            
            <div className="grid grid-cols-3 gap-6 mb-8">
              <Card variant="tattooRed" className="text-center p-4">
                <CardContent className="p-0">
                  <p className="text-3xl font-bold text-red-600 mb-1">5000+</p>
                  <p className="text-sm text-gray-600 font-medium">Tatuagens realizadas</p>
                </CardContent>
              </Card>
              <Card variant="tattooRed" className="text-center p-4">
                <CardContent className="p-0">
                  <p className="text-3xl font-bold text-red-600 mb-1">15+</p>
                  <p className="text-sm text-gray-600 font-medium">Artistas premiados</p>
                </CardContent>
              </Card>
              <Card variant="tattooRed" className="text-center p-4">
                <CardContent className="p-0">
                  <p className="text-3xl font-bold text-red-600 mb-1">98%</p>
                  <p className="text-sm text-gray-600 font-medium">Clientes satisfeitos</p>
                </CardContent>
              </Card>
            </div>
            
            <Button asChild variant="tattooBlack" size="lg" className="font-bold">
              <Link to="/about">Conheça nossa história</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
