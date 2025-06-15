
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Shield, UserCog, Mail, Copy, Eye, Edit, Users, Plus, DollarSign, ShoppingBag, Calendar, FileText } from "lucide-react";
import { Artist } from "@/services/interfaces/IArtistsService";

interface ArtistPermissions {
  canViewOwnAppointments: boolean;
  canEditOwnAppointments: boolean;
  canViewClients: boolean;
  canAddClients: boolean;
  canEditOwnPortfolio: boolean;
  canViewFinancialSummary: boolean;
  canAccessShop: boolean;
  canViewReports: boolean;
}

interface Props {
  artist: Artist;
  onPermissionsUpdate: (permissions: ArtistPermissions) => void;
}

const defaultPermissions: ArtistPermissions = {
  canViewOwnAppointments: true,
  canEditOwnAppointments: false,
  canViewClients: false,
  canAddClients: false,
  canEditOwnPortfolio: true,
  canViewFinancialSummary: false,
  canAccessShop: false,
  canViewReports: false,
};

const ArtistPermissionsManager = ({ artist, onPermissionsUpdate }: Props) => {
  const [permissions, setPermissions] = useState<ArtistPermissions>(
    artist.permissions || defaultPermissions
  );
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteToken, setInviteToken] = useState<string | null>(null);

  const permissionItems = [
    {
      key: 'canViewOwnAppointments' as keyof ArtistPermissions,
      label: 'Ver Próprios Agendamentos',
      description: 'Permite visualizar sua agenda pessoal',
      icon: Calendar,
      category: 'Agendamentos'
    },
    {
      key: 'canEditOwnAppointments' as keyof ArtistPermissions,
      label: 'Editar Próprios Agendamentos',
      description: 'Permite modificar seus agendamentos',
      icon: Edit,
      category: 'Agendamentos'
    },
    {
      key: 'canViewClients' as keyof ArtistPermissions,
      label: 'Visualizar Clientes',
      description: 'Acesso à lista de clientes',
      icon: Eye,
      category: 'Clientes'
    },
    {
      key: 'canAddClients' as keyof ArtistPermissions,
      label: 'Adicionar Clientes',
      description: 'Permite cadastrar novos clientes',
      icon: Plus,
      category: 'Clientes'
    },
    {
      key: 'canEditOwnPortfolio' as keyof ArtistPermissions,
      label: 'Gerenciar Portfólio',
      description: 'Editar e atualizar portfólio pessoal',
      icon: Users,
      category: 'Portfólio'
    },
    {
      key: 'canViewFinancialSummary' as keyof ArtistPermissions,
      label: 'Ver Resumo Financeiro',
      description: 'Acesso a resumos financeiros pessoais',
      icon: DollarSign,
      category: 'Financeiro'
    },
    {
      key: 'canAccessShop' as keyof ArtistPermissions,
      label: 'Acessar Loja',
      description: 'Funcionalidades da loja virtual',
      icon: ShoppingBag,
      category: 'Loja'
    },
    {
      key: 'canViewReports' as keyof ArtistPermissions,
      label: 'Ver Relatórios',
      description: 'Acesso a relatórios básicos',
      icon: FileText,
      category: 'Relatórios'
    },
  ];

  const handlePermissionChange = (key: keyof ArtistPermissions, value: boolean) => {
    const newPermissions = { ...permissions, [key]: value };
    setPermissions(newPermissions);
    onPermissionsUpdate(newPermissions);
  };

  const generateInviteToken = () => {
    // Gera um token único simulado
    const token = 'invite_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setInviteToken(token);
    setIsInviteModalOpen(true);
    
    // Simula salvamento no backend
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
      description: `Convite criado para ${artist.first_name} ${artist.last_name}`,
    });
  };

  const copyInviteLink = () => {
    if (inviteToken) {
      const inviteUrl = `${window.location.origin}/invite?token=${inviteToken}`;
      navigator.clipboard.writeText(inviteUrl);
      toast({
        title: "Link Copiado",
        description: "Link de convite copiado para a área de transferência",
      });
    }
  };

  const groupedPermissions = permissionItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof permissionItems>);

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            Configurações de Permissão
          </h3>
          <p className="text-gray-600">Defina o acesso do tatuador às funcionalidades do sistema</p>
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
        {Object.entries(groupedPermissions).map(([category, items]) => (
          <Card key={category} className="shadow-xl bg-gradient-to-br from-white to-gray-50 border-gray-200">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                {category}
              </CardTitle>
              <CardDescription>
                Controle de acesso para funcionalidades de {category.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-red-600" />
                      <div>
                        <Label htmlFor={item.key} className="font-medium text-gray-800 cursor-pointer">
                          {item.label}
                        </Label>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    <Switch
                      id={item.key}
                      checked={permissions[item.key]}
                      onCheckedChange={(value) => handlePermissionChange(item.key, value)}
                      className="data-[state=checked]:bg-red-600"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Convite */}
      <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
        <DialogContent className="max-w-md bg-gradient-to-br from-white to-red-50 border-red-200">
          <DialogHeader className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-6 rounded-lg -mx-6 -mt-6 mb-6">
            <DialogTitle className="text-xl font-black">Convite Gerado</DialogTitle>
            <DialogDescription className="text-red-100">
              Link de convite criado com sucesso
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="font-medium text-gray-700">Para:</Label>
              <p className="text-gray-800">{artist.first_name} {artist.last_name}</p>
              <p className="text-sm text-gray-600">{artist.email}</p>
            </div>
            
            <div>
              <Label className="font-medium text-gray-700">Token de Convite:</Label>
              <div className="mt-2 p-3 bg-gray-100 rounded-lg border break-all text-sm font-mono">
                {inviteToken}
              </div>
            </div>

            <div>
              <Label className="font-medium text-gray-700">Link do Convite:</Label>
              <div className="mt-2 p-3 bg-gray-100 rounded-lg border break-all text-sm">
                {window.location.origin}/invite?token={inviteToken}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={copyInviteLink}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar Link
              </Button>
              <Button
                onClick={() => setIsInviteModalOpen(false)}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                Fechar
              </Button>
            </div>

            <div className="text-xs text-gray-500 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <strong>Nota:</strong> Este link deve ser enviado por e-mail para o tatuador. Ele é válido para uso único e expirará após o primeiro acesso.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArtistPermissionsManager;
