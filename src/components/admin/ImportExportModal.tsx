
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Download, FileText, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportExportModal: React.FC<ImportExportModalProps> = ({ isOpen, onClose }) => {
  const [exportFormat, setExportFormat] = useState<string>("xlsx");
  const [exportType, setExportType] = useState<string>("transactions");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];
      
      if (allowedTypes.includes(file.type) || file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
        setImportFile(file);
        toast({
          title: "Arquivo carregado",
          description: `Arquivo ${file.name} carregado com sucesso.`,
        });
      } else {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione um arquivo .xlsx ou .csv",
          variant: "destructive"
        });
      }
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo para importar.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simular processamento de importação
    setTimeout(() => {
      toast({
        title: "Importação concluída",
        description: `${Math.floor(Math.random() * 50) + 10} registros foram importados com sucesso.`,
      });
      setIsProcessing(false);
      setImportFile(null);
      onClose();
    }, 3000);
  };

  const handleExport = async () => {
    setIsProcessing(true);
    
    // Simular geração de exportação
    setTimeout(() => {
      // Criar dados simulados para download
      const mockData = generateMockExportData(exportType);
      const blob = new Blob([mockData], { 
        type: exportFormat === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `99tattoo_${exportType}_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Exportação concluída",
        description: `Arquivo de ${exportType} exportado com sucesso.`,
      });
      setIsProcessing(false);
      onClose();
    }, 2000);
  };

  const generateMockExportData = (type: string) => {
    switch (type) {
      case 'transactions':
        return `Data,Cliente,Tatuador,Valor,Status,Produto
2024-01-15,João Silva,Ana Silva,R$ 450.00,Concluído,Tatuagem Fineline
2024-01-14,Maria Santos,Carlos Santos,R$ 300.00,Pendente,Tatuagem Old School
2024-01-13,Pedro Costa,Ana Silva,R$ 520.00,Concluído,Tatuagem Realismo`;
      
      case 'commissions':
        return `Data,Artista,Valor Base,Taxa,Comissão,Status
2024-01-15,Ana Silva,R$ 450.00,30%,R$ 135.00,Pago
2024-01-14,Carlos Santos,R$ 300.00,30%,R$ 90.00,Pendente
2024-01-13,Pedro Costa,R$ 520.00,25%,R$ 130.00,Calculado`;
      
      case 'expenses':
        return `Data,Descrição,Categoria,Valor,Método Pagamento
2024-01-15,Compra de tintas,Materiais,R$ 250.00,PIX
2024-01-14,Aluguel do estúdio,Aluguel,R$ 2500.00,Transferência
2024-01-13,Marketing digital,Marketing,R$ 400.00,Cartão`;
      
      default:
        return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gradient-to-br from-white to-red-50 border-red-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-red-600" />
            Importar / Exportar Dados Financeiros
          </DialogTitle>
          <DialogDescription>
            Gerencie seus dados financeiros através de importação e exportação de planilhas
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="export" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-red-100 to-red-200 p-1 rounded-lg">
            <TabsTrigger 
              value="export"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar Dados
            </TabsTrigger>
            <TabsTrigger 
              value="import"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white"
            >
              <Upload className="h-4 w-4 mr-2" />
              Importar Dados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-xl border border-red-200">
              <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
                <Download className="h-5 w-5" />
                Configurações de Exportação
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="exportType" className="text-red-700 font-bold">Tipo de Dados</Label>
                  <Select value={exportType} onValueChange={setExportType}>
                    <SelectTrigger className="border-red-200 focus:border-red-500">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-red-200">
                      <SelectItem value="transactions">Transações</SelectItem>
                      <SelectItem value="commissions">Comissões</SelectItem>
                      <SelectItem value="expenses">Despesas</SelectItem>
                      <SelectItem value="all">Todos os Dados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exportFormat" className="text-red-700 font-bold">Formato do Arquivo</Label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger className="border-red-200 focus:border-red-500">
                      <SelectValue placeholder="Selecione o formato" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-red-200">
                      <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                      <SelectItem value="csv">CSV (.csv)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-blue-800">Informações da Exportação</h4>
                    <p className="text-blue-700 text-sm mt-1">
                      O arquivo será gerado com todos os dados do tipo selecionado, formatado para fácil análise em planilhas.
                      Os dados incluem campos como data, valores, status e informações de relacionamento.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleExport}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                {isProcessing ? (
                  <>Gerando arquivo...</>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar {exportType === 'all' ? 'Todos os Dados' : exportType}
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-xl border border-red-200">
              <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Importar Planilha Financeira
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="importFile" className="text-red-700 font-bold">Selecionar Arquivo</Label>
                  <Input
                    id="importFile"
                    type="file"
                    accept=".xlsx,.csv"
                    onChange={handleFileUpload}
                    className="border-red-200 focus:border-red-500 focus:ring-red-200 file:bg-red-50 file:text-red-700 file:border-red-200"
                  />
                  <p className="text-sm text-gray-600">
                    Formatos aceitos: .xlsx, .csv (máximo 10MB)
                  </p>
                </div>

                {importFile && (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Arquivo selecionado:</span>
                      <span className="text-green-700">{importFile.name}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-yellow-800">Formato Esperado</h4>
                    <p className="text-yellow-700 text-sm mt-1">
                      O arquivo deve conter colunas: Data, Descrição, Valor, Tipo, Cliente/Fornecedor.
                      Certifique-se de que os dados estão formatados corretamente antes da importação.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleImport}
                disabled={!importFile || isProcessing}
                className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>Processando arquivo...</>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Importar Dados
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportExportModal;
