
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Brush, 
  Search, 
  Plus, 
  Users, 
  Star, 
  BarChart3,
  Target,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  Loader2,
  Download,
  UserPlus,
  Sparkles
} from "lucide-react";
import NaveMaeLayout from "@/components/layouts/NaveMaeLayout";
import TattooArtistDetailModal from "@/components/tattoo-artists/TattooArtistDetailModal";
import PopulateArtistModal from "@/components/tattoo-artists/PopulateArtistModal";
import ExportDataModal from "@/components/tattoo-artists/ExportDataModal";
import { useCRMData } from "@/hooks/useFirestoreIntegration";
import { TattooArtistData } from "@/services/FirestoreService";

const NaveMaeArtists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [diagnosticFilter, setDiagnosticFilter] = useState("all");
  const [viewingArtist, setViewingArtist] = useState<TattooArtistData | null>(null);
  const [exportingArtist, setExportingArtist] = useState<TattooArtistData | null>(null);
  const [showPopulateModal, setShowPopulateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Usar hook do CRM para dados em tempo real
  const { artists, loading, generateNewArtist } = useCRMData();

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

  // Função para calcular métricas de um artista
  const calculateArtistStats = (artist: TattooArtistData) => {
    if (!artist.metricasMensais) return null;
    
    const metrics = Object.entries(artist.metricasMensais)
      .sort(([a], [b]) => b.localeCompare(a)) // Mais recente primeiro
      .slice(0, 1)[0]; // Último mês apenas
    
    if (!metrics) return null;
    
    const [monthYear, data] = metrics;
    const avgPerTattoo = data.tatuagensRealizadas > 0 
      ? data.valorTotalRecebido / data.tatuagensRealizadas 
      : 0;
    
    return {
      lastMonth: monthYear,
      lastData: data,
      avgPerTattoo,
      totalMonths: Object.keys(artist.metricasMensais).length
    };
  };

  // Função para gerar novo tatuador
  const handleGenerateArtist = async (config: any) => {
    setIsGenerating(true);
    try {
      await generateNewArtist(config);
    } catch (error) {
      console.error('Erro ao gerar tatuador:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Função para formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <NaveMaeLayout>
      <div className="space-y-6">
        {/* Header com métricas principais */}
        <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-purple-800 mb-2">
              Tatuadores da Rede
            </h1>
            <p className="text-gray-600">
              Gerencie todos os tatuadores parceiros da 99Tattoo em tempo real
            </p>
          </div>
          
          {/* Botão para popular novo tatuador */}
          <Button
            onClick={() => setShowPopulateModal(true)}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 flex items-center gap-2 shadow-lg"
          >
            <UserPlus className="h-5 w-5" />
            Gerar Novo Tatuador
          </Button>
        </div>

        {/* Cards de métricas */}
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

        {/* Filtros e busca */}
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de tatuadores */}
        <div className="grid gap-6">
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
              const artistStats = calculateArtistStats(artist);

              return (
                <Card key={artist.userId} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Informações básicas */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-purple-600" />
                          <h3 className="text-lg font-bold text-gray-900">{artist.userId}</h3>
                          <Badge className={diagnosticStatus.color}>
                            {diagnosticStatus.label}
                          </Badge>
                        </div>
                        
                        {artistStats && (
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Último: {artistStats.lastMonth}
                            </span>
                            <span className="flex items-center gap-1">
                              <BarChart3 className="h-3 w-3" />
                              {artistStats.totalMonths} meses
                            </span>
                            {artistStats.lastData.compartilhadoComunidade && (
                              <Badge className="bg-blue-100 text-blue-800 text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Público
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Métricas rápidas */}
                      {artistStats && (
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-purple-700">
                              {artistStats.lastData.tatuagensRealizadas}
                            </div>
                            <div className="text-xs text-gray-600">Tatuagens</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-green-700">
                              {formatCurrency(artistStats.lastData.valorTotalRecebido)}
                            </div>
                            <div className="text-xs text-gray-600">Faturamento</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-indigo-700">
                              {formatCurrency(artistStats.avgPerTattoo)}
                            </div>
                            <div className="text-xs text-gray-600">Valor/Tatuagem</div>
                          </div>
                        </div>
                      )}

                      {/* Botões de ação */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setViewingArtist(artist)}
                          className="hover:bg-purple-50 hover:border-purple-300"
                        >
                          Ver Detalhes
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setExportingArtist(artist)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Estado vazio */}
        {filteredArtists.length === 0 && !loading && (
          <div className="text-center py-12">
            <Brush className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum tatuador encontrado</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || diagnosticFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca' 
                : 'Os tatuadores aparecerão aqui conforme preenchem seus perfis'
              }
            </p>
            <Button
              onClick={() => setShowPopulateModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Gerar Primeiro Tatuador
            </Button>
          </div>
        )}

        {/* Modais */}
        <TattooArtistDetailModal
          artist={viewingArtist}
          isOpen={!!viewingArtist}
          onClose={() => setViewingArtist(null)}
          onExport={(artist) => {
            setExportingArtist(artist);
            setViewingArtist(null);
          }}
        />

        <ExportDataModal
          artist={exportingArtist}
          isOpen={!!exportingArtist}
          onClose={() => setExportingArtist(null)}
        />

        <PopulateArtistModal
          isOpen={showPopulateModal}
          onClose={() => setShowPopulateModal(false)}
          onGenerate={handleGenerateArtist}
          isGenerating={isGenerating}
        />
      </div>
    </NaveMaeLayout>
  );
};

export default NaveMaeArtists;
