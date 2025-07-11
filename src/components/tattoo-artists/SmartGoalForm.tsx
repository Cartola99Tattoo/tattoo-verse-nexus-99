
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CalendarDays, Target, BarChart3, CheckCircle, Clock, Eye, EyeOff, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SmartGoal {
  id?: string;
  title: string;
  specific: string;
  measurable: string;
  measurableValue: number;
  achievable: string;
  relevant: string;
  timebound: string;
  status: 'Em Andamento' | 'Concluída' | 'Pausada' | 'Cancelada';
  isPublic: boolean;
  createdAt?: string;
}

interface SmartGoalFormProps {
  goal?: SmartGoal | null;
  onSave: (goal: SmartGoal) => void;
  onCancel: () => void;
}

const SmartGoalForm: React.FC<SmartGoalFormProps> = ({ goal, onSave, onCancel }) => {
  const [formData, setFormData] = useState<SmartGoal>({
    id: goal?.id || '',
    title: goal?.title || '',
    specific: goal?.specific || '',
    measurable: goal?.measurable || '',
    measurableValue: goal?.measurableValue || 0,
    achievable: goal?.achievable || '',
    relevant: goal?.relevant || '',
    timebound: goal?.timebound || '',
    status: goal?.status || 'Em Andamento',
    isPublic: goal?.isPublic || false,
    createdAt: goal?.createdAt || new Date().toISOString()
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: keyof SmartGoal, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título da meta é obrigatório';
    }

    if (!formData.specific.trim()) {
      newErrors.specific = 'Campo "Específica" é obrigatório';
    } else if (formData.specific.length > 300) {
      newErrors.specific = 'Máximo de 300 caracteres';
    }

    if (!formData.measurable.trim()) {
      newErrors.measurable = 'Campo "Mensurável" é obrigatório';
    }

    if (!formData.measurableValue || formData.measurableValue <= 0) {
      newErrors.measurableValue = 'Valor alvo deve ser maior que zero';
    }

    if (!formData.timebound) {
      newErrors.timebound = 'Data limite é obrigatória';
    }

    if (formData.achievable.length > 200) {
      newErrors.achievable = 'Máximo de 200 caracteres';
    }

    if (formData.relevant.length > 200) {
      newErrors.relevant = 'Máximo de 200 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const InfoTooltip = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 text-red-500 cursor-help ml-1" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <Card className="border-red-100 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <Target className="h-5 w-5" />
          {goal ? 'Editar Meta SMART' : 'Criar Nova Meta SMART'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título da Meta */}
          <div>
            <Label htmlFor="title" className="text-gray-700 font-medium">
              Título da Meta *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Ex: Meta de Expansão do Estúdio"
              className={`rounded-lg ${errors.title ? 'border-red-500' : 'border-red-200'}`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Seção SMART */}
          <div className="grid gap-6">
            {/* S - Específica */}
            <Card className="bg-red-50 border-red-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-red-700 text-lg flex items-center">
                  🎯 S - Específica
                  <InfoTooltip content="Defina exatamente o que você quer alcançar. Seja claro e detalhado sobre seu objetivo." />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="specific" className="text-gray-700">
                  O que você quer alcançar? *
                </Label>
                <Textarea
                  id="specific"
                  value={formData.specific}
                  onChange={(e) => handleInputChange('specific', e.target.value)}
                  placeholder="Ex: Quero aumentar o número de clientes em sessões de tatuagem de realismo."
                  maxLength={300}
                  rows={3}
                  className={`rounded-lg ${errors.specific ? 'border-red-500' : 'border-red-200'}`}
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-500">{formData.specific.length}/300 caracteres</span>
                  {errors.specific && <span className="text-red-500 text-sm">{errors.specific}</span>}
                </div>
              </CardContent>
            </Card>

            {/* M - Mensurável */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-blue-700 text-lg flex items-center">
                  📊 M - Mensurável
                  <InfoTooltip content="Como você vai medir o progresso? Defina métricas claras e um valor específico a ser alcançado." />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="measurable" className="text-gray-700">
                    Como você vai medir o progresso? *
                  </Label>
                  <Input
                    id="measurable"
                    value={formData.measurable}
                    onChange={(e) => handleInputChange('measurable', e.target.value)}
                    placeholder="Ex: Número de clientes, Faturamento mensal, Sessões por mês"
                    className={`rounded-lg ${errors.measurable ? 'border-red-500' : 'border-blue-200'}`}
                  />
                  {errors.measurable && <p className="text-red-500 text-sm mt-1">{errors.measurable}</p>}
                </div>
                <div>
                  <Label htmlFor="measurableValue" className="text-gray-700">
                    Qual o valor alvo? *
                  </Label>
                  <Input
                    id="measurableValue"
                    type="number"
                    min="1"
                    value={formData.measurableValue}
                    onChange={(e) => handleInputChange('measurableValue', parseInt(e.target.value) || 0)}
                    placeholder="Ex: 20"
                    className={`rounded-lg ${errors.measurableValue ? 'border-red-500' : 'border-blue-200'}`}
                  />
                  {errors.measurableValue && <p className="text-red-500 text-sm mt-1">{errors.measurableValue}</p>}
                </div>
              </CardContent>
            </Card>

            {/* A - Atingível */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-green-700 text-lg flex items-center">
                  ✅ A - Atingível
                  <InfoTooltip content="Sua meta é realista? Explique por que acredita que é possível alcançá-la." />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="achievable" className="text-gray-700">
                  É realista e possível de ser alcançado?
                </Label>
                <Textarea
                  id="achievable"
                  value={formData.achievable}
                  onChange={(e) => handleInputChange('achievable', e.target.value)}
                  placeholder="Ex: Sim, com a divulgação nas redes sociais e aprimoramento das técnicas."
                  maxLength={200}
                  rows={2}
                  className="rounded-lg border-green-200"
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-500">{formData.achievable.length}/200 caracteres</span>
                  {errors.achievable && <span className="text-red-500 text-sm">{errors.achievable}</span>}
                </div>
              </CardContent>
            </Card>

            {/* R - Relevante */}
            <Card className="bg-orange-50 border-orange-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-orange-700 text-lg flex items-center">
                  🎯 R - Relevante
                  <InfoTooltip content="Por que esta meta é importante para o seu estúdio? Como ela contribui para seus objetivos maiores?" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="relevant" className="text-gray-700">
                  Por que essa meta é importante para seu estúdio?
                </Label>
                <Textarea
                  id="relevant"
                  value={formData.relevant}
                  onChange={(e) => handleInputChange('relevant', e.target.value)}
                  placeholder="Ex: Essa meta é crucial para o crescimento da minha especialidade e reconhecimento no mercado."
                  maxLength={200}
                  rows={2}
                  className="rounded-lg border-orange-200"
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-500">{formData.relevant.length}/200 caracteres</span>
                  {errors.relevant && <span className="text-red-500 text-sm">{errors.relevant}</span>}
                </div>
              </CardContent>
            </Card>

            {/* T - Temporal */}
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-purple-700 text-lg flex items-center">
                  ⏰ T - Temporal
                  <InfoTooltip content="Defina uma data limite clara para alcançar sua meta. Isso cria urgência e foco." />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="timebound" className="text-gray-700">
                  Qual a data limite para alcançar essa meta? *
                </Label>
                <Input
                  id="timebound"
                  type="date"
                  value={formData.timebound}
                  onChange={(e) => handleInputChange('timebound', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`rounded-lg ${errors.timebound ? 'border-red-500' : 'border-purple-200'}`}
                />
                {errors.timebound && <p className="text-red-500 text-sm mt-1">{errors.timebound}</p>}
              </CardContent>
            </Card>
          </div>

          {/* Status e Visibilidade */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status" className="text-gray-700 font-medium">
                Status da Meta
              </Label>
              <Select value={formData.status} onValueChange={(value: any) => handleInputChange('status', value)}>
                <SelectTrigger className="rounded-lg border-red-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Em Andamento">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      Em Andamento
                    </div>
                  </SelectItem>
                  <SelectItem value="Concluída">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Concluída
                    </div>
                  </SelectItem>
                  <SelectItem value="Pausada">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      Pausada
                    </div>
                  </SelectItem>
                  <SelectItem value="Cancelada">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-red-500" />
                      Cancelada
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-700 font-medium mb-2 block">
                Visibilidade da Meta
              </Label>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border">
                <Switch
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                />
                <div className="flex items-center gap-2">
                  {formData.isPublic ? (
                    <>
                      <Eye className="h-4 w-4 text-green-600" />
                      <span className="text-green-700 font-medium">Pública para a Comunidade</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-700">Manter Privada</span>
                    </>
                  )}
                </div>
              </div>
              {formData.isPublic && (
                <p className="text-sm text-green-600 mt-1">
                  Sua meta será visível para outros membros da comunidade e pode inspirar colaborações!
                </p>
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg"
            >
              <Target className="h-4 w-4 mr-2" />
              {goal ? 'Atualizar Meta' : 'Criar Meta'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-6 rounded-lg border-red-200 text-red-600 hover:bg-red-50"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SmartGoalForm;
