
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Award, Star, Trophy, Save, X, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TierManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TierManagementModal: React.FC<TierManagementModalProps> = ({ isOpen, onClose }) => {
  const [tiers, setTiers] = useState([
    { name: 'Bronze', minPoints: 0, maxPoints: 500, benefits: 'Desconto de 5% na próxima compra', color: 'amber' },
    { name: 'Silver', minPoints: 501, maxPoints: 1500, benefits: 'Desconto de 10%, acesso antecipado a flashs', color: 'gray' },
    { name: 'Gold', minPoints: 1501, maxPoints: 3000, benefits: 'Desconto de 15%, sessão de retoque grátis', color: 'yellow' },
    { name: 'Platinum', minPoints: 3001, maxPoints: 99999, benefits: 'Desconto de 20%, flash gratuita de aniversário', color: 'purple' }
  ]);

  const handleSave = () => {
    toast({
      title: "Níveis Atualizados!",
      description: "Os níveis do programa foram configurados com sucesso.",
    });
    onClose();
  };

  const getTierIcon = (index: number) => {
    const icons = [Award, Star, Crown, Trophy];
    const Icon = icons[index] || Award;
    return <Icon className="h-5 w-5" />;
  };

  const updateTier = (index: number, field: string, value: string | number) => {
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setTiers(newTiers);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200">
        <DialogHeader className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-lg -m-6 mb-6">
          <DialogTitle className="text-2xl font-black flex items-center gap-3">
            <Crown className="h-6 w-6" />
            👑 Configuração dos Níveis do Programa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
            <h3 className="text-lg font-bold text-purple-800 mb-2">📈 Sistema de Progressão</h3>
            <p className="text-purple-600 text-sm">
              Configure os diferentes níveis de fidelidade e seus benefícios exclusivos para incentivar o engajamento dos clientes.
            </p>
          </div>

          <div className="space-y-4">
            {tiers.map((tier, index) => (
              <Card key={index} className={`border-2 border-${tier.color}-200 bg-${tier.color}-50`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`bg-${tier.color}-600 p-2 rounded-full text-white`}>
                      {getTierIcon(index)}
                    </div>
                    <h4 className={`text-xl font-bold text-${tier.color}-800`}>{tier.name}</h4>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className={`text-sm font-bold text-${tier.color}-700`}>Pontos Mínimos</Label>
                      <Input
                        type="number"
                        value={tier.minPoints}
                        onChange={(e) => updateTier(index, 'minPoints', parseInt(e.target.value))}
                        className={`border-2 border-${tier.color}-300 focus:border-${tier.color}-500`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className={`text-sm font-bold text-${tier.color}-700`}>Pontos Máximos</Label>
                      <Input
                        type="number"
                        value={tier.maxPoints === 99999 ? '' : tier.maxPoints}
                        placeholder="Ilimitado"
                        onChange={(e) => updateTier(index, 'maxPoints', parseInt(e.target.value) || 99999)}
                        className={`border-2 border-${tier.color}-300 focus:border-${tier.color}-500`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className={`text-sm font-bold text-${tier.color}-700`}>Benefícios</Label>
                      <Input
                        value={tier.benefits}
                        onChange={(e) => updateTier(index, 'benefits', e.target.value)}
                        className={`border-2 border-${tier.color}-300 focus:border-${tier.color}-500`}
                        placeholder="Descreva os benefícios deste nível"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                <Plus className="h-5 w-5" />
                💡 Sugestões de Benefícios por Nível
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="font-bold text-blue-700">Bronze (Iniciante):</div>
                  <div className="text-blue-600">• Desconto de 5-10% em serviços<br/>• Newsletter exclusiva<br/>• Pontos em dobro no aniversário</div>
                  
                  <div className="font-bold text-blue-700">Silver (Intermediário):</div>
                  <div className="text-blue-600">• Desconto de 10-15%<br/>• Acesso antecipado a flashs<br/>• Consulta gratuita</div>
                </div>
                <div className="space-y-2">
                  <div className="font-bold text-blue-700">Gold (Avançado):</div>
                  <div className="text-blue-600">• Desconto de 15-20%<br/>• Sessão de retoque grátis<br/>• Prioridade no agendamento</div>
                  
                  <div className="font-bold text-blue-700">Platinum (VIP):</div>
                  <div className="text-blue-600">• Desconto de 20-25%<br/>• Flash gratuita de aniversário<br/>• Eventos exclusivos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-2 border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Níveis
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TierManagementModal;
