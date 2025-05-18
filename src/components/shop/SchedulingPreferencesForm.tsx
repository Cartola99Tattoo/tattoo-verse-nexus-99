
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { SchedulingPreferences, PreferredTime } from "@/services/interfaces/IProductService";
import DateSelector from "./DateSelector";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Check } from "lucide-react";

interface SchedulingPreferencesFormProps {
  initialPreferences?: SchedulingPreferences;
  onSave: (preferences: SchedulingPreferences) => void;
  onlyDisplay?: boolean;
  artistName?: string;
}

const SchedulingPreferencesForm: React.FC<SchedulingPreferencesFormProps> = ({
  initialPreferences,
  onSave,
  onlyDisplay = false,
  artistName
}) => {
  const [preferences, setPreferences] = useState<SchedulingPreferences>(
    initialPreferences || { 
      preferredDates: [], 
      preferredTime: "Qualquer horário", 
      isFlexible: true 
    }
  );
  
  const [saveAttempted, setSaveAttempted] = useState(false);
  
  const preferredTimes: PreferredTime[] = [
    'Manhã',
    'Tarde',
    'Noite',
    'Qualquer horário'
  ];
  
  const handleChange = (field: keyof SchedulingPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };
  
  const handleDatesChange = (dates: Date[]) => {
    const formattedDates = dates.map(date => date.toISOString());
    handleChange('preferredDates', formattedDates);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveAttempted(true);
    
    if (isValid) {
      onSave(preferences);
    }
  };
  
  // Parse stored ISO strings back to Date objects
  const selectedDates: Date[] = (preferences.preferredDates || []).map(dateStr => new Date(dateStr));
  
  const isValid = selectedDates.length >= 3;
  const showError = saveAttempted && !isValid;
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label className="font-medium">Datas Preferenciais</Label>
          {artistName && (
            <span className="text-sm text-gray-500">para {artistName}</span>
          )}
        </div>
        
        <p className="text-sm text-gray-500 mb-2">
          Selecione pelo menos 3 datas preferidas para agendamento da sua sessão
        </p>
        <DateSelector
          selectedDates={selectedDates}
          onChange={handleDatesChange}
          minDates={3}
          maxDates={5}
          disabled={onlyDisplay}
        />
        
        {showError && (
          <Alert className="mt-2 bg-amber-50 border-amber-100">
            <Info className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-800 text-xs">
              Selecione pelo menos 3 datas para prosseguir
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      <div className="pt-2">
        <Label className="font-medium">Horário Preferencial</Label>
        <RadioGroup
          value={preferences.preferredTime || 'Qualquer horário'}
          onValueChange={(value) => handleChange('preferredTime', value as PreferredTime)}
          className="mt-2 space-y-1"
          disabled={onlyDisplay}
        >
          {preferredTimes.map((time) => (
            <div key={time} className="flex items-center space-x-2">
              <RadioGroupItem value={time} id={`time-${time}`} />
              <Label htmlFor={`time-${time}`} className="text-sm">{time}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      <div className="flex items-center space-x-2 pt-2">
        <Switch
          id="flexible"
          checked={preferences.isFlexible}
          onCheckedChange={(checked) => handleChange('isFlexible', checked)}
          disabled={onlyDisplay}
        />
        <Label htmlFor="flexible">Tenho flexibilidade de horário</Label>
      </div>
      
      <div className="pt-2">
        <Label htmlFor="notes">Informações Adicionais (opcional)</Label>
        <Textarea
          id="notes"
          value={preferences.additionalNotes || ''}
          onChange={(e) => handleChange('additionalNotes', e.target.value)}
          placeholder="Alguma alergia? Condição de saúde? Já possui tatuagens na mesma área?"
          className="mt-1"
          rows={3}
          disabled={onlyDisplay}
        />
      </div>
      
      {!onlyDisplay && (
        <div className="flex flex-col pt-2 space-y-2">
          <Alert className="bg-blue-50 border-blue-100">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-800 text-xs">
              Após confirmação do seu pedido, o estúdio entrará em contato para confirmar
              uma das suas datas preferenciais de acordo com a disponibilidade do artista.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-red-500 hover:bg-red-600"
              disabled={!isValid}
            >
              {isValid ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Salvar Preferências
                </>
              ) : (
                "Selecione pelo menos 3 datas"
              )}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

export default SchedulingPreferencesForm;
