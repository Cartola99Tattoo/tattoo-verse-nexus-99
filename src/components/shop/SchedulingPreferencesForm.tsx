
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { SchedulingPreferences, PreferredTime } from "@/services/interfaces/IProductService";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Calendar as CalendarIcon, X } from "lucide-react";
import { toast } from "sonner";

interface SchedulingPreferencesFormProps {
  initialPreferences?: SchedulingPreferences;
  onSave: (preferences: SchedulingPreferences) => void;
  readOnly?: boolean;
}

const MIN_DATES = 3;

const SchedulingPreferencesForm: React.FC<SchedulingPreferencesFormProps> = ({
  initialPreferences,
  onSave,
  readOnly = false
}) => {
  const [preferences, setPreferences] = useState<SchedulingPreferences>(initialPreferences || {
    preferredDates: [],
    preferredTime: undefined,
    isFlexible: false,
    additionalNotes: ""
  });
  
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  // Pegar as datas preferidas formatadas
  const getSelectedDatesText = () => {
    if (!preferences.preferredDates || preferences.preferredDates.length === 0) {
      return "Selecione datas para agendamento";
    }
    
    if (preferences.preferredDates.length === 1) {
      return format(new Date(preferences.preferredDates[0]), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    }
    
    return `${preferences.preferredDates.length} datas selecionadas`;
  };

  // Formatar as datas para exibição
  const formatDateForDisplay = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
  };
  
  // Validar o formulário
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Verificar se foram selecionadas pelo menos 3 datas
    if (!preferences.preferredDates || preferences.preferredDates.length < MIN_DATES) {
      newErrors.preferredDates = `Por favor, selecione pelo menos ${MIN_DATES} datas preferidas.`;
    }
    
    // Verificar se foi selecionado um horário preferido
    if (!preferences.preferredTime) {
      newErrors.preferredTime = "Por favor, selecione um horário preferido.";
    }
    
    setErrors(newErrors);
    setTouched({
      preferredDates: true,
      preferredTime: true
    });
    
    return Object.keys(newErrors).length === 0;
  };
  
  // Handler para atualizar o estado de preferências
  const handleChange = (field: keyof SchedulingPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Limpar erro quando o campo é preenchido
    if (errors[field]) {
      if (field === "preferredDates" && (!value || value.length < MIN_DATES)) {
        // Manter o erro se não tiver datas suficientes
        return;
      }
      
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  // Remover uma data específica
  const removeDate = (dateToRemove: string) => {
    if (preferences.preferredDates) {
      const updatedDates = preferences.preferredDates.filter(date => date !== dateToRemove);
      handleChange('preferredDates', updatedDates);
      
      // Verificar se ainda tem datas suficientes após a remoção
      if (updatedDates.length < MIN_DATES) {
        setErrors(prev => ({ 
          ...prev, 
          preferredDates: `Por favor, selecione pelo menos ${MIN_DATES} datas preferidas.`
        }));
      }
    }
  };
  
  // Adicionar uma data selecionada
  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    
    // Verificar se a data é futura
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) {
      toast.error("Data inválida", { 
        description: "Por favor, selecione datas futuras.",
        position: "top-right"
      });
      return;
    }
    
    const dateString = date.toISOString().split('T')[0];
    
    // Verificar se a data já foi selecionada
    if (preferences.preferredDates && preferences.preferredDates.includes(dateString)) {
      // Remover a data se já estiver selecionada (toggle)
      const updatedDates = preferences.preferredDates.filter(d => d !== dateString);
      handleChange('preferredDates', updatedDates);
      
      if (updatedDates.length < MIN_DATES) {
        setErrors(prev => ({ 
          ...prev, 
          preferredDates: `Por favor, selecione pelo menos ${MIN_DATES} datas preferidas.`
        }));
      }
      return;
    }
    
    // Adicionar a nova data
    const updatedDates = [...(preferences.preferredDates || []), dateString].sort();
    handleChange('preferredDates', updatedDates);
    
    // Se atingiu o mínimo de datas, limpar o erro
    if (updatedDates.length >= MIN_DATES && errors.preferredDates) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.preferredDates;
        return newErrors;
      });
    }
  };
  
  // Salvar as preferências
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (validateForm()) {
      onSave(preferences);
    } else {
      toast.error("Por favor, preencha todos os campos obrigatórios.", {
        position: "top-right"
      });
    }
  };
  
  // Autosubmit on changes (for readOnly mode or when all valid fields are entered)
  useEffect(() => {
    if (readOnly) return;
    
    const hasRequiredFields = 
      preferences.preferredDates && 
      preferences.preferredDates.length >= MIN_DATES && 
      preferences.preferredTime;
    
    if (hasRequiredFields && !errors.preferredDates && !errors.preferredTime) {
      const debounceTimer = setTimeout(() => {
        onSave(preferences);
      }, 500);
      
      return () => clearTimeout(debounceTimer);
    }
  }, [preferences, errors, readOnly]);
  
  const isDateSelected = (date: Date): boolean => {
    const dateString = date.toISOString().split('T')[0];
    return preferences.preferredDates ? preferences.preferredDates.includes(dateString) : false;
  };
  
  return (
    <div className="space-y-4">
      {!readOnly && (
        <Alert className="bg-blue-50 border-blue-100">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-800 text-xs">
            Por favor, selecione pelo menos {MIN_DATES} datas preferidas para agendar sua tatuagem.
            O estúdio entrará em contato para confirmar a disponibilidade.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-3">
        {/* Seleção de datas */}
        <div>
          <Label className={`form-required ${touched.preferredDates && errors.preferredDates ? 'text-red-500' : ''}`}>
            Datas Preferidas
          </Label>
          
          <Popover open={calendarOpen && !readOnly} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${
                  touched.preferredDates && errors.preferredDates ? 'border-red-500 focus:ring-red-500' : ''
                }`}
                onClick={() => !readOnly && setCalendarOpen(true)}
                disabled={readOnly}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {getSelectedDatesText()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto">
              <div className="p-3">
                <p className="text-xs mb-2">
                  Selecione ao menos {MIN_DATES} datas. Clique novamente em uma data para desmarcar.
                </p>
                <Calendar
                  mode="multiple"
                  selected={preferences.preferredDates?.map(d => new Date(d)) || []}
                  onSelect={(dates) => {
                    if (dates && dates.length > 0) {
                      // Só atualiza se houver uma mudança real
                      handleChange('preferredDates', dates.map(d => d.toISOString().split('T')[0]).sort());
                    } else {
                      handleChange('preferredDates', []);
                      setErrors(prev => ({
                        ...prev,
                        preferredDates: `Por favor, selecione pelo menos ${MIN_DATES} datas preferidas.`
                      }));
                    }
                  }}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                  initialFocus
                  className="pointer-events-auto"
                />
                
                <div className="border-t mt-3 pt-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setCalendarOpen(false)}
                  >
                    Confirmar datas
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Mostrar datas selecionadas em chips */}
          {preferences.preferredDates && preferences.preferredDates.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {preferences.preferredDates.map((date) => (
                <div 
                  key={date} 
                  className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs flex items-center"
                >
                  {formatDateForDisplay(date)}
                  {!readOnly && (
                    <button 
                      type="button" 
                      className="ml-1 text-gray-500 hover:text-gray-700"
                      onClick={() => removeDate(date)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {touched.preferredDates && errors.preferredDates && (
            <p className="form-error-message">{errors.preferredDates}</p>
          )}
        </div>
        
        {/* Horários preferidos */}
        <div>
          <Label 
            htmlFor="preferredTime"
            className={`form-required ${touched.preferredTime && errors.preferredTime ? 'text-red-500' : ''}`}
          >
            Horário Preferido
          </Label>
          <Select
            value={preferences.preferredTime || ''}
            onValueChange={(value: PreferredTime) => handleChange('preferredTime', value)}
            disabled={readOnly}
            onOpenChange={() => !touched.preferredTime && setTouched({...touched, preferredTime: true})}
          >
            <SelectTrigger 
              className={`w-full ${touched.preferredTime && errors.preferredTime ? 'border-red-500 focus:ring-red-500' : ''}`}
            >
              <SelectValue placeholder="Selecione um horário preferido" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Manhã">Manhã (08:00 - 12:00)</SelectItem>
              <SelectItem value="Tarde">Tarde (13:00 - 18:00)</SelectItem>
              <SelectItem value="Noite">Noite (18:00 - 22:00)</SelectItem>
              <SelectItem value="Qualquer horário">Qualquer horário</SelectItem>
            </SelectContent>
          </Select>
          {touched.preferredTime && errors.preferredTime && (
            <p className="form-error-message">{errors.preferredTime}</p>
          )}
        </div>
        
        {/* Flexibilidade */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isFlexible"
            checked={preferences.isFlexible || false}
            onCheckedChange={(checked) => handleChange('isFlexible', checked === true)}
            disabled={readOnly}
          />
          <label
            htmlFor="isFlexible"
            className="text-sm leading-none"
          >
            Tenho flexibilidade de horário
          </label>
        </div>
        
        {/* Observações adicionais */}
        <div>
          <Label htmlFor="additionalNotes">Observações Adicionais</Label>
          <Textarea
            id="additionalNotes"
            value={preferences.additionalNotes || ''}
            onChange={(e) => handleChange('additionalNotes', e.target.value)}
            placeholder="Informações adicionais para o agendamento..."
            className="resize-none"
            disabled={readOnly}
          />
        </div>
      </div>
      
      {!readOnly && (
        <div className="flex justify-end">
          <Button
            type="button"
            className="bg-red-500 hover:bg-red-600"
            onClick={() => handleSubmit()}
            disabled={
              !preferences.preferredDates ||
              preferences.preferredDates.length < MIN_DATES ||
              !preferences.preferredTime
            }
          >
            Salvar Preferências
          </Button>
        </div>
      )}
    </div>
  );
};

export default SchedulingPreferencesForm;
