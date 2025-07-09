
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, FileJson, FileSpreadsheet, CheckCircle } from 'lucide-react';
import { TattooArtistData } from '@/services/FirestoreService';

interface ExportDataModalProps {
  artist: TattooArtistData | null;
  isOpen: boolean;
  onClose: () => void;
}

const ExportDataModal: React.FC<ExportDataModalProps> = ({
  artist,
  isOpen,
  onClose
}) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  if (!artist) return null;

  // Preparar dados para exportação
  const exportData = {
    userId: artist.userId,
    diagnostico: artist.diagnostico || null,
    metricasMensais: artist.metricasMensais || null,
    exportedAt: new Date().toISOString(),
    exportSource: '99Tattoo CRM'
  };

  // Preparar dados em formato CSV
  const prepareCSVData = () => {
    const rows = [];
    rows.push(['Campo', 'Valor', 'Tipo', 'Data']);
    
    // Informações básicas
    rows.push(['UserId', artist.userId, 'Identificação', new Date().toLocaleDateString('pt-BR')]);
    
    // Diagnóstico
    if (artist.diagnostico) {
      Object.entries(artist.diagnostico).forEach(([section, data]) => {
        if (typeof data === 'object' && data !== null) {
          Object.entries(data as Record<string, string>).forEach(([questionId, answer]) => {
            rows.push([`Diagnóstico - ${section} - ${questionId}`, answer, 'SPIN', '']);
          });
        }
      });
    }
    
    // Métricas mensais
    if (artist.metricasMensais) {
      Object.entries(artist.metricasMensais).forEach(([monthYear, metrics]) => {
        rows.push([`Métricas - ${monthYear} - Tatuagens`, metrics.tatuagensRealizadas.toString(), 'Métricas', monthYear]);
        rows.push([`Métricas - ${monthYear} - Horas`, metrics.horasTrabalhadas.toString(), 'Métricas', monthYear]);
        rows.push([`Métricas - ${monthYear} - Valor`, metrics.valorTotalRecebido.toString(), 'Métricas', monthYear]);
        rows.push([`Métricas - ${monthYear} - Compartilhado`, metrics.compartilhadoComunidade.toString(), 'Métricas', monthYear]);
      });
    }
    
    return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  };

  const jsonData = JSON.stringify(exportData, null, 2);
  const csvData = prepareCSVData();

  const handleCopy = async (format: string, data: string) => {
    try {
      await navigator.clipboard.writeText(data);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const handleDownload = (format: string, data: string, filename: string) => {
    const blob = new Blob([data], { 
      type: format === 'json' ? 'application/json' : 'text/csv' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Download className="h-6 w-6 text-blue-600" />
            Exportar Dados - {artist.userId}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="json" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="json" className="flex items-center gap-2">
              <FileJson className="h-4 w-4" />
              JSON
            </TabsTrigger>
            <TabsTrigger value="csv" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              CSV
            </TabsTrigger>
          </TabsList>

          <TabsContent value="json" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Formato JSON</h3>
                <p className="text-sm text-gray-600">
                  Estrutura completa de dados em formato JSON
                </p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">
                {new Blob([jsonData]).size} bytes
              </Badge>
            </div>

            <ScrollArea className="h-64 w-full border rounded-lg p-4 bg-gray-50">
              <pre className="text-xs font-mono whitespace-pre-wrap">
                {jsonData}
              </pre>
            </ScrollArea>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleCopy('json', jsonData)}
                className="flex-1"
              >
                {copiedFormat === 'json' ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar JSON
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => handleDownload('json', jsonData, `tatuador-${artist.userId}.json`)}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download JSON
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="csv" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Formato CSV</h3>
                <p className="text-sm text-gray-600">
                  Dados tabulares para planilhas
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800">
                {csvData.split('\n').length} linhas
              </Badge>
            </div>

            <ScrollArea className="h-64 w-full border rounded-lg p-4 bg-gray-50">
              <pre className="text-xs font-mono whitespace-pre-wrap">
                {csvData}
              </pre>
            </ScrollArea>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleCopy('csv', csvData)}
                className="flex-1"
              >
                {copiedFormat === 'csv' ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar CSV
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => handleDownload('csv', csvData, `tatuador-${artist.userId}.csv`)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDataModal;
