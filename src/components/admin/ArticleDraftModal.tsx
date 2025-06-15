
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Save, 
  ArrowRight, 
  Plus, 
  Trash2, 
  FileText, 
  Tag, 
  Image,
  Link,
  Sparkles,
  PenTool,
  Upload,
  X
} from 'lucide-react';
import { ContentIdea, CreateContentIdeaData } from '@/types/contentIdea';
import { toast } from '@/hooks/use-toast';

interface ArticleDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateContentIdeaData) => void;
  onTransformToArticle: (data: CreateContentIdeaData) => void;
  editingIdea?: ContentIdea | null;
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

const MOCK_AUTHORS = [
  'Mariana Silva', 'Rafael Costa', 'Juliana Mendes', 'Carlos Fernandes', 
  'Ana Paula', 'Bruno Santos', 'Equipe 99Tattoo'
];

const ArticleDraftModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onTransformToArticle,
  editingIdea 
}: ArticleDraftModalProps) => {
  const [formData, setFormData] = useState<CreateContentIdeaData>({
    theme: '',
    format: 'Blog Post',
    purchaseStage: 'Aprendizado e Descoberta',
    focusPersonas: [],
    personaRelevance: '',
    focusKeyword: '',
    status: 'Ideia',
    notes: '',
    ideaCreator: '',
    draftTitles: [''],
    draftSummary: '',
    draftContent: '',
    seoKeywords: [''],
    provisionalSlug: '',
    suggestedAuthor: '',
    featuredImageUrl: '',
    internalLinks: [''],
    suggestedCTA: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Initialize form with editing data
  useEffect(() => {
    if (editingIdea) {
      setFormData({
        theme: editingIdea.theme,
        format: editingIdea.format,
        purchaseStage: editingIdea.purchaseStage,
        focusPersonas: editingIdea.focusPersonas,
        personaRelevance: editingIdea.personaRelevance,
        focusKeyword: editingIdea.focusKeyword,
        status: editingIdea.status,
        notes: editingIdea.notes,
        ideaCreator: editingIdea.ideaCreator,
        draftTitles: editingIdea.draftTitles || [''],
        draftSummary: editingIdea.draftSummary || '',
        draftContent: editingIdea.draftContent || '',
        seoKeywords: editingIdea.seoKeywords || [''],
        provisionalSlug: editingIdea.provisionalSlug || '',
        suggestedAuthor: editingIdea.suggestedAuthor || '',
        featuredImageUrl: editingIdea.featuredImageUrl || '',
        internalLinks: editingIdea.internalLinks || [''],
        suggestedCTA: editingIdea.suggestedCTA || ''
      });
      setImagePreview(editingIdea.featuredImageUrl || '');
    } else {
      // Reset form for new idea
      setFormData({
        theme: '',
        format: 'Blog Post',
        purchaseStage: 'Aprendizado e Descoberta',
        focusPersonas: [],
        personaRelevance: '',
        focusKeyword: '',
        status: 'Ideia',
        notes: '',
        ideaCreator: '',
        draftTitles: [''],
        draftSummary: '',
        draftContent: '',
        seoKeywords: [''],
        provisionalSlug: '',
        suggestedAuthor: '',
        featuredImageUrl: '',
        internalLinks: [''],
        suggestedCTA: ''
      });
      setImagePreview('');
    }
  }, [editingIdea, isOpen]);

  // Auto-generate slug from first title
  useEffect(() => {
    if (formData.draftTitles[0] && !editingIdea?.provisionalSlug) {
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
  }, [formData.draftTitles, editingIdea?.provisionalSlug]);

  const handleSave = async () => {
    if (!formData.theme.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um tema para o conteúdo",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      onSave(formData);
      toast({
        title: "Rascunho Salvo!",
        description: "Todos os dados do rascunho foram salvos com sucesso!"
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
    if (!formData.theme.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um tema antes de transformar em artigo",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Transformando em Artigo!",
      description: "Redirecionando para criação do artigo..."
    });
    onTransformToArticle(formData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setImagePreview(imageUrl);
        setFormData(prev => ({ ...prev, featuredImageUrl: imageUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper functions for array fields
  const addTitle = () => {
    setFormData(prev => ({
      ...prev,
      draftTitles: [...prev.draftTitles!, '']
    }));
  };

  const removeTitle = (index: number) => {
    if (formData.draftTitles!.length > 1) {
      setFormData(prev => ({
        ...prev,
        draftTitles: prev.draftTitles!.filter((_, i) => i !== index)
      }));
    }
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
    if (formData.seoKeywords!.length > 1) {
      setFormData(prev => ({
        ...prev,
        seoKeywords: prev.seoKeywords!.filter((_, i) => i !== index)
      }));
    }
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
    if (formData.internalLinks!.length > 1) {
      setFormData(prev => ({
        ...prev,
        internalLinks: prev.internalLinks!.filter((_, i) => i !== index)
      }));
    }
  };

  const updateLink = (index: number, value: string) => {
    const newLinks = [...formData.internalLinks!];
    newLinks[index] = value;
    setFormData(prev => ({ ...prev, internalLinks: newLinks }));
  };

  // Calculate draft progress
  const draftProgress = [
    formData.draftTitles?.some(Boolean),
    formData.draftSummary,
    formData.draftContent
  ].filter(Boolean).length;

  const isWellDeveloped = draftProgress >= 2;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-white via-red-50 to-gray-50 border-4 border-red-200 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-t-lg -m-6 mb-6 shadow-xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-red-700 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <DialogTitle className="text-3xl font-black flex items-center gap-3">
            <PenTool className="h-8 w-8" />
            {editingIdea ? 'Editar Rascunho de Artigo' : 'Novo Rascunho de Artigo'}
          </DialogTitle>
          <p className="text-red-100 font-medium text-lg">
            Desenvolva seu rascunho completo antes de transformá-lo em artigo
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content - 2/3 */}
          <div className="xl:col-span-2 space-y-8">
            {/* Basic Information */}
            <Card className="border-4 border-red-200 shadow-xl bg-gradient-to-br from-white to-red-50">
              <CardHeader className="bg-gradient-to-r from-red-100 to-red-200 border-b-4 border-red-300">
                <CardTitle className="text-red-700 font-black text-xl flex items-center gap-3">
                  <FileText className="h-6 w-6" />
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div>
                  <Label htmlFor="theme" className="text-red-700 font-bold text-lg mb-2 block">Tema/Assunto *</Label>
                  <Input
                    id="theme"
                    value={formData.theme}
                    onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                    className="border-2 border-red-200 focus:border-red-500 text-lg p-4"
                    placeholder="Ex: Guia completo de cuidados com tatuagem..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-red-700 font-bold text-lg mb-2 block">Formato</Label>
                    <select
                      value={formData.format}
                      onChange={(e) => setFormData(prev => ({ ...prev, format: e.target.value as any }))}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-md focus:border-red-500 focus:ring-2 focus:ring-red-200 text-lg"
                    >
                      {FORMATS.map(format => (
                        <option key={format} value={format}>{format}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label className="text-red-700 font-bold text-lg mb-2 block">Status</Label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-md focus:border-red-500 focus:ring-2 focus:ring-red-200 text-lg"
                    >
                      {STATUS_OPTIONS.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label className="text-red-700 font-bold text-lg mb-2 block">Estágio da Jornada de Compra</Label>
                  <select
                    value={formData.purchaseStage}
                    onChange={(e) => setFormData(prev => ({ ...prev, purchaseStage: e.target.value as any }))}
                    className="w-full px-4 py-3 border-2 border-red-200 rounded-md focus:border-red-500 focus:ring-2 focus:ring-red-200 text-lg"
                  >
                    {PURCHASE_STAGES.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="ideaCreator" className="text-red-700 font-bold text-lg mb-2 block">Criador da Ideia</Label>
                  <Input
                    id="ideaCreator"
                    value={formData.ideaCreator}
                    onChange={(e) => setFormData(prev => ({ ...prev, ideaCreator: e.target.value }))}
                    className="border-2 border-red-200 focus:border-red-500 text-lg p-4"
                    placeholder="Seu nome..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Article Draft Content */}
            <Card className="border-4 border-green-200 shadow-xl bg-gradient-to-br from-white to-green-50">
              <CardHeader className="bg-gradient-to-r from-green-100 to-green-200 border-b-4 border-green-300">
                <CardTitle className="text-green-700 font-black text-xl flex items-center gap-3">
                  <PenTool className="h-6 w-6" />
                  Desenvolvimento do Rascunho de Artigo
                  <div className="ml-auto flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                    <span className="font-bold">{draftProgress}/3 Completo</span>
                    {isWellDeveloped && <Sparkles className="h-4 w-4" />}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Multiple Title Ideas */}
                <div>
                  <Label className="text-green-700 font-black text-xl mb-4 block">
                    Rascunho(s) de Título
                  </Label>
                  <div className="space-y-4">
                    {formData.draftTitles?.map((title, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <div className="flex-1">
                          <Input
                            value={title}
                            onChange={(e) => updateTitle(index, e.target.value)}
                            placeholder={`Ideia de título ${index + 1}...`}
                            className="border-2 border-green-200 focus:border-green-500 text-lg p-4"
                          />
                        </div>
                        {formData.draftTitles!.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeTitle(index)}
                            variant="outline"
                            size="sm"
                            className="border-2 border-red-300 text-red-600 hover:bg-red-50 p-3"
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
                      className="border-2 border-green-300 text-green-600 hover:bg-green-50 font-bold text-lg px-6 py-3"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Adicionar Outra Ideia de Título
                    </Button>
                  </div>
                </div>

                {/* Article Summary */}
                <div>
                  <Label htmlFor="draftSummary" className="text-green-700 font-black text-xl mb-4 block">
                    Resumo do Artigo (Rascunho)
                  </Label>
                  <Textarea
                    id="draftSummary"
                    value={formData.draftSummary}
                    onChange={(e) => setFormData(prev => ({ ...prev, draftSummary: e.target.value }))}
                    placeholder="Escreva um resumo/introdução detalhado do artigo..."
                    className="border-2 border-green-200 focus:border-green-500 resize-y text-lg p-4"
                    rows={6}
                  />
                </div>

                {/* Article Content */}
                <div>
                  <Label htmlFor="draftContent" className="text-green-700 font-black text-xl mb-4 block">
                    Conteúdo do Artigo (Rascunho)
                  </Label>
                  <Textarea
                    id="draftContent"
                    value={formData.draftContent}
                    onChange={(e) => setFormData(prev => ({ ...prev, draftContent: e.target.value }))}
                    placeholder="Desenvolva o conteúdo completo do artigo aqui... Inclua parágrafos, subtítulos, listas e todo o texto que deseja no artigo final."
                    className="border-2 border-green-200 focus:border-green-500 resize-y text-lg p-4"
                    rows={16}
                  />
                </div>
              </CardContent>
            </Card>

            {/* SEO and Metadata */}
            <Card className="border-4 border-blue-200 shadow-xl bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-200 border-b-4 border-blue-300">
                <CardTitle className="text-blue-700 font-black text-xl flex items-center gap-3">
                  <Tag className="h-6 w-6" />
                  SEO e Metadados
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div>
                  <Label htmlFor="focusKeyword" className="text-blue-700 font-bold text-lg mb-2 block">Palavra-chave Foco Principal</Label>
                  <Input
                    id="focusKeyword"
                    value={formData.focusKeyword}
                    onChange={(e) => setFormData(prev => ({ ...prev, focusKeyword: e.target.value }))}
                    placeholder="Ex: tatuagem realista, cuidados com tatuagem..."
                    className="border-2 border-blue-200 focus:border-blue-500 text-lg p-4"
                  />
                </div>

                {/* SEO Keywords */}
                <div>
                  <Label className="text-blue-700 font-bold text-lg mb-2 block">Palavras-chave Sugeridas para SEO</Label>
                  <div className="space-y-4">
                    {formData.seoKeywords?.map((keyword, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <div className="flex-1">
                          <Input
                            value={keyword}
                            onChange={(e) => updateKeyword(index, e.target.value)}
                            placeholder={`Palavra-chave ${index + 1}...`}
                            className="border-2 border-blue-200 focus:border-blue-500 text-lg p-4"
                          />
                        </div>
                        {formData.seoKeywords!.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeKeyword(index)}
                            variant="outline"
                            size="sm"
                            className="border-2 border-red-300 text-red-600 hover:bg-red-50 p-3"
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
                      className="border-2 border-blue-300 text-blue-600 hover:bg-blue-50 font-bold"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Palavra-chave
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="provisionalSlug" className="text-blue-700 font-bold text-lg mb-2 block">URL Provisória / Slug</Label>
                    <Input
                      id="provisionalSlug"
                      value={formData.provisionalSlug}
                      onChange={(e) => setFormData(prev => ({ ...prev, provisionalSlug: e.target.value }))}
                      placeholder="url-do-artigo"
                      className="border-2 border-blue-200 focus:border-blue-500 font-mono text-lg p-4"
                    />
                  </div>

                  <div>
                    <Label htmlFor="suggestedAuthor" className="text-blue-700 font-bold text-lg mb-2 block">Autor Sugerido</Label>
                    <select
                      id="suggestedAuthor"
                      value={formData.suggestedAuthor}
                      onChange={(e) => setFormData(prev => ({ ...prev, suggestedAuthor: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-lg"
                    >
                      <option value="">Selecione um autor...</option>
                      {MOCK_AUTHORS.map(author => (
                        <option key={author} value={author}>{author}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Featured Image */}
                <div>
                  <Label className="text-blue-700 font-bold text-lg mb-2 block flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Imagem Destacada (Rascunho)
                  </Label>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <Input
                        value={formData.featuredImageUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, featuredImageUrl: e.target.value }))}
                        placeholder="Cole a URL da imagem ou use o upload abaixo"
                        className="border-2 border-blue-200 focus:border-blue-500 text-lg p-4"
                      />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="border-2 border-blue-300 text-blue-600 hover:bg-blue-50 font-bold px-6 py-3"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Escolher Ficheiro
                        </Button>
                      </div>
                    </div>
                    {imagePreview && (
                      <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                        <img
                          src={imagePreview}
                          alt="Preview da imagem destacada"
                          className="max-w-full h-48 object-cover rounded-lg shadow-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Internal Links */}
                <div>
                  <Label className="text-blue-700 font-bold text-lg mb-2 block flex items-center gap-2">
                    <Link className="h-5 w-5" />
                    Links Internos Sugeridos
                  </Label>
                  <div className="space-y-4">
                    {formData.internalLinks?.map((link, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <div className="flex-1">
                          <Input
                            value={link}
                            onChange={(e) => updateLink(index, e.target.value)}
                            placeholder={`Link interno ${index + 1}...`}
                            className="border-2 border-blue-200 focus:border-blue-500 text-lg p-4"
                          />
                        </div>
                        {formData.internalLinks!.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeLink(index)}
                            variant="outline"
                            size="sm"
                            className="border-2 border-red-300 text-red-600 hover:bg-red-50 p-3"
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
                      className="border-2 border-blue-300 text-blue-600 hover:bg-blue-50 font-bold"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Link Interno
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="suggestedCTA" className="text-blue-700 font-bold text-lg mb-2 block">Call to Action (CTA) Sugerido</Label>
                  <Textarea
                    id="suggestedCTA"
                    value={formData.suggestedCTA}
                    onChange={(e) => setFormData(prev => ({ ...prev, suggestedCTA: e.target.value }))}
                    placeholder="Ex: Agende sua consulta hoje mesmo! Entre em contato conosco para transformar sua ideia em realidade."
                    className="border-2 border-blue-200 focus:border-blue-500 resize-y text-lg p-4"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 1/3 */}
          <div className="space-y-8">
            {/* Progress and Actions */}
            <Card className="border-4 border-red-200 shadow-xl bg-gradient-to-br from-white to-red-50">
              <CardHeader className="bg-gradient-to-r from-red-100 to-red-200 border-b-4 border-red-300">
                <CardTitle className="text-red-700 font-black text-lg">Ações</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Progress Indicator */}
                <div className="bg-green-50 border-4 border-green-200 rounded-lg p-4 shadow-lg">
                  <p className="text-green-800 font-black text-center mb-3">
                    Progresso do Rascunho: {draftProgress}/3
                  </p>
                  <div className="w-full bg-green-200 rounded-full h-3 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-700 h-3 rounded-full transition-all duration-500 shadow-lg"
                      style={{ width: `${(draftProgress / 3) * 100}%` }}
                    />
                  </div>
                  {isWellDeveloped && (
                    <div className="flex items-center justify-center gap-2 mt-3 text-green-700">
                      <Sparkles className="h-5 w-5" />
                      <span className="font-black">Pronto para transformar!</span>
                    </div>
                  )}
                </div>

                {/* Transform to Article Button - ALWAYS VISIBLE */}
                <Button
                  onClick={handleTransform}
                  className="w-full py-4 font-black text-lg transition-all duration-300 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-xl transform hover:scale-105 border-2 border-red-400"
                >
                  <ArrowRight className="h-6 w-6 mr-2" />
                  Transformar em Artigo
                  <Sparkles className="h-6 w-6 ml-2" />
                </Button>

                {/* Save Draft Button */}
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full py-4 border-2 border-red-300 text-red-600 hover:bg-red-50 font-black text-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                      Salvando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-5 w-5" />
                      Salvar Rascunho
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <Card className="border-4 border-gray-200 shadow-xl bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-200 border-b-4 border-gray-300">
                <CardTitle className="text-gray-700 font-black text-lg">Observações Adicionais</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Observações, ideias extras, referências..."
                  className="border-2 border-gray-200 focus:border-gray-500 resize-y text-lg p-4"
                  rows={6}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleDraftModal;
