
import React from "react";
import MultiTenantTestDashboard from "@/components/admin/MultiTenantTestDashboard";

const MultiTenantTests = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Testes Multi-Tenant
        </h1>
        <p className="text-gray-600">
          Validação completa da segregação de dados, agregação, segurança e performance 
          do sistema multi-tenant 99Tattoo.
        </p>
      </div>
      
      <MultiTenantTestDashboard />
    </div>
  );
};

export default MultiTenantTests;
