
import React from "react";
import UnifiedLoginForm from "./UnifiedLoginForm";
import RegisterOptions from "./RegisterOptions";

const EcosistemaHero = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 flex items-center justify-center p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
            Bem-vindo ao{" "}
            <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
              Ecossistema
            </span>
          </h1>
          <h2 className="text-6xl md:text-8xl font-black text-white mb-8">
            99Tattoo
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12">
            Conectando tatuadores e clientes em uma experiência única, 
            segura e profissional
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Formulário de Login */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Já faz parte do ecossistema?
            </h3>
            <UnifiedLoginForm />
          </div>

          {/* Opções de Cadastro */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Primeira vez aqui?
            </h3>
            <RegisterOptions />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcosistemaHero;
