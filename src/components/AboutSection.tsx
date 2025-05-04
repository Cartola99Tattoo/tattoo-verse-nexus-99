
import React from 'react';

const AboutSection: React.FC = () => {
  const features = [
    {
      title: "Arte Personalizada",
      description: "Cada tatuagem é única e desenvolvida exclusivamente para você.",
      icon: "✦"
    },
    {
      title: "Equipamentos Avançados",
      description: "Utilizamos apenas os mais modernos equipamentos do mercado.",
      icon: "✧"
    },
    {
      title: "Ambiente Esterilizado",
      description: "Segurança e higiene são nossas prioridades absolutas.",
      icon: "⁂"
    },
    {
      title: "Artistas Premiados",
      description: "Nossa equipe é formada por tatuadores premiados internacionalmente.",
      icon: "⁑"
    }
  ];

  return (
    <section id="home" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Sobre o <span className="text-tattoo-red">99Tattoo</span></h2>
          <div className="red-line mx-auto w-24 my-4"></div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Fundado em 2020, o 99Tattoo surgiu da paixão por transformar a pele em uma tela para expressão artística. 
            Nossa missão é criar tatuagens que contam histórias e transcendem o tempo com um toque futurista.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-tattoo-darkgray rounded-lg p-6 futuristic-border transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-tattoo-red/20"
            >
              <div className="text-4xl text-tattoo-red mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
