
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Loader } from "lucide-react";

interface ServiceFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  categories: Array<{ id: string; name: string; }>;
  artists: Array<{ id: string; first_name: string; last_name: string; }>;
  isSubmitting: boolean;
}

export default function ServiceForm({
  initialData,
  onSubmit,
  onCancel,
  categories,
  artists,
  isSubmitting
}: ServiceFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    service_type: initialData?.service_type || "",
    price: initialData?.price || "",
    duration: initialData?.duration || "",
    status: initialData?.status || "active",
    images: initialData?.images || []
  });

  const serviceTypes = [
    { value: "digital", label: "Serviço Digital" },
    { value: "apoio", label: "Apoio ao Projeto" },
    { value: "presencial", label: "Serviço Presencial" }
  ];

  const statusOptions = [
    { value: "active", label: "Ativo" },
    { value: "inactive", label: "Inativo" }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isPriceDisabled = formData.service_type === "apoio";

  return (
    <div className="max-h-[80vh] overflow-y-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <Card className="border-red-200 bg-gradient-to-br from-white to-red-50">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-black text-red-800 text-lg">Informações do Serviço</h3>
            
            <div>
              <Label htmlFor="name" className="text-red-700 font-bold">Título do Serviço</Label>
              <Input
                id="name"
                variant="tattoo"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ex: Consultoria de Design Online, Workshop de Cuidados"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-red-700 font-bold">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Descrição detalhada do serviço oferecido"
                className="border-red-200 focus:border-red-600 focus:ring-red-200"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="service_type" className="text-red-700 font-bold">Tipo de Serviço</Label>
                <Select value={formData.service_type} onValueChange={(value) => handleInputChange("service_type", value)}>
                  <SelectTrigger className="border-red-200 focus:border-red-600 focus:ring-red-200">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status" className="text-red-700 font-bold">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger className="border-red-200 focus:border-red-600 focus:ring-red-200">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price" className="text-red-700 font-bold">
                  Preço {isPriceDisabled && "(Valor Livre / Doação)"}
                </Label>
                <Input
                  id="price"
                  type="number"
                  variant="tattoo"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                  placeholder={isPriceDisabled ? "Valor definido pelo cliente" : "0,00"}
                  disabled={isPriceDisabled}
                  required={!isPriceDisabled}
                />
                {isPriceDisabled && (
                  <p className="text-xs text-red-500 mt-1">
                    Para apoio ao projeto, o cliente define o valor no momento da compra
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="duration" className="text-red-700 font-bold">Duração (minutos)</Label>
                <Input
                  id="duration"
                  type="number"
                  variant="tattoo"
                  value={formData.duration}
                  onChange={(e) => handleInputChange("duration", e.target.value)}
                  placeholder="Ex: 60 (para 1 hora)"
                />
                <p className="text-xs text-red-500 mt-1">
                  Opcional - aplicável para consultorias e serviços com tempo definido
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Específicas por Tipo */}
        {formData.service_type && (
          <Card className="border-red-200 bg-gradient-to-br from-white to-red-50">
            <CardContent className="p-4 space-y-4">
              <h3 className="font-black text-red-800 text-lg">
                Informações Específicas - {serviceTypes.find(t => t.value === formData.service_type)?.label}
              </h3>
              
              {formData.service_type === "digital" && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-2">Serviço Digital</h4>
                    <p className="text-blue-700 text-sm">
                      Este serviço será oferecido de forma online. Inclua na descrição:
                    </p>
                    <ul className="text-blue-700 text-sm mt-2 list-disc list-inside">
                      <li>Plataforma utilizada (Zoom, Meet, etc.)</li>
                      <li>Materiais fornecidos</li>
                      <li>Requisitos técnicos</li>
                      <li>Política de cancelamento</li>
                    </ul>
                  </div>
                </div>
              )}

              {formData.service_type === "apoio" && (
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-2">Apoio ao Projeto 99Tattoo</h4>
                    <p className="text-purple-700 text-sm">
                      Esta opção permite que clientes apoiem o projeto com valores livres. Inclua na descrição:
                    </p>
                    <ul className="text-purple-700 text-sm mt-2 list-disc list-inside">
                      <li>Como o apoio ajuda o projeto</li>
                      <li>Benefícios ou reconhecimentos oferecidos</li>
                      <li>Transparência no uso dos recursos</li>
                    </ul>
                  </div>
                </div>
              )}

              {formData.service_type === "presencial" && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-2">Serviço Presencial</h4>
                    <p className="text-green-700 text-sm">
                      Este serviço requer presença física. Inclua na descrição:
                    </p>
                    <ul className="text-green-700 text-sm mt-2 list-disc list-inside">
                      <li>Local onde será realizado</li>
                      <li>Equipamentos utilizados</li>
                      <li>Preparação necessária</li>
                      <li>Política de agendamento</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Upload de Imagens */}
        <Card className="border-red-200 bg-gradient-to-br from-white to-red-50">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-black text-red-800 text-lg">Imagens do Serviço</h3>
            
            <div>
              <Label className="text-red-700 font-bold">Imagens Representativas</Label>
              <div className="border-2 border-dashed border-red-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-red-400" />
                <p className="mt-2 text-sm text-red-600">
                  Arraste e solte imagens aqui ou clique para selecionar
                </p>
                <p className="text-xs text-red-500 mt-1">
                  PNG, JPG, GIF até 10MB cada
                </p>
              </div>
              <p className="text-xs text-red-600 mt-2">
                Adicione imagens que representem o serviço (screenshots, fotos do local, logos, etc.)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="tattoo"
            disabled={isSubmitting}
            className="shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Serviço"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
