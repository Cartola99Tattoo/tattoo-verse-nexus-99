
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FileText, Edit, Save, X, ArrowRight, PenTool, BookOpen, Sparkles, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
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
  const [isDraftEditing, setIsDraftEditing] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
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

  // Auto-save draft after 3 seconds of inactivity
  useEffect(() => {
    if (isDraftEditing) {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
      
      const timer = setTimeout(() => {
        handleSaveDraft();
        setAutoSaveTimer(null);
      }, 3000);
      
      setAutoSaveTimer(timer);
      
      return () => {
        if (timer) clearTimeout(timer);
      };
    }
  }, [formData.draftTitle, formData.draftSummary, formData.draftContent, isDraftEditing]);

  const handleSave = () => {
    onUpdate(idea, formData);
    setIsEditing(false);
    setLastSaved(new Date());
  };

  const handleSaveDraft = () => {
    console.log('Auto-salvando rascunho...');
    onUpdate(idea, formData);
    setIsDraftEditing(false);
    setLastSaved(new Date());
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

  const handleDraftFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (!isDraftEditing) setIsDraftEditing(true);
  };

  const getDraftStatusMessage = () => {
    if (draftCompleteness === 0) return "Rascunho não iniciado";
    if (draftCompleteness === 1) return "Rascunho em desenvolvimento";
    if (draftCompleteness === 2) return "Rascunho bem desenvolvido";
    return "Rascunho completo e pronto!";
  };

  const getDraftStatusColor = () => {
    if (draftCompleteness === 0) return "text-gray-500";
    if (draftCompleteness === 1) return "text-yellow-600";
    if (draftCompleteness === 2) return "text-green-600";
    return "text-green-800";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-white via-red-50 to-white border-4 border-red-300 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-8 -m-6 mb-8 rounded-t-xl shadow-2xl">
          <DialogTitle className="flex items-center justify-between text-3xl font-black">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full shadow-lg">
                <PenTool className="h-8 w-8" />
              </div>
              <div>
                <div className="text-2xl">Ambiente de Rascunho</div>
                <div className="text-red-200 text-sm font-normal">
                  {isEditing ? 'Editando informações básicas' : 'Desenvolvendo conteúdo'}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 shadow-xl font-bold"
                >
                  <Edit className="h-5 w-5 mr-2" />
                  Editar Info
                </Button>
              )}
              <Button
                onClick={onClose}
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 shadow-xl"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Coluna Esquerda - Informações Básicas (2/5) */}
          <div className="xl:col-span-2 space-y-6">
            <Card className="bg-white border-4 border-red-200 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-t-lg p-6">
                <CardTitle className="flex items-center gap-3 text-xl font-black">
                  <BookOpen className="h-6 w-6" />
                  Informações do Card
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div>
                  <Label className="text-red-700 font-black text-lg mb-3 block">Tema Principal</Label>
                  {isEditing ? (
                    <Input
                      value={formData.theme}
                      onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                      className="border-red-200 focus:border-red-500 shadow-lg text-lg font-medium"
                    />
                  ) : (
                    <p className="font-bold text-gray-800 bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-2 border-gray-200 shadow-md text-lg">
                      {idea.theme}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-red-700 font-black text-lg mb-3 block">Formato</Label>
                    <Badge className="bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-xl text-lg px-4 py-2">
                      {idea.format}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-red-700 font-black text-lg mb-3 block">Status</Label>
                    <Badge className="bg-gradient-to-r from-red-600 to-red-800 text-white shadow-xl text-lg px-4 py-2">
                      {idea.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-red-700 font-black text-lg mb-3 block">Etapa da Jornada</Label>
                  <Badge className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl text-lg px-4 py-2">
                    {idea.purchaseStage}
                  </Badge>
                </div>

                <div>
                  <Label className="text-red-700 font-black text-lg mb-3 block">Personas Foco</Label>
                  <p className="text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-2 border-gray-200 shadow-md font-medium">
                    {getPersonaNames(idea.focusPersonas)}
                  </p>
                </div>

                <div>
                  <Label className="text-red-700 font-black text-lg mb-3 block">Palavra-chave Foco</Label>
                  <p className="text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-2 border-gray-200 shadow-md font-medium">
                    {idea.focusKeyword}
                  </p>
                </div>

                {isEditing && (
                  <>
                    <div>
                      <Label className="text-red-700 font-black text-lg mb-3 block">Relevância para Personas</Label>
                      <Textarea
                        value={formData.personaRelevance}
                        onChange={(e) => setFormData(prev => ({ ...prev, personaRelevance: e.target.value }))}
                        className="border-red-200 focus:border-red-500 shadow-lg resize-y"
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label className="text-red-700 font-black text-lg mb-3 block">Notas</Label>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        className="border-red-200 focus:border-red-500 shadow-lg resize-y"
                        rows={4}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita - ÁREA DE DESENVOLVIMENTO DO RASCUNHO (3/5) */}
          <div className="xl:col-span-3 space-y-6">
            <Card className="bg-white border-4 border-green-300 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white rounded-t-lg p-6">
                <CardTitle className="flex items-center justify-between text-xl font-black">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-xl">Desenvolvimento do Rascunho</div>
                      <div className="text-green-200 text-sm font-normal">
                        {getDraftStatusMessage()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-6 w-6" />
                    <span className="text-2xl font-black">{draftCompleteness}/3</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Indicador de Progresso SUPER Visual */}
                <div className="bg-gradient-to-br from-green-50 via-green-100 to-green-200 p-6 rounded-2xl border-4 border-green-300 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-black text-green-800 flex items-center gap-3">
                      <CheckCircle2 className="h-8 w-8" />
                      Status do Rascunho
                    </span>
                    <div className="bg-white px-6 py-3 rounded-full shadow-xl border-2 border-green-500">
                      <span className="text-2xl font-black text-green-700">
                        {Math.round((draftCompleteness / 3) * 100)}% Completo
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-green-200 rounded-full h-6 shadow-inner border-2 border-green-300 mb-6">
                    <div 
                      className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 h-6 rounded-full transition-all duration-700 shadow-lg flex items-center justify-end pr-3"
                      style={{ width: `${(draftCompleteness / 3) * 100}%` }}
                    >
                      {draftCompleteness > 0 && (
                        <span className="text-white font-bold text-sm">
                          {draftCompleteness}/3
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { field: 'draftTitle', label: 'Título', icon: '📝' },
                      { field: 'draftSummary', label: 'Resumo', icon: '📋' },
                      { field: 'draftContent', label: 'Conteúdo', icon: '📄' }
                    ].map((item, i) => (
                      <div
                        key={i}
                        className={`text-center py-4 px-3 rounded-2xl border-4 transition-all duration-300 shadow-lg ${
                          formData[item.field as keyof typeof formData] 
                            ? 'bg-gradient-to-br from-green-600 to-green-800 text-white border-green-700 transform scale-105 shadow-2xl' 
                            : 'bg-white text-green-600 border-green-300 hover:border-green-400'
                        }`}
                      >
                        <div className="text-3xl mb-2">{item.icon}</div>
                        <div className="font-black text-lg">{item.label}</div>
                        <div className="text-sm opacity-80">
                          {formData[item.field as keyof typeof formData] ? 'Concluído' : 'Pendente'}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className={`text-center mt-6 ${getDraftStatusColor()}`}>
                    <p className="text-xl font-black flex items-center justify-center gap-2">
                      {isDraftWellDeveloped ? (
                        <>🎉 Rascunho bem desenvolvido - Pronto para transformar!</>
                      ) : (
                        <>✍️ Continue desenvolvendo seu rascunho</>
                      )}
                    </p>
                  </div>
                </div>

                {/* Status de Salvamento */}
                {isDraftEditing && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600 animate-spin" />
                    <span className="text-blue-700 font-bold">Salvando automaticamente...</span>
                  </div>
                )}

                {lastSaved && !isDraftEditing && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-green-700 font-bold">
                      Salvo às {lastSaved.toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                )}

                {/* CAMPOS DE RASCUNHO EDITÁVEIS */}
                <div className="space-y-8">
                  <div>
                    <Label className="text-green-700 font-black text-xl mb-4 block flex items-center gap-3">
                      <FileText className="h-6 w-6" />
                      Rascunho de Título *
                    </Label>
                    <Input
                      value={formData.draftTitle}
                      onChange={(e) => handleDraftFieldChange('draftTitle', e.target.value)}
                      placeholder="Digite o título provisório do artigo..."
                      className="border-green-300 focus:border-green-500 shadow-lg text-xl py-4 font-medium"
                    />
                  </div>

                  <div>
                    <Label className="text-green-700 font-black text-xl mb-4 block flex items-center gap-3">
                      <BookOpen className="h-6 w-6" />
                      Resumo do Artigo (Rascunho)
                    </Label>
                    <Textarea
                      value={formData.draftSummary}
                      onChange={(e) => handleDraftFieldChange('draftSummary', e.target.value)}
                      placeholder="Escreva uma breve sinopse do conteúdo que será abordado no artigo..."
                      className="border-green-300 focus:border-green-500 shadow-lg resize-y font-medium"
                      rows={6}
                    />
                  </div>

                  <div>
                    <Label className="text-green-700 font-black text-xl mb-4 block flex items-center gap-3">
                      <PenTool className="h-6 w-6" />
                      Conteúdo do Artigo (Rascunho Completo)
                    </Label>
                    <Textarea
                      value={formData.draftContent}
                      onChange={(e) => handleDraftFieldChange('draftContent', e.target.value)}
                      placeholder="Escreva o rascunho completo do artigo ou partes significativas dele. Você pode usar este espaço para desenvolver o conteúdo principal, estruturar ideias, adicionar tópicos importantes, etc..."
                      className="border-green-300 focus:border-green-500 shadow-lg resize-y font-medium"
                      rows={20}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ÁREA DE AÇÃO PRINCIPAL */}
        <div className="border-t-4 border-red-300 bg-gradient-to-br from-red-50 via-red-100 to-red-200 p-8 -m-6 mt-8 rounded-b-xl shadow-inner">
          {isEditing ? (
            /* Modo de Edição */
            <div className="flex justify-between items-center">
              <div className="flex gap-6">
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-700 hover:via-green-800 hover:to-green-900 text-white shadow-2xl font-black text-xl px-12 py-4 transform hover:scale-105 transition-all duration-300"
                >
                  <Save className="h-6 w-6 mr-3" />
                  Salvar Alterações
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="border-red-400 text-red-600 hover:bg-red-50 shadow-xl font-bold text-lg px-8 py-4"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            /* Modo de Visualização */
            <div className="flex justify-between items-center">
              <div className="flex gap-6">
                {/* BOTÃO PRINCIPAL: TRANSFORMAR EM ARTIGO */}
                {isDraftWellDeveloped ? (
                  <Button
                    onClick={handleTransform}
                    className="bg-gradient-to-r from-red-600 via-red-700 via-red-800 to-red-900 hover:from-red-700 hover:via-red-800 hover:via-red-900 hover:to-black text-white shadow-2xl font-black text-2xl px-16 py-6 transform hover:scale-110 transition-all duration-300 border-4 border-red-400/50 hover:border-red-300"
                  >
                    <ArrowRight className="h-8 w-8 mr-4 animate-pulse" />
                    Transformar em Artigo Final
                    <Sparkles className="h-8 w-8 ml-4 animate-bounce" />
                  </Button>
                ) : (
                  <div className="bg-yellow-100 border-4 border-yellow-400 rounded-2xl p-6 flex items-center gap-4 shadow-xl">
                    <AlertCircle className="h-8 w-8 text-yellow-600" />
                    <div>
                      <p className="font-black text-yellow-800 text-xl">Desenvolva mais o rascunho</p>
                      <p className="text-yellow-700 font-medium">Adicione pelo menos o título e mais um campo para transformar em artigo</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1 font-medium">
                  Criado em: {new Date(idea.created_at).toLocaleDateString('pt-BR')}
                </p>
                <p className="text-sm text-gray-600 font-medium">
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
