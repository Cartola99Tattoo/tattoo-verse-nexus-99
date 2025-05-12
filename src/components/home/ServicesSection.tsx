
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    title: "Tatuagens Personalizadas",
    description: "Criamos desenhos exclusivos com base nas suas ideias e preferências",
    icon: "✏️",
    link: "/shop",
  },
  {
    title: "Cover-ups",
    description: "Transformamos tatuagens antigas em novas obras de arte",
    icon: "🔄",
    link: "/shop",
  },
  {
    title: "Tatuagens em Eventos",
    description: "Serviço exclusivo para festas e eventos corporativos",
    icon: "🎉",
    link: "/contact",
  },
  {
    title: "Consultoria",
    description: "Ajudamos você a escolher o estilo, tamanho e localização ideal",
    icon: "💬",
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nossos <span className="text-red-500">Serviços</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Oferecemos serviços exclusivos e personalizados para transformar suas ideias em arte na pele
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card
              key={service.title}
              className={`hover-lift overflow-hidden border border-gray-200 transition-all duration-700 transform ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{
                transitionDelay: `${index * 150}ms`,
              }}
            >
              <CardContent className="p-6 flex flex-col h-full">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-6 flex-grow">{service.description}</p>
                <Link
                  to={service.link}
                  className="text-red-500 hover:text-red-600 flex items-center font-medium group"
                >
                  Saiba mais
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
