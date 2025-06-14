
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FileText, Edit, Save, X, ArrowRight, PenTool, BookOpen } from 'lucide-react';
import { ContentIdea, CreateContentIdeaData } from '@/types/contentIdea';
import { Persona } from '@/types/persona';

interface ContentIdeaDetailModalProps {
  idea: ContentIdea;
  personas: Persona[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (idea: ContentIdea, data: CreateContentIdeaData) => void;
  onTransformToArticle: (idea: ContentIdea) => void;
}

const ContentIdeaDetailModal = ({ 
  idea, 
  personas, 
  isOpen, 
  onClose, 
  onUpdate, 
  onTransformToArticle 
}: ContentIdeaDetailModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    theme: idea.theme,
    format: idea.format,
    purchaseStage: idea.purchaseStage,
    focusPersonas: idea.focusPersonas,
    personaRelevance: idea.personaRelevance,
    focusKeyword: idea.focusKeyword,
    status: idea.status,
    notes: idea.notes,
    ideaCreator: idea.ideaCreator,
    draftTitle: idea.draftTitle || '',
    draftSummary: idea.draftSummary || '',
    draftContent: idea.draftContent || ''
  });

  const handleSave = () => {
    onUpdate(idea, formData);
    setIsEditing(false);
  };

  const canTransformToArticle = ['Em Produção', 'Em Revisão', 'Fazendo Imagens/Gráficos'].includes(idea.status);
  const hasDraftContent = formData.draftTitle || formData.draftSummary || formData.draftContent;

  const getPersonaNames = (personaIds: string[]) => {
    return personaIds.map(id => {
      const persona = personas.find(p => p.id === id);
      return persona ? persona.name : id;
    }).join(', ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-white to-red-50 border-2 border-red-200 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 -m-6 mb-6 rounded-t-lg shadow-lg">
          <DialogTitle className="flex items-center justify-between text-2xl font-black">
            <div className="flex items-center gap-3">
              <FileText className="h-7 w-7" />
              {isEditing ? 'Editando Card de Conteúdo' : 'Detalhes do Card de Conteúdo'}
            </div>
            <div className="flex gap-2">
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-white hover:bg-white/10 shadow-lg"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              )}
              <Button
                onClick={onClose}
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10 shadow-lg"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coluna Esquerda - Informações Básicas */}
          <div className="space-y-6">
            <Card className="bg-white border-2 border-red-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-t-lg p-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-5 w-5" />
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label className="text-red-700 font-bold">Tema Principal</Label>
                  {isEditing ? (
                    <Input
                      value={formData.theme}
                      onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                      className="border-red-200 focus:border-red-500 shadow-sm"
                    />
                  ) : (
                    <p className="font-medium text-gray-800 bg-gray-50 p-3 rounded-lg border">{idea.theme}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-red-700 font-bold">Formato</Label>
                    <Badge className="mt-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg">
                      {idea.format}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-red-700 font-bold">Status</Label>
                    <Badge className="mt-2 bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg">
                      {idea.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-red-700 font-bold">Etapa da Jornada</Label>
                  <Badge className="mt-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
                    {idea.purchaseStage}
                  </Badge>
                </div>

                <div>
                  <Label className="text-red-700 font-bold">Personas Foco</Label>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border">{getPersonaNames(idea.focusPersonas)}</p>
                </div>

                <div>
                  <Label className="text-red-700 font-bold">Palavra-chave Foco</Label>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border">{idea.focusKeyword}</p>
                </div>

                <div>
                  <Label className="text-red-700 font-bold">Relevância para Personas</Label>
                  {isEditing ? (
                    <Textarea
                      value={formData.personaRelevance}
                      onChange={(e) => setFormData(prev => ({ ...prev, personaRelevance: e.target.value }))}
                      className="border-red-200 focus:border-red-500 shadow-sm"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border whitespace-pre-wrap">{idea.personaRelevance}</p>
                  )}
                </div>

                <div>
                  <Label className="text-red-700 font-bold">Notas</Label>
                  {isEditing ? (
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      className="border-red-200 focus:border-red-500 shadow-sm"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border whitespace-pre-wrap">{idea.notes}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita - Rascunho do Artigo */}
          <div className="space-y-6">
            <Card className="bg-white border-2 border-green-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-t-lg p-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <PenTool className="h-5 w-5" />
                  Rascunho do Artigo
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label className="text-green-700 font-bold text-sm mb-2 block">
                    Rascunho de Título *
                  </Label>
                  {isEditing ? (
                    <Input
                      value={formData.draftTitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, draftTitle: e.target.value }))}
                      placeholder="Digite o título provisório do artigo..."
                      className="border-green-200 focus:border-green-500 shadow-sm"
                    />
                  ) : (
                    <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                      <p className="text-gray-800 font-semibold">
                        {idea.draftTitle || 'Não definido'}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-green-700 font-bold text-sm mb-2 block">
                    Resumo do Artigo (Rascunho)
                  </Label>
                  {isEditing ? (
                    <Textarea
                      value={formData.draftSummary}
                      onChange={(e) => setFormData(prev => ({ ...prev, draftSummary: e.target.value }))}
                      placeholder="Escreva uma breve sinopse do conteúdo..."
                      className="border-green-200 focus:border-green-500 shadow-sm"
                      rows={4}
                    />
                  ) : (
                    <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200 min-h-[100px]">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {idea.draftSummary || 'Não definido'}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-green-700 font-bold text-sm mb-2 block">
                    Conteúdo do Artigo (Rascunho)
                  </Label>
                  {isEditing ? (
                    <Textarea
                      value={formData.draftContent}
                      onChange={(e) => setFormData(prev => ({ ...prev, draftContent: e.target.value }))}
                      placeholder="Escreva o rascunho completo do artigo ou partes significativas dele..."
                      className="border-green-200 focus:border-green-500 shadow-sm resize-y"
                      rows={12}
                    />
                  ) : (
                    <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200 max-h-80 overflow-y-auto">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {idea.draftContent || 'Nenhum conteúdo rascunho ainda'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Indicador de Progresso do Rascunho */}
                <div className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-lg border border-green-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-green-800">Progresso do Rascunho</span>
                    <span className="text-sm font-bold text-green-700">
                      {[formData.draftTitle, formData.draftSummary, formData.draftContent].filter(Boolean).length}/3
                    </span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-700 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${([formData.draftTitle, formData.draftSummary, formData.draftContent].filter(Boolean).length / 3) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    {hasDraftContent ? 'Rascunho em desenvolvimento' : 'Comece desenvolvendo seu rascunho'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-between items-center pt-8 border-t-2 border-red-200 bg-gradient-to-r from-red-50 to-red-100 p-6 -m-6 mt-6 rounded-b-lg">
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white shadow-lg font-bold"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 shadow-lg"
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                {canTransformToArticle && hasDraftContent && (
                  <Button
                    onClick={() => onTransformToArticle(idea)}
                    className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-xl font-black text-lg px-8 py-3 transform hover:scale-105 transition-all duration-300"
                  >
                    <ArrowRight className="h-5 w-5 mr-3" />
                    Transformar em Artigo
                  </Button>
                )}
              </>
            )}
          </div>
          
          {!isEditing && (
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">
                Criado em: {new Date(idea.created_at).toLocaleDateString('pt-BR')}
              </p>
              <p className="text-sm text-gray-600">
                Atualizado em: {new Date(idea.updated_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentIdeaDetailModal;
