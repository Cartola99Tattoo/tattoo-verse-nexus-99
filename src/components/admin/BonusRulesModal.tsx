
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Gift, UserPlus, Calendar, Zap, Target, Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BonusRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BonusRulesModal: React.FC<BonusRulesModalProps> = ({ isOpen, onClose }) => {
  const [bonusRules, setBonusRules] = useState({
    referralEnabled: true,
    referralBonus: 50,
    birthdayEnabled: true,
    birthdayBonus: 'Flash grátis',
    cashbackEnabled: true,
    cashbackPercentage: 5,
    doublePointsEnabled: true,
    doublePointsDays: 'Terças-feiras',
    welcomeBonusEnabled: true,
    welcomeBonusPoints: 100
  });

  const handleSave = () => {
    toast({
      title: "Regras de Bonificação Atualizadas!",
      description: "As configurações foram salvas com sucesso.",
    });
    onClose();
  };

  const updateRule = (field: string, value: string | number | boolean) => {
    setBonusRules(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-green-50 border-2 border-green-200">
        <DialogHeader className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 rounded-lg -m-6 mb-6">
          <DialogTitle className="text-2xl font-black flex items-center gap-3">
            <Gift className="h-6 w-6" />
            🎁 Configuração das Regras de Bonificação
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-bold text-green-800 mb-2">✨ Sistema de Incentivos</h3>
            <p className="text-green-600 text-sm">
              Configure as regras de bonificação para incentivar a fidelidade, indicações e engajamento dos clientes.
            </p>
          </div>

          {/* Bônus de Indicação */}
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <UserPlus className="h-6 w-6 text-blue-600" />
                  <h4 className="text-lg font-bold text-blue-800">Bônus de Indicação</h4>
                </div>
                <Switch
                  checked={bonusRules.referralEnabled}
                  onCheckedChange={(checked) => updateRule('referralEnabled', checked)}
                />
              </div>
              {bonusRules.referralEnabled && (
                <div className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-blue-700">Valor do Bônus (R$)</Label>
                      <Input
                        type="number"
                        value={bonusRules.referralBonus}
                        onChange={(e) => updateRule('referralBonus', parseFloat(e.target.value))}
                        className="border-2 border-blue-300 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-blue-700">Aplicação</Label>
                      <Input
                        value="Para ambos (indicador + novo cliente)"
                        disabled
                        className="border-2 border-blue-300 bg-blue-100"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-blue-600">
                    Quando um cliente indica um amigo que realiza uma tatuagem, ambos recebem o bônus.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bônus de Aniversário */}
          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-purple-600" />
                  <h4 className="text-lg font-bold text-purple-800">Bônus de Aniversário</h4>
                </div>
                <Switch
                  checked={bonusRules.birthdayEnabled}
                  onCheckedChange={(checked) => updateRule('birthdayEnabled', checked)}
                />
              </div>
              {bonusRules.birthdayEnabled && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-purple-700">Tipo de Bônus</Label>
                    <Input
                      value={bonusRules.birthdayBonus}
                      onChange={(e) => updateRule('birthdayBonus', e.target.value)}
                      className="border-2 border-purple-300 focus:border-purple-500"
                      placeholder="Ex: Flash grátis, 20% desconto, 500 pontos"
                    />
                  </div>
                  <p className="text-xs text-purple-600">
                    Benefício especial oferecido no mês do aniversário do cliente.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sistema de Cashback */}
          <Card className="border-2 border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Zap className="h-6 w-6 text-yellow-600" />
                  <h4 className="text-lg font-bold text-yellow-800">Cashback em Créditos</h4>
                </div>
                <Switch
                  checked={bonusRules.cashbackEnabled}
                  onCheckedChange={(checked) => updateRule('cashbackEnabled', checked)}
                />
              </div>
              {bonusRules.cashbackEnabled && (
                <div className="space-y-3">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-yellow-700">Percentual de Cashback (%)</Label>
                      <Input
                        type="number"
                        value={bonusRules.cashbackPercentage}
                        onChange={(e) => updateRule('cashbackPercentage', parseFloat(e.target.value))}
                        className="border-2 border-yellow-300 focus:border-yellow-500"
                        min="0"
                        max="100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-yellow-700">Forma de Retorno</Label>
                      <Input
                        value="Crédito direto para próxima tatuagem"
                        disabled
                        className="border-2 border-yellow-300 bg-yellow-100"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-yellow-600">
                    Percentual do valor gasto que retorna como crédito para futuras compras.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pontos em Dobro */}
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-orange-600" />
                  <h4 className="text-lg font-bold text-orange-800">Pontos em Dobro</h4>
                </div>
                <Switch
                  checked={bonusRules.doublePointsEnabled}
                  onCheckedChange={(checked) => updateRule('doublePointsEnabled', checked)}
                />
              </div>
              {bonusRules.doublePointsEnabled && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-orange-700">Dias da Promoção</Label>
                    <Input
                      value={bonusRules.doublePointsDays}
                      onChange={(e) => updateRule('doublePointsDays', e.target.value)}
                      className="border-2 border-orange-300 focus:border-orange-500"
                      placeholder="Ex: Terças-feiras, Primeiras semanas do mês"
                    />
                  </div>
                  <p className="text-xs text-orange-600">
                    Dias ou períodos em que os clientes ganham pontos em dobro.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bônus de Boas-vindas */}
          <Card className="border-2 border-pink-200 bg-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Gift className="h-6 w-6 text-pink-600" />
                  <h4 className="text-lg font-bold text-pink-800">Bônus de Boas-vindas</h4>
                </div>
                <Switch
                  checked={bonusRules.welcomeBonusEnabled}
                  onCheckedChange={(checked) => updateRule('welcomeBonusEnabled', checked)}
                />
              </div>
              {bonusRules.welcomeBonusEnabled && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-pink-700">Pontos de Boas-vindas</Label>
                    <Input
                      type="number"
                      value={bonusRules.welcomeBonusPoints}
                      onChange={(e) => updateRule('welcomeBonusPoints', parseInt(e.target.value))}
                      className="border-2 border-pink-300 focus:border-pink-500"
                    />
                  </div>
                  <p className="text-xs text-pink-600">
                    Pontos concedidos automaticamente quando o cliente se cadastra no programa.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-2 border-green-300 text-green-700 hover:bg-green-50"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-bold"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Regras
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BonusRulesModal;
