
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ticket, Save, X, Calendar, Percent, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupon?: any;
  isEdit?: boolean;
}

const CouponModal: React.FC<CouponModalProps> = ({ isOpen, onClose, coupon, isEdit = false }) => {
  const [formData, setFormData] = useState({
    code: coupon?.code || '',
    description: coupon?.description || '',
    discountType: coupon?.discountType || 'percentage',
    discountValue: coupon?.discountValue || '',
    maxUses: coupon?.maxUses || '',
    validUntil: coupon?.validUntil || '',
    category: coupon?.category || 'general',
    minPurchase: coupon?.minPurchase || ''
  });

  const handleSave = () => {
    toast({
      title: isEdit ? "Cupom Atualizado!" : "Novo Cupom Criado!",
      description: `Cupom ${formData.code} foi ${isEdit ? 'atualizado' : 'criado'} com sucesso.`,
    });
    onClose();
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-white to-orange-50 border-2 border-orange-200">
        <DialogHeader className="bg-gradient-to-r from-orange-600 to-orange-800 text-white p-6 rounded-lg -m-6 mb-6">
          <DialogTitle className="text-2xl font-black flex items-center gap-3">
            <Ticket className="h-6 w-6" />
            🎫 {isEdit ? 'Editar Cupom' : 'Novo Cupom de Evento'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-orange-700 flex items-center gap-2">
                <Ticket className="h-4 w-4" />
                Código do Cupom
              </Label>
              <Input
                value={formData.code}
                onChange={(e) => updateField('code', e.target.value.toUpperCase())}
                placeholder="Ex: VERÃO2024"
                className="border-2 border-orange-300 focus:border-orange-500 font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-orange-700 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Válido Até
              </Label>
              <Input
                type="date"
                value={formData.validUntil}
                onChange={(e) => updateField('validUntil', e.target.value)}
                className="border-2 border-orange-300 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-bold text-orange-700">Descrição do Evento/Promoção</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Ex: Desconto especial para o evento de verão da 99Tattoo..."
              className="border-2 border-orange-300 focus:border-orange-500"
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-orange-700 flex items-center gap-2">
                <Percent className="h-4 w-4" />
                Tipo de Desconto
              </Label>
              <Select value={formData.discountType} onValueChange={(value) => updateField('discountType', value)}>
                <SelectTrigger className="border-2 border-orange-300 focus:border-orange-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-orange-200">
                  <SelectItem value="percentage">Percentual (%)</SelectItem>
                  <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                  <SelectItem value="free_service">Serviço Gratuito</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-orange-700">Valor do Desconto</Label>
              <Input
                type="number"
                value={formData.discountValue}
                onChange={(e) => updateField('discountValue', e.target.value)}
                placeholder={formData.discountType === 'percentage' ? '20' : '100'}
                className="border-2 border-orange-300 focus:border-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-orange-700 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Máximo de Usos
              </Label>
              <Input
                type="number"
                value={formData.maxUses}
                onChange={(e) => updateField('maxUses', e.target.value)}
                placeholder="100"
                className="border-2 border-orange-300 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-orange-700">Categoria do Evento</Label>
              <Select value={formData.category} onValueChange={(value) => updateField('category', value)}>
                <SelectTrigger className="border-2 border-orange-300 focus:border-orange-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-orange-200">
                  <SelectItem value="general">Geral</SelectItem>
                  <SelectItem value="flash">Flash Tattoos</SelectItem>
                  <SelectItem value="color">Tatuagens Coloridas</SelectItem>
                  <SelectItem value="black">Trabalhos Black Work</SelectItem>
                  <SelectItem value="realism">Realismo</SelectItem>
                  <SelectItem value="first_time">Primeira Tatuagem</SelectItem>
                  <SelectItem value="birthday">Aniversário</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-orange-700">Compra Mínima (R$)</Label>
              <Input
                type="number"
                value={formData.minPurchase}
                onChange={(e) => updateField('minPurchase', e.target.value)}
                placeholder="200"
                className="border-2 border-orange-300 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <h4 className="text-lg font-bold text-blue-800 mb-2">📅 Ideias para Eventos Promocionais</h4>
            <div className="grid md:grid-cols-2 gap-3 text-sm text-blue-600">
              <div>
                <strong>Sazonais:</strong> Verão, Inverno, Black Friday<br/>
                <strong>Temáticos:</strong> Halloween, Dia das Mães, Namorados<br/>
                <strong>Estúdio:</strong> Aniversário, inauguração
              </div>
              <div>
                <strong>Categorias:</strong> Flash Day, Color Week<br/>
                <strong>Sociais:</strong> Primeira tatuagem, indicação<br/>
                <strong>Urgência:</strong> Last Minute, Weekend
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-2 border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-orange-600 to-orange-800 hover:from-orange-700 hover:to-orange-900 text-white font-bold"
            >
              <Save className="h-4 w-4 mr-2" />
              {isEdit ? 'Atualizar' : 'Criar'} Cupom
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CouponModal;
