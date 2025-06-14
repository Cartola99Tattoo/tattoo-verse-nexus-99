
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FileText, Edit, Save, X, ArrowRight, PenTool, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
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

  const handleTransform = () => {
    // Salvar antes de transformar
    onUpdate(idea, formData);
    onTransformToArticle(idea);
  };

  const hasDraftContent = formData.draftTitle || formData.draftSummary || formData.draftContent;
  const draftCompleteness = [formData.draftTitle, formData.draftSummary, formData.draftContent].filter(Boolean).length;
  const isDraftWellDeveloped = draftCompleteness >= 2;

  const getPersonaNames = (personaIds: string[]) => {
    return personaIds.map(id => {
      const persona = personas.find(p => p.id === id);
      return persona ? persona.name : id;
    }).join(', ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-white to-red-50 border-2 border-red-200 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 -m-6 mb-6 rounded-t-lg shadow-lg">
          <DialogTitle className="flex items-center justify-between text-2xl font-black">
            <div className="flex items-center gap-3">
              <FileText className="h-7 w-7" />
              {isEditing ? 'Editando Rascunho de Conteúdo' : 'Rascunho de Conteúdo Detalhado'}
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

                {/* Campos editáveis sempre na esquerda */}
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

          {/* Coluna Direita - ÁREA DE DESENVOLVIMENTO DO RASCUNHO */}
          <div className="space-y-6">
            <Card className="bg-white border-2 border-green-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-t-lg p-4">
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    <PenTool className="h-5 w-5" />
                    Desenvolvimento do Rascunho
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-bold">{draftCompleteness}/3</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Indicador de Progresso do Rascunho */}
                <div className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-lg border-2 border-green-300 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-black text-green-800 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Progresso do Rascunho
                    </span>
                    <span className="text-lg font-black text-green-700 bg-white px-3 py-1 rounded-full shadow-md">
                      {draftCompleteness}/3 Completo
                    </span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-3 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-700 h-3 rounded-full transition-all duration-500 shadow-lg"
                      style={{ 
                        width: `${(draftCompleteness / 3) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {[
                      { field: 'draftTitle', label: 'Título' },
                      { field: 'draftSummary', label: 'Resumo' },
                      { field: 'draftContent', label: 'Conteúdo' }
                    ].map((item, i) => (
                      <div
                        key={i}
                        className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-bold border-2 transition-all duration-300 ${
                          formData[item.field as keyof typeof formData] 
                            ? 'bg-green-600 text-white border-green-700 shadow-lg' 
                            : 'bg-white text-green-600 border-green-300'
                        }`}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-green-700 mt-2 text-center font-medium">
                    {isDraftWellDeveloped ? '🎉 Rascunho bem desenvolvido - Pronto para transformar!' : '✍️ Continue desenvolvendo seu rascunho'}
                  </p>
                </div>

                {/* CAMPOS DE RASCUNHO FUNCIONAIS */}
                <div className="space-y-6">
                  <div>
                    <Label className="text-green-700 font-bold text-lg mb-3 block flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Rascunho de Título *
                    </Label>
                    <Input
                      value={formData.draftTitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, draftTitle: e.target.value }))}
                      placeholder="Digite o título provisório do artigo..."
                      className="border-green-200 focus:border-green-500 shadow-sm text-lg py-3"
                      disabled={!isEditing}
                    />
                    {!isEditing && !formData.draftTitle && (
                      <p className="text-sm text-gray-500 mt-1 italic">Clique em "Editar" para adicionar o título</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-green-700 font-bold text-lg mb-3 block flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Resumo do Artigo (Rascunho)
                    </Label>
                    <Textarea
                      value={formData.draftSummary}
                      onChange={(e) => setFormData(prev => ({ ...prev, draftSummary: e.target.value }))}
                      placeholder="Escreva uma breve sinopse do conteúdo que será abordado no artigo..."
                      className="border-green-200 focus:border-green-500 shadow-sm resize-y"
                      rows={5}
                      disabled={!isEditing}
                    />
                    {!isEditing && !formData.draftSummary && (
                      <p className="text-sm text-gray-500 mt-1 italic">Clique em "Editar" para adicionar o resumo</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-green-700 font-bold text-lg mb-3 block flex items-center gap-2">
                      <PenTool className="h-5 w-5" />
                      Conteúdo do Artigo (Rascunho Completo)
                    </Label>
                    <Textarea
                      value={formData.draftContent}
                      onChange={(e) => setFormData(prev => ({ ...prev, draftContent: e.target.value }))}
                      placeholder="Escreva o rascunho completo do artigo ou partes significativas dele. Você pode usar este espaço para desenvolver o conteúdo principal, estruturar ideias, adicionar tópicos importantes, etc..."
                      className="border-green-200 focus:border-green-500 shadow-sm resize-y"
                      rows={16}
                      disabled={!isEditing}
                    />
                    {!isEditing && !formData.draftContent && (
                      <p className="text-sm text-gray-500 mt-1 italic">Clique em "Editar" para desenvolver o conteúdo</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ÁREA DE AÇÃO PRINCIPAL */}
        <div className="border-t-4 border-red-200 bg-gradient-to-r from-red-50 to-red-100 p-8 -m-6 mt-8 rounded-b-lg">
          {isEditing ? (
            /* Modo de Edição */
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white shadow-xl font-black text-lg px-8 py-3"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Salvar Rascunho
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 shadow-lg"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            /* Modo de Visualização */
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                {/* BOTÃO PRINCIPAL: TRANSFORMAR EM ARTIGO */}
                {isDraftWellDeveloped && (
                  <Button
                    onClick={handleTransform}
                    className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white shadow-2xl font-black text-xl px-12 py-4 transform hover:scale-105 transition-all duration-300 border-2 border-red-400/50"
                  >
                    <ArrowRight className="h-6 w-6 mr-3 animate-pulse" />
                    Transformar em Artigo Final
                    <Sparkles className="h-6 w-6 ml-3" />
                  </Button>
                )}
                
                {/* Mensagem motivacional se rascunho não estiver desenvolvido */}
                {!isDraftWellDeveloped && (
                  <div className="bg-yellow-100 border-2 border-yellow-300 rounded-lg p-4 flex items-center gap-3">
                    <PenTool className="h-6 w-6 text-yellow-600" />
                    <div>
                      <p className="font-bold text-yellow-800 text-lg">Desenvolva mais o rascunho</p>
                      <p className="text-yellow-700">Adicione pelo menos o título e mais um campo para transformar em artigo</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">
                  Criado em: {new Date(idea.created_at).toLocaleDateString('pt-BR')}
                </p>
                <p className="text-sm text-gray-600">
                  Atualizado em: {new Date(idea.updated_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentIdeaDetailModal;
