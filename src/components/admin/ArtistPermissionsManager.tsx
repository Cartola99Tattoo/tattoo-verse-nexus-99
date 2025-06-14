
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, User, Calendar, DollarSign, FolderOpen, Users, Settings, AlertTriangle } from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface PermissionModule {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  permissions: Permission[];
}

interface ArtistPermissionsManagerProps {
  permissions?: any;
  onPermissionsChange: (permissions: any) => void;
}

const ArtistPermissionsManager = ({ permissions, onPermissionsChange }: ArtistPermissionsManagerProps) => {
  const [permissionModules, setPermissionModules] = useState<PermissionModule[]>([
    {
      id: 'appointments',
      name: 'Agendamentos',
      icon: <Calendar className="h-5 w-5" />,
      color: 'blue',
      permissions: [
        { id: 'view_appointments', name: 'Visualizar Agendamentos', description: 'Ver todos os agendamentos do estúdio', enabled: permissions?.appointments?.view_appointments || false },
        { id: 'view_own_appointments', name: 'Ver Próprios Agendamentos', description: 'Ver apenas seus próprios agendamentos', enabled: permissions?.appointments?.view_own_appointments || true },
        { id: 'create_appointments', name: 'Criar Agendamentos', description: 'Agendar novos clientes', enabled: permissions?.appointments?.create_appointments || false },
        { id: 'edit_appointments', name: 'Editar Agendamentos', description: 'Modificar agendamentos existentes', enabled: permissions?.appointments?.edit_appointments || false },
        { id: 'cancel_appointments', name: 'Cancelar Agendamentos', description: 'Cancelar agendamentos de clientes', enabled: permissions?.appointments?.cancel_appointments || false },
        { id: 'reschedule_appointments', name: 'Reagendar', description: 'Reagendar compromissos', enabled: permissions?.appointments?.reschedule_appointments || false }
      ]
    },
    {
      id: 'financial',
      name: 'Financeiro',
      icon: <DollarSign className="h-5 w-5" />,
      color: 'green',
      permissions: [
        { id: 'view_all_financial', name: 'Ver Todas as Transações', description: 'Visualizar todas as transações financeiras', enabled: permissions?.financial?.view_all_financial || false },
        { id: 'view_own_financial', name: 'Ver Próprias Transações', description: 'Ver apenas suas comissões e ganhos', enabled: permissions?.financial?.view_own_financial || true },
        { id: 'view_commission_reports', name: 'Relatórios de Comissão', description: 'Acessar relatórios detalhados de comissões', enabled: permissions?.financial?.view_commission_reports || false },
        { id: 'manage_expenses', name: 'Gerenciar Despesas', description: 'Cadastrar e editar despesas próprias', enabled: permissions?.financial?.manage_expenses || false },
        { id: 'view_studio_revenue', name: 'Ver Receita do Estúdio', description: 'Visualizar receita total do estúdio', enabled: permissions?.financial?.view_studio_revenue || false }
      ]
    },
    {
      id: 'projects',
      name: 'Projetos',
      icon: <FolderOpen className="h-5 w-5" />,
      color: 'purple',
      permissions: [
        { id: 'view_all_projects', name: 'Ver Todos os Projetos', description: 'Visualizar todos os projetos do estúdio', enabled: permissions?.projects?.view_all_projects || false },
        { id: 'view_own_projects', name: 'Ver Próprios Projetos', description: 'Ver apenas projetos onde está envolvido', enabled: permissions?.projects?.view_own_projects || true },
        { id: 'create_projects', name: 'Criar Projetos', description: 'Criar novos projetos', enabled: permissions?.projects?.create_projects || false },
        { id: 'edit_projects', name: 'Editar Projetos', description: 'Modificar projetos existentes', enabled: permissions?.projects?.edit_projects || false },
        { id: 'manage_tasks', name: 'Gerenciar Tarefas', description: 'Criar, editar e mover tarefas', enabled: permissions?.projects?.manage_tasks || false },
        { id: 'assign_team_members', name: 'Atribuir Membros', description: 'Adicionar/remover membros da equipe', enabled: permissions?.projects?.assign_team_members || false }
      ]
    },
    {
      id: 'events',
      name: 'Eventos',
      icon: <Users className="h-5 w-5" />,
      color: 'orange',
      permissions: [
        { id: 'view_events', name: 'Visualizar Eventos', description: 'Ver eventos e convenções do estúdio', enabled: permissions?.events?.view_events || true },
        { id: 'create_events', name: 'Criar Eventos', description: 'Organizar novos eventos', enabled: permissions?.events?.create_events || false },
        { id: 'edit_events', name: 'Editar Eventos', description: 'Modificar eventos existentes', enabled: permissions?.events?.edit_events || false },
        { id: 'manage_participants', name: 'Gerenciar Participantes', description: 'Gerenciar lista de participantes', enabled: permissions?.events?.manage_participants || false },
        { id: 'event_reporting', name: 'Relatórios de Eventos', description: 'Gerar relatórios de performance', enabled: permissions?.events?.event_reporting || false }
      ]
    },
    {
      id: 'clients',
      name: 'Clientes (CRM)',
      icon: <User className="h-5 w-5" />,
      color: 'red',
      permissions: [
        { id: 'view_all_clients', name: 'Ver Todos os Clientes', description: 'Acessar base completa de clientes', enabled: permissions?.clients?.view_all_clients || false },
        { id: 'view_own_clients', name: 'Ver Próprios Clientes', description: 'Ver apenas clientes atendidos por você', enabled: permissions?.clients?.view_own_clients || true },
        { id: 'create_clients', name: 'Cadastrar Clientes', description: 'Adicionar novos clientes ao sistema', enabled: permissions?.clients?.create_clients || false },
        { id: 'edit_client_info', name: 'Editar Informações', description: 'Modificar dados dos clientes', enabled: permissions?.clients?.edit_client_info || false },
        { id: 'view_client_history', name: 'Histórico Completo', description: 'Ver histórico completo de interações', enabled: permissions?.clients?.view_client_history || false },
        { id: 'manage_loyalty', name: 'Gerenciar Fidelidade', description: 'Adicionar/remover pontos de fidelidade', enabled: permissions?.clients?.manage_loyalty || false }
      ]
    },
    {
      id: 'system',
      name: 'Sistema',
      icon: <Settings className="h-5 w-5" />,
      color: 'gray',
      permissions: [
        { id: 'access_admin_panel', name: 'Painel Administrativo', description: 'Acesso limitado ao painel admin', enabled: permissions?.system?.access_admin_panel || false },
        { id: 'manage_own_profile', name: 'Gerenciar Próprio Perfil', description: 'Editar informações do próprio perfil', enabled: permissions?.system?.manage_own_profile || true },
        { id: 'view_analytics', name: 'Ver Análises', description: 'Acessar relatórios e analytics', enabled: permissions?.system?.view_analytics || false },
        { id: 'export_data', name: 'Exportar Dados', description: 'Exportar relatórios e dados', enabled: permissions?.system?.export_data || false },
        { id: 'system_notifications', name: 'Notificações do Sistema', description: 'Receber notificações importantes', enabled: permissions?.system?.system_notifications || true }
      ]
    }
  ]);

  const handlePermissionChange = (moduleId: string, permissionId: string, enabled: boolean) => {
    const updatedModules = permissionModules.map(module => {
      if (module.id === moduleId) {
        return {
          ...module,
          permissions: module.permissions.map(permission => 
            permission.id === permissionId ? { ...permission, enabled } : permission
          )
        };
      }
      return module;
    });

    setPermissionModules(updatedModules);

    // Construir objeto de permissões para salvar
    const newPermissions = updatedModules.reduce((acc, module) => {
      acc[module.id] = module.permissions.reduce((moduleAcc, permission) => {
        moduleAcc[permission.id] = permission.enabled;
        return moduleAcc;
      }, {} as any);
      return acc;
    }, {} as any);

    onPermissionsChange(newPermissions);
  };

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { bg: string, border: string, text: string, badge: string } } = {
      blue: { bg: 'from-blue-50 to-blue-100', border: 'border-blue-200', text: 'text-blue-800', badge: 'from-blue-500 to-blue-600' },
      green: { bg: 'from-green-50 to-green-100', border: 'border-green-200', text: 'text-green-800', badge: 'from-green-500 to-green-600' },
      purple: { bg: 'from-purple-50 to-purple-100', border: 'border-purple-200', text: 'text-purple-800', badge: 'from-purple-500 to-purple-600' },
      orange: { bg: 'from-orange-50 to-orange-100', border: 'border-orange-200', text: 'text-orange-800', badge: 'from-orange-500 to-orange-600' },
      red: { bg: 'from-red-50 to-red-100', border: 'border-red-200', text: 'text-red-800', badge: 'from-red-500 to-red-600' },
      gray: { bg: 'from-gray-50 to-gray-100', border: 'border-gray-200', text: 'text-gray-800', badge: 'from-gray-500 to-gray-600' }
    };
    return colorMap[color] || colorMap.gray;
  };

  const getEnabledPermissionsCount = (modulePermissions: Permission[]) => {
    return modulePermissions.filter(p => p.enabled).length;
  };

  return (
    <Card className="bg-gradient-to-br from-white to-indigo-50 border-indigo-200 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-xl font-black">
          <Shield className="h-5 w-5" />
          Permissões de Acesso
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Aviso de Segurança */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-300 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800 font-medium mb-2">
            <AlertTriangle className="h-5 w-5" />
            Configuração de Segurança
          </div>
          <p className="text-yellow-700 text-sm">
            Configure cuidadosamente as permissões. Permissões muito amplas podem comprometer a segurança dos dados.
          </p>
        </div>

        {/* Módulos de Permissões */}
        <div className="space-y-6">
          {permissionModules.map((module) => {
            const colors = getColorClasses(module.color);
            const enabledCount = getEnabledPermissionsCount(module.permissions);
            
            return (
              <div key={module.id} className={`bg-gradient-to-r ${colors.bg} p-6 rounded-lg border ${colors.border} shadow-lg hover:shadow-xl transition-all duration-300`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-white shadow-md ${colors.text}`}>
                      {module.icon}
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg ${colors.text}`}>{module.name}</h3>
                      <p className={`text-sm ${colors.text} opacity-75`}>
                        {enabledCount} de {module.permissions.length} permissões ativas
                      </p>
                    </div>
                  </div>
                  <Badge className={`bg-gradient-to-r ${colors.badge} text-white font-bold px-3 py-1`}>
                    {enabledCount}/{module.permissions.length}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {module.permissions.map((permission) => (
                    <div key={permission.id} className="bg-white p-4 rounded-lg border shadow-md hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 mr-3">
                          <Label className={`font-medium ${colors.text} cursor-pointer`}>
                            {permission.name}
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">
                            {permission.description}
                          </p>
                        </div>
                        <Switch
                          checked={permission.enabled}
                          onCheckedChange={(enabled) => handlePermissionChange(module.id, permission.id, enabled)}
                          className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-500 data-[state=checked]:to-indigo-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumo de Permissões */}
        <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-lg border border-indigo-200">
          <h3 className="text-indigo-800 font-bold text-lg mb-3">Resumo das Permissões</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {permissionModules.map((module) => {
              const colors = getColorClasses(module.color);
              const enabledCount = getEnabledPermissionsCount(module.permissions);
              
              return (
                <div key={module.id} className="text-center">
                  <div className={`p-3 rounded-lg bg-white shadow-md ${colors.text} mb-2`}>
                    {module.icon}
                  </div>
                  <div className="text-sm font-medium text-gray-700">{module.name}</div>
                  <Badge className={`bg-gradient-to-r ${colors.badge} text-white text-xs mt-1`}>
                    {enabledCount}/{module.permissions.length}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArtistPermissionsManager;
