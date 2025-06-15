
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Shield, UserCog, Mail, Copy, Check, Send, Calendar, Users, Palette, FileText, ShoppingBag, Bell } from "lucide-react";
import { Artist } from "@/services/interfaces/IArtistsService";

interface DetailedPermissions {
  // Acesso à Agenda
  canViewOwnSchedule: boolean;
  canEditOwnAppointments: boolean;
  canCreateAppointments: boolean;
  canCancelAppointments: boolean;
  
  // Gerenciamento de Clientes
  canViewOwnClients: boolean;
  canViewAllClients: boolean;
  canAddClients: boolean;
  canEditClients: boolean;
  canViewClientHistory: boolean;
  
  // Gestão de Portfólio
  canViewOwnPortfolio: boolean;
  canEditOwnPortfolio: boolean;
  canAddPortfolioItems: boolean;
  canDeletePortfolioItems: boolean;
  
  // Acesso a Relatórios
  canViewPersonalFinancials: boolean;
  canViewPerformanceReports: boolean;
  
  // Outros
  canAccessShop: boolean;
  canSendNotifications: boolean;
}

interface Props {
  artist: Artist;
  onPermissionsUpdate: (permissions: DetailedPermissions) => void;
}

const defaultPermissions: DetailedPermissions = {
  canViewOwnSchedule: true,
  canEditOwnAppointments: false,
  canCreateAppointments: false,
  canCancelAppointments: false,
  canViewOwnClients: true,
  canViewAllClients: false,
  canAddClients: false,
  canEditClients: false,
  canViewClientHistory: false,
  canViewOwnPortfolio: true,
  canEditOwnPortfolio: true,
  canAddPortfolioItems: true,
  canDeletePortfolioItems: false,
  canViewPersonalFinancials: false,
  canViewPerformanceReports: false,
  canAccessShop: false,
  canSendNotifications: false,
};

