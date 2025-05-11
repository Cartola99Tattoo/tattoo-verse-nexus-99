
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-16 bg-red-500 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para Transformar sua Ideia em Arte?
          </h2>
          <p className="text-lg md:text-xl mb-8">
            Agende uma consulta hoje mesmo e dê o primeiro passo para sua nova tatuagem.
            Nossos artistas estão ansiosos para criar algo único para você.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              asChild 
              size="lg"
              className="bg-white text-red-500 hover:bg-gray-100 text-lg font-bold"
            >
              <Link to="/shop">Ver Catálogo</Link>
            </Button>
            <Button 
              asChild 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 text-lg font-bold"
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
