
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, X, AlertCircle } from 'lucide-react';
import { WeeklySchedule, UnavailablePeriod } from '@/services/interfaces/IArtistsService';

interface ArtistScheduleManagerProps {
  schedule?: WeeklySchedule;
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
  { key: 'sunday', label: 'Domingo' }
];

const ArtistScheduleManager = ({ 
  schedule, 
  unavailablePeriods, 
  onScheduleChange, 
  onUnavailablePeriodsChange 
}: ArtistScheduleManagerProps) => {
  const [newUnavailablePeriod, setNewUnavailablePeriod] = useState({
    start_date: '',
    end_date: '',
    reason: ''
  });

  const currentSchedule = schedule || {
    monday: { is_available: false, start_time: '09:00', end_time: '18:00' },
    tuesday: { is_available: false, start_time: '09:00', end_time: '18:00' },
    wednesday: { is_available: false, start_time: '09:00', end_time: '18:00' },
    thursday: { is_available: false, start_time: '09:00', end_time: '18:00' },
    friday: { is_available: false, start_time: '09:00', end_time: '18:00' },
    saturday: { is_available: false, start_time: '09:00', end_time: '18:00' },
    sunday: { is_available: false, start_time: '09:00', end_time: '18:00' }
  };

  const handleDayChange = (day: string, field: string, value: string | boolean) => {
    onScheduleChange({
      ...currentSchedule,
      [day]: {
        ...currentSchedule[day as keyof WeeklySchedule],
        [field]: value
      }
    });
  };

  const handleAddUnavailablePeriod = () => {
    if (!newUnavailablePeriod.start_date || !newUnavailablePeriod.end_date) return;

    const period: UnavailablePeriod = {
      id: Date.now().toString(),
      start_date: newUnavailablePeriod.start_date,
      end_date: newUnavailablePeriod.end_date,
      reason: newUnavailablePeriod.reason || 'Período indisponível'
    };

    onUnavailablePeriodsChange([...unavailablePeriods, period]);
    setNewUnavailablePeriod({ start_date: '', end_date: '', reason: '' });
  };

  const handleRemoveUnavailablePeriod = (id: string) => {
    onUnavailablePeriodsChange(unavailablePeriods.filter(period => period.id !== id));
  };

  const getActiveDaysCount = () => {
    return daysOfWeek.filter(day => currentSchedule[day.key as keyof WeeklySchedule].is_available).length;
  };

  return (
    <div className="space-y-8">
      {/* Horários de Trabalho Semanais */}
      <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-xl font-black">
            <Clock className="h-5 w-5" />
            Horários de Trabalho Semanais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Resumo */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-blue-800 font-bold">Disponibilidade Semanal</h3>
                <p className="text-blue-600">{getActiveDaysCount()} de 7 dias ativos</p>
              </div>
              <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg px-4 py-2">
                {getActiveDaysCount()}/7
              </Badge>
            </div>
          </div>

          {/* Grid de dias */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {daysOfWeek.map((day) => {
              const daySchedule = currentSchedule[day.key as keyof WeeklySchedule];
              return (
                <div
                  key={day.key}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    daySchedule.is_available
                      ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-300 shadow-lg'
                      : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Label className={`font-bold text-lg ${daySchedule.is_available ? 'text-green-800' : 'text-gray-600'}`}>
                      {day.label}
                    </Label>
                    <Switch
                      checked={daySchedule.is_available}
                      onCheckedChange={(checked) => handleDayChange(day.key, 'is_available', checked)}
                      className="data-[state=checked]:bg-green-600"
                    />
                  </div>
                  
                  {daySchedule.is_available && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-green-700 font-medium text-sm">Início</Label>
                        <Input
                          type="time"
                          value={daySchedule.start_time}
                          onChange={(e) => handleDayChange(day.key, 'start_time', e.target.value)}
                          className="border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                        />
                      </div>
                      <div>
                        <Label className="text-green-700 font-medium text-sm">Fim</Label>
                        <Input
                          type="time"
                          value={daySchedule.end_time}
                          onChange={(e) => handleDayChange(day.key, 'end_time', e.target.value)}
                          className="border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Períodos Indisponíveis */}
      <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-xl font-black">
            <Calendar className="h-5 w-5" />
            Períodos Indisponíveis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Adicionar novo período */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
            <h3 className="text-orange-800 font-bold mb-4">Adicionar Período Indisponível</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-orange-700 font-medium">Data Início</Label>
                <Input
                  type="date"
                  value={newUnavailablePeriod.start_date}
                  onChange={(e) => setNewUnavailablePeriod({ ...newUnavailablePeriod, start_date: e.target.value })}
                  className="border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>
              <div>
                <Label className="text-orange-700 font-medium">Data Fim</Label>
                <Input
                  type="date"
                  value={newUnavailablePeriod.end_date}
                  onChange={(e) => setNewUnavailablePeriod({ ...newUnavailablePeriod, end_date: e.target.value })}
                  className="border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>
              <div>
                <Label className="text-orange-700 font-medium">Motivo</Label>
                <Input
                  value={newUnavailablePeriod.reason}
                  onChange={(e) => setNewUnavailablePeriod({ ...newUnavailablePeriod, reason: e.target.value })}
                  placeholder="Ex: Férias, Viagem..."
                  className="border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleAddUnavailablePeriod}
                  disabled={!newUnavailablePeriod.start_date || !newUnavailablePeriod.end_date}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </div>
          </div>

          {/* Lista de períodos */}
          <div className="space-y-3">
            {unavailablePeriods.map((period) => (
              <div key={period.id} className="bg-white p-4 rounded-lg border border-orange-200 shadow-md hover:shadow-lg transition-all duration-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                      <div>
                        <div className="font-medium text-gray-800">{period.reason}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(period.start_date).toLocaleDateString()} até {new Date(period.end_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveUnavailablePeriod(period.id)}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {unavailablePeriods.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>Nenhum período indisponível configurado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ArtistScheduleManager;
