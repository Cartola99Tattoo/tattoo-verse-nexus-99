
import Layout from "@/components/layout/Layout";
import AuthForm from "@/components/Auth/AuthForm";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirecionar se o usuário já estiver autenticado
  useEffect(() => {
    if (user && !isLoading) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  // Mostrar nada enquanto verifica o estado de autenticação
  if (isLoading) {
    return null;
  }

  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">
            Acesse sua conta
          </h1>
          <AuthForm />
        </div>
      </div>
    </Layout>
  );
}
