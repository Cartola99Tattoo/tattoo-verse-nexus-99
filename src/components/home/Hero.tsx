
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-[90vh] bg-black overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?q=80&w=1976&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-transparent to-red-900/20" />
      
      <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
        <div className={`max-w-2xl transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
              Sua Tatuagem Personalizada
            </span>{" "}
            <span className="text-white">Começa Aqui</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-6 leading-relaxed">
            Você pode ter uma tatuagem personalizada que combine com seu corpo, criada em um estúdio seguro e higienizado!
          </p>
          <p className="text-lg text-gray-300 mb-8">
            Tatuagens exclusivas, artistas renomados e estúdio seguro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="xl"
              variant="tattoo"
              className="font-bold"
            >
              <Link to="/contact">Agende sua Tatuagem</Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="tattooOutline"
              className="bg-white/10 border-white text-white hover:bg-white hover:text-red-600 font-bold"
            >
              <Link to="/shop">Ver Catálogo</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
