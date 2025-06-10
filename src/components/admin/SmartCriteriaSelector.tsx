
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IProjectSmartGoal, SmartCriteria } from "@/services/interfaces/IProjectService";

interface SmartCriteriaSelectorProps {
  smartGoals: IProjectSmartGoal[];
  selectedGoalId: string;
  selectedCriteria: SmartCriteria[];
  onGoalChange: (goalId: string) => void;
  onCriteriaChange: (criteria: SmartCriteria[]) => void;
  showLabel?: boolean;
}

const smartCriteriaOptions = [
  { value: 'specific', label: 'ESPECÍFICA (Specific)' },
  { value: 'measurable', label: 'MENSURÁVEL (Measurable)' },
  { value: 'achievable', label: 'ATINGÍVEL (Achievable)' },
  { value: 'relevant', label: 'RELEVANTE (Relevant)' },
  { value: 'time_bound', label: 'TEMPORAL (Time-bound)' }
];

const SmartCriteriaSelector = ({
  smartGoals,
  selectedGoalId,
  selectedCriteria,
  onGoalChange,
  onCriteriaChange,
  showLabel = true
}: SmartCriteriaSelectorProps) => {
  const handleCriteriaToggle = (criteria: SmartCriteria) => {
    const updatedCriteria = selectedCriteria.includes(criteria)
      ? selectedCriteria.filter(c => c !== criteria)
      : [...selectedCriteria, criteria];
    onCriteriaChange(updatedCriteria);
  };

  return (
    <div className="space-y-4">
      {showLabel && (
        <Label className="text-sm font-semibold text-red-600">
          Associação à Meta SMART
        </Label>
      )}
      
      <div className="bg-red-50 p-4 rounded-lg border border-red-200 space-y-4">
        {smartGoals.length === 0 ? (
          <p className="text-sm text-gray-600 italic">
            Nenhuma Meta SMART definida para este projeto.
          </p>
        ) : (
          <>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-red-700">Meta SMART</Label>
              <Select value={selectedGoalId} onValueChange={onGoalChange}>
                <SelectTrigger className="border-red-200 focus:border-red-400">
                  <SelectValue placeholder="Selecionar meta SMART (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma meta associada</SelectItem>
                  {smartGoals.map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>
                      {goal.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedGoalId && selectedGoalId !== 'none' && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-red-700">
                  Critério(s) SMART Específico(s)
                </Label>
                <div className="grid grid-cols-1 gap-2">
                  {smartCriteriaOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`criteria-${option.value}`}
                        checked={selectedCriteria.includes(option.value as SmartCriteria)}
                        onCheckedChange={() => handleCriteriaToggle(option.value as SmartCriteria)}
                        className="border-red-300"
                      />
                      <Label 
                        htmlFor={`criteria-${option.value}`}
                        className="text-sm cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Selecione um ou mais critérios SMART aos quais esta tarefa/ação contribui.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SmartCriteriaSelector;
