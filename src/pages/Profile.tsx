
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { UserEdit, Package, CreditCard, LogOut, Loader2 } from "lucide-react";

// Esquema de validação para perfil
const profileSchema = z.object({
  first_name: z.string().min(2, { message: "Nome é obrigatório" }),
  last_name: z.string().min(2, { message: "Sobrenome é obrigatório" }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user, profile, isLoading: authLoading, signOut, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const [isUpdating, setIsUpdating] = useState(false);

  // Formulário de perfil
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
    },
  });

  // Atualiza o formulário quando o perfil carregar
  useEffect(() => {
    if (profile) {
      profileForm.reset({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
      });
    }
  }, [profile]);

  // Redirecionar se não estiver logado
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Manipulador para atualização de perfil
  const onSubmitProfile = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
        
      if (error) throw error;
      
      await refreshProfile();
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar perfil",
        description: "Não foi possível salvar suas informações.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Manipulador para logout
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você saiu da sua conta com sucesso.",
      });
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Não foi possível fazer logout.",
      });
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="container py-12 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <p>Carregando perfil...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600">
                    {profile?.first_name?.charAt(0) || profile?.last_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </div>
                  <div>
                    <div className="font-medium">
                      {profile?.first_name && profile?.last_name 
                        ? `${profile.first_name} ${profile.last_name}` 
                        : user?.email || "Usuário"}
                    </div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair da Conta
            </Button>
          </div>
          
          {/* Main Content */}
          <div>
            <Tabs defaultValue="profile">
              <TabsList className="mb-6">
                <TabsTrigger value="profile">
                  <UserEdit className="mr-2 h-4 w-4" />
                  Perfil
                </TabsTrigger>
                <TabsTrigger value="orders">
                  <Package className="mr-2 h-4 w-4" />
                  Meus Pedidos
                </TabsTrigger>
                <TabsTrigger value="payment">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pagamentos
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                    <CardDescription>
                      Atualize suas informações pessoais.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="first_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="last_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sobrenome</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input value={user?.email || ""} disabled />
                          </FormControl>
                        </FormItem>
                        <Button type="submit" className="mt-2" disabled={isUpdating}>
                          {isUpdating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Salvando...
                            </>
                          ) : (
                            "Salvar Alterações"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Meus Pedidos</CardTitle>
                    <CardDescription>
                      Acompanhe o status dos seus pedidos.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {ordersLoading ? (
                      <div className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                        <p>Carregando seus pedidos...</p>
                      </div>
                    ) : orders && orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div 
                            key={order.id} 
                            className="border rounded-lg p-4 hover:border-primary transition-colors"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                              <div>
                                <div className="flex items-center">
                                  <span className="font-medium">{order.reference_code}</span>
                                  <span className="mx-2 text-gray-300">|</span>
                                  <span className="text-sm text-gray-500">
                                    {new Date(order.created_at).toLocaleDateString('pt-BR')}
                                  </span>
                                </div>
                                <div className="mt-1">
                                  <span className="text-sm">
                                    {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'itens'}
                                  </span>
                                  <span className="mx-2 text-gray-300">|</span>
                                  <span className="font-medium">
                                    R$ {order.total_amount.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center mt-3 md:mt-0 space-x-2">
                                <div className={`
                                  px-2 py-1 text-xs rounded-full
                                  ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                  ${order.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                                  ${order.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                                  ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                                `}>
                                  {order.status === 'pending' && 'Pendente'}
                                  {order.status === 'processing' && 'Processando'}
                                  {order.status === 'completed' && 'Concluído'}
                                  {order.status === 'cancelled' && 'Cancelado'}
                                </div>
                                <Button asChild variant="outline" size="sm">
                                  <Link to={`/orders/${order.id}`}>
                                    Detalhes
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">Você ainda não fez nenhum pedido.</p>
                        <Button asChild>
                          <Link to="/shop">Explorar Tatuagens</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="payment">
                <Card>
                  <CardHeader>
                    <CardTitle>Métodos de Pagamento</CardTitle>
                    <CardDescription>
                      Gerencie seus métodos de pagamento.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500 mb-4">
                      Esta funcionalidade estará disponível em breve!
                    </p>
                    <Button disabled>Adicionar Método de Pagamento</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
}
