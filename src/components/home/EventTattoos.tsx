
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const EventTattoos = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-black to-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div 
            className="rounded-lg overflow-hidden h-[500px]" 
            style={{
              backgroundImage: "url(https://images.unsplash.com/photo-1595475207225-428b62bda831?q=80&w=2069&auto=format&fit=crop)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="w-full h-full bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
              <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold inline-block mb-4 w-max">
                Novo
              </span>
              <h3 className="text-2xl font-bold mb-2">Festas & Eventos Corporativos</h3>
              <p className="mb-4 opacity-90">
                Flash tattoos e performances ao vivo
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="text-red-500">Eleve seu evento</span> com 
              <br />tatuagens exclusivas
            </h2>
            
            <p className="text-lg opacity-90">
              Transforme seu evento em uma experiência inesquecível com nosso serviço de tatuagens para festas, eventos corporativos e celebrações especiais.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-red-500 p-2 rounded-full mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Artistas Premiados</h4>
                  <p className="opacity-80">Nossa equipe de tatuadores talentosos traz profissionalismo e excelência para qualquer evento.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-red-500 p-2 rounded-full mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Personalização Total</h4>
                  <p className="opacity-80">Designs exclusivos para seu evento, seja corporativo, casamento ou festa particular.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-red-500 p-2 rounded-full mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Experiência Inesquecível</h4>
                  <p className="opacity-80">Crie memórias duradouras para seus convidados com uma atividade interativa e única.</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                asChild
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 rounded-md text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Link to="/events">
                  Reserve para seu evento
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventTattoos;
