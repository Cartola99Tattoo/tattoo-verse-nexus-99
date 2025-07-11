
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    title: "Consultoria Especializada",
    description: "Com uma Consultoria Especializada, você terá o suporte individual de um artista experiente para transformar suas ideias em uma arte que realmente ressoa com sua alma, garantindo uma tatuagem que conta sua história e evita arrependimentos futuros.",
    icon: "💬",
    link: "/consultoria",
  },
  {
    title: "Artistas Selecionados",
    description: "Nossa curadoria rigorosa reúne apenas os melhores tatuadores, cada um especializado em estilos únicos. Você não apenas escolhe um profissional, mas encontra o artista perfeito que dominará a técnica ideal para dar vida à sua visão com maestria incomparável.",
    icon: "🎨",
    link: "/artists",
  },
  {
    title: "Logística Completa",
    description: "Desde o primeiro contato até a cicatrização final, cuidamos de cada detalhe da sua jornada. Agendamento flexível, ambiente esterilizado, materiais premium e acompanhamento pós-tattoo - tudo pensado para que você se concentre apenas em viver essa experiência transformadora.",
    icon: "🔄",
    link: "/contact",
  },
  {
    title: "Marketing Integrado",
    description: "Sua tatuagem merece ser celebrada! Oferecemos sessões fotográficas profissionais, compartilhamento em nossas redes e campanhas que destacam sua nova arte. Transformamos seu momento especial em uma história inspiradora que conecta e emociona outras pessoas.",
    icon: "📱",
    link: "/contact",
  },
];

const ServicesSection = () => {
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
      className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tattoo-title-red">
            Nossos <span className="tattoo-title-gradient">Benefícios Exclusivos</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Oferecemos uma experiência completa e personalizada para transformar suas ideias em arte na pele, com acompanhamento especializado em cada etapa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card
              key={service.title}
              className={`group overflow-hidden tattoo-card-enhanced tattoo-hover-lift cursor-pointer ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{
                transitionDelay: `${index * 150}ms`,
              }}
            >
              <CardContent className="p-6 flex flex-col h-full relative">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                
                <div className="relative z-10">
                  <div className="text-4xl mb-4 p-3 bg-gradient-to-br from-red-100 to-red-200 rounded-full w-fit shadow-lg group-hover:shadow-xl group-hover:bg-gradient-to-br group-hover:from-red-200 group-hover:to-red-300 transition-all duration-300 tattoo-hover-glow">
                    {service.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 tattoo-title-red group-hover:text-red-700 transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-700 mb-6 flex-grow leading-relaxed group-hover:text-gray-800 transition-colors duration-300 text-sm">
                    {service.description}
                  </p>
                  
                  <Link
                    to={service.link}
                    className="inline-flex items-center font-medium text-red-600 hover:text-white bg-transparent hover:bg-gradient-to-r hover:from-red-600 hover:to-red-800 px-4 py-2 rounded-lg border-2 border-red-600 hover:border-red-800 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 group/link"
                  >
                    <span className="mr-2">Saiba mais</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1 duration-300" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
