import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function Profile() {
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const { session, user, profile, isLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!session && !isLoading) {
      navigate("/auth");
    }

    if (profile) {
      setValue("firstName", profile.first_name || "");
      setValue("lastName", profile.last_name || "");
      setValue("email", user?.email || "");
    }
  }, [session, user, profile, isLoading, setValue, navigate]);

  const onSubmit = async (data: FormData) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
        })
        .eq("id", user?.id);

      if (error) {
        throw error;
      }
      
      toast({
        title: "Perfil atualizado com sucesso!",
      });
      
      await refreshProfile();
      reset(data);
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar o perfil",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-6">
            Meu Perfil
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="firstName">Nome</Label>
              <Input
                id="firstName"
                type="text"
                {...register("firstName")}
                placeholder="Nome"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input
                id="lastName"
                type="text"
                {...register("lastName")}
                placeholder="Sobrenome"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Email"
                disabled
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <Button type="submit" disabled={isUpdating} className="w-full">
              {isUpdating ? "Atualizando..." : "Atualizar Perfil"}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
