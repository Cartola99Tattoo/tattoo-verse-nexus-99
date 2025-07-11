
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Phone, Calendar, UserCheck, Gift, Save, X } from 'lucide-react';

interface AddLoyaltyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (memberData: NewMemberData) => void;
}

interface NewMemberData {
  name: string;
  email: string;
  phone: string;
  birthDate?: string;
  primaryArtist?: string;
  status: 'active' | 'inactive' | 'pending';
  initialPoints: number;
}

const mockArtists = [
  'João Tattoo',
  'Maria Tattoo', 
  'Pedro Tattoo',
  'Ana Tattoo',
  'Carlos Tattoo',
  'Fernanda Tattoo',
  'Roberto Tattoo',
  'Luciana Tattoo'
];

const AddLoyaltyMemberModal: React.FC<AddLoyaltyMemberModalProps> = ({
  isOpen,
  onClose,
  onAddMember
}) => {
  const [formData, setFormData] = useState<NewMemberData>({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    primaryArtist: '',
    status: 'active',
    initialPoints: 0
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: keyof NewMemberData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    if (formData.initialPoints < 0) {
      newErrors.initialPoints = 'Pontos iniciais não podem ser negativos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAddMember(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      birthDate: '',
      primaryArtist: '',
      status: 'active',
      initialPoints: 0
    });
    setErrors({});
    onClose();
  };

  const formatPhone = (value: string) => {
    // Remove tudo que não for número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara (11) 99999-9999
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    
    return value;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-red-50/30 to-white border-2 border-red-200 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-6 rounded-t-xl -m-6 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full transform translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full transform -translate-x-8 translate-y-8"></div>
          
          <DialogTitle className="text-2xl font-black flex items-center gap-3 relative z-10">
            <div className="bg-white/20 rounded-full p-2 backdrop-blur-sm">
              <User className="h-6 w-6" />
            </div>
            👤 Adicionar Novo Membro
          </DialogTitle>
          <p className="text-red-100 font-medium text-base relative z-10 mt-2">
            Cadastre um novo cliente no programa de fidelidade 99Tattoo
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grid de 2 colunas para campos principais */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Nome Completo */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <User className="h-4 w-4 text-red-600" />
                Nome Completo *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Digite o nome completo"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`border-2 focus:ring-red-400 focus:border-red-400 ${errors.name ? 'border-red-400' : 'border-red-200'}`}
              />
              {errors.name && (
                <p className="text-red-600 text-xs font-medium">{errors.name}</p>
              )}
            </div>

            {/* E-mail */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Mail className="h-4 w-4 text-red-600" />
                E-mail *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`border-2 focus:ring-red-400 focus:border-red-400 ${errors.email ? 'border-red-400' : 'border-red-200'}`}
              />
              {errors.email && (
                <p className="text-red-600 text-xs font-medium">{errors.email}</p>
              )}
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Phone className="h-4 w-4 text-red-600" />
                Telefone (WhatsApp) *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', formatPhone(e.target.value))}
                className={`border-2 focus:ring-red-400 focus:border-red-400 ${errors.phone ? 'border-red-400' : 'border-red-200'}`}
              />
              {errors.phone && (
                <p className="text-red-600 text-xs font-medium">{errors.phone}</p>
              )}
            </div>

            {/* Data de Nascimento */}
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-red-600" />
                Data de Nascimento
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                className="border-2 border-red-200 focus:ring-red-400 focus:border-red-400"
              />
              <p className="text-xs text-gray-500">Para bonificações de aniversário</p>
            </div>

            {/* Tatuador Principal */}
            <div className="space-y-2">
              <Label htmlFor="primaryArtist" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-red-600" />
                Tatuador Principal
              </Label>
              <Select 
                value={formData.primaryArtist} 
                onValueChange={(value) => handleInputChange('primaryArtist', value)}
              >
                <SelectTrigger className="border-2 border-red-200 focus:ring-red-400 focus:border-red-400">
                  <SelectValue placeholder="Selecione um tatuador (opcional)" />
                </SelectTrigger>
                <SelectContent className="bg-white border-red-200 max-h-48">
                  <SelectItem value="">Nenhum tatuador específico</SelectItem>
                  {mockArtists.map((artist) => (
                    <SelectItem key={artist} value={artist}>
                      {artist}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status no Programa */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-red-600" />
                Status no Programa *
              </Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange('status', value as 'active' | 'inactive' | 'pending')}
              >
                <SelectTrigger className="border-2 border-red-200 focus:ring-red-400 focus:border-red-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-red-200">
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pontos Iniciais - Campo único */}
          <div className="space-y-2">
            <Label htmlFor="initialPoints" className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Gift className="h-4 w-4 text-red-600" />
              Pontos Iniciais
            </Label>
            <Input
              id="initialPoints"
              type="number"
              min="0"
              placeholder="0"
              value={formData.initialPoints}
              onChange={(e) => handleInputChange('initialPoints', parseInt(e.target.value) || 0)}
              className={`border-2 focus:ring-red-400 focus:border-red-400 max-w-xs ${errors.initialPoints ? 'border-red-400' : 'border-red-200'}`}
            />
            {errors.initialPoints && (
              <p className="text-red-600 text-xs font-medium">{errors.initialPoints}</p>
            )}
            <p className="text-xs text-gray-500">Novos membros normalmente começam com 0 pontos</p>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-4 pt-6 border-t border-red-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-400 font-bold"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white font-black shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Save className="h-4 w-4 mr-2" />
              Adicionar Membro
            </Button>
          </div>
        </form>

        {/* Seção de Lógicas de Bonificação (Informativa) */}
        <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
          <h3 className="text-lg font-black text-blue-800 mb-4 flex items-center gap-2">
            <Gift className="h-5 w-5" />
            💡 Lógicas de Bonificação Estratégicas
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="font-bold text-blue-700">A. Pontos por Gasto:</div>
              <div className="text-blue-600">1 ponto = R$ 100 gastos</div>
              
              <div className="font-bold text-blue-700">B. Sistema de Níveis:</div>
              <div className="text-blue-600">Bronze → Prata → Ouro → Diamante</div>
              
              <div className="font-bold text-blue-700">C. Indicação:</div>
              <div className="text-blue-600">R$ 50 para ambos (indicador + novo cliente)</div>
            </div>
            <div className="space-y-2">
              <div className="font-bold text-blue-700">D. Aniversário:</div>
              <div className="text-blue-600">Flash grátis ou desconto especial</div>
              
              <div className="font-bold text-blue-700">E. Desafios:</div>
              <div className="text-blue-600">Missões temporárias com recompensas</div>
              
              <div className="font-bold text-blue-700">F. Cashback:</div>
              <div className="text-blue-600">% do gasto vira crédito direto</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddLoyaltyMemberModal;
