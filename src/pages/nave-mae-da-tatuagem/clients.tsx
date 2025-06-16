
import React from "react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";
import Clients from "@/pages/admin/Clients";

// Migração do módulo de clientes para a Nave-Mãe da Tatuagem
// Esta página encapsula todo o CRM existente mantendo a funcionalidade completa
const NaveMaeClients = () => {
  return (
    <NaveMaeLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-red-800 mb-2">Gestão Central de Clientes</h1>
          <p className="text-gray-600">
            Módulo CRM centralizado da Nave-Mãe para gerenciamento completo de clientes e leads da rede 99Tattoo
          </p>
        </div>
        
        {/* Componente de clientes completo do admin */}
        <div className="bg-white rounded-lg shadow-xl">
          <Clients />
        </div>
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeClients;
