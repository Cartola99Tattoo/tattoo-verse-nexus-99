
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Brush, Clock, DollarSign, Star } from 'lucide-react';

interface MetricData {
  tatuagensRealizadas: number;
  horasTrabalhadas: number;
  valorTotalRecebido: number;
  compartilhadoComunidade: boolean;
}

interface MetricsComparisonCardProps {
  monthYear: string;
  currentData: MetricData;
  previousData?: MetricData;
  avgPerTattoo: number;
  avgPerHour: number;
}

const MetricsComparisonCard: React.FC<MetricsComparisonCardProps> = ({
  monthYear,
  currentData,
  previousData,
  avgPerTattoo,
  avgPerHour
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calculateChange = (current: number, previous?: number) => {
    if (!previous || previous === 0) return null;
    return current - previous;
  };

  const getChangeDisplay = (change: number | null, isPercentage = false) => {
    if (change === null || change === 0) return null;
    
    const isPositive = change > 0;
    const displayValue = isPercentage 
      ? `${Math.abs(change).toFixed(1)}%`
      : Math.abs(change).toString();
    
    return (
      <Badge 
        className={`ml-2 text-xs ${
          isPositive 
            ? 'bg-green-100 text-green-800 border-green-200' 
            : 'bg-red-100 text-red-800 border-red-200'
        }`}
      >
        {isPositive ? (
          <TrendingUp className="h-3 w-3 mr-1" />
        ) : (
          <TrendingDown className="h-3 w-3 mr-1" />
        )}
        {isPositive ? '+' : '-'}{displayValue}
      </Badge>
    );
  };

  // Calcular mudanças
  const tattooChange = calculateChange(currentData.tatuagensRealizadas, previousData?.tatuagensRealizadas);
  const hoursChange = calculateChange(currentData.horasTrabalhadas, previousData?.horasTrabalhadas);
  const revenueChange = calculateChange(currentData.valorTotalRecebido, previousData?.valorTotalRecebido);
  
  const prevAvgPerTattoo = previousData && previousData.tatuagensRealizadas > 0 
    ? previousData.valorTotalRecebido / previousData.tatuagensRealizadas 
    : 0;
  const avgTattooChange = calculateChange(avgPerTattoo, prevAvgPerTattoo);

  const prevAvgPerHour = previousData && previousData.horasTrabalhadas > 0 
    ? previousData.valorTotalRecebido / previousData.horasTrabalhadas 
    : 0;
  const avgHourChange = calculateChange(avgPerHour, prevAvgPerHour);

  return (
    <Card className="border-red-200 bg-gradient-to-br from-white to-red-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-red-800">
            {monthYear}
          </CardTitle>
          {currentData.compartilhadoComunidade && (
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              <Star className="h-3 w-3 mr-1" />
              Compartilhado
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Métricas brutas */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
              Dados do Mês
            </h4>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brush className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Tatuagens</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-purple-700">
                  {currentData.tatuagensRealizadas}
                </span>
                {tattooChange !== null && getChangeDisplay(tattooChange)}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">Horas</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-orange-700">
                  {currentData.horasTrabalhadas}h
                </span>
                {hoursChange !== null && getChangeDisplay(hoursChange)}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Faturamento</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-green-700">
                  {formatCurrency(currentData.valorTotalRecebido)}
                </span>
                {revenueChange !== null && getChangeDisplay(revenueChange)}
              </div>
            </div>
          </div>

          {/* Métricas calculadas */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
              Valores Médios
            </h4>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Por Tatuagem</span>
              <div className="flex items-center">
                <span className="font-bold text-indigo-700">
                  {currentData.tatuagensRealizadas > 0 
                    ? formatCurrency(avgPerTattoo) 
                    : 'N/A'
                  }
                </span>
                {avgTattooChange !== null && currentData.tatuagensRealizadas > 0 && 
                  getChangeDisplay(avgTattooChange)
                }
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Por Hora</span>
              <div className="flex items-center">
                <span className="font-bold text-teal-700">
                  {currentData.horasTrabalhadas > 0 
                    ? formatCurrency(avgPerHour) 
                    : 'N/A'
                  }
                </span>
                {avgHourChange !== null && currentData.horasTrabalhadas > 0 && 
                  getChangeDisplay(avgHourChange)
                }
              </div>
            </div>
          </div>
        </div>

        {/* Insights */}
        {(tattooChange !== null || revenueChange !== null) && (
          <div className="mt-4 pt-4 border-t border-red-200">
            <p className="text-xs text-gray-600">
              📈 Comparação com {previousData ? 'mês anterior' : 'período anterior'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricsComparisonCard;
