
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { SchedulingPreferences, PreferredTime } from "@/services/interfaces/IProductService";
import DateSelector from "./DateSelector";

interface SchedulingPreferencesFormProps {
  initialPreferences?: SchedulingPreferences;
  onSave: (preferences: SchedulingPreferences) => void;
}

const SchedulingPreferencesForm: React.FC<SchedulingPreferencesFormProps> = ({
  initialPreferences,
  onSave,
}) => {
  const [preferences, setPreferences] = useState<SchedulingPreferences>(
    initialPreferences || { preferredDates: [], preferredTime: "Qualquer horário", isFlexible: true }
  );
  
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
    onSave(preferences);
  };
  
  // Parse stored ISO strings back to Date objects
  const selectedDates: Date[] = (preferences.preferredDates || []).map(dateStr => new Date(dateStr));
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="font-medium">Datas Preferenciais</Label>
        <p className="text-sm text-gray-500 mb-2">
          Selecione pelo menos 3 datas preferidas para agendamento da sua sessão
        </p>
        <DateSelector
          selectedDates={selectedDates}
          onChange={handleDatesChange}
          minDates={1}
          maxDates={5}
        />
      </div>
      
      <div className="pt-2">
        <Label className="font-medium">Horário Preferencial</Label>
        <RadioGroup
          value={preferences.preferredTime || 'Qualquer horário'}
          onValueChange={(value) => handleChange('preferredTime', value as PreferredTime)}
          className="mt-2 space-y-1"
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
        />
      </div>
      
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          className="bg-red-500 hover:bg-red-600"
        >
          Salvar Preferências
        </Button>
      </div>
    </form>
  );
};

export default SchedulingPreferencesForm;
