
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FileText, Edit, Save, X, ArrowRight, PenTool, BookOpen, Sparkles, CheckCircle2, Clock, AlertCircle, Plus, Trash2, Link, Image, Target, Tag, User, Globe } from 'lucide-react';
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
    draftTitles: idea.draftTitles || [''],
    draftSummary: idea.draftSummary || '',
    draftContent: idea.draftContent || '',
    seoKeywords: idea.seoKeywords || [''],
    provisionalSlug: idea.provisionalSlug || '',
    suggestedAuthor: idea.suggestedAuthor || '',
    featuredImageUrl: idea.featuredImageUrl || '',
    internalLinks: idea.internalLinks || [''],
    suggestedCTA: idea.suggestedCTA || ''
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
  }, [formData, isDraftEditing]);

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

  // Calcular progresso do rascunho com base nos novos campos
  const completedFields = [
    formData.draftTitles.filter(Boolean).length > 0,
    formData.draftSummary,
    formData.draftContent,
    formData.seoKeywords.filter(Boolean).length > 0,
    formData.provisionalSlug,
    formData.suggestedCTA
  ].filter(Boolean).length;

  const totalFields = 6;
  const isDraftWellDeveloped = completedFields >= 3;

  const getPersonaNames = (personaIds: string[]) => {
    return personaIds.map(id => {
      const persona = personas.find(p => p.id === id);
      return persona ? persona.name : id;
    }).join(', ');
  };

  const handleDraftFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (!isDraftEditing) setIsDraftEditing(true);
  };

  // Funções auxiliares para campos de array
  const addDraftTitle = () => {
    setFormData(prev => ({
      ...prev,
      draftTitles: [...prev.draftTitles, '']
    }));
    setIsDraftEditing(true);
  };

  const removeDraftTitle = (index: number) => {
    setFormData(prev => ({
      ...prev,
      draftTitles: prev.draftTitles.filter((_, i) => i !== index)
    }));
    setIsDraftEditing(true);
  };

  const updateDraftTitle = (index: number, value: string) => {
    const newTitles = [...formData.draftTitles];
    newTitles[index] = value;
    handleDraftFieldChange('draftTitles', newTitles);
  };

  const addSeoKeyword = () => {
    setFormData(prev => ({
      ...prev,
      seoKeywords: [...prev.seoKeywords, '']
    }));
    setIsDraftEditing(true);
  };

  const removeSeoKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      seoKeywords: prev.seoKeywords.filter((_, i) => i !== index)
    }));
    setIsDraftEditing(true);
  };

  const updateSeoKeyword = (index: number, value: string) => {
    const newKeywords = [...formData.seoKeywords];
    newKeywords[index] = value;
    handleDraftFieldChange('seoKeywords', newKeywords);
  };

  const addInternalLink = () => {
    setFormData(prev => ({
      ...prev,
      internalLinks: [...prev.internalLinks, '']
    }));
    setIsDraftEditing(true);
  };

  const removeInternalLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      internalLinks: prev.internalLinks.filter((_, i) => i !== index)
    }));
    setIsDraftEditing(true);
  };

  const updateInternalLink = (index: number, value: string) => {
    const newLinks = [...formData.internalLinks];
    newLinks[index] = value;
    handleDraftFieldChange('internalLinks', newLinks);
  };

  const getDraftStatusMessage = () => {
    if (completedFields === 0) return "Rascunho não iniciado";
    if (completedFields < 3) return "Rascunho em desenvolvimento";
    if (completedFields < 5) return "Rascunho bem desenvolvido";
    return "Rascunho completo e pronto!";
  };

  const getDraftStatusColor = () => {
    if (completedFields === 0) return "text-gray-500";
    if (completedFields < 3) return "text-yellow-600";
    if (completedFields < 5) return "text-green-600";
    return "text-green-800";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto bg-gradient-to-br from-white via-red-50 to-white border-4 border-red-300 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-8 -m-6 mb-8 rounded-t-xl shadow-2xl">
          <DialogTitle className="flex items-center justify-between text-3xl font-black">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full shadow-lg">
                <PenTool className="h-8 w-8" />
              </div>
              <div>
                <div className="text-2xl">Centro de Desenvolvimento de Rascunho</div>
                <div className="text-red-200 text-sm font-normal">
                  {isEditing ? 'Editando informações básicas' : 'Desenvolvendo conteúdo completo'}
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

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Coluna Esquerda - Informações Básicas (1/4) */}
          <div className="space-y-6">
            <Card className="bg-white border-4 border-red-200 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-t-lg p-4">
                <CardTitle className="flex items-center gap-3 text-lg font-black">
                  <BookOpen className="h-5 w-5" />
                  Info do Card
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label className="text-red-700 font-bold text-sm mb-2 block">Tema Principal</Label>
                  {isEditing ? (
                    <Input
                      value={formData.theme}
                      onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                      className="border-red-200 focus:border-red-500 shadow-lg text-sm"
                    />
                  ) : (
                    <p className="font-medium text-gray-800 bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg border-2 border-gray-200 shadow-md text-sm">
                      {idea.theme}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-red-700 font-bold text-sm mb-2 block">Formato</Label>
                    <Badge className="bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg text-xs px-3 py-1">
                      {idea.format}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-red-700 font-bold text-sm mb-2 block">Status</Label>
                    <Badge className="bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg text-xs px-3 py-1">
                      {idea.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-red-700 font-bold text-sm mb-2 block">Etapa da Jornada</Label>
                  <Badge className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg text-xs px-3 py-1">
                    {idea.purchaseStage}
                  </Badge>
                </div>

                <div>
                  <Label className="text-red-700 font-bold text-sm mb-2 block">Personas Foco</Label>
                  <p className="text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg border-2 border-gray-200 shadow-md text-xs">
                    {getPersonaNames(idea.focusPersonas)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Principal - DESENVOLVIMENTO DO RASCUNHO (3/4) */}
          <div className="xl:col-span-3 space-y-6">
            {/* Dashboard de Progresso */}
            <Card className="bg-white border-4 border-green-300 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white rounded-t-lg p-4">
                <CardTitle className="flex items-center justify-between text-lg font-black">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-lg">Desenvolvimento do Rascunho</div>
                      <div className="text-green-200 text-xs font-normal">
                        {getDraftStatusMessage()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5" />
                    <span className="text-xl font-black">{completedFields}/{totalFields}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-gradient-to-br from-green-50 via-green-100 to-green-200 p-4 rounded-xl border-3 border-green-300 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-black text-green-800 flex items-center gap-2">
                      <CheckCircle2 className="h-6 w-6" />
                      Status do Rascunho
                    </span>
                    <div className="bg-white px-4 py-2 rounded-full shadow-lg border-2 border-green-500">
                      <span className="text-lg font-black text-green-700">
                        {Math.round((completedFields / totalFields) * 100)}% Completo
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-green-200 rounded-full h-4 shadow-inner border-2 border-green-300 mb-4">
                    <div 
                      className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 h-4 rounded-full transition-all duration-700 shadow-lg flex items-center justify-end pr-2"
                      style={{ width: `${(completedFields / totalFields) * 100}%` }}
                    >
                      {completedFields > 0 && (
                        <span className="text-white font-bold text-xs">
                          {completedFields}/{totalFields}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className={`text-center ${getDraftStatusColor()}`}>
                    <p className="text-lg font-black flex items-center justify-center gap-2">
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
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 flex items-center gap-3 mt-4">
                    <Clock className="h-4 w-4 text-blue-600 animate-spin" />
                    <span className="text-blue-700 font-bold text-sm">Salvando automaticamente...</span>
                  </div>
                )}

                {lastSaved && !isDraftEditing && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 flex items-center gap-3 mt-4">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-green-700 font-bold text-sm">
                      Salvo às {lastSaved.toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CAMPOS DE RASCUNHO EXPANDIDOS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Coluna 1 - Conteúdo Principal */}
              <div className="space-y-6">
                {/* Múltiplos Títulos */}
                <Card className="bg-white border-2 border-blue-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Ideias de Títulos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {formData.draftTitles.map((title, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          value={title}
                          onChange={(e) => updateDraftTitle(index, e.target.value)}
                          placeholder={`Título ${index + 1}...`}
                          className="border-blue-200 focus:border-blue-500 shadow-sm text-sm"
                        />
                        {formData.draftTitles.length > 1 && (
                          <Button
                            onClick={() => removeDraftTitle(index)}
                            variant="outline"
                            size="sm"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      onClick={addDraftTitle}
                      variant="outline"
                      size="sm"
                      className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Outra Ideia de Título
                    </Button>
                  </CardContent>
                </Card>

                {/* Resumo */}
                <Card className="bg-white border-2 border-purple-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Resumo do Artigo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <Textarea
                      value={formData.draftSummary}
                      onChange={(e) => handleDraftFieldChange('draftSummary', e.target.value)}
                      placeholder="Escreva uma breve sinopse do conteúdo que será abordado no artigo..."
                      className="border-purple-200 focus:border-purple-500 shadow-sm resize-y"
                      rows={4}
                    />
                  </CardContent>
                </Card>

                {/* Conteúdo Principal */}
                <Card className="bg-white border-2 border-green-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-green-600 to-green-800 text-white p-4">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <PenTool className="h-5 w-5" />
                      Conteúdo do Artigo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <Textarea
                      value={formData.draftContent}
                      onChange={(e) => handleDraftFieldChange('draftContent', e.target.value)}
                      placeholder="Escreva o rascunho completo do artigo ou partes significativas dele..."
                      className="border-green-200 focus:border-green-500 shadow-sm resize-y"
                      rows={12}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Coluna 2 - Detalhes e SEO */}
              <div className="space-y-6">
                {/* SEO Keywords */}
                <Card className="bg-white border-2 border-orange-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-800 text-white p-4">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      Palavras-chave SEO
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {formData.seoKeywords.map((keyword, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          value={keyword}
                          onChange={(e) => updateSeoKeyword(index, e.target.value)}
                          placeholder={`Palavra-chave ${index + 1}...`}
                          className="border-orange-200 focus:border-orange-500 shadow-sm text-sm"
                        />
                        {formData.seoKeywords.length > 1 && (
                          <Button
                            onClick={() => removeSeoKeyword(index)}
                            variant="outline"
                            size="sm"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      onClick={addSeoKeyword}
                      variant="outline"
                      size="sm"
                      className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Palavra-chave
                    </Button>
                  </CardContent>
                </Card>

                {/* URL e Autor */}
                <Card className="bg-white border-2 border-indigo-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-4">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      URL e Autor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <Label className="text-indigo-700 font-bold text-sm mb-2 block">URL Provisória/Slug</Label>
                      <Input
                        value={formData.provisionalSlug}
                        onChange={(e) => handleDraftFieldChange('provisionalSlug', e.target.value)}
                        placeholder="url-amigavel-do-artigo"
                        className="border-indigo-200 focus:border-indigo-500 shadow-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-indigo-700 font-bold text-sm mb-2 block">Autor Sugerido</Label>
                      <Input
                        value={formData.suggestedAuthor}
                        onChange={(e) => handleDraftFieldChange('suggestedAuthor', e.target.value)}
                        placeholder="Nome do autor..."
                        className="border-indigo-200 focus:border-indigo-500 shadow-sm"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Imagem Destacada */}
                <Card className="bg-white border-2 border-pink-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-pink-600 to-pink-800 text-white p-4">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Image className="h-5 w-5" />
                      Imagem Destacada
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <Input
                      type="file"
                      accept="image/*"
                      className="border-pink-200 focus:border-pink-500 shadow-sm"
                    />
                    <p className="text-xs text-gray-600 mt-2">Ou cole uma URL de imagem:</p>
                    <Input
                      value={formData.featuredImageUrl}
                      onChange={(e) => handleDraftFieldChange('featuredImageUrl', e.target.value)}
                      placeholder="https://exemplo.com/imagem.jpg"
                      className="border-pink-200 focus:border-pink-500 shadow-sm mt-2"
                    />
                  </CardContent>
                </Card>

                {/* Links Internos */}
                <Card className="bg-white border-2 border-teal-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-800 text-white p-4">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Link className="h-5 w-5" />
                      Links Internos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {formData.internalLinks.map((link, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          value={link}
                          onChange={(e) => updateInternalLink(index, e.target.value)}
                          placeholder={`Link interno ${index + 1}...`}
                          className="border-teal-200 focus:border-teal-500 shadow-sm text-sm"
                        />
                        {formData.internalLinks.length > 1 && (
                          <Button
                            onClick={() => removeInternalLink(index)}
                            variant="outline"
                            size="sm"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      onClick={addInternalLink}
                      variant="outline"
                      size="sm"
                      className="w-full border-teal-300 text-teal-600 hover:bg-teal-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Link Interno
                    </Button>
                  </CardContent>
                </Card>

                {/* Call to Action */}
                <Card className="bg-white border-2 border-red-200 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white p-4">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Call to Action
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <Textarea
                      value={formData.suggestedCTA}
                      onChange={(e) => handleDraftFieldChange('suggestedCTA', e.target.value)}
                      placeholder="Escreva o call to action principal do artigo..."
                      className="border-red-200 focus:border-red-500 shadow-sm resize-y"
                      rows={3}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* ÁREA DE AÇÃO PRINCIPAL */}
        <div className="border-t-4 border-red-300 bg-gradient-to-br from-red-50 via-red-100 to-red-200 p-6 -m-6 mt-8 rounded-b-xl shadow-inner">
          {isEditing ? (
            /* Modo de Edição */
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-700 hover:via-green-800 hover:to-green-900 text-white shadow-xl font-black text-lg px-8 py-3 transform hover:scale-105 transition-all duration-300"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Salvar Alterações
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="border-red-400 text-red-600 hover:bg-red-50 shadow-lg font-bold text-md px-6 py-3"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            /* Modo de Visualização */
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                {/* BOTÃO PRINCIPAL: TRANSFORMAR EM ARTIGO - SEMPRE VISÍVEL */}
                <Button
                  onClick={handleTransform}
                  className="bg-gradient-to-r from-red-600 via-red-700 via-red-800 to-red-900 hover:from-red-700 hover:via-red-800 hover:via-red-900 hover:to-black text-white shadow-2xl font-black text-xl px-12 py-5 transform hover:scale-110 transition-all duration-300 border-4 border-red-400/50 hover:border-red-300"
                >
                  <ArrowRight className="h-6 w-6 mr-3 animate-pulse" />
                  Transformar em Artigo Final
                  <Sparkles className="h-6 w-6 ml-3 animate-bounce" />
                </Button>
                
                {!isDraftWellDeveloped && (
                  <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 flex items-center gap-3 shadow-lg">
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                    <div>
                      <p className="font-bold text-yellow-800 text-md">Desenvolva mais o rascunho</p>
                      <p className="text-yellow-700 text-sm">Complete mais campos para um artigo mais rico</p>
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
