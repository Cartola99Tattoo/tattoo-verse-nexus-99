
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, FileText, Users, Target, Tag, Sparkles, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { BlogCategory } from '@/services/interfaces/IBlogService';
import { Persona } from '@/types/persona';
import { toast } from '@/hooks/use-toast';

interface BlogPostFormProps {
  post?: any;
  categories: BlogCategory[];
  personas?: Persona[];
  initialData?: {
    title?: string;
    excerpt?: string;
    content?: string;
    focusPersonas?: string[];
    purchaseStage?: string;
    // Novos campos vindos do rascunho
    titles?: string[];
    seoKeywords?: string[];
    provisionalSlug?: string;
    suggestedAuthor?: string;
    featuredImageUrl?: string;
    internalLinks?: string[];
    suggestedCTA?: string;
  };
  onSave: () => void;
  onCancel: () => void;
}

const PURCHASE_STAGES = [
  'Aprendizado e Descoberta',
  'Reconhecimento do Problema', 
  'Consideração da Solução',
  'Decisão de Compra'
];

const BlogPostForm = ({ 
  post, 
  categories, 
  personas = [], 
  initialData,
  onSave, 
  onCancel 
}: BlogPostFormProps) => {
  const [formData, setFormData] = useState({
    // Campos principais do artigo
    title: initialData?.title || initialData?.titles?.[0] || post?.title || '',
    excerpt: initialData?.excerpt || post?.excerpt || '',
    content: initialData?.content || post?.content || '',
    categoryId: post?.blog_categories?.id || categories[0]?.id || '',
    slug: initialData?.provisionalSlug || post?.slug || '',
    
    // Tags estratégicas
    focusPersonas: initialData?.focusPersonas || [],
    purchaseStages: initialData?.purchaseStage ? [initialData.purchaseStage] : [],
    
    // SEO e metadados
    focusKeyword: initialData?.seoKeywords?.[0] || '',
    metaDescription: '',
    seoKeywords: initialData?.seoKeywords || [''],
    
    // Campos adicionais vindos do rascunho
    alternativeTitles: initialData?.titles?.slice(1) || [],
    author: initialData?.suggestedAuthor || 'Equipe 99Tattoo',
    featuredImageUrl: initialData?.featuredImageUrl || '',
    internalLinks: initialData?.internalLinks || [''],
    callToAction: initialData?.suggestedCTA || '',
  });

  const [isLoading, setIsLoading] = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !post && !initialData?.provisionalSlug) {
      const slug = formData.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, post, initialData?.provisionalSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Sucesso!",
        description: post ? "Artigo atualizado com sucesso!" : "Artigo criado com sucesso!",
      });
      
      onSave();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar artigo. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonaChange = (personaId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      focusPersonas: checked 
        ? [...prev.focusPersonas, personaId]
        : prev.focusPersonas.filter(id => id !== personaId)
    }));
  };

  const handleStageChange = (stage: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      purchaseStages: checked 
        ? [...prev.purchaseStages, stage]
        : prev.purchaseStages.filter(s => s !== stage)
    }));
  };

  // Funções auxiliares para campos de array
  const addSeoKeyword = () => {
    setFormData(prev => ({
      ...prev,
      seoKeywords: [...prev.seoKeywords, '']
    }));
  };

  const removeSeoKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      seoKeywords: prev.seoKeywords.filter((_, i) => i !== index)
    }));
  };

  const updateSeoKeyword = (index: number, value: string) => {
    const newKeywords = [...formData.seoKeywords];
    newKeywords[index] = value;
    setFormData(prev => ({ ...prev, seoKeywords: newKeywords }));
  };

  const addInternalLink = () => {
    setFormData(prev => ({
      ...prev,
      internalLinks: [...prev.internalLinks, '']
    }));
  };

  const removeInternalLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      internalLinks: prev.internalLinks.filter((_, i) => i !== index)
    }));
  };

  const updateInternalLink = (index: number, value: string) => {
    const newLinks = [...formData.internalLinks];
    newLinks[index] = value;
    setFormData(prev => ({ ...prev, internalLinks: newLinks }));
  };

  const isFormValid = formData.title && formData.content && formData.excerpt;
  const hasStrategicTags = formData.focusPersonas.length > 0 || formData.purchaseStages.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50 to-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={onCancel}
            className="mb-6 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-500 shadow-lg font-bold"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Centro de Produção
          </Button>
          
          <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-8 rounded-2xl shadow-2xl">
            <h1 className="text-4xl font-black mb-2 flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full">
                <FileText className="h-8 w-8" />
              </div>
              {post ? 'Editar Artigo do Blog' : 'Criar Novo Artigo'}
            </h1>
            <p className="text-red-100 text-lg font-medium">
              {initialData?.titles?.[0] ? `Transformando rascunho: "${initialData.titles[0]}"` : 'Configure todas as informações do seu artigo'}
            </p>
            {initialData && (
              <div className="mt-4 bg-white/20 p-4 rounded-lg">
                <p className="text-red-100 font-bold">✨ Dados importados do rascunho:</p>
                <ul className="text-red-200 text-sm mt-2 space-y-1">
                  {initialData.titles && <li>• {initialData.titles.length} título(s) sugerido(s)</li>}
                  {initialData.seoKeywords && <li>• {initialData.seoKeywords.filter(Boolean).length} palavra(s)-chave SEO</li>}
                  {initialData.internalLinks && <li>• {initialData.internalLinks.filter(Boolean).length} link(s) interno(s)</li>}
                  {initialData.suggestedCTA && <li>• Call to Action sugerido</li>}
                </ul>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Coluna Principal - Conteúdo (2/3) */}
          <div className="xl:col-span-2 space-y-8">
            {/* Informações Básicas do Artigo */}
            <Card className="bg-white border-4 border-red-200 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6">
                <CardTitle className="text-2xl font-black flex items-center gap-3">
                  <FileText className="h-6 w-6" />
                  Conteúdo Principal
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div>
                  <Label htmlFor="title" className="text-red-700 font-black text-lg mb-3 block">
                    Título do Artigo *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Digite o título do artigo..."
                    className="border-red-200 focus:border-red-500 shadow-lg text-xl py-4 font-medium"
                    required
                  />
                  
                  {/* Títulos alternativos do rascunho */}
                  {formData.alternativeTitles.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                      <Label className="text-blue-700 font-bold text-sm mb-2 block">
                        📝 Outras ideias de título do rascunho:
                      </Label>
                      <div className="space-y-2">
                        {formData.alternativeTitles.map((altTitle, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-blue-600 text-sm font-medium">• {altTitle}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setFormData(prev => ({ ...prev, title: altTitle }))}
                              className="text-xs border-blue-300 text-blue-600 hover:bg-blue-100"
                            >
                              Usar este
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="slug" className="text-red-700 font-black text-lg mb-3 block">
                    Slug (URL) *
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="url-do-artigo"
                    className="border-red-200 focus:border-red-500 shadow-lg font-mono"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt" className="text-red-700 font-black text-lg mb-3 block">
                    Resumo/Introdução *
                  </Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Escreva um resumo atrativo do artigo..."
                    className="border-red-200 focus:border-red-500 shadow-lg resize-y font-medium"
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content" className="text-red-700 font-black text-lg mb-3 block">
                    Conteúdo Completo *
                  </Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Escreva o conteúdo completo do artigo..."
                    className="border-red-200 focus:border-red-500 shadow-lg resize-y font-medium"
                    rows={20}
                    required
                  />
                </div>

                {/* Call to Action */}
                {formData.callToAction && (
                  <div>
                    <Label htmlFor="callToAction" className="text-red-700 font-black text-lg mb-3 block">
                      Call to Action
                    </Label>
                    <Textarea
                      id="callToAction"
                      value={formData.callToAction}
                      onChange={(e) => setFormData(prev => ({ ...prev, callToAction: e.target.value }))}
                      placeholder="Call to Action do artigo..."
                      className="border-red-200 focus:border-red-500 shadow-lg resize-y font-medium"
                      rows={3}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SEO e Metadados Expandidos */}
            <Card className="bg-white border-4 border-blue-200 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
                <CardTitle className="text-2xl font-black flex items-center gap-3">
                  <Tag className="h-6 w-6" />
                  SEO e Metadados Avançados
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div>
                  <Label htmlFor="focusKeyword" className="text-blue-700 font-black text-lg mb-3 block">
                    Palavra-chave Foco Principal
                  </Label>
                  <Input
                    id="focusKeyword"
                    value={formData.focusKeyword}
                    onChange={(e) => setFormData(prev => ({ ...prev, focusKeyword: e.target.value }))}
                    placeholder="Ex: tatuagem realista, cuidados com tatuagem..."
                    className="border-blue-200 focus:border-blue-500 shadow-lg"
                  />
                </div>

                {/* Múltiplas palavras-chave SEO */}
                <div>
                  <Label className="text-blue-700 font-black text-lg mb-3 block">
                    Palavras-chave SEO Adicionais
                  </Label>
                  <div className="space-y-3">
                    {formData.seoKeywords.map((keyword, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          value={keyword}
                          onChange={(e) => updateSeoKeyword(index, e.target.value)}
                          placeholder={`Palavra-chave ${index + 1}...`}
                          className="border-blue-200 focus:border-blue-500 shadow-sm"
                        />
                        {formData.seoKeywords.length > 1 && (
                          <Button
                            type="button"
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
                      type="button"
                      onClick={addSeoKeyword}
                      variant="outline"
                      size="sm"
                      className="border-blue-300 text-blue-600 hover:bg-blue-50"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Palavra-chave
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="metaDescription" className="text-blue-700 font-black text-lg mb-3 block">
                    Meta Descrição
                  </Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                    placeholder="Descrição que aparecerá nos resultados de busca..."
                    className="border-blue-200 focus:border-blue-500 shadow-lg resize-y"
                    rows={3}
                    maxLength={160}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    {formData.metaDescription.length}/160 caracteres
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="category" className="text-blue-700 font-black text-lg mb-3 block">
                      Categoria
                    </Label>
                    <select
                      id="category"
                      value={formData.categoryId}
                      onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                      className="w-full px-4 py-3 border-blue-200 border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-lg font-medium"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="author" className="text-blue-700 font-black text-lg mb-3 block">
                      Autor
                    </Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                      placeholder="Nome do autor..."
                      className="border-blue-200 focus:border-blue-500 shadow-lg"
                    />
                  </div>
                </div>

                {/* Links internos */}
                {formData.internalLinks.some(Boolean) && (
                  <div>
                    <Label className="text-blue-700 font-black text-lg mb-3 block">
                      Links Internos Sugeridos
                    </Label>
                    <div className="space-y-3">
                      {formData.internalLinks.map((link, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input
                            value={link}
                            onChange={(e) => updateInternalLink(index, e.target.value)}
                            placeholder={`Link interno ${index + 1}...`}
                            className="border-blue-200 focus:border-blue-500 shadow-sm"
                          />
                          {formData.internalLinks.length > 1 && (
                            <Button
                              type="button"
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
                        type="button"
                        onClick={addInternalLink}
                        variant="outline"
                        size="sm"
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Link Interno
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Coluna Lateral - Tags Estratégicas (1/3) */}
          <div className="space-y-8">
            {/* Indicador de Tags Estratégicas */}
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-4 border-purple-300 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6">
                <CardTitle className="text-xl font-black flex items-center gap-3">
                  <Sparkles className="h-6 w-6" />
                  Tags Estratégicas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-purple-800 font-bold text-lg">Status da Configuração</span>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${
                    hasStrategicTags 
                      ? 'bg-green-100 border-green-400 text-green-800' 
                      : 'bg-yellow-100 border-yellow-400 text-yellow-800'
                  }`}>
                    {hasStrategicTags ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="font-bold">Configurado</span>
                      </>
                    ) : (
                      <>
                        <Target className="h-4 w-4" />
                        <span className="font-bold">Pendente</span>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-purple-700 font-medium text-center">
                  {hasStrategicTags 
                    ? '🎯 Ótimo! Suas tags estratégicas ajudarão na análise de performance.'
                    : '⚠️ Configure as tags para análise estratégica futura.'
                  }
                </p>
              </CardContent>
            </Card>

            {/* Personas Foco */}
            <Card className="bg-white border-4 border-green-200 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6">
                <CardTitle className="text-xl font-black flex items-center gap-3">
                  <Users className="h-6 w-6" />
                  Personas Foco
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-800 font-bold text-sm text-center">
                    🎯 Selecione as personas que este artigo deve atingir para análise futura
                  </p>
                </div>
                
                {personas.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="font-medium">Nenhuma persona cadastrada</p>
                    <p className="text-sm">Configure personas na aba correspondente</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {personas.map(persona => (
                      <div 
                        key={persona.id} 
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-300 ${
                          formData.focusPersonas.includes(persona.id)
                            ? 'bg-green-100 border-green-400 shadow-lg'
                            : 'bg-gray-50 border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <Checkbox
                          id={`persona-${persona.id}`}
                          checked={formData.focusPersonas.includes(persona.id)}
                          onCheckedChange={(checked) => 
                            handlePersonaChange(persona.id, checked as boolean)
                          }
                          className="border-2 border-green-500"
                        />
                        <Label 
                          htmlFor={`persona-${persona.id}`} 
                          className="flex-1 font-bold text-gray-800 cursor-pointer"
                        >
                          {persona.name}
                        </Label>
                        {formData.focusPersonas.includes(persona.id) && (
                          <Badge className="bg-green-600 text-white font-bold">
                            Selecionada
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Estágios da Jornada */}
            <Card className="bg-white border-4 border-orange-200 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-800 text-white p-6">
                <CardTitle className="text-xl font-black flex items-center gap-3">
                  <Target className="h-6 w-6" />
                  Jornada de Compra
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 mb-4">
                  <p className="text-orange-800 font-bold text-sm text-center">
                    🚀 Marque os estágios da jornada que este artigo deve impactar
                  </p>
                </div>
                
                <div className="space-y-3">
                  {PURCHASE_STAGES.map(stage => (
                    <div 
                      key={stage} 
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-300 ${
                        formData.purchaseStages.includes(stage)
                          ? 'bg-orange-100 border-orange-400 shadow-lg'
                          : 'bg-gray-50 border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <Checkbox
                        id={`stage-${stage}`}
                        checked={formData.purchaseStages.includes(stage)}
                        onCheckedChange={(checked) => 
                          handleStageChange(stage, checked as boolean)
                        }
                        className="border-2 border-orange-500"
                      />
                      <Label 
                        htmlFor={`stage-${stage}`} 
                        className="flex-1 font-bold text-gray-800 cursor-pointer"
                      >
                        {stage}
                      </Label>
                      {formData.purchaseStages.includes(stage) && (
                        <Badge className="bg-orange-600 text-white font-bold">
                          Selecionado
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Botão de Publicação */}
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-4 border-red-300 shadow-2xl">
              <CardContent className="p-6">
                <Button
                  type="submit"
                  disabled={!isFormValid || isLoading}
                  className={`w-full py-6 text-xl font-black transition-all duration-300 ${
                    isFormValid 
                      ? 'bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white shadow-2xl transform hover:scale-105' 
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Salvando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Save className="h-6 w-6" />
                      {post ? 'Atualizar Artigo' : 'Publicar Artigo'}
                      <Sparkles className="h-6 w-6" />
                    </div>
                  )}
                </Button>
                
                {!isFormValid && (
                  <p className="text-red-600 text-center mt-3 font-bold">
                    ⚠️ Preencha todos os campos obrigatórios (*)
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogPostForm;
