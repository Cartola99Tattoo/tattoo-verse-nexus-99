
import React from "react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";
import Settings from "@/pages/admin/Settings";

const NaveMaeSettings = () => {
  return (
    <NaveMaeLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-red-800 mb-2">Configurações Centrais</h1>
          <p className="text-gray-600">
            Configurações mestras da plataforma 99Tattoo
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-xl">
          <Settings />
        </div>
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeSettings;
