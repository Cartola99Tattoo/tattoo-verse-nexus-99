
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tag, Save, Calendar, Users, Palette, Copy, Check, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const couponSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  displayName: z.string().min(1, "Nome para código é obrigatório"),
  eventId: z.string().min(1, "Evento é obrigatório"),
  usageLimit: z.number().min(1, "Limite de uso deve ser maior que 0"),
  categories: z.array(z.string()).min(1, "Selecione pelo menos uma categoria"),
  artists: z.array(z.string()).min(1, "Selecione pelo menos um tatuador"),
  expirationDate: z.string().min(1, "Data de expiração é obrigatória"),
  discountType: z.enum(['percentage', 'fixed', 'free']),
  discountValue: z.number().optional(),
  isActive: z.boolean(),
  description: z.string().optional(),
});

type CouponFormData = z.infer<typeof couponSchema>;

interface EventCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (coupon: any) => void;
}

// Mock data
const mockEvents = [
  { id: "1", name: "Flash Day Verão 2025" },
  { id: "2", name: "Workshop Especial" },
  { id: "3", name: "Festival de Tatuagem" },
];

const mockCategories = [
  "Fineline", "Old School", "Realismo", "Minimalista", "Blackwork", "Aquarela"
];

const mockArtists = [
  "Ana Silva", "Carlos Santos", "Pedro Costa", "Maria Oliveira", "João Pereira"
];

