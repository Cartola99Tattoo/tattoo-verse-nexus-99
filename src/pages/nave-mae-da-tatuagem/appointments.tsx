
import React from "react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";
import Appointments from "@/pages/admin/Appointments";

const NaveMaeAppointments = () => {
  return (
    <NaveMaeLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-red-800 mb-2">Gestão Central de Agendamentos</h1>
          <p className="text-gray-600">
            Controle total dos agendamentos de todos os estúdios da rede 99Tattoo
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-xl">
          <Appointments />
        </div>
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeAppointments;
