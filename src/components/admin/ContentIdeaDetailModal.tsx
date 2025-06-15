
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Save, 
  ArrowRight, 
  Plus, 
  Trash2, 
  FileText, 
  Users, 
  Target, 
  Tag, 
  Image,
  Link,
  Sparkles,
  PenTool
} from 'lucide-react';
import { ContentIdea, CreateContentIdeaData } from '@/types/contentIdea';
import { Persona } from '@/types/persona';
import { toast } from '@/hooks/use-toast';

interface ContentIdeaDetailModalProps {
  idea: ContentIdea;
  personas: Persona[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (idea: ContentIdea, data: CreateContentIdeaData) => void;
  onTransformToArticle: (idea: ContentIdea) => void;
}

const FORMATS = [
  'Blog Post', 'eBook', 'Webinar/Live', 'Vídeo Curto', 
  'Post de Redes Sociais', 'Infográfico', 'Estudo de Caso', 'Outro'
];

const PURCHASE_STAGES = [
  'Aprendizado e Descoberta',
  'Reconhecimento do Problema', 
  'Consideração da Solução',
  'Decisão de Compra'
];

const STATUS_OPTIONS = [
  'Ideia', 'Planejado', 'Em Produção', 'Em Revisão', 
  'Fazendo Imagens/Gráficos', 'Conteúdo Agendado', 'Publicado', 'Promover/Distribuir'
];

const ContentIdeaDetailModal = ({ 
  idea, 
  personas, 
  isOpen, 
  onClose, 
  onUpdate, 
  onTransformToArticle 
}: ContentIdeaDetailModalProps) => {
  const [formData, setFormData] = useState<CreateContentIdeaData>({
    theme: idea.theme,
    format: idea.format,
    purchaseStage: idea.purchaseStage,
    focusPersonas: idea.focusPersonas,
    personaRelevance: idea.personaRelevance,
    focusKeyword: idea.focusKeyword,
    status: idea.status,
    notes: idea.notes,
    ideaCreator: idea.ideaCreator,
    // Campos expandidos de rascunho
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

  const [isLoading, setIsLoading] = useState(false);

  // Auto-generate slug from first title
  useEffect(() => {
    if (formData.draftTitles[0] && !idea.provisionalSlug) {
      const slug = formData.draftTitles[0]
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, provisionalSlug: slug }));
    }
  }, [formData.draftTitles, idea.provisionalSlug]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      onUpdate(idea, formData);
      toast({
        title: "Sucesso!",
        description: "Rascunho salvo com sucesso!"
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar rascunho",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransform = () => {
    // Update the idea with current form data before transforming
    const updatedIdea = { ...idea, ...formData, updated_at: new Date().toISOString() };
    onTransformToArticle(updatedIdea);
  };

  // Funções auxiliares para campos de array
  const addTitle = () => {
    setFormData(prev => ({
      ...prev,
      draftTitles: [...prev.draftTitles!, '']
    }));
  };

  const removeTitle = (index: number) => {
    setFormData(prev => ({
      ...prev,
      draftTitles: prev.draftTitles!.filter((_, i) => i !== index)
    }));
  };

  const updateTitle = (index: number, value: string) => {
    const newTitles = [...formData.draftTitles!];
    newTitles[index] = value;
    setFormData(prev => ({ ...prev, draftTitles: newTitles }));
  };

  const addKeyword = () => {
    setFormData(prev => ({
      ...prev,
      seoKeywords: [...prev.seoKeywords!, '']
    }));
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      seoKeywords: prev.seoKeywords!.filter((_, i) => i !== index)
    }));
  };

  const updateKeyword = (index: number, value: string) => {
    const newKeywords = [...formData.seoKeywords!];
    newKeywords[index] = value;
    setFormData(prev => ({ ...prev, seoKeywords: newKeywords }));
  };

  const addLink = () => {
    setFormData(prev => ({
      ...prev,
      internalLinks: [...prev.internalLinks!, '']
    }));
  };

  const removeLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      internalLinks: prev.internalLinks!.filter((_, i) => i !== index)
    }));
  };

  const updateLink = (index: number, value: string) => {
    const newLinks = [...formData.internalLinks!];
    newLinks[index] = value;
    setFormData(prev => ({ ...prev, internalLinks: newLinks }));
  };

  const handlePersonaChange = (personaId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      focusPersonas: checked 
        ? [...prev.focusPersonas, personaId]
        : prev.focusPersonas.filter(id => id !== personaId)
    }));
  };

  // Calcular progresso do rascunho
  const draftProgress = [
    formData.draftTitles?.some(Boolean),
    formData.draftSummary,
    formData.draftContent
  ].filter(Boolean).length;

  const isWellDeveloped = draftProgress >= 2;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-red-50 to-gray-50">
        <DialogHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-t-lg -m-6 mb-6">
          <DialogTitle className="text-2xl font-black flex items-center gap-3">
            <PenTool className="h-6 w-6" />
            Centro de Rascunhos - Desenvolva sua Ideia
          </DialogTitle>
          <p className="text-red-100 font-medium">
            Complete os campos para desenvolver um rascunho detalhado
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal - Rascunho (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações Básicas */}
            <Card className="border-2 border-red-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-red-100 to-red-200 border-b border-red-300">
                <CardTitle className="text-red-700 font-bold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="theme" className="text-red-700 font-bold">Tema/Assunto *</Label>
                  <Input
                    id="theme"
                    value={formData.theme}
                    onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                    className="border-red-200 focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-red-700 font-bold">Formato</Label>
                    <select
                      value={formData.format}
                      onChange={(e) => setFormData(prev => ({ ...prev, format: e.target.value as any }))}
                      className="w-full px-3 py-2 border-2 border-red-200 rounded-md focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    >
                      {FORMATS.map(format => (
                        <option key={format} value={format}>{format}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label className="text-red-700 font-bold">Status</Label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full px-3 py-2 border-2 border-red-200 rounded-md focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    >
                      {STATUS_OPTIONS.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label className="text-red-700 font-bold">Estágio da Jornada de Compra</Label>
                  <select
                    value={formData.purchaseStage}
                    onChange={(e) => setFormData(prev => ({ ...prev, purchaseStage: e.target.value as any }))}
                    className="w-full px-3 py-2 border-2 border-red-200 rounded-md focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  >
                    {PURCHASE_STAGES.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Rascunho de Conteúdo */}
            <Card className="border-2 border-green-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-100 to-green-200 border-b border-green-300">
                <CardTitle className="text-green-700 font-bold flex items-center gap-2">
                  <PenTool className="h-5 w-5" />
                  Desenvolvimento do Rascunho
                  <Badge className={`ml-auto ${isWellDeveloped ? 'bg-green-600' : 'bg-yellow-500'} text-white`}>
                    {draftProgress}/3 Completo
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Múltiplas Ideias de Título */}
                <div>
                  <Label className="text-green-700 font-bold text-lg mb-3 block">
                    Rascunho de Título(s)
                  </Label>
                  <div className="space-y-3">
                    {formData.draftTitles?.map((title, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          value={title}
                          onChange={(e) => updateTitle(index, e.target.value)}
                          placeholder={`Ideia de título ${index + 1}...`}
                          className="border-green-200 focus:border-green-500"
                        />
                        {formData.draftTitles!.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeTitle(index)}
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
                      type="button"
                      onClick={addTitle}
                      variant="outline"
                      size="sm"
                      className="border-green-300 text-green-600 hover:bg-green-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Outra Ideia de Título
                    </Button>
                  </div>
                </div>

                {/* Resumo do Artigo */}
                <div>
                  <Label htmlFor="draftSummary" className="text-green-700 font-bold text-lg mb-3 block">
                    Resumo do Artigo (Rascunho)
                  </Label>
                  <Textarea
                    id="draftSummary"
                    value={formData.draftSummary}
                    onChange={(e) => setFormData(prev => ({ ...prev, draftSummary: e.target.value }))}
                    placeholder="Escreva um resumo/introdução do artigo..."
                    className="border-green-200 focus:border-green-500 resize-y"
                    rows={4}
                  />
                </div>

                {/* Conteúdo do Artigo */}
                <div>
                  <Label htmlFor="draftContent" className="text-green-700 font-bold text-lg mb-3 block">
                    Conteúdo do Artigo (Rascunho)
                  </Label>
                  <Textarea
                    id="draftContent"
                    value={formData.draftContent}
                    onChange={(e) => setFormData(prev => ({ ...prev, draftContent: e.target.value }))}
                    placeholder="Desenvolva o conteúdo completo do artigo aqui..."
                    className="border-green-200 focus:border-green-500 resize-y"
                    rows={12}
                  />
                </div>
              </CardContent>
            </Card>

            {/* SEO e Metadados */}
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-200 border-b border-blue-300">
                <CardTitle className="text-blue-700 font-bold flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  SEO e Metadados
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="focusKeyword" className="text-blue-700 font-bold">Palavra-chave Foco Principal</Label>
                  <Input
                    id="focusKeyword"
                    value={formData.focusKeyword}
                    onChange={(e) => setFormData(prev => ({ ...prev, focusKeyword: e.target.value }))}
                    placeholder="Ex: tatuagem realista, cuidados com tatuagem..."
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>

                {/* Palavras-chave SEO */}
                <div>
                  <Label className="text-blue-700 font-bold">Palavras-chave Sugeridas para SEO</Label>
                  <div className="space-y-3">
                    {formData.seoKeywords?.map((keyword, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          value={keyword}
                          onChange={(e) => updateKeyword(index, e.target.value)}
                          placeholder={`Palavra-chave ${index + 1}...`}
                          className="border-blue-200 focus:border-blue-500"
                        />
                        {formData.seoKeywords!.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeKeyword(index)}
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
                      type="button"
                      onClick={addKeyword}
                      variant="outline"
                      size="sm"
                      className="border-blue-300 text-blue-600 hover:bg-blue-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Palavra-chave
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="provisionalSlug" className="text-blue-700 font-bold">URL Provisória / Slug</Label>
                    <Input
                      id="provisionalSlug"
                      value={formData.provisionalSlug}
                      onChange={(e) => setFormData(prev => ({ ...prev, provisionalSlug: e.target.value }))}
                      placeholder="url-do-artigo"
                      className="border-blue-200 focus:border-blue-500 font-mono text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="suggestedAuthor" className="text-blue-700 font-bold">Autor Sugerido</Label>
                    <Input
                      id="suggestedAuthor"
                      value={formData.suggestedAuthor}
                      onChange={(e) => setFormData(prev => ({ ...prev, suggestedAuthor: e.target.value }))}
                      placeholder="Nome do autor..."
                      className="border-blue-200 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="featuredImageUrl" className="text-blue-700 font-bold flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Imagem Destacada (URL)
                  </Label>
                  <Input
                    id="featuredImageUrl"
                    value={formData.featuredImageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, featuredImageUrl: e.target.value }))}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>

                {/* Links Internos */}
                <div>
                  <Label className="text-blue-700 font-bold flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    Links Internos Sugeridos
                  </Label>
                  <div className="space-y-3">
                    {formData.internalLinks?.map((link, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          value={link}
                          onChange={(e) => updateLink(index, e.target.value)}
                          placeholder={`Link interno ${index + 1}...`}
                          className="border-blue-200 focus:border-blue-500"
                        />
                        {formData.internalLinks!.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeLink(index)}
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
                      type="button"
                      onClick={addLink}
                      variant="outline"
                      size="sm"
                      className="border-blue-300 text-blue-600 hover:bg-blue-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Link Interno
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="suggestedCTA" className="text-blue-700 font-bold">Call to Action (CTA) Sugerido</Label>
                  <Textarea
                    id="suggestedCTA"
                    value={formData.suggestedCTA}
                    onChange={(e) => setFormData(prev => ({ ...prev, suggestedCTA: e.target.value }))}
                    placeholder="Ex: Agende sua consulta hoje mesmo!"
                    className="border-blue-200 focus:border-blue-500 resize-y"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Lateral - Personas e Ações (1/3) */}
          <div className="space-y-6">
            {/* Personas Foco */}
            <Card className="border-2 border-purple-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-200 border-b border-purple-300">
                <CardTitle className="text-purple-700 font-bold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Personas Foco
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {personas.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhuma persona cadastrada</p>
                ) : (
                  personas.map(persona => (
                    <div key={persona.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={`persona-${persona.id}`}
                        checked={formData.focusPersonas.includes(persona.id)}
                        onCheckedChange={(checked) => 
                          handlePersonaChange(persona.id, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`persona-${persona.id}`} 
                        className="flex-1 cursor-pointer font-medium"
                      >
                        {persona.name}
                      </Label>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Relevância para Personas */}
            <Card className="border-2 border-orange-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-100 to-orange-200 border-b border-orange-300">
                <CardTitle className="text-orange-700 font-bold flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Relevância
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <Textarea
                  value={formData.personaRelevance}
                  onChange={(e) => setFormData(prev => ({ ...prev, personaRelevance: e.target.value }))}
                  placeholder="Por que este conteúdo é relevante para as personas selecionadas?"
                  className="border-orange-200 focus:border-orange-500 resize-y"
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Observações */}
            <Card className="border-2 border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-300">
                <CardTitle className="text-gray-700 font-bold">Observações</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Observações adicionais..."
                  className="border-gray-200 focus:border-gray-500 resize-y"
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Progresso e Ações */}
            <Card className="border-2 border-red-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-red-100 to-red-200 border-b border-red-300">
                <CardTitle className="text-red-700 font-bold">Ações</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {/* Indicador de Progresso */}
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
                  <p className="text-green-800 font-bold text-sm text-center mb-2">
                    Progresso do Rascunho: {draftProgress}/3
                  </p>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(draftProgress / 3) * 100}%` }}
                    />
                  </div>
                  {isWellDeveloped && (
                    <div className="flex items-center justify-center gap-2 mt-2 text-green-700">
                      <Sparkles className="h-4 w-4" />
                      <span className="text-xs font-bold">Pronto para transformar!</span>
                    </div>
                  )}
                </div>

                {/* Botão Transformar em Artigo - SEMPRE VISÍVEL */}
                <Button
                  onClick={handleTransform}
                  className={`w-full py-3 font-bold transition-all duration-300 ${
                    isWellDeveloped
                      ? 'bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-xl transform hover:scale-105'
                      : 'bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white shadow-lg'
                  }`}
                >
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Transformar em Artigo
                  <Sparkles className="h-5 w-5 ml-2" />
                </Button>

                {/* Botão Salvar Rascunho */}
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full border-red-300 text-red-600 hover:bg-red-50 font-bold"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      Salvando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Salvar Rascunho
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentIdeaDetailModal;
