
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface DateSelectorProps {
  selectedDates: Date[];
  onChange: (dates: Date[]) => void;
  minDates?: number;
  maxDates?: number;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDates = [],
  onChange,
  minDates = 1,
  maxDates = 3
}) => {
  const [currentDate, setCurrentDate] = useState<Date | undefined>(undefined);

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    
    setCurrentDate(date);
    
    // Check if date is already selected
    const dateExists = selectedDates.some(
      selectedDate => 
        selectedDate.getDate() === date.getDate() && 
        selectedDate.getMonth() === date.getMonth() && 
        selectedDate.getFullYear() === date.getFullYear()
    );
    
    if (dateExists) {
      // If already selected, remove it
      const updatedDates = selectedDates.filter(
        selectedDate => 
          !(selectedDate.getDate() === date.getDate() && 
          selectedDate.getMonth() === date.getMonth() && 
          selectedDate.getFullYear() === date.getFullYear())
      );
      onChange(updatedDates);
    } else {
      // If not selected and haven't reached max, add it
      if (selectedDates.length < maxDates) {
        onChange([...selectedDates, date]);
      }
    }
  };

  const removeDate = (index: number) => {
    const updatedDates = [...selectedDates];
    updatedDates.splice(index, 1);
    onChange(updatedDates);
  };

  // Create an array of Date objects for the next 2 months that excludes past dates
  const today = new Date();
  const twoMonthsFromNow = new Date();
  twoMonthsFromNow.setMonth(today.getMonth() + 2);
  
  // Function to format date for display
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="space-y-3">
      {/* Selected dates chips */}
      <div className="flex flex-wrap gap-2 min-h-10">
        {selectedDates.map((date, index) => (
          <div 
            key={date.toISOString()} 
            className="bg-red-100 text-red-800 px-3 py-1 rounded-full flex items-center text-sm"
          >
            {formatDate(date)}
            <button
              type="button"
              onClick={() => removeDate(index)}
              className="ml-2 text-red-600 hover:text-red-800"
              aria-label={`Remover data ${formatDate(date)}`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        
        {selectedDates.length < minDates && (
          <p className="text-amber-600 text-xs mt-1">
            Por favor, selecione pelo menos {minDates} data{minDates > 1 ? 's' : ''} preferencial{minDates > 1 ? 'is' : ''}
          </p>
        )}
      </div>
      
      <Calendar
        mode="single"
        selected={currentDate}
        onSelect={handleSelect}
        disabled={[
          { before: today },
          { after: twoMonthsFromNow }
        ]}
        className="rounded border"
      />
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>Datas selecionadas: {selectedDates.length}/{maxDates}</span>
        <span>Clique em uma data para adicionar/remover</span>
      </div>
    </div>
  );
};

export default DateSelector;
