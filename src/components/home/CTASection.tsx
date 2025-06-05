
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para Transformar sua Ideia em Arte?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Agende uma consulta hoje mesmo e dê o primeiro passo para sua nova tatuagem.
            Nossos artistas estão ansiosos para criar algo único para você.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              asChild 
              size="xl"
              className="bg-white text-red-600 hover:bg-gray-100 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Link to="/shop">Ver Catálogo</Link>
            </Button>
            <Button 
              asChild 
              size="xl"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-red-600 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Link to="/contact">Agendar Consulta</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
