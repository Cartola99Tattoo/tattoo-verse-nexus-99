
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { CheckIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import DateSelector from "./DateSelector";
import { SchedulingPreferences, PreferredTime } from "@/services/interfaces/IProductService";

const preferredTimes: PreferredTime[] = ["Manhã", "Tarde", "Noite", "Qualquer horário"];

interface SchedulingPreferencesFormProps {
  initialPreferences?: SchedulingPreferences;
  onSave: (preferences: SchedulingPreferences) => void;
}

const SchedulingPreferencesForm: React.FC<SchedulingPreferencesFormProps> = ({
  initialPreferences = {},
  onSave,
}) => {
  const [preferences, setPreferences] = useState<SchedulingPreferences>({
    preferredDates: initialPreferences.preferredDates || [],
    preferredTime: initialPreferences.preferredTime || undefined,
    isFlexible: initialPreferences.isFlexible || false,
    additionalNotes: initialPreferences.additionalNotes || "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleDateChange = (dates: Date[]) => {
    const dateStrings = dates.map(date => date.toISOString());
    setPreferences(prev => ({ ...prev, preferredDates: dateStrings }));
    
    // Clear error if we now have enough dates
    if (dates.length >= 3 && errors.preferredDates) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.preferredDates;
        return newErrors;
      });
    }
  };
  
  const handleTimeChange = (value: PreferredTime) => {
    setPreferences(prev => ({ ...prev, preferredTime: value }));
    
    // Clear error
    if (errors.preferredTime) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.preferredTime;
        return newErrors;
      });
    }
  };
  
  const handleFlexibleChange = (checked: boolean) => {
    setPreferences(prev => ({ ...prev, isFlexible: checked }));
  };
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPreferences(prev => ({ ...prev, additionalNotes: e.target.value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors: Record<string, string> = {};
    
    // Check if we have at least 3 preferred dates
    const selectedDates = preferences.preferredDates || [];
    if (!Array.isArray(selectedDates) || selectedDates.length < 3) {
      newErrors.preferredDates = "Por favor, selecione pelo menos 3 datas preferenciais";
    }
    
    // Check if preferred time is selected
    if (!preferences.preferredTime) {
      newErrors.preferredTime = "Horário preferencial é obrigatório";
    }
    
    // If there are validation errors, don't proceed
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSave(preferences);
  };
  
  // Convert date strings back to Date objects for the DateSelector component
  const selectedDates = (preferences.preferredDates || [])
    .map(dateStr => new Date(dateStr))
    .filter(date => !isNaN(date.getTime())); // Filter out invalid dates
  
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Preferred Dates */}
      <div className="space-y-2">
        <Label className="font-medium">
          Datas Preferenciais <span className="text-red-500">*</span>
        </Label>
        <p className="text-sm text-gray-500 mb-2">
          Selecione pelo menos 3 datas preferenciais para o seu agendamento.
        </p>
        <DateSelector 
          selectedDates={selectedDates}
          onChange={handleDateChange}
          minDates={3}
          maxDates={5}
        />
        {errors.preferredDates && (
          <p className="text-red-500 text-xs mt-1">{errors.preferredDates}</p>
        )}
      </div>
      
      {/* Preferred Time */}
      <div className="space-y-2">
        <Label htmlFor="preferredTime" className="font-medium">
          Horário Preferencial <span className="text-red-500">*</span>
        </Label>
        <Select
          value={preferences.preferredTime}
          onValueChange={handleTimeChange as any}
        >
          <SelectTrigger 
            id="preferredTime" 
            className={errors.preferredTime ? "border-red-500" : ""}
          >
            <SelectValue placeholder="Selecione o horário preferencial" />
          </SelectTrigger>
          <SelectContent>
            {preferredTimes.map(time => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.preferredTime && (
          <p className="text-red-500 text-xs mt-1">{errors.preferredTime}</p>
        )}
      </div>
      
      {/* Flexibility */}
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="flexible" 
          checked={preferences.isFlexible}
          onCheckedChange={handleFlexibleChange}
        />
        <label
          htmlFor="flexible"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Tenho flexibilidade de horário (posso me ajustar à disponibilidade do artista)
        </label>
      </div>
      
      {/* Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="additionalNotes" className="font-medium">
          Informações Adicionais <span className="text-gray-500">(opcional)</span>
        </Label>
        <p className="text-sm text-gray-500">
          Por favor, informe se você tem alguma condição especial, alergia ou outras informações relevantes para o artista.
        </p>
        <Textarea
          id="additionalNotes"
          placeholder="Ex: Tenho alergia a determinado tipo de tinta, já tenho outra tatuagem próxima, etc."
          value={preferences.additionalNotes || ""}
          onChange={handleNotesChange}
          className="min-h-[100px]"
        />
      </div>
    </form>
  );
};

export default SchedulingPreferencesForm;
