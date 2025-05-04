
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-tattoo-black border-t border-tattoo-red/20 py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold text-tattoo-white mb-4">
              <span className="text-tattoo-red">99</span>Tattoo
            </div>
            <p className="text-gray-400 mb-4">
              Transformando sua pele em obras de arte desde 2020.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-tattoo-red transition-colors">
                📱
              </a>
              <a href="#" className="text-gray-400 hover:text-tattoo-red transition-colors">
                📸
              </a>
              <a href="#" className="text-gray-400 hover:text-tattoo-red transition-colors">
                🐦
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Navegação</h3>
            <ul className="space-y-2">
              {['Home', 'Blog', 'Loja', 'Artistas', 'Contato'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase()}`} 
                    className="text-gray-400 hover:text-tattoo-red transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Informações</h3>
            <ul className="space-y-2">
              {['Sobre Nós', 'FAQ', 'Cuidados', 'Política de Privacidade', 'Termos de Uso'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-tattoo-red transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Receba novidades e promoções exclusivas.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Seu e-mail" 
                className="bg-tattoo-darkgray border border-tattoo-red/30 rounded-l py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:border-tattoo-red"
              />
              <button className="bg-tattoo-red px-4 rounded-r">
                →
              </button>
            </div>
          </div>
        </div>
        
        <div className="red-line my-6"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} 99Tattoo. Todos os direitos reservados.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-tattoo-red transition-colors text-sm">
              Política de Privacidade
            </a>
            <a href="#" className="text-gray-400 hover:text-tattoo-red transition-colors text-sm">
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
