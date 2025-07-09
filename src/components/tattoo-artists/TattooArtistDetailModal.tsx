
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  User, 
  Target, 
  BarChart3, 
  Star, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  TrendingDown,
  Download
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { TattooArtistData, MonthlyMetrics } from '@/services/FirestoreService';
import MetricsComparisonCard from './MetricsComparisonCard';

interface TattooArtistDetailModalProps {
  artist: TattooArtistData | null;
  isOpen: boolean;
  onClose: () => void;
  onExport?: (artist: TattooArtistData) => void;
}

const TattooArtistDetailModal: React.FC<TattooArtistDetailModalProps> = ({
  artist,
  isOpen,
  onClose,
  onExport
}) => {
  if (!artist) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Preparar dados das métricas ordenados
  const sortedMetrics = artist.metricasMensais 
    ? Object.entries(artist.metricasMensais)
        .sort(([a], [b]) => b.localeCompare(a)) // Mais recente primeiro
        .map(([monthYear, data], index, array) => ({
          monthYear,
          data,
          previousData: array[index + 1] ? array[index + 1][1] : undefined,
          avgPerTattoo: data.tatuagensRealizadas > 0 ? data.valorTotalRecebido / data.tatuagensRealizadas : 0,
          avgPerHour: data.horasTrabalhadas > 0 ? data.valorTotalRecebido / data.horasTrabalhadas : 0
        }))
    : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <User className="h-6 w-6 text-purple-600" />
              Perfil Detalhado: {artist.userId}
            </DialogTitle>
            {onExport && (
              <Button
                onClick={() => onExport(artist)}
                variant="outline"
                size="sm"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            {/* Seção Diagnóstico SPIN */}
            {artist.diagnostico && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-red-700">
                  <Target className="h-5 w-5" />
                  Diagnóstico Estratégico SPIN
                </h3>
                
                <div className="grid gap-4">
                  {[
                    { 
                      key: 'situacao', 
                      title: '📊 Situação Atual', 
                      color: 'bg-blue-50 border-blue-200',
                      icon: BarChart3
                    },
                    { 
                      key: 'problemas', 
                      title: '❗ Problemas e Desafios', 
                      color: 'bg-orange-50 border-orange-200',
                      icon: AlertTriangle
                    },
                    { 
                      key: 'implicacoes', 
                      title: '⚠️ Impactos e Consequências', 
                      color: 'bg-red-50 border-red-200',
                      icon: TrendingDown
                    },
                    { 
                      key: 'necessidades', 
                      title: '💡 Necessidades e Soluções', 
                      color: 'bg-green-50 border-green-200',
                      icon: Target
                    }
                  ].map(section => {
                    const sectionData = artist.diagnostico![section.key as keyof typeof artist.diagnostico];
                    if (!sectionData || typeof sectionData !== 'object') return null;
                    
                    return (
                      <Card key={section.key} className={`${section.color} border-2`}>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <section.icon className="h-4 w-4" />
                            {section.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {Object.entries(sectionData as Record<string, string>).map(([questionId, answer], idx) => (
                              <div key={questionId} className="bg-white p-4 rounded-lg border shadow-sm">
                                <div className="flex items-start gap-3">
                                  <div className="bg-red-100 text-red-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                    {idx + 1}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-800 leading-relaxed">
                                      {answer}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Seção Métricas Mensais */}
            {sortedMetrics.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-700">
                  <BarChart3 className="h-5 w-5" />
                  Histórico de Métricas Mensais
                </h3>
                
                <div className="grid gap-4">
                  {sortedMetrics.map(({ monthYear, data, previousData, avgPerTattoo, avgPerHour }) => (
                    <MetricsComparisonCard
                      key={monthYear}
                      monthYear={monthYear}
                      currentData={data}
                      previousData={previousData}
                      avgPerTattoo={avgPerTattoo}
                      avgPerHour={avgPerHour}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Estado vazio */}
            {!artist.diagnostico && (!artist.metricasMensais || Object.keys(artist.metricasMensais).length === 0) && (
              <div className="text-center py-12">
                <User className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Perfil em Construção
                </h3>
                <p className="text-gray-500">
                  Este tatuador ainda não preencheu seu diagnóstico ou métricas mensais.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TattooArtistDetailModal;