const EventCouponModal: React.FC<EventCouponModalProps> = ({ isOpen, onClose, onSave }) => {
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [isCodeCopied, setIsCodeCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      name: "",
      displayName: "",
      eventId: "",
      usageLimit: 50,
      categories: [],
      artists: [],
      expirationDate: "",
      discountType: 'percentage',
      discountValue: 20,
      isActive: true,
      description: "",
    }
  });

  const watchedDiscountType = watch('discountType');

  const generateSecureCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedCode(result);
    return result;
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setIsCodeCopied(true);
    toast({
      title: "Código copiado!",
      description: "O código do cupom foi copiado para a área de transferência.",
    });
    setTimeout(() => setIsCodeCopied(false), 2000);
  };

  const onSubmit = async (data: CouponFormData) => {
    setIsSubmitting(true);
    
    try {
      const code = generatedCode || generateSecureCode();
      
      const couponData = {
        ...data,
        code,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        usageCount: 0,
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      onSave(couponData);
      
      toast({
        title: "Cupom criado com sucesso!",
        description: `Código gerado: ${code}`,
      });
      
      reset();
      setGeneratedCode("");
      onClose();
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar cupom. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDiscountDisplay = () => {
    const type = watchedDiscountType;
    const value = watch('discountValue');
    
    switch (type) {
      case 'percentage':
        return `${value || 0}% de desconto`;
      case 'fixed':
        return `R$ ${(value || 0).toFixed(2)} de desconto`;
      case 'free':
        return 'Tatuagem grátis';
      default:
        return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-white to-red-50 border-red-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent flex items-center gap-2">
            <Tag className="h-6 w-6 text-red-600" />
            Criar Novo Cupom Promocional para Evento
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações Básicas */}
          <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-red-700 font-bold">Nome do Cupom</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Ex: Promoção Flash Day Verão"
                    className="border-red-200 focus:border-red-500 focus:ring-red-200"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-red-700 font-bold">Nome para Código do Cupom</Label>
                  <Input
                    id="displayName"
                    {...register('displayName')}
                    placeholder="Ex: FlashPartyVerão-A"
                    className="border-red-200 focus:border-red-500 focus:ring-red-200"
                  />
                  {errors.displayName && <p className="text-red-500 text-sm">{errors.displayName.message}</p>}
                  <p className="text-xs text-red-600">Nome descritivo para identificação interna</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-red-700 font-bold">Descrição (Opcional)</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Descreva os detalhes da promoção..."
                  className="border-red-200 focus:border-red-500 focus:ring-red-200"
                />
              </div>
            </CardContent>
          </Card>

          {/* Código de Segurança */}
          <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200 shadow-xl">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-orange-800">Código de Segurança do Cupom</h3>
                  <p className="text-sm text-orange-600">Código aleatório de alto nível de segurança gerado automaticamente</p>
                </div>
                <Button
                  type="button"
                  onClick={generateSecureCode}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Gerar Código
                </Button>
              </div>

              {generatedCode && (
                <div className="bg-white p-4 rounded-lg border-2 border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Código gerado:</p>
                      <p className="text-2xl font-black text-orange-800 tracking-wider">{generatedCode}</p>
                    </div>
                    <Button
                      type="button"
                      onClick={copyCodeToClipboard}
                      variant="outline"
                      className="border-orange-200 text-orange-700 hover:bg-orange-50"
                    >
                      {isCodeCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Evento e Configurações */}
          <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-xl">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventId" className="text-blue-700 font-bold">Evento Associado</Label>
                  <Select onValueChange={(value) => setValue('eventId', value)}>
                    <SelectTrigger className="border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Selecione o evento" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-blue-200">
                      {mockEvents.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            {event.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.eventId && <p className="text-red-500 text-sm">{errors.eventId.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="usageLimit" className="text-blue-700 font-bold">Limite de Uso</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    {...register('usageLimit', { valueAsNumber: true })}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-200"
                  />
                  {errors.usageLimit && <p className="text-red-500 text-sm">{errors.usageLimit.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expirationDate" className="text-blue-700 font-bold">Data de Expiração</Label>
                  <Input
                    id="expirationDate"
                    type="date"
                    {...register('expirationDate')}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-200"
                  />
                  {errors.expirationDate && <p className="text-red-500 text-sm">{errors.expirationDate.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Desconto */}
          <Card className="bg-gradient-to-br from-white to-green-50 border-green-200 shadow-xl">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-green-800">Configuração do Desconto</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discountType" className="text-green-700 font-bold">Tipo de Desconto</Label>
                  <Select onValueChange={(value) => setValue('discountType', value as any)}>
                    <SelectTrigger className="border-green-200 focus:border-green-500">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-green-200">
                      <SelectItem value="percentage">Porcentagem</SelectItem>
                      <SelectItem value="fixed">Valor Fixo</SelectItem>
                      <SelectItem value="free">Tatuagem Grátis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {watchedDiscountType !== 'free' && (
                  <div className="space-y-2">
                    <Label htmlFor="discountValue" className="text-green-700 font-bold">
                      {watchedDiscountType === 'percentage' ? 'Porcentagem (%)' : 'Valor (R$)'}
                    </Label>
                    <Input
                      id="discountValue"
                      type="number"
                      {...register('discountValue', { valueAsNumber: true })}
                      className="border-green-200 focus:border-green-500 focus:ring-green-200"
                    />
                  </div>
                )}
              </div>

              <div className="bg-white p-4 rounded-lg border-2 border-green-200">
                <p className="text-sm text-gray-600">Prévia do desconto:</p>
                <p className="text-xl font-bold text-green-700">{getDiscountDisplay()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Categorias e Artistas */}
          <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-xl">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-purple-800">Restrições do Cupom</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-purple-700 font-bold">Categorias de Tatuagens Válidas</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {mockCategories.map((category) => (
                      <label key={category} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          value={category}
                          onChange={(e) => {
                            const current = watch('categories') || [];
                            if (e.target.checked) {
                              setValue('categories', [...current, category]);
                            } else {
                              setValue('categories', current.filter(c => c !== category));
                            }
                          }}
                          className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm">{category}</span>
                      </label>
                    ))}
                  </div>
                  {errors.categories && <p className="text-red-500 text-sm">{errors.categories.message}</p>}
                </div>

                <Separator className="bg-purple-200" />

                <div className="space-y-2">
                  <Label className="text-purple-700 font-bold">Tatuadores Válidos</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {mockArtists.map((artist) => (
                      <label key={artist} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          value={artist}
                          onChange={(e) => {
                            const current = watch('artists') || [];
                            if (e.target.checked) {
                              setValue('artists', [...current, artist]);
                            } else {
                              setValue('artists', current.filter(a => a !== artist));
                            }
                          }}
                          className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm">{artist}</span>
                      </label>
                    ))}
                  </div>
                  {errors.artists && <p className="text-red-500 text-sm">{errors.artists.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card className="bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Status do Cupom</h3>
                  <p className="text-sm text-gray-600">Defina se o cupom estará ativo imediatamente</p>
                </div>
                <Switch
                  {...register('isActive')}
                  defaultChecked={true}
                  className="data-[state=checked]:bg-green-600"
                />
              </div>
            </CardContent>
          </Card>

          {/* Botões */}
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-red-200 text-red-600 hover:bg-red-50 flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Criando...' : 'Criar Cupom'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventCouponModal;
