
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Plus, Edit, Trash2, Clock, Palette } from 'lucide-react';
import { ArtistPricing, PricingItem } from '@/services/interfaces/IArtistsService';

interface ArtistPricingManagerProps {
  pricing?: ArtistPricing;
  onPricingChange: (pricing: ArtistPricing) => void;
}

const pricingCategories = [
  'Tamanho Pequeno (até 5cm)',
  'Tamanho Médio (5-15cm)',
  'Tamanho Grande (15-30cm)',
  'Tamanho Extra Grande (30cm+)',
  'Cover Up',
  'Retoque',
  'Sessão Completa',
  'Por Hora'
];

const ArtistPricingManager = ({ pricing, onPricingChange }: ArtistPricingManagerProps) => {
  const [newItem, setNewItem] = useState({
    category: '',
    min_price: '',
    max_price: '',
    description: '',
    estimated_hours: ''
  });

  const currentPricing = pricing || {
    base_price_per_hour: 0,
    minimum_session_price: 0,
    pricing_items: [],
    additional_costs: {
      consultation: 0,
      design: 0,
      touch_up: 0
    },
    payment_methods: [],
    pricing_notes: ''
  };

  const handleAddPricingItem = () => {
    if (!newItem.category || !newItem.min_price) return;

    const pricingItem: PricingItem = {
      id: Date.now().toString(),
      category: newItem.category,
      min_price: Number(newItem.min_price),
      max_price: newItem.max_price ? Number(newItem.max_price) : undefined,
      description: newItem.description,
      estimated_hours: newItem.estimated_hours ? Number(newItem.estimated_hours) : undefined
    };

    onPricingChange({
      ...currentPricing,
      pricing_items: [...currentPricing.pricing_items, pricingItem]
    });

    setNewItem({
      category: '',
      min_price: '',
      max_price: '',
      description: '',
      estimated_hours: ''
    });
  };

  const handleRemovePricingItem = (id: string) => {
    onPricingChange({
      ...currentPricing,
      pricing_items: currentPricing.pricing_items.filter(item => item.id !== id)
    });
  };

  const handleBasePriceChange = (field: string, value: string) => {
    onPricingChange({
      ...currentPricing,
      [field]: Number(value) || 0
    });
  };

  const handleAdditionalCostChange = (field: string, value: string) => {
    onPricingChange({
      ...currentPricing,
      additional_costs: {
        ...currentPricing.additional_costs,
        [field]: Number(value) || 0
      }
    });
  };

  return (
    <Card className="bg-gradient-to-br from-white to-green-50 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-xl font-black">
          <DollarSign className="h-5 w-5" />
          Preços e Serviços
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        {/* Preços Base */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
          <h3 className="text-green-800 font-bold text-lg mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Valores Base
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-green-700 font-medium">Valor por Hora (R$)</Label>
              <Input
                type="number"
                value={currentPricing.base_price_per_hour}
                onChange={(e) => handleBasePriceChange('base_price_per_hour', e.target.value)}
                placeholder="150"
                className="border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200"
              />
            </div>
            <div>
              <Label className="text-green-700 font-medium">Valor Mínimo da Sessão (R$)</Label>
              <Input
                type="number"
                value={currentPricing.minimum_session_price}
                onChange={(e) => handleBasePriceChange('minimum_session_price', e.target.value)}
                placeholder="200"
                className="border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200"
              />
            </div>
          </div>
        </div>

        {/* Custos Adicionais */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
          <h3 className="text-blue-800 font-bold text-lg mb-4">Custos Adicionais</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-blue-700 font-medium">Consulta (R$)</Label>
              <Input
                type="number"
                value={currentPricing.additional_costs.consultation}
                onChange={(e) => handleAdditionalCostChange('consultation', e.target.value)}
                placeholder="50"
                className="border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <Label className="text-blue-700 font-medium">Design (R$)</Label>
              <Input
                type="number"
                value={currentPricing.additional_costs.design}
                onChange={(e) => handleAdditionalCostChange('design', e.target.value)}
                placeholder="100"
                className="border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <Label className="text-blue-700 font-medium">Retoque (R$)</Label>
              <Input
                type="number"
                value={currentPricing.additional_costs.touch_up}
                onChange={(e) => handleAdditionalCostChange('touch_up', e.target.value)}
                placeholder="80"
                className="border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
        </div>

        {/* Tabela de Preços por Categoria */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
          <h3 className="text-purple-800 font-bold text-lg mb-4 flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Preços por Categoria
          </h3>

          {/* Adicionar novo item */}
          <div className="bg-white p-4 rounded-lg border border-purple-200 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label className="text-purple-700 font-medium">Categoria</Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                  <SelectTrigger className="border-purple-200 focus:border-purple-500">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-purple-200 shadow-xl">
                    {pricingCategories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-purple-700 font-medium">Preço Mín. (R$)</Label>
                <Input
                  type="number"
                  value={newItem.min_price}
                  onChange={(e) => setNewItem({ ...newItem, min_price: e.target.value })}
                  placeholder="200"
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>
              <div>
                <Label className="text-purple-700 font-medium">Preço Máx. (R$)</Label>
                <Input
                  type="number"
                  value={newItem.max_price}
                  onChange={(e) => setNewItem({ ...newItem, max_price: e.target.value })}
                  placeholder="500"
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>
              <div>
                <Label className="text-purple-700 font-medium">Horas Est.</Label>
                <Input
                  type="number"
                  value={newItem.estimated_hours}
                  onChange={(e) => setNewItem({ ...newItem, estimated_hours: e.target.value })}
                  placeholder="2"
                  className="border-purple-200 focus:border-purple-500"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleAddPricingItem}
                  disabled={!newItem.category || !newItem.min_price}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <Label className="text-purple-700 font-medium">Descrição</Label>
              <Input
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Descrição adicional sobre esta categoria..."
                className="border-purple-200 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Lista de itens existentes */}
          <div className="space-y-3">
            {currentPricing.pricing_items.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-lg border border-purple-200 shadow-md hover:shadow-lg transition-all duration-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium">
                        {item.category}
                      </Badge>
                      <span className="font-bold text-purple-800">
                        R$ {item.min_price}
                        {item.max_price && ` - R$ ${item.max_price}`}
                      </span>
                      {item.estimated_hours && (
                        <span className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.estimated_hours}h
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-600">{item.description}</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemovePricingItem(item.id)}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {currentPricing.pricing_items.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <DollarSign className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>Nenhuma categoria de preço configurada</p>
            </div>
          )}
        </div>

        {/* Observações sobre Preços */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200">
          <h3 className="text-yellow-800 font-bold text-lg mb-4">Observações sobre Preços</h3>
          <Textarea
            value={currentPricing.pricing_notes}
            onChange={(e) => onPricingChange({ ...currentPricing, pricing_notes: e.target.value })}
            placeholder="Observações gerais sobre política de preços, descontos, formas de pagamento..."
            className="border-yellow-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ArtistPricingManager;
