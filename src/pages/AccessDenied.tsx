
import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { AlertCircle } from "lucide-react";

const AccessDenied = () => {
  return (
    <>
      <Helmet>
        <title>Acesso Negado - 99Tattoo</title>
      </Helmet>
      <Layout>
        <div className="container flex flex-col items-center justify-center py-20">
          <div className="text-red-500 mb-6">
            <AlertCircle size={64} />
          </div>
          <h1 className="text-4xl font-bold mb-4">Acesso Negado</h1>
          <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
            Você não tem permissão para acessar esta página. Entre em contato com o administrador se acreditar que isto é um erro.
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <Link to="/">Voltar para o Início</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/auth">Fazer Login como outro usuário</Link>
            </Button>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AccessDenied;
