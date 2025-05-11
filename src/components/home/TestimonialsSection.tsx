
import { useState } from "react";

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

  return (
    <section className="py-16 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            O Que Nossos <span className="text-red-500">Clientes Dizem</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Veja os depoimentos de clientes satisfeitos que confiaram em nosso trabalho
            para eternizar momentos e ideias em forma de arte.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="bg-gray-900 rounded-xl p-8 shadow-xl">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 mb-6 md:mb-0 flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-red-500">
                    <img
                      src={testimonials[currentIndex].image}
                      alt={testimonials[currentIndex].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                    {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                      <span key={i} className="inline-block">★</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="md:w-2/3 md:pl-8">
                <div className="text-2xl text-gray-200 italic mb-4">"{testimonials[currentIndex].text}"</div>
                <div className="text-lg font-bold">{testimonials[currentIndex].name}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8 gap-4">
            <button
              onClick={prevTestimonial}
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-red-500 flex items-center justify-center text-white transition-colors"
              aria-label="Anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  currentIndex === index ? "bg-red-500" : "bg-gray-500"
                } transition-colors`}
                aria-label={`Ir para o depoimento ${index + 1}`}
              />
            ))}
            <button
              onClick={nextTestimonial}
              className="w-10 h-10 rounded-full bg-gray-800 hover:bg-red-500 flex items-center justify-center text-white transition-colors"
              aria-label="Próximo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
