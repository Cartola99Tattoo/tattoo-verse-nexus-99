
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DateSelectorProps {
  selectedDates: Date[];
  onChange: (dates: Date[]) => void;
  minDates?: number;
  maxDates?: number;
  disabled?: boolean;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDates = [],
  onChange,
  minDates = 1,
  maxDates = 3,
  disabled = false
}) => {
  const [currentDate, setCurrentDate] = useState<Date | undefined>(undefined);

  const handleSelect = (date: Date | undefined) => {
    if (!date || disabled) return;
    
    setCurrentDate(date);
    
    // Verificar se a data é passada
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return; // Não permitir datas passadas
    }
    
    // Verificar se a data já está selecionada
    const dateExists = selectedDates.some(
      selectedDate => 
        selectedDate.getDate() === date.getDate() && 
        selectedDate.getMonth() === date.getMonth() && 
        selectedDate.getFullYear() === date.getFullYear()
    );
    
    if (dateExists) {
      // Se já estiver selecionada, remover
      const updatedDates = selectedDates.filter(
        selectedDate => 
          !(selectedDate.getDate() === date.getDate() && 
          selectedDate.getMonth() === date.getMonth() && 
          selectedDate.getFullYear() === date.getFullYear())
      );
      onChange(updatedDates);
    } else {
      // Se não estiver selecionada e não tiver atingido o máximo, adicionar
      if (selectedDates.length < maxDates) {
        onChange([...selectedDates, date]);
      }
    }
  };

  const removeDate = (index: number) => {
    if (disabled) return;
    const updatedDates = [...selectedDates];
    updatedDates.splice(index, 1);
    onChange(updatedDates);
  };

  // Criar um array de objetos Date para os próximos 2 meses que exclui datas passadas
  const today = new Date();
  const twoMonthsFromNow = new Date();
  twoMonthsFromNow.setMonth(today.getMonth() + 2);
  
  // Função para formatar data para exibição
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      weekday: 'short'
    }).format(date);
  };

  // Verificar se uma data está selecionada para destacá-la no calendário
  const isDateSelected = (date: Date): boolean => {
    return selectedDates.some(selectedDate => 
      selectedDate.getDate() === date.getDate() && 
      selectedDate.getMonth() === date.getMonth() && 
      selectedDate.getFullYear() === date.getFullYear()
    );
  };
  
  return (
    <div className="space-y-3">
      {/* Chips de datas selecionadas */}
      <div className="flex flex-wrap gap-2 min-h-10">
        {selectedDates.map((date, index) => (
          <Badge 
            key={date.toISOString()} 
            variant="outline"
            className="bg-red-50 text-red-800 hover:bg-red-100 px-3 py-1.5 rounded-full flex items-center text-sm"
          >
            {formatDate(date)}
            {!disabled && (
              <button
                type="button"
                onClick={() => removeDate(index)}
                className="ml-2 text-red-600 hover:text-red-800"
                aria-label={`Remover data ${formatDate(date)}`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}
      </div>
      
      {!disabled && (
        <>
          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={handleSelect}
            disabled={[
              { before: today },
              { after: twoMonthsFromNow }
            ]}
            className="rounded border pointer-events-auto bg-white"
            modifiers={{
              selected: selectedDates
            }}
            modifiersStyles={{
              selected: {
                backgroundColor: "#f44336",
                color: "white",
                fontWeight: "bold"
              }
            }}
            showOutsideDays={false}
            fixedWeeks
          />
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>Datas selecionadas: {selectedDates.length}/{maxDates}</span>
            <span>
              {selectedDates.length < minDates 
                ? `Selecione pelo menos ${minDates} datas` 
                : "Clique em uma data para adicionar/remover"}
            </span>
          </div>
          
          <div className="text-xs text-gray-500">
            <p>• Selecione datas nos próximos 2 meses</p>
            <p>• Horário específico será confirmado pelo estúdio</p>
          </div>
        </>
      )}
    </div>
  );
};

export default DateSelector;
