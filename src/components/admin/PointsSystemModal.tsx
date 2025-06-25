
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Coins, Target, Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PointsSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PointsSystemModal: React.FC<PointsSystemModalProps> = ({ isOpen, onClose }) => {
  const [pointsPerReal, setPointsPerReal] = useState('1');
  const [minPurchase, setMinPurchase] = useState('100');
  const [redemptionRate, setRedemptionRate] = useState('100');
  const [redemptionValue, setRedemptionValue] = useState('10');

  const handleSave = () => {
    toast({
      title: "Sistema de Pontos Atualizado!",
      description: "As configurações foram salvas com sucesso.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg -m-6 mb-6">
          <DialogTitle className="text-2xl font-black flex items-center gap-3">
            <Coins className="h-6 w-6" />
            ⚙️ Configuração do Sistema de Pontos
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-blue-800 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Regras de Acúmulo de Pontos
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-blue-700">Pontos por Real Gasto</Label>
                  <Input
                    type="number"
                    value={pointsPerReal}
                    onChange={(e) => setPointsPerReal(e.target.value)}
                    className="border-2 border-blue-300 focus:border-blue-500"
                  />
                  <p className="text-xs text-blue-600">Quantos pontos o cliente ganha por R$ 1,00 gasto</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-blue-700">Compra Mínima (R$)</Label>
                  <Input
                    type="number"
                    value={minPurchase}
                    onChange={(e) => setMinPurchase(e.target.value)}
                    className="border-2 border-blue-300 focus:border-blue-500"
                  />
                  <p className="text-xs text-blue-600">Valor mínimo para acumular pontos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-green-800">Regras de Resgate</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-green-700">Pontos para Resgate</Label>
                  <Input
                    type="number"
                    value={redemptionRate}
                    onChange={(e) => setRedemptionRate(e.target.value)}
                    className="border-2 border-green-300 focus:border-green-500"
                  />
                  <p className="text-xs text-green-600">Quantos pontos equivalem ao valor de resgate</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-bold text-green-700">Valor do Resgate (R$)</Label>
                  <Input
                    type="number"
                    value={redemptionValue}
                    onChange={(e) => setRedemptionValue(e.target.value)}
                    className="border-2 border-green-300 focus:border-green-500"
                  />
                  <p className="text-xs text-green-600">Valor em reais que os pontos representam</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <h4 className="text-lg font-bold text-yellow-800 mb-2">📊 Resumo da Configuração</h4>
            <div className="text-sm text-yellow-700 space-y-1">
              <p>• A cada R$ {minPurchase},00 gastos = {pointsPerReal} ponto(s)</p>
              <p>• {redemptionRate} pontos = R$ {redemptionValue},00 de desconto</p>
              <p>• Taxa de conversão: {((parseFloat(redemptionValue) / parseFloat(redemptionRate)) * 100).toFixed(1)}% de retorno</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-2 border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Configurações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PointsSystemModal;
