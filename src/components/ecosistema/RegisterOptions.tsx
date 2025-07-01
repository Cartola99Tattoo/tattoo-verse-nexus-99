
import React from "react";
import { Button } from "@/components/ui/button";
import { User, Building, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const RegisterOptions = () => {
  return (
    <div className="space-y-4">
      <Link to="/register/cliente">
        <Button className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-6 text-lg group">
          <User className="mr-3 h-5 w-5" />
          <div className="text-left flex-1">
            <div className="font-bold">Cadastrar como Cliente</div>
            <div className="text-sm text-red-100">Quero fazer uma tatuagem</div>
          </div>
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>

      <Link to="/register/estudio">
        <Button variant="outline" className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 font-bold py-6 text-lg group">
          <Building className="mr-3 h-5 w-5" />
          <div className="text-left flex-1">
            <div className="font-bold">Cadastrar sua Loja/Estúdio</div>
            <div className="text-sm text-gray-300">Quero usar a plataforma</div>
          </div>
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>

      <div className="text-center mt-6">
        <p className="text-gray-300 text-sm mb-2">Tatuador independente?</p>
        <Link 
          to="/tatuadores-da-nova-era" 
          className="text-red-300 hover:text-red-200 text-sm underline transition-colors"
        >
          Conheça a Comunidade Tatuadores da Nova Era
        </Link>
      </div>
    </div>
  );
};

export default RegisterOptions;
