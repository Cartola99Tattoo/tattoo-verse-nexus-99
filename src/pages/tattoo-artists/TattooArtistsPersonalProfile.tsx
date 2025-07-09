
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Trophy, 
  Target, 
  BarChart3, 
  Calendar, 
  TrendingUp,
  Award,
  Clock,
  DollarSign,
  Brush,
  Star,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calculator
} from 'lucide-react';
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";
import SPINQuestionnaire from "@/components/tattoo-artists/SPINQuestionnaire";
import MonthlyMetricsManager from "@/components/tattoo-artists/MonthlyMetricsManager";
import { useFirestoreIntegration } from "@/hooks/useFirestoreIntegration";

const TattooArtistsPersonalProfile = () => {
  const {
    isAuthenticated,
    loading,
    spinAnswers,
    monthlyMetrics,
    saveSPINSection,
    saveMonthlyMetrics,
    loadUserData
  } = useFirestoreIntegration();

  const [localSPINResponses, setLocalSPINResponses] = useState<Record<string, string>>({});
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  // Carregar dados ao inicializar
  useEffect(() => {
    if (isAuthenticated) {
      loadUserData();
    }
  }, [isAuthenticated, loadUserData]);

  // Atualizar estado local quando dados do Firestore mudarem
  useEffect(() => {
    if (spinAnswers) {
      const flattenedResponses: Record<string, string> = {};
      Object.entries(spinAnswers).forEach(([section, answers]) => {
        if (typeof answers === 'object' && answers !== null) {
          Object.entries(answers as Record<string, string>).forEach(([questionId, answer]) => {
            flattenedResponses[questionId] = answer;
          });
        }
      });
      setLocalSPINResponses(flattenedResponses);
    }
  }, [spinAnswers]);

  // Função para calcular métricas derivadas
  const calculateDerivedMetrics = (metrics: Record<string, any>) => {
    const metricsArray = Object.entries(metrics).map(([monthYear, data]) => {
      const [year, month] = monthYear.split('-').map(Number);
      return {
        monthYear,
        year,
        month,
        ...data,
        avgPerTattoo: data.tatuagensRealizadas > 0 ? data.valorTotalRecebido / data.tatuagensRealizadas : 0,
        avgPerHour: data.horasTrabalhadas > 0 ? data.valorTotalRecebido / data.horasTrabalhadas : 0
      };
    }).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });

    return metricsArray;
  };

  // Calcular estatísticas do perfil
  const profileStats = React.useMemo(() => {
    const metricsArray = calculateDerivedMetrics(monthlyMetrics);
    
    const totalTattoos = metricsArray.reduce((sum, m) => sum + (m.tatuagensRealizadas || 0), 0);
    const totalRevenue = metricsArray.reduce((sum, m) => sum + (m.valorTotalRecebido || 0), 0);
    const totalHours = metricsArray.reduce((sum, m) => sum + (m.horasTrabalhadas || 0), 0);
    const sharedMonths = metricsArray.filter(m => m.compartilhadoComunidade).length;
    
    const avgTattooValue = totalTattoos > 0 ? totalRevenue / totalTattoos : 0;
    const avgHourlyRate = totalHours > 0 ? totalRevenue / totalHours : 0;
    
    return {
      totalTattoos,
      totalRevenue,
      avgTattooValue,
      avgHourlyRate,
      totalMonths: metricsArray.length,
      sharedMonths
    };
  }, [monthlyMetrics]);

  // Progresso do diagnóstico SPIN
  const spinProgress = React.useMemo(() => {
    const sections = ['situacao', 'problemas', 'implicacoes', 'necessidades'];
    const completedSections = sections.filter(section => 
      spinAnswers[section] && Object.keys(spinAnswers[section]).length > 0
    ).length;
    return Math.round((completedSections / sections.length) * 100);
  }, [spinAnswers]);

  const handleSPINUpdate = (responses: Record<string, string>) => {
    setLocalSPINResponses(responses);
  };

  const handleSPINSave = async () => {
    setIsLoadingAction(true);
    try {
      // Agrupar respostas por seção para salvamento completo
      const sections = ['situacao', 'problemas', 'implicacoes', 'necessidades'];
      
      for (const section of sections) {
        const sectionAnswers: Record<string, string> = {};
        Object.entries(localSPINResponses).forEach(([questionId, answer]) => {
          if (questionId.startsWith(section) && typeof answer === 'string' && answer.trim()) {
            sectionAnswers[questionId] = answer;
          }
        });
        
        if (Object.keys(sectionAnswers).length > 0) {
          await saveSPINSection(section, sectionAnswers);
        }
      }
      
      await loadUserData();
    } catch (error) {
      console.error('Erro ao salvar diagnóstico:', error);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleMetricsSave = async (monthYear: string, metricsData: any) => {
    setIsLoadingAction(true);
    try {
      const success = await saveMonthlyMetrics(monthYear, metricsData);
      if (success) {
        await loadUserData();
      }
      return success;
    } catch (error) {
      console.error('Erro ao salvar métricas:', error);
      return false;
    } finally {
      setIsLoadingAction(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <TattooArtistLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            <p className="text-gray-600">Carregando seus dados...</p>
          </div>
        </div>
      </TattooArtistLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <TattooArtistLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <p className="text-gray-600">Erro de autenticação. Recarregue a página.</p>
          </div>
        </div>
      </TattooArtistLayout>
    );
  }

  return (
    <TattooArtistLayout>
      <div className="space-y-8">
        {/* Header do Perfil */}
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-red-800 mb-2 flex items-center gap-3">
                <User className="h-8 w-8" />
                Meu Perfil Profissional
              </h1>
              <p className="text-red-600 text-lg">
                Acompanhe seu crescimento e compartilhe conquistas com a comunidade
              </p>
            </div>
            <Badge className="bg-red-600 text-white text-lg px-4 py-2">
              Tatuador da Nova Era
            </Badge>
          </div>

          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-red-200 text-center">
              <Trophy className="h-6 w-6 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-700">{profileStats.totalTattoos}</div>
              <div className="text-sm text-gray-600">Tatuagens Realizadas</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-red-200 text-center">
              <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700">{formatCurrency(profileStats.totalRevenue)}</div>
              <div className="text-sm text-gray-600">Faturamento Total</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-red-200 text-center">
              <Calculator className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">{formatCurrency(profileStats.avgTattooValue)}</div>
              <div className="text-sm text-gray-600">Valor Médio/Tatuagem</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-red-200 text-center">
              <Star className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700">{profileStats.sharedMonths}</div>
              <div className="text-sm text-gray-600">Meses Compartilhados</div>
            </div>
          </div>
        </div>

        {/* Progresso Geral */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Progresso do Perfil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Diagnóstico Estratégico</span>
                  <span className="text-sm font-bold text-red-600">{spinProgress}%</span>
                </div>
                <Progress value={spinProgress} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Registros Mensais</span>
                  <span className="text-sm font-bold text-blue-600">{profileStats.totalMonths} meses</span>
                </div>
                <Progress value={Math.min(profileStats.totalMonths * 20, 100)} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Abas Principais */}
        <Tabs defaultValue="diagnostico" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-red-50 border border-red-200">
            <TabsTrigger 
              value="diagnostico" 
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <Target className="h-4 w-4 mr-2" />
              Diagnóstico Estratégico
            </TabsTrigger>
            <TabsTrigger 
              value="metricas"
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Acompanhamento Mensal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diagnostico" className="mt-6">
            <SPINQuestionnaire
              responses={localSPINResponses}
              onUpdate={handleSPINUpdate}
              onSave={handleSPINSave}
              onSaveSection={saveSPINSection}
              isLoading={isLoadingAction}
            />
          </TabsContent>

          <TabsContent value="metricas" className="mt-6">
            <MonthlyMetricsManager
              metrics={monthlyMetrics}
              onUpdate={handleMetricsSave}
            />
          </TabsContent>
        </Tabs>
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistsPersonalProfile;
