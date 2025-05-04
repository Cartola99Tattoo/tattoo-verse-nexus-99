
import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden tech-pattern">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[20%] left-[10%] w-32 h-32 rounded-full bg-tattoo-red/5 animate-pulse"></div>
        <div className="absolute bottom-[30%] right-[15%] w-40 h-40 rounded-full bg-tattoo-red/5 animate-pulse delay-300"></div>
      </div>

      <div className="container mx-auto px-4 py-20 z-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2 space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                <span className="text-tattoo-red">99Tattoo</span> <br />
                <span className="inline-block animate-slideRight opacity-0" style={{ animationDelay: '0.3s' }}>Apaixonados</span> <br />
                <span className="inline-block animate-slideRight opacity-0" style={{ animationDelay: '0.6s' }}>por Tatuagens</span>
              </h1>
              <div className="red-line my-6"></div>
            </div>
            
            <p className="text-xl text-gray-300 max-w-lg animate-slideRight opacity-0" style={{ animationDelay: '0.9s' }}>
              Arte futurista na pele, criada com paixão e tecnologia de ponta. 
              Transforme seu corpo em uma tela para expressão única.
            </p>
            
            <div className="flex gap-4 pt-4 animate-slideRight opacity-0" style={{ animationDelay: '1.2s' }}>
              <button className="bg-tattoo-red px-6 py-3 rounded futuristic-border flex items-center gap-2 hover:bg-tattoo-red/80 transition-all duration-300 clip-diagonal">
                Agendar Sessão <ArrowRight size={16} />
              </button>
              <button className="border border-tattoo-red/50 text-tattoo-red px-6 py-3 rounded futuristic-border hover:bg-tattoo-red/10 transition-all duration-300">
                Conhecer Artistas
              </button>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-tattoo-red/20 to-transparent rounded-full animate-float"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-2 border-tattoo-red/30 p-1 animate-glow">
                  <img 
                    src="https://images.unsplash.com/photo-1543322748-33df6d3db806?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                    alt="Tatuador trabalhando" 
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
