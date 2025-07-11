
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Upload, Trash2, Download, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DocumentItem {
  id: string;
  name: string;
  type: 'contract' | 'health_certificate' | 'course_certificate' | 'portfolio' | 'other';
  uploadDate: string;
  expiryDate?: string;
  status: 'valid' | 'expiring' | 'expired';
  fileUrl: string;
}

interface ArtistDocumentsManagerProps {
  documents: DocumentItem[];
  onDocumentsChange: (documents: DocumentItem[]) => void;
}

const documentTypes = {
  contract: 'Contrato de Prestação',
  health_certificate: 'Certificado Sanitário',
  course_certificate: 'Certificado de Curso',
  portfolio: 'Portfólio PDF',
  other: 'Outros'
};

const ArtistDocumentsManager = ({ documents, onDocumentsChange }: ArtistDocumentsManagerProps) => {
  const [newDocument, setNewDocument] = useState({
    name: '',
    type: '',
    expiryDate: ''
  });

  const handleAddDocument = () => {
    if (!newDocument.name || !newDocument.type) return;

    const document: DocumentItem = {
      id: Date.now().toString(),
      name: newDocument.name,
      type: newDocument.type as DocumentItem['type'],
      uploadDate: new Date().toISOString(),
      expiryDate: newDocument.expiryDate || undefined,
      status: getDocumentStatus(newDocument.expiryDate),
      fileUrl: `https://example.com/documents/${newDocument.name}`
    };

    onDocumentsChange([...documents, document]);
    setNewDocument({ name: '', type: '', expiryDate: '' });
  };

  const handleRemoveDocument = (id: string) => {
    onDocumentsChange(documents.filter(doc => doc.id !== id));
  };

  const getDocumentStatus = (expiryDate?: string): DocumentItem['status'] => {
    if (!expiryDate) return 'valid';
    
    const expiry = new Date(expiryDate);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (expiry < now) return 'expired';
    if (expiry < thirtyDaysFromNow) return 'expiring';
    return 'valid';
  };

  const getStatusBadge = (status: DocumentItem['status']) => {
    switch (status) {
      case 'valid':
        return <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">Válido</Badge>;
      case 'expiring':
        return <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">Expirando</Badge>;
      case 'expired':
        return <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white">Expirado</Badge>;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-xl font-black">
          <FileText className="h-5 w-5" />
          Documentos Importantes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Adicionar Novo Documento */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <h3 className="text-orange-800 font-bold mb-4">Adicionar Novo Documento</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-orange-700 font-medium">Nome do Documento</Label>
              <Input
                placeholder="Ex: Contrato 2024, Certificado Sanitário..."
                value={newDocument.name}
                onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
                className="border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              />
            </div>
            <div>
              <Label className="text-orange-700 font-medium">Tipo de Documento</Label>
              <Select value={newDocument.type} onValueChange={(value) => setNewDocument({...newDocument, type: value})}>
                <SelectTrigger className="border-orange-200 focus:border-orange-500">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="bg-white border-orange-200 shadow-xl">
                  {Object.entries(documentTypes).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-orange-700 font-medium">Data de Validade (Opcional)</Label>
              <Input
                type="date"
                value={newDocument.expiryDate}
                onChange={(e) => setNewDocument({...newDocument, expiryDate: e.target.value})}
                className="border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              />
            </div>
          </div>
          <Button
            onClick={handleAddDocument}
            disabled={!newDocument.name || !newDocument.type}
            className="mt-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Upload className="h-4 w-4 mr-2" />
            Adicionar Documento
          </Button>
        </div>

        {/* Lista de Documentos */}
        <div className="space-y-3">
          <h3 className="text-orange-800 font-bold">Documentos Cadastrados</h3>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>Nenhum documento cadastrado ainda</p>
            </div>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.id} className="bg-white p-4 rounded-lg border border-orange-200 shadow-md hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-orange-600" />
                      <div>
                        <div className="font-medium text-gray-800">{doc.name}</div>
                        <div className="text-sm text-gray-600">
                          {documentTypes[doc.type]} • Enviado em {format(new Date(doc.uploadDate), 'dd/MM/yyyy', { locale: ptBR })}
                        </div>
                        {doc.expiryDate && (
                          <div className="text-sm text-gray-600 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Válido até {format(new Date(doc.expiryDate), 'dd/MM/yyyy', { locale: ptBR })}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(doc.status)}
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveDocument(doc.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        title="Remover"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alertas de Documentos */}
        {documents.some(doc => doc.status === 'expiring' || doc.status === 'expired') && (
          <div className="bg-gradient-to-r from-yellow-50 to-red-50 border border-yellow-300 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800 font-medium mb-2">
              <AlertCircle className="h-5 w-5" />
              Atenção: Documentos com Problemas
            </div>
            <ul className="text-sm space-y-1">
              {documents.filter(doc => doc.status === 'expired').map(doc => (
                <li key={doc.id} className="text-red-700">
                  • {doc.name} - <strong>EXPIRADO</strong>
                </li>
              ))}
              {documents.filter(doc => doc.status === 'expiring').map(doc => (
                <li key={doc.id} className="text-yellow-700">
                  • {doc.name} - <strong>Expira em breve</strong>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ArtistDocumentsManager;
