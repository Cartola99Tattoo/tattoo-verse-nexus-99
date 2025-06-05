
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Carlos Rodrigues",
    image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=1780&auto=format&fit=crop",
    text: "Fiquei extremamente satisfeito com minha tatuagem! O artista entendeu perfeitamente o que eu queria e superou minhas expectativas. O estúdio é limpo, organizado e todo o procedimento foi feito com segurança.",
    rating: 5,
  },
  {
    id: 2,
    name: "Amanda Oliveira",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
    text: "A experiência na 99Tattoo foi incrível do começo ao fim. Desde a consulta inicial até o cuidado pós-tatuagem, eles foram super atenciosos e profissionais. Amei o resultado final!",
    rating: 5,
  },
  {
    id: 3,
    name: "Felipe Santos",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
    text: "Já fiz 3 tatuagens na 99Tattoo e sempre saio satisfeito. A qualidade do trabalho é consistente e os preços são justos pelo que entregam. Recomendo fortemente.",
    rating: 4,
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            O Que Nossos{" "}
            <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
              Clientes Dizem
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Veja os depoimentos de clientes satisfeitos que confiaram em nosso trabalho
            para eternizar momentos e ideias em forma de arte.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <Card variant="tattooDark" className="overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/3 flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 ring-4 ring-red-500">
                    <img
                      src={currentTestimonial.image}
                      alt={currentTestimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    {currentTestimonial.name}
                  </h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < currentTestimonial.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <blockquote className="text-lg text-gray-300 leading-relaxed italic">
                    "{currentTestimonial.text}"
                  </blockquote>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-8 gap-4">
            <Button
              variant="tattooOutline"
              size="icon"
              onClick={prevTestimonial}
              className="bg-white/10 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-red-500 scale-125"
                      : "bg-gray-600 hover:bg-gray-500"
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="tattooOutline"
              size="icon"
              onClick={nextTestimonial}
              className="bg-white/10 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
