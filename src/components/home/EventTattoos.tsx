
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const EventTattoos = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-20 relative overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(to right, #d61f3f, #ea384c, #ff596f)",
      }}
    >
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615212814093-f56085288bd1?q=80&w=2128&auto=format&fit=crop')] bg-cover bg-center"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div 
            className={`transition-all duration-1000 transform ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Tatuagens em Festas e Eventos
            </h2>
            <p className="text-white/90 text-lg mb-6 leading-relaxed">
              Transforme seu evento com uma experiência única e memorável. Oferecemos serviço de tatuagens para festas corporativas, casamentos, aniversários e eventos especiais.
            </p>
            <p className="text-white/90 text-lg mb-8 leading-relaxed">
              Nós da 99Tattoo priorizamos fechar parcerias com estúdios de tatuagem que levam a sua segurança e acolhimento a sério e com total prioridade! Com ambientes limpos, calmos e higienizados seguindo as normas de bio-segurança. Reserve seu horário hoje mesmo com um de nossos tatuadores!
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-red-500 hover:bg-gray-100 font-bold px-8 py-6 text-lg hover-scale"
            >
              <Link to="/contact" className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Solicite um Orçamento
              </Link>
            </Button>
          </div>
          <div 
            className={`transition-all duration-1000 delay-300 transform ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556195332-95503f664ced?q=80&w=2071&auto=format&fit=crop"
                alt="Tatuagens em eventos"
                className="w-full h-auto rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-5 -right-5 bg-white p-4 rounded-lg shadow-lg rotate-6 animate-pulse">
                <p className="text-red-500 font-bold text-xl">Perfeito para:</p>
                <ul className="text-gray-700">
                  <li>• Festas corporativas</li>
                  <li>• Casamentos</li>
                  <li>• Aniversários</li>
                  <li>• Eventos especiais</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventTattoos;
