
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { WeeklySchedule, DaySchedule, UnavailablePeriod } from "@/services/interfaces/IArtistsService";
import { Calendar, Clock, Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface ArtistScheduleManagerProps {
  schedule: WeeklySchedule | undefined;
  unavailablePeriods: UnavailablePeriod[];
  onScheduleChange: (schedule: WeeklySchedule) => void;
  onUnavailablePeriodsChange: (periods: UnavailablePeriod[]) => void;
}

const daysOfWeek = [
  { key: 'monday', label: 'Segunda-feira' },
  { key: 'tuesday', label: 'Terça-feira' },
  { key: 'wednesday', label: 'Quarta-feira' },
  { key: 'thursday', label: 'Quinta-feira' },
  { key: 'friday', label: 'Sexta-feira' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
];

const unavailableTypes = [
  { value: 'vacation', label: 'Férias' },
  { value: 'sick_leave', label: 'Licença Médica' },
  { value: 'workshop', label: 'Workshop/Curso' },
  { value: 'personal', label: 'Pessoal' },
  { value: 'other', label: 'Outro' },
];

const ArtistScheduleManager = ({ 
  schedule, 
  unavailablePeriods, 
  onScheduleChange, 
  onUnavailablePeriodsChange 
}: ArtistScheduleManagerProps) => {
  const currentSchedule: WeeklySchedule = schedule || {};

  const handleDayScheduleChange = (day: keyof WeeklySchedule, daySchedule: DaySchedule) => {
    onScheduleChange({
      ...currentSchedule,
      [day]: daySchedule
    });
  };

  const handleAddUnavailablePeriod = () => {
    const newPeriod: UnavailablePeriod = {
      id: `period-${Date.now()}`,
      artist_id: '', // Will be set by parent
      start_date: '',
      end_date: '',
      reason: '',
      type: 'vacation',
      created_at: new Date().toISOString()
    };

    onUnavailablePeriodsChange([...unavailablePeriods, newPeriod]);
  };

  const handleUpdateUnavailablePeriod = (periodId: string, updates: Partial<UnavailablePeriod>) => {
    onUnavailablePeriodsChange(
      unavailablePeriods.map(period =>
        period.id === periodId ? { ...period, ...updates } : period
      )
    );
  };

  const handleRemoveUnavailablePeriod = (periodId: string) => {
    onUnavailablePeriodsChange(
      unavailablePeriods.filter(period => period.id !== periodId)
    );
  };

  return (
    <div className="space-y-6">
      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horários de Trabalho Semanais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {daysOfWeek.map(({ key, label }) => {
            const daySchedule = currentSchedule[key as keyof WeeklySchedule] || {
              is_working: false,
              start_time: '09:00',
              end_time: '18:00'
            };

            return (
              <div key={key} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">{label}</Label>
                  <Switch
                    checked={daySchedule.is_working}
                    onCheckedChange={(checked) =>
                      handleDayScheduleChange(key as keyof WeeklySchedule, {
                        ...daySchedule,
                        is_working: checked
                      })
                    }
                  />
                </div>
                
                {daySchedule.is_working && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Início</Label>
                      <Input
                        type="time"
                        value={daySchedule.start_time || '09:00'}
                        onChange={(e) =>
                          handleDayScheduleChange(key as keyof WeeklySchedule, {
                            ...daySchedule,
                            start_time: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Fim</Label>
                      <Input
                        type="time"
                        value={daySchedule.end_time || '18:00'}
                        onChange={(e) =>
                          handleDayScheduleChange(key as keyof WeeklySchedule, {
                            ...daySchedule,
                            end_time: e.target.value
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Pausa Início</Label>
                      <Input
                        type="time"
                        value={daySchedule.break_start || ''}
                        onChange={(e) =>
                          handleDayScheduleChange(key as keyof WeeklySchedule, {
                            ...daySchedule,
                            break_start: e.target.value
                          })
                        }
                        placeholder="Opcional"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Pausa Fim</Label>
                      <Input
                        type="time"
                        value={daySchedule.break_end || ''}
                        onChange={(e) =>
                          handleDayScheduleChange(key as keyof WeeklySchedule, {
                            ...daySchedule,
                            break_end: e.target.value
                          })
                        }
                        placeholder="Opcional"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Unavailable Periods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Períodos de Indisponibilidade
            </CardTitle>
            <Button onClick={handleAddUnavailablePeriod}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Período
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {unavailablePeriods.length > 0 ? (
            unavailablePeriods.map((period) => (
              <div key={period.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Data Início</Label>
                        <Input
                          type="date"
                          value={period.start_date}
                          onChange={(e) =>
                            handleUpdateUnavailablePeriod(period.id, { start_date: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Data Fim</Label>
                        <Input
                          type="date"
                          value={period.end_date}
                          onChange={(e) =>
                            handleUpdateUnavailablePeriod(period.id, { end_date: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Tipo</Label>
                        <Select
                          value={period.type}
                          onValueChange={(value: 'vacation' | 'sick_leave' | 'workshop' | 'personal' | 'other') =>
                            handleUpdateUnavailablePeriod(period.id, { type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {unavailableTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Motivo</Label>
                      <Input
                        value={period.reason}
                        onChange={(e) =>
                          handleUpdateUnavailablePeriod(period.id, { reason: e.target.value })
                        }
                        placeholder="Descreva o motivo da indisponibilidade"
                      />
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="ml-2"
                    onClick={() => handleRemoveUnavailablePeriod(period.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum período de indisponibilidade cadastrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ArtistScheduleManager;
