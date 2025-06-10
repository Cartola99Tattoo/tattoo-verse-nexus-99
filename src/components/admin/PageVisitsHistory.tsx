
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getClientService } from "@/services/serviceFactory";
import { formatDate } from "@/lib/utils";
import { Globe, Clock, Eye, Activity } from "lucide-react";
import { PageVisit } from "@/services/interfaces/IClientService";

interface PageVisitsHistoryProps {
  clientId: string;
}

const PageVisitsHistory: React.FC<PageVisitsHistoryProps> = ({ clientId }) => {
  const clientService = getClientService();

  const { data: pageVisits = [], isLoading } = useQuery({
    queryKey: ['client-page-visits', clientId],
    queryFn: () => clientService.fetchClientPageVisits(clientId),
  });

  const formatDuration = (seconds: number | undefined) => {
    if (!seconds) return "N/A";
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getPageTypeIcon = (url: string) => {
    if (url.includes('/artists')) return "👨‍🎨";
    if (url.includes('/events')) return "🎉";
    if (url.includes('/shop')) return "🛍️";
    if (url.includes('/blog')) return "📖";
    if (url.includes('/contact')) return "📞";
    if (url.includes('/consultoria')) return "💼";
    return "🌐";
  };

  const getEngagementLevel = (duration: number | undefined) => {
    if (!duration) return { level: "Baixo", color: "secondary" };
    if (duration >= 300) return { level: "Alto", color: "tattooSuccess" }; // 5+ minutos
    if (duration >= 120) return { level: "Médio", color: "tattooWarning" }; // 2+ minutos
    return { level: "Baixo", color: "tattooInfo" };
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Histórico de Navegação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Carregando histórico...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Histórico de Navegação
          <Badge variant="tattooSecondary">{pageVisits.length} visitas</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pageVisits.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Globe className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>Nenhuma visita registrada ainda</p>
            <p className="text-sm">O histórico aparecerá quando o cliente navegar pelo site</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-auto">
            {pageVisits.map((visit) => {
              const engagement = getEngagementLevel(visit.duration_seconds);
              
              return (
                <div key={visit.id} className="border-l-4 border-red-200 pl-4 py-3 bg-gray-50 rounded-r-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getPageTypeIcon(visit.url)}</span>
                      <div>
                        <h4 className="font-medium text-sm">
                          {visit.page_title || 'Página do Site'}
                        </h4>
                        <p className="text-xs text-gray-600 font-mono">{visit.url}</p>
                      </div>
                    </div>
                    <Badge variant={engagement.color as any} className="text-xs">
                      Engajamento {engagement.level}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(visit.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>Permanência: {formatDuration(visit.duration_seconds)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PageVisitsHistory;
