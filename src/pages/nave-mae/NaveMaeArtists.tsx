
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Brush, 
  Search, 
  Filter, 
  Plus, 
  Users, 
  Star, 
  Award, 
  TrendingUp, 
  Edit, 
  Trash2, 
  Eye,
  BarChart3,
  Target,
  Calendar,
  DollarSign,
  Clock,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Download
} from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";
import ArtistModal from "@/components/nave-mae/ArtistModal";
import { useCRMData } from "@/hooks/useFirestoreIntegration";
import { TattooArtistData } from "@/services/FirestoreService";

const NaveMaeArtists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [diagnosticFilter, setDiagnosticFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<TattooArtistData | null>(null);
  const [viewingArtist, setViewingArtist] = useState<TattooArtistData | null>(null);

  // Usar hook do CRM para dados em tempo real
  const { artists, loading } = useCRMData();

  // Filtrar artistas baseado nos critérios
  const filteredArtists = artists.filter(artist => {
    const matchesSearch = artist.userId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDiagnostic = diagnosticFilter === 'all' || 
      (diagnosticFilter === 'complete' && artist.diagnostico && 
       artist.diagnostico.situacao && artist.diagnostico.problemas && 
       artist.diagnostico.implicacoes && artist.diagnostico.necessidades) ||
      (diagnosticFilter === 'partial' && artist.diagnostico && 
       (!artist.diagnostico.situacao || !artist.diagnostico.problemas || 
        !artist.diagnostico.implicacoes || !artist.diagnostico.necessidades)) ||
      (diagnosticFilter === 'empty' && !artist.diagnostico);
    
    return matchesSearch && matchesDiagnostic;
  });

  // Calcular estatísticas
  const totalArtists = artists.length;
  const completeProfiles = artists.filter(a => 
    a.diagnostico && a.diagnostico.situacao && a.diagnostico.problemas && 
    a.diagnostico.implicacoes && a.diagnostico.necessidades
  ).length;
  const withMetrics = artists.filter(a => 
    a.metricasMensais && Object.keys(a.metricasMensais).length > 0
  ).length;
  const sharedMetrics = artists.filter(a => 
    a.metricasMensais && Object.values(a.metricasMensais).some(m => m.compartilhadoComunidade)
  ).length;

  // Função para calcular métricas derivadas
  const calculateMonthlyStats = (artist: TattooArtistData) => {
    if (!artist.metricasMensais) return null;
    
    const metrics = Object.entries(artist.metricasMensais)
      .sort(([a], [b]) => b.localeCompare(a)) // Mais recente primeiro
      .slice(0, 2); // Últimos 2 meses
    
    if (metrics.length === 0) return null;
    
    const [currentMonth, current] = metrics[0];
    const previous = metrics[1] ? metrics[1][1] : null;
    
    const avgPerTattoo = current.tatuagensRealizadas > 0 
      ? current.valorTotalRecebido / current.tatuagensRealizadas 
      : 0;
    
    const avgPerHour = current.horasTrabalhadas > 0 
      ? current.valorTotalRecebido / current.horasTrabalhadas 
      : 0;
    
    // Calcular tendências se houver mês anterior
    let trends = null;
    if (previous) {
      const prevAvgPerTattoo = previous.tatuagensRealizadas > 0 
        ? previous.valorTotalRecebido / previous.tatuagensRealizadas 
        : 0;
      
      trends = {
        tattoos: current.tatuagensRealizadas - previous.tatuagensRealizadas,
        revenue: current.valorTotalRecebido - previous.valorTotalRecebido,
        avgPerTattoo: avgPerTattoo - prevAvgPerTattoo
      };
    }
    
    return {
      currentMonth,
      current,
      avgPerTattoo,
      avgPerHour,
      trends,
      totalMonths: Object.keys(artist.metricasMensais).length
    };
  };

  // Função para obter status do diagnóstico
  const getDiagnosticStatus = (artist: TattooArtistData) => {
    if (!artist.diagnostico) {
      return { status: 'empty', label: 'Não Iniciado', color: 'bg-gray-100 text-gray-800' };
    }
    
    const sections = ['situacao', 'problemas', 'implicacoes', 'necessidades'];
    const completedSections = sections.filter(section => 
      artist.diagnostico![section as keyof typeof artist.diagnostico]
    ).length;
    
    if (completedSections === 4) {
      return { status: 'complete', label: 'Completo', color: 'bg-green-100 text-green-800' };
    } else if (completedSections > 0) {
      return { status: 'partial', label: `${completedSections}/4 Seções`, color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { status: 'empty', label: 'Vazio', color: 'bg-gray-100 text-gray-800' };
    }
  };

  // Função para formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Função para exportar dados (simulada)
  const handleExportData = (artist?: TattooArtistData) => {
    const dataToExport = artist ? [artist] : filteredArtists;
    
    const exportData = dataToExport.map(a => ({
      userId: a.userId,
      diagnosticoCompleto: getDiagnosticStatus(a).status === 'complete',
      totalMesesComMetricas: a.metricasMensais ? Object.keys(a.metricasMensais).length : 0,
      compartilhouMetricas: a.metricasMensais ? Object.values(a.metricasMensais).some(m => m.compartilhadoComunidade) : false
    }));

    // Simular exportação
    console.log('Dados exportados:', exportData);
    // Aqui você poderia implementar a exportação real para CSV/JSON
  };

  return (
    <NaveMaeLayout>
      <div className="space-y-6">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Total de Tatuadores</p>
                  <p className="text-3xl font-bold text-purple-800">{totalArtists}</p>
                </div>
                <Brush className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Perfis Completos</p>
                  <p className="text-3xl font-bold text-green-800">{completeProfiles}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Com Métricas</p>
                  <p className="text-3xl font-bold text-blue-800">{withMetrics}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Compartilharam</p>
                  <p className="text-3xl font-bold text-yellow-800">{sharedMetrics}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="w-full md:w-96 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por ID do tatuador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-4 items-center">
                <Select value={diagnosticFilter} onValueChange={setDiagnosticFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Diagnósticos</SelectItem>
                    <SelectItem value="complete">Completo</SelectItem>
                    <SelectItem value="partial">Parcial</SelectItem>
                    <SelectItem value="empty">Não Iniciado</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  onClick={() => handleExportData()}
                  variant="outline"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Tatuadores */}
        <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-6">
          {loading ? (
            [...Array(3)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))
          ) : (
            filteredArtists.map((artist) => {
              const diagnosticStatus = getDiagnosticStatus(artist);
              const monthlyStats = calculateMonthlyStats(artist);

              return (
                <Card key={artist.userId} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                          <Users className="h-5 w-5 text-purple-600" />
                          {artist.userId}
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-1">Tatuador da Comunidade 99Tattoo</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={diagnosticStatus.color}>
                          {diagnosticStatus.label}
                        </Badge>
                        {monthlyStats && (
                          <Badge className="bg-blue-100 text-blue-800">
                            {monthlyStats.totalMonths} {monthlyStats.totalMonths === 1 ? 'Mês' : 'Meses'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Diagnóstico SPIN */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <Target className="h-4 w-4 text-red-600" />
                          Diagnóstico Estratégico
                        </h4>
                        
                        {artist.diagnostico ? (
                          <div className="space-y-2">
                            {[
                              { key: 'situacao', label: 'Situação', icon: BarChart3 },
                              { key: 'problemas', label: 'Problemas', icon: AlertTriangle },
                              { key: 'implicacoes', label: 'Implicações', icon: TrendingDown },
                              { key: 'necessidades', label: 'Necessidades', icon: Target }
                            ].map(section => {
                              const hasSection = artist.diagnostico![section.key as keyof typeof artist.diagnostico];
                              return (
                                <div key={section.key} className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2">
                                    <section.icon className="h-3 w-3 text-gray-500" />
                                    <span>{section.label}</span>
                                  </div>
                                  {hasSection ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 italic">Diagnóstico não iniciado</p>
                        )}
                      </div>

                      {/* Métricas Mensais */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-blue-600" />
                          Métricas Mensais
                        </h4>
                        
                        {monthlyStats ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="flex items-center gap-2">
                                <Calendar className="h-3 w-3 text-gray-500" />
                                Último Mês
                              </span>
                              <span className="font-medium">{monthlyStats.currentMonth}</span>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm">
                              <span className="flex items-center gap-2">
                                <Brush className="h-3 w-3 text-purple-500" />
                                Tatuagens
                              </span>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">{monthlyStats.current.tatuagensRealizadas}</span>
                                {monthlyStats.trends && monthlyStats.trends.tattoos !== 0 && (
                                  <Badge className={`text-xs ${
                                    monthlyStats.trends.tattoos > 0 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {monthlyStats.trends.tattoos > 0 ? '+' : ''}{monthlyStats.trends.tattoos}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm">
                              <span className="flex items-center gap-2">
                                <DollarSign className="h-3 w-3 text-green-500" />
                                Faturamento
                              </span>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">{formatCurrency(monthlyStats.current.valorTotalRecebido)}</span>
                                {monthlyStats.trends && monthlyStats.trends.revenue !== 0 && (
                                  <Badge className={`text-xs ${
                                    monthlyStats.trends.revenue > 0 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {formatCurrency(Math.abs(monthlyStats.trends.revenue))}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm">
                              <span className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-orange-500" />
                                Valor/Tatuagem
                              </span>
                              <span className="font-medium">{formatCurrency(monthlyStats.avgPerTattoo)}</span>
                            </div>
                            
                            {monthlyStats.current.compartilhadoComunidade && (
                              <Badge className="bg-blue-100 text-blue-800 text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Compartilhado na Comunidade
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 italic">Nenhuma métrica registrada</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setViewingArtist(artist)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver Detalhes
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExportData(artist)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {filteredArtists.length === 0 && !loading && (
          <div className="text-center py-12">
            <Brush className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum tatuador encontrado</h3>
            <p className="text-gray-500">
              {searchTerm || diagnosticFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca' 
                : 'Os tatuadores aparecerão aqui conforme preenchem seus perfis'
              }
            </p>
          </div>
        )}

        {/* Modal de Detalhes do Tatuador */}
        {viewingArtist && (
          <Dialog open={!!viewingArtist} onOpenChange={() => setViewingArtist(null)}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Detalhes do Tatuador: {viewingArtist.userId}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Diagnóstico Detalhado */}
                {viewingArtist.diagnostico && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Target className="h-5 w-5 text-red-600" />
                      Diagnóstico SPIN Selling
                    </h3>
                    
                    {[
                      { key: 'situacao', title: '📊 Situação Atual', color: 'bg-blue-50 border-blue-200' },
                      { key: 'problemas', title: '❗ Problemas e Desafios', color: 'bg-orange-50 border-orange-200' },
                      { key: 'implicacoes', title: '⚠️ Impactos e Consequências', color: 'bg-red-50 border-red-200' },
                      { key: 'necessidades', title: '💡 Necessidades e Soluções', color: 'bg-green-50 border-green-200' }
                    ].map(section => {
                      const sectionData = viewingArtist.diagnostico![section.key as keyof typeof viewingArtist.diagnostico];
                      if (!sectionData) return null;
                      
                      return (
                        <Card key={section.key} className={section.color}>
                          <CardHeader>
                            <CardTitle className="text-base">{section.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {Object.entries(sectionData as Record<string, string>).map(([questionId, answer], idx) => (
                                <div key={questionId} className="bg-white p-3 rounded border">
                                  <p className="text-sm font-medium text-gray-700 mb-1">
                                    Pergunta {idx + 1}:
                                  </p>
                                  <p className="text-sm text-gray-600">{answer}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}

                {/* Métricas Detalhadas */}
                {viewingArtist.metricasMensais && Object.keys(viewingArtist.metricasMensais).length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      Histórico de Métricas
                    </h3>
                    
                    <div className="grid gap-4">
                      {Object.entries(viewingArtist.metricasMensais)
                        .sort(([a], [b]) => b.localeCompare(a))
                        .map(([monthYear, metrics]) => {
                          const avgPerTattoo = metrics.tatuagensRealizadas > 0 
                            ? metrics.valorTotalRecebido / metrics.tatuagensRealizadas 
                            : 0;
                          const avgPerHour = metrics.horasTrabalhadas > 0 
                            ? metrics.valorTotalRecebido / metrics.horasTrabalhadas 
                            : 0;
                          
                          return (
                            <Card key={monthYear} className="border-blue-200">
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-base">{monthYear}</CardTitle>
                                  {metrics.compartilhadoComunidade && (
                                    <Badge className="bg-blue-100 text-blue-800">
                                      <Star className="h-3 w-3 mr-1" />
                                      Público
                                    </Badge>
                                  )}
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                                  <div>
                                    <div className="text-2xl font-bold text-purple-700">{metrics.tatuagensRealizadas}</div>
                                    <div className="text-xs text-gray-600">Tatuagens</div>
                                  </div>
                                  <div>
                                    <div className="text-2xl font-bold text-orange-700">{metrics.horasTrabalhadas}h</div>
                                    <div className="text-xs text-gray-600">Horas</div>
                                  </div>
                                  <div>
                                    <div className="text-2xl font-bold text-green-700">{formatCurrency(metrics.valorTotalRecebido)}</div>
                                    <div className="text-xs text-gray-600">Faturamento</div>
                                  </div>
                                  <div>
                                    <div className="text-2xl font-bold text-indigo-700">{formatCurrency(avgPerTattoo)}</div>
                                    <div className="text-xs text-gray-600">Valor/Tatuagem</div>
                                  </div>
                                  <div>
                                    <div className="text-2xl font-bold text-teal-700">{formatCurrency(avgPerHour)}</div>
                                    <div className="text-xs text-gray-600">Valor/Hora</div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeArtists;
