
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const FinancialSettings = () => {
  const [commissionSettings, setCommissionSettings] = useState({
    default_tattoo_rate: 30,
    exclusive_tattoo_rate: 40,
    product_rate: 15,
    currency: 'BRL'
  });

  const [paymentMethods, setPaymentMethods] = useState([
    { id: '1', name: 'Dinheiro', active: true },
    { id: '2', name: 'Cartão de Crédito', active: true },
    { id: '3', name: 'Cartão de Débito', active: true },
    { id: '4', name: 'PIX', active: true },
    { id: '5', name: 'Boleto', active: false },
    { id: '6', name: 'Transferência Bancária', active: true },
  ]);

  const [newPaymentMethod, setNewPaymentMethod] = useState('');

  const handleSaveCommissions = () => {
    // Aqui você salvaria as configurações no backend
    toast({
      title: "Configurações salvas",
      description: "As regras de comissão foram atualizadas com sucesso.",
    });
  };

  const handleAddPaymentMethod = () => {
    if (!newPaymentMethod.trim()) return;
    
    const newMethod = {
      id: Date.now().toString(),
      name: newPaymentMethod,
      active: true
    };
    
    setPaymentMethods([...paymentMethods, newMethod]);
    setNewPaymentMethod('');
    
    toast({
      title: "Método adicionado",
      description: "Novo método de pagamento foi adicionado.",
    });
  };

  const togglePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => 
      method.id === id ? { ...method, active: !method.active } : method
    ));
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    toast({
      title: "Método removido",
      description: "O método de pagamento foi removido.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Configurações Financeiras
        </h2>
        <p className="text-gray-600">Gerencie regras de comissão e métodos de pagamento</p>
      </div>

      <Tabs defaultValue="commissions" className="space-y-4">
        <TabsList className="grid w-fit grid-cols-3">
          <TabsTrigger value="commissions">Comissões</TabsTrigger>
          <TabsTrigger value="payments">Métodos de Pagamento</TabsTrigger>
          <TabsTrigger value="general">Gerais</TabsTrigger>
        </TabsList>

        <TabsContent value="commissions">
          <Card>
            <CardHeader>
              <CardTitle>Regras de Comissão Padrão</CardTitle>
              <CardDescription>
                Configure os percentuais de comissão para diferentes tipos de serviço
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="default_tattoo_rate">Tatuagem de Inspiração (%)</Label>
                  <Input
                    id="default_tattoo_rate"
                    type="number"
                    min="0"
                    max="100"
                    value={commissionSettings.default_tattoo_rate}
                    onChange={(e) => setCommissionSettings({
                      ...commissionSettings,
                      default_tattoo_rate: Number(e.target.value)
                    })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Comissão para tatuagens baseadas em referências
                  </p>
                </div>

                <div>
                  <Label htmlFor="exclusive_tattoo_rate">Tatuagem Exclusiva (%)</Label>
                  <Input
                    id="exclusive_tattoo_rate"
                    type="number"
                    min="0"
                    max="100"
                    value={commissionSettings.exclusive_tattoo_rate}
                    onChange={(e) => setCommissionSettings({
                      ...commissionSettings,
                      exclusive_tattoo_rate: Number(e.target.value)
                    })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Comissão para tatuagens autorais/personalizadas
                  </p>
                </div>

                <div>
                  <Label htmlFor="product_rate">Venda de Produtos (%)</Label>
                  <Input
                    id="product_rate"
                    type="number"
                    min="0"
                    max="100"
                    value={commissionSettings.product_rate}
                    onChange={(e) => setCommissionSettings({
                      ...commissionSettings,
                      product_rate: Number(e.target.value)
                    })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Comissão para venda de produtos físicos
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <Button onClick={handleSaveCommissions}>
                  Salvar Configurações de Comissão
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Pagamento</CardTitle>
              <CardDescription>
                Gerencie os métodos de pagamento disponíveis no sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Adicionar novo método */}
              <div className="flex gap-2">
                <Input
                  placeholder="Nome do novo método de pagamento"
                  value={newPaymentMethod}
                  onChange={(e) => setNewPaymentMethod(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddPaymentMethod()}
                />
                <Button onClick={handleAddPaymentMethod}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>

              {/* Lista de métodos */}
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{method.name}</span>
                      <Badge variant={method.active ? "default" : "secondary"}>
                        {method.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePaymentMethod(method.id)}
                      >
                        {method.active ? "Desativar" : "Ativar"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removePaymentMethod(method.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Configurações básicas do sistema financeiro
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currency">Moeda Padrão</Label>
                  <Select
                    value={commissionSettings.currency}
                    onValueChange={(value) => setCommissionSettings({
                      ...commissionSettings,
                      currency: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a moeda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real Brasileiro (BRL)</SelectItem>
                      <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select defaultValue="America/Sao_Paulo">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o fuso horário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">América/São Paulo (UTC-3)</SelectItem>
                      <SelectItem value="America/New_York">América/Nova York (UTC-5)</SelectItem>
                      <SelectItem value="Europe/London">Europa/Londres (UTC+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t pt-4">
                <Button onClick={handleSaveCommissions}>
                  Salvar Configurações Gerais
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialSettings;
