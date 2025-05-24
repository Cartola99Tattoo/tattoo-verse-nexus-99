
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArtistPricing, PricingService } from "@/services/interfaces/IArtistsService";
import { Plus, Trash2, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ArtistPricingManagerProps {
  pricing: ArtistPricing | undefined;
  onPricingChange: (pricing: ArtistPricing) => void;
}

const ArtistPricingManager = ({ pricing, onPricingChange }: ArtistPricingManagerProps) => {
  const [newService, setNewService] = useState<Partial<PricingService>>({
    name: '',
    description: '',
    price: 0,
    price_type: 'fixed'
  });

  const currentPricing: ArtistPricing = pricing || {
    minimum_session_price: 0,
    hourly_rate: 0,
    services: []
  };

  const handleBasePriceChange = (field: keyof ArtistPricing, value: number) => {
    onPricingChange({
      ...currentPricing,
      [field]: value
    });
  };

  const handleAddService = () => {
    if (!newService.name?.trim()) {
      toast({
        title: "Erro",
        description: "Nome do serviço é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    const service: PricingService = {
      id: `service-${Date.now()}`,
      name: newService.name,
      description: newService.description || '',
      price: newService.price || 0,
      price_type: newService.price_type || 'fixed'
    };

    onPricingChange({
      ...currentPricing,
      services: [...currentPricing.services, service]
    });

    setNewService({
      name: '',
      description: '',
      price: 0,
      price_type: 'fixed'
    });

    toast({
      title: "Sucesso",
      description: "Serviço adicionado com sucesso!",
    });
  };

  const handleRemoveService = (serviceId: string) => {
    onPricingChange({
      ...currentPricing,
      services: currentPricing.services.filter(service => service.id !== serviceId)
    });
  };

  const handleUpdateService = (serviceId: string, updates: Partial<PricingService>) => {
    onPricingChange({
      ...currentPricing,
      services: currentPricing.services.map(service =>
        service.id === serviceId ? { ...service, ...updates } : service
      )
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Preços e Serviços
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Base Prices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minimum_session">Valor Mínimo da Sessão (R$)</Label>
            <Input
              id="minimum_session"
              type="number"
              min="0"
              step="0.01"
              value={currentPricing.minimum_session_price || ''}
              onChange={(e) => handleBasePriceChange('minimum_session_price', Number(e.target.value))}
              placeholder="0,00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hourly_rate">Preço por Hora (R$)</Label>
            <Input
              id="hourly_rate"
              type="number"
              min="0"
              step="0.01"
              value={currentPricing.hourly_rate || ''}
              onChange={(e) => handleBasePriceChange('hourly_rate', Number(e.target.value))}
              placeholder="0,00"
            />
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-4">
          <h3 className="font-medium">Serviços Específicos</h3>
          
          {currentPricing.services.length > 0 && (
            <div className="space-y-3">
              {currentPricing.services.map((service) => (
                <div key={service.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          value={service.name}
                          onChange={(e) => handleUpdateService(service.id, { name: e.target.value })}
                          placeholder="Nome do serviço"
                        />
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={service.price || ''}
                            onChange={(e) => handleUpdateService(service.id, { price: Number(e.target.value) })}
                            placeholder="Preço"
                            className="flex-1"
                          />
                          <Select 
                            value={service.price_type} 
                            onValueChange={(value: 'fixed' | 'hourly' | 'custom') => 
                              handleUpdateService(service.id, { price_type: value })
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fixed">Fixo</SelectItem>
                              <SelectItem value="hourly">Por Hora</SelectItem>
                              <SelectItem value="custom">Customizado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Textarea
                        value={service.description || ''}
                        onChange={(e) => handleUpdateService(service.id, { description: e.target.value })}
                        placeholder="Descrição do serviço (opcional)"
                        className="min-h-[60px]"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="ml-2"
                      onClick={() => handleRemoveService(service.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Service */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-sm">Adicionar Novo Serviço</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                value={newService.name || ''}
                onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome do serviço"
              />
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newService.price || ''}
                  onChange={(e) => setNewService(prev => ({ ...prev, price: Number(e.target.value) }))}
                  placeholder="Preço"
                  className="flex-1"
                />
                <Select 
                  value={newService.price_type} 
                  onValueChange={(value: 'fixed' | 'hourly' | 'custom') => 
                    setNewService(prev => ({ ...prev, price_type: value }))
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixo</SelectItem>
                    <SelectItem value="hourly">Por Hora</SelectItem>
                    <SelectItem value="custom">Customizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Textarea
              value={newService.description || ''}
              onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição do serviço (opcional)"
              className="min-h-[60px]"
            />
            <Button onClick={handleAddService} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Serviço
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArtistPricingManager;
