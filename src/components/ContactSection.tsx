
import React from 'react';
import LeadForm from './LeadForm';

const ContactSection: React.FC = () => {
  return (
    <section id="contato" className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl font-bold mb-4">Entre em <span className="text-tattoo-red">Contato</span></h2>
            <div className="red-line w-24 my-4"></div>
            <p className="text-lg text-gray-300 mb-8">
              Pronto para transformar suas ideias em arte? Cadastre-se agora e receba novidades, 
              promoções exclusivas e conteúdos sobre o mundo da tatuagem.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-tattoo-red/20 flex items-center justify-center rounded-full flex-shrink-0">
                  <span className="text-tattoo-red">📍</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Localização</h3>
                  <p className="text-gray-400">Av. Paulista, 1000 - São Paulo, SP</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-tattoo-red/20 flex items-center justify-center rounded-full flex-shrink-0">
                  <span className="text-tattoo-red">🕒</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Horário de Funcionamento</h3>
                  <p className="text-gray-400">Segunda a Sábado: 10h às 20h</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-tattoo-red/20 flex items-center justify-center rounded-full flex-shrink-0">
                  <span className="text-tattoo-red">📞</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Contato</h3>
                  <p className="text-gray-400">contato@99tattoo.com</p>
                  <p className="text-gray-400">(11) 99999-9999</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-tattoo-red/20 flex items-center justify-center rounded-full hover:bg-tattoo-red/40 transition-colors">
                <span className="text-tattoo-red">📱</span>
              </a>
              <a href="#" className="w-10 h-10 bg-tattoo-red/20 flex items-center justify-center rounded-full hover:bg-tattoo-red/40 transition-colors">
                <span className="text-tattoo-red">📸</span>
              </a>
              <a href="#" className="w-10 h-10 bg-tattoo-red/20 flex items-center justify-center rounded-full hover:bg-tattoo-red/40 transition-colors">
                <span className="text-tattoo-red">🐦</span>
              </a>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <LeadForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
