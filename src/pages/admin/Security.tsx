
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shield, Lock, User, UserCheck, Key, Eye, Mail } from "lucide-react";

export default function Security() {
  const { user, profile } = useAuth();

  // Verificar se o usuário tem permissão para acessar o painel
  if (!user || !profile || profile.role !== "admin") {
    return <Navigate to="/access-denied" />;
  }

  return (
    <AdminLayout 
      title="Segurança" 
      description="Configurações de segurança e permissões do sistema"
    >
      <div className="p-6">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="roles">Funções e Permissões</TabsTrigger>
            <TabsTrigger value="access">Controle de Acesso</TabsTrigger>
            <TabsTrigger value="password">Política de Senhas</TabsTrigger>
            <TabsTrigger value="logs">Logs de Atividade</TabsTrigger>
            <TabsTrigger value="2fa">Autenticação 2FA</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Usuários do Sistema</CardTitle>
                  <CardDescription>Gerenciar contas de usuários administrativos</CardDescription>
                </div>
                <Button size="sm">Novo Usuário</Button>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <div className="grid grid-cols-12 border-b px-4 py-3 font-medium text-sm text-gray-500">
                    <div className="col-span-3">Nome</div>
                    <div className="col-span-3">Email</div>
                    <div className="col-span-2">Função</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2 text-right">Ações</div>
                  </div>
                  
                  <div className="grid grid-cols-12 items-center px-4 py-3 hover:bg-gray-50 border-b">
                    <div className="col-span-3 flex items-center gap-2">
                      <User size={16} />
                      <span>Admin Demo</span>
                    </div>
                    <div className="col-span-3">admin@demo.com</div>
                    <div className="col-span-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Administrador</span>
                    </div>
                    <div className="col-span-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Ativo</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <Button variant="ghost" size="sm">Editar</Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 items-center px-4 py-3 hover:bg-gray-50 border-b">
                    <div className="col-span-3 flex items-center gap-2">
                      <User size={16} />
                      <span>Maria Oliveira</span>
                    </div>
                    <div className="col-span-3">maria@99tattoo.com</div>
                    <div className="col-span-2">
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">Artista</span>
                    </div>
                    <div className="col-span-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Ativo</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <Button variant="ghost" size="sm">Editar</Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 items-center px-4 py-3 hover:bg-gray-50">
                    <div className="col-span-3 flex items-center gap-2">
                      <User size={16} />
                      <span>João Silva</span>
                    </div>
                    <div className="col-span-3">joao@99tattoo.com</div>
                    <div className="col-span-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Atendente</span>
                    </div>
                    <div className="col-span-2">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Inativo</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <Button variant="ghost" size="sm">Editar</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Funções e Permissões</CardTitle>
                  <CardDescription>Gerenciar funções de usuários e permissões</CardDescription>
                </div>
                <Button size="sm">Nova Função</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Administrador</CardTitle>
                      <CardDescription>Acesso completo ao sistema</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">Esta função tem acesso irrestrito a todas as funcionalidades do sistema.</p>
                      <p className="text-center py-4 text-muted-foreground text-sm">
                        Funcionalidade em desenvolvimento. Aqui serão exibidas e gerenciadas as permissões desta função.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Artista</CardTitle>
                      <CardDescription>Acesso aos recursos de arte e agendamentos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">Esta função tem acesso a gerenciamento de portfólio, agendamentos e clientes.</p>
                      <p className="text-center py-4 text-muted-foreground text-sm">
                        Funcionalidade em desenvolvimento. Aqui serão exibidas e gerenciadas as permissões desta função.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Atendente</CardTitle>
                      <CardDescription>Acesso aos recursos de atendimento ao cliente</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">Esta função tem acesso a gerenciamento de agendamentos e pedidos.</p>
                      <p className="text-center py-4 text-muted-foreground text-sm">
                        Funcionalidade em desenvolvimento. Aqui serão exibidas e gerenciadas as permissões desta função.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="access" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Controle de Acesso</CardTitle>
                <CardDescription>Gerenciar configurações de acesso ao sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Bloqueio automático de conta</Label>
                      <p className="text-sm text-muted-foreground">
                        Bloqueia contas após múltiplas tentativas de login malsucedidas
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Autenticação baseada em IP</Label>
                      <p className="text-sm text-muted-foreground">
                        Limita o acesso a endereços IP específicos
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Sessões simultâneas</Label>
                      <p className="text-sm text-muted-foreground">
                        Permite que usuários façam login em múltiplos dispositivos
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Expiração de sessão</Label>
                      <p className="text-sm text-muted-foreground">
                        Define o tempo de expiração da sessão
                      </p>
                    </div>
                    <div className="w-20">
                      <Input type="number" defaultValue="30" min="5" max="120" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Salvar Configurações</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="password" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Política de Senhas</CardTitle>
                <CardDescription>Configurar requisitos de senha para usuários</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Comprimento mínimo</Label>
                      <p className="text-sm text-muted-foreground">
                        Número mínimo de caracteres na senha
                      </p>
                    </div>
                    <div className="w-20">
                      <Input type="number" defaultValue="8" min="6" max="20" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Exigir letra maiúscula</Label>
                      <p className="text-sm text-muted-foreground">
                        A senha deve conter pelo menos uma letra maiúscula
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Exigir número</Label>
                      <p className="text-sm text-muted-foreground">
                        A senha deve conter pelo menos um número
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Exigir caractere especial</Label>
                      <p className="text-sm text-muted-foreground">
                        A senha deve conter pelo menos um caractere especial
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Expiração de senha</Label>
                      <p className="text-sm text-muted-foreground">
                        Força os usuários a alterar a senha periodicamente (dias)
                      </p>
                    </div>
                    <div className="w-20">
                      <Input type="number" defaultValue="90" min="0" max="365" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Salvar Política</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Logs de Atividade</CardTitle>
                <CardDescription>Registro de atividades no sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  <Eye className="mx-auto h-16 w-16 opacity-20 mb-2" />
                  Funcionalidade em desenvolvimento. Aqui serão exibidos os logs de atividades do sistema.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="2fa" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Autenticação de Dois Fatores (2FA)</CardTitle>
                <CardDescription>Configure a autenticação de dois fatores para contas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Ativar 2FA para administradores</Label>
                      <p className="text-sm text-muted-foreground">
                        Exige 2FA para contas com permissões administrativas
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Opcional para outros usuários</Label>
                      <p className="text-sm text-muted-foreground">
                        Permite que outros usuários ativem 2FA se desejarem
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Método de 2FA</Label>
                      <p className="text-sm text-muted-foreground">
                        Escolha os métodos de 2FA disponíveis
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Mail size={14} />
                        Email
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Shield size={14} />
                        App
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Expiração do código</Label>
                      <p className="text-sm text-muted-foreground">
                        Tempo de expiração do código 2FA (minutos)
                      </p>
                    </div>
                    <div className="w-20">
                      <Input type="number" defaultValue="5" min="1" max="30" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Salvar Configurações</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
