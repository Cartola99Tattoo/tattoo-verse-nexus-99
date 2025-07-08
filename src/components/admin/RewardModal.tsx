
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gift, Save, X, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  reward?: any;
  isEdit?: boolean;
}

const RewardModal: React.FC<RewardModalProps> = ({ isOpen, onClose, reward, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: reward?.name || '',
    description: reward?.description || '',
    pointsCost: reward?.pointsCost || '',
    category: reward?.category || 'discount',
    status: reward?.status || 'active',
    limitations: reward?.limitations || ''
  });

  const handleSave = () => {
    toast({
      title: isEdit ? "Recompensa Atualizada!" : "Nova Recompensa Criada!",
      description: `${formData.name} foi ${isEdit ? 'atualizada' : 'adicionada'} ao catálogo com sucesso.`,
    });
    onClose();
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-white to-yellow-50 border-2 border-yellow-200">
        <DialogHeader className="bg-gradient-to-r from-yellow-600 to-yellow-800 text-white p-6 rounded-lg -m-6 mb-6">
          <DialogTitle className="text-2xl font-black flex items-center gap-3">
            <Gift className="h-6 w-6" />
            🎁 {isEdit ? 'Editar Recompensa' : 'Nova Recompensa'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-yellow-700">Nome da Recompensa</Label>
              <Input
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Ex: Desconto 15%"
                className="border-2 border-yellow-300 focus:border-yellow-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-yellow-700">Custo em Pontos</Label>
              <Input
                type="number"
                value={formData.pointsCost}
                onChange={(e) => updateField('pointsCost', e.target.value)}
                placeholder="Ex: 500"
                className="border-2 border-yellow-300 focus:border-yellow-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-yellow-700">Descrição</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Descreva detalhadamente a recompensa..."
              className="border-2 border-yellow-300 focus:border-yellow-500"
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-yellow-700">Categoria</Label>
              <Select value={formData.category} onValueChange={(value) => updateField('category', value)}>
                <SelectTrigger className="border-2 border-yellow-300 focus:border-yellow-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-yellow-200">
                  <SelectItem value="discount">Desconto</SelectItem>
                  <SelectItem value="service">Serviço Gratuito</SelectItem>
                  <SelectItem value="product">Produto</SelectItem>
                  <SelectItem value="experience">Experiência</SelectItem>
                  <SelectItem value="priority">Prioridade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-yellow-700">Status</Label>
              <Select value={formData.status} onValueChange={(value) => updateField('status', value)}>
                <SelectTrigger className="border-2 border-yellow-300 focus:border-yellow-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-yellow-200">
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="limited">Limitado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-yellow-700">Limitações/Condições</Label>
            <Textarea
              value={formData.limitations}
              onChange={(e) => updateField('limitations', e.target.value)}
              placeholder="Ex: Válido apenas para tatuagens acima de R$ 200,00..."
              className="border-2 border-yellow-300 focus:border-yellow-500"
              rows={2}
            />
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <h4 className="text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              💡 Sugestões de Recompensas
            </h4>
            <div className="grid md:grid-cols-2 gap-3 text-sm text-blue-600">
              <div>
                <strong>Descontos:</strong> 5%, 10%, 15%, 20%<br/>
                <strong>Serviços:</strong> Flash grátis, retoque, consulta<br/>
                <strong>Produtos:</strong> Pomada, acessórios
              </div>
              <div>
                <strong>Experiências:</strong> Sessão VIP, evento exclusivo<br/>
                <strong>Prioridades:</strong> Agendamento antecipado<br/>
                <strong>Especiais:</strong> Tatuagem personalizada
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-2 border-yellow-300 text-yellow-700 hover:bg-yellow-50"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-700 hover:to-yellow-900 text-white font-bold"
            >
              <Save className="h-4 w-4 mr-2" />
              {isEdit ? 'Atualizar' : 'Criar'} Recompensa
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RewardModal;