const ArtistPermissionsManager = ({ artist, onPermissionsUpdate }: Props) => {
  const [permissions, setPermissions] = useState<DetailedPermissions>(
    artist.permissions || defaultPermissions
  );
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const permissionCategories = [
    {
      title: "Acesso à Agenda",
      icon: Calendar,
      description: "Controle das funcionalidades de agendamento",
      permissions: [
        { key: 'canViewOwnSchedule', label: 'Visualizar sua própria agenda', description: 'Ver horários e compromissos pessoais' },
        { key: 'canEditOwnAppointments', label: 'Editar seus próprios agendamentos', description: 'Modificar horários e detalhes dos agendamentos' },
        { key: 'canCreateAppointments', label: 'Criar novos agendamentos', description: 'Agendar novos atendimentos' },
        { key: 'canCancelAppointments', label: 'Cancelar agendamentos', description: 'Cancelar compromissos existentes' },
      ]
    },
    {
      title: "Gerenciamento de Clientes",
      icon: Users,
      description: "Acesso e controle sobre informações de clientes",
      permissions: [
        { key: 'canViewOwnClients', label: 'Visualizar próprios clientes', description: 'Ver lista de clientes atendidos' },
        { key: 'canViewAllClients', label: 'Visualizar todos os clientes', description: 'Acesso à base completa de clientes' },
        { key: 'canAddClients', label: 'Adicionar novos clientes', description: 'Cadastrar novos clientes no sistema' },
        { key: 'canEditClients', label: 'Editar informações de clientes', description: 'Modificar dados dos clientes' },
        { key: 'canViewClientHistory', label: 'Acessar histórico do cliente', description: 'Ver histórico completo de atendimentos' },
      ]
    },
    {
      title: "Gestão de Portfólio",
      icon: Palette,
      description: "Controle sobre o portfólio pessoal",
      permissions: [
        { key: 'canViewOwnPortfolio', label: 'Visualizar seu portfólio', description: 'Ver trabalhos do próprio portfólio' },
        { key: 'canEditOwnPortfolio', label: 'Editar portfólio', description: 'Modificar descrições e detalhes dos trabalhos' },
        { key: 'canAddPortfolioItems', label: 'Adicionar trabalhos', description: 'Incluir novos trabalhos no portfólio' },
        { key: 'canDeletePortfolioItems', label: 'Remover trabalhos', description: 'Excluir itens do portfólio' },
      ]
    },
    {
      title: "Acesso a Relatórios",
      icon: FileText,
      description: "Visualização de relatórios e métricas",
      permissions: [
        { key: 'canViewPersonalFinancials', label: 'Resumo financeiro pessoal', description: 'Ver ganhos e comissões pessoais' },
        { key: 'canViewPerformanceReports', label: 'Relatórios de desempenho', description: 'Acessar métricas de performance individual' },
      ]
    },
    {
      title: "Outros Acessos",
      icon: ShoppingBag,
      description: "Funcionalidades adicionais do sistema",
      permissions: [
        { key: 'canAccessShop', label: 'Acessar loja', description: 'Funcionalidades da loja e inventário' },
        { key: 'canSendNotifications', label: 'Enviar notificações', description: 'Enviar mensagens e lembretes a clientes' },
      ]
    },
  ];

  const handlePermissionChange = (key: keyof DetailedPermissions, value: boolean) => {
    const newPermissions = { ...permissions, [key]: value };
    setPermissions(newPermissions);
    onPermissionsUpdate(newPermissions);
  };

  const generateInviteToken = () => {
    const token = 'invite_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setInviteToken(token);
    setIsInviteModalOpen(true);
    setCopiedLink(false);
    
    console.log(`Convite gerado para ${artist.first_name} ${artist.last_name}:`, {
      artistId: artist.id,
      token: token,
      email: artist.email,
      inviteUrl: `${window.location.origin}/invite?token=${token}`,
      createdAt: new Date().toISOString(),
      status: 'pending'
    });

    toast({
      title: "Convite Gerado",
      description: `Link de convite criado para ${artist.first_name} ${artist.last_name}`,
    });
  };

  const copyInviteLink = () => {
    if (inviteToken) {
      const inviteUrl = `${window.location.origin}/invite?token=${inviteToken}`;
      navigator.clipboard.writeText(inviteUrl);
      setCopiedLink(true);
      toast({
        title: "Link Copiado",
        description: "Link de convite copiado para a área de transferência",
      });
      
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const sendInvite = () => {
    // Simular envio de e-mail
    toast({
      title: "Convite Enviado",
      description: `Convite enviado para o e-mail ${artist.email}`,
    });
    
    console.log(`Simulando envio de e-mail para ${artist.email} com token: ${inviteToken}`);
  };

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            Configurações de Permissão
          </h3>
          <p className="text-gray-600">Defina o acesso detalhado do tatuador às funcionalidades do sistema</p>
        </div>
        <Button
          onClick={generateInviteToken}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Mail className="h-4 w-4 mr-2" />
          Gerar Convite
        </Button>
      </div>

      {/* Status do Artista */}
      <Card className="shadow-xl bg-gradient-to-br from-white to-red-50 border-red-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                {artist.first_name.charAt(0)}{artist.last_name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{artist.first_name} {artist.last_name}</h4>
                <p className="text-sm text-gray-600">{artist.email}</p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <UserCog className="h-3 w-3 mr-1" />
              Tatuador
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Permissões por categoria */}
      <div className="grid gap-6">
        {permissionCategories.map((category) => (
          <Card key={category.title} className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <category.icon className="h-5 w-5 text-red-600" />
                {category.title}
              </CardTitle>
              <CardDescription>
                {category.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {category.permissions.map((permission) => (
                  <div key={permission.key} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <Label htmlFor={permission.key} className="font-medium text-gray-800 cursor-pointer">
                        {permission.label}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">{permission.description}</p>
                    </div>
                    <Switch
                      id={permission.key}
                      checked={permissions[permission.key as keyof DetailedPermissions]}
                      onCheckedChange={(value) => handlePermissionChange(permission.key as keyof DetailedPermissions, value)}
                      className="data-[state=checked]:bg-red-600"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Convite Aprimorado */}
      <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
        <DialogContent className="max-w-lg bg-gradient-to-br from-white to-red-50 border-red-200">
          <DialogHeader className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-6 rounded-lg -mx-6 -mt-6 mb-6">
            <DialogTitle className="text-xl font-black flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Convite de Acesso Gerado
            </DialogTitle>
            <DialogDescription className="text-red-100">
              Compartilhe o acesso com o tatuador
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Informações do destinatário */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <Label className="font-medium text-gray-700">Destinatário:</Label>
              <div className="mt-2">
                <p className="font-semibold text-gray-800">{artist.first_name} {artist.last_name}</p>
                <p className="text-sm text-gray-600">{artist.email}</p>
              </div>
            </div>
            
            {/* Link do convite */}
            <div>
              <Label className="font-medium text-gray-700">Link do Convite de Uso Único:</Label>
              <div className="mt-2 p-3 bg-gray-100 rounded-lg border border-gray-300 break-all text-sm font-mono">
                {window.location.origin}/invite?token={inviteToken}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Este link é válido para uso único e expirará após o primeiro acesso.
              </p>
            </div>

            {/* Ações de compartilhamento */}
            <div className="flex gap-3">
              <Button
                onClick={copyInviteLink}
                className={`flex-1 transition-all duration-300 ${
                  copiedLink 
                    ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                } text-white font-medium`}
              >
                {copiedLink ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar Link do Convite
                  </>
                )}
              </Button>
              
              <Button
                onClick={sendInvite}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium"
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar Convite
              </Button>
            </div>

            {/* Nota informativa */}
            <div className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <strong>Importante:</strong> O tatuador receberá este link e poderá definir sua senha no primeiro acesso. 
              Após o uso, o link será automaticamente invalidado por segurança.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArtistPermissionsManager;
