
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative h-[80vh] bg-black overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?q=80&w=1976&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
      <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="text-red-500">99</span>Tattoo
          </h1>
          <p className="text-3xl md:text-4xl font-bold text-white mb-6">
            Apaixonados por Tatuagens
          </p>
          <p className="text-xl text-gray-200 mb-8">
            Escolha sua próxima arte e agende online com os melhores profissionais do mercado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-6 text-lg"
            >
              <Link to="/shop">Ver Catálogo</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white/10 font-bold px-8 py-6 text-lg"
            >
              <Link to="/contact">Agendar Consulta</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
