
import React from "react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";
import Products from "@/pages/admin/Products";

const NaveMaeProducts = () => {
  return (
    <NaveMaeLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-red-800 mb-2">Gestão Central de Produtos</h1>
          <p className="text-gray-600">
            Catálogo unificado de produtos, tatuagens e serviços de toda a rede 99Tattoo
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-xl">
          <Products />
        </div>
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeProducts;
