
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
  PenTool,
  Upload,
  CheckCircle2
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

const MOCK_AUTHORS = [
  'Mariana Silva', 'Rafael Costa', 'Juliana Mendes', 'Carlos Fernandes', 
  'Ana Paula', 'Bruno Santos', 'Equipe 99Tattoo'
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
  const [imagePreview, setImagePreview] = useState<string>('');

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

  // Set image preview
  useEffect(() => {
    if (formData.featuredImageUrl) {
      setImagePreview(formData.featuredImageUrl);
    }
  }, [formData.featuredImageUrl]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      onUpdate(idea, formData);
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
    const updatedIdea = { ...idea, ...formData, updated_at: new Date().toISOString() };
    toast({
      title: "Transformando em Artigo!",
      description: "Redirecionando para criação do artigo..."
    });
    onTransformToArticle(updatedIdea);
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

  // Funções auxiliares para campos de array
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
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-white via-red-50 to-gray-50 border-4 border-red-200 shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-t-lg -m-6 mb-6 shadow-xl">
          <DialogTitle className="text-3xl font-black flex items-center gap-3">
            <PenTool className="h-8 w-8" />
            Centro de Rascunhos - Desenvolva sua Ideia
          </DialogTitle>
          <p className="text-red-100 font-medium text-lg">
            Complete os campos para desenvolver um rascunho detalhado do seu artigo
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Coluna Principal - Rascunho de Artigo (3/4) */}
          <div className="xl:col-span-3 space-y-8">
            {/* Informações Básicas */}
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
              </CardContent>
            </Card>

            {/* Rascunho de Conteúdo */}
            <Card className="border-4 border-green-200 shadow-xl bg-gradient-to-br from-white to-green-50">
              <CardHeader className="bg-gradient-to-r from-green-100 to-green-200 border-b-4 border-green-300">
                <CardTitle className="text-green-700 font-black text-xl flex items-center gap-3">
                  <PenTool className="h-6 w-6" />
                  Desenvolvimento do Rascunho de Artigo
                  <Badge className={`ml-auto text-lg px-4 py-2 ${isWellDeveloped ? 'bg-green-600' : 'bg-yellow-500'} text-white shadow-lg`}>
                    {draftProgress}/3 Completo
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {/* Múltiplas Ideias de Título */}
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

                {/* Resumo do Artigo */}
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

                {/* Conteúdo do Artigo */}
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

            {/* SEO e Metadados */}
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

                {/* Palavras-chave SEO */}
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

                {/* Imagem Destacada */}
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

                {/* Links Internos */}
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

          {/* Coluna Lateral - Personas e Ações (1/4) */}
          <div className="space-y-8">
            {/* Personas Foco */}
            <Card className="border-4 border-purple-200 shadow-xl bg-gradient-to-br from-white to-purple-50">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-200 border-b-4 border-purple-300">
                <CardTitle className="text-purple-700 font-black text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Personas Foco
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
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
            <Card className="border-4 border-orange-200 shadow-xl bg-gradient-to-br from-white to-orange-50">
              <CardHeader className="bg-gradient-to-r from-orange-100 to-orange-200 border-b-4 border-orange-300">
                <CardTitle className="text-orange-700 font-black text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Relevância
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Textarea
                  value={formData.personaRelevance}
                  onChange={(e) => setFormData(prev => ({ ...prev, personaRelevance: e.target.value }))}
                  placeholder="Por que este conteúdo é relevante para as personas selecionadas?"
                  className="border-2 border-orange-200 focus:border-orange-500 resize-y text-lg p-4"
                  rows={5}
                />
              </CardContent>
            </Card>

            {/* Observações */}
            <Card className="border-4 border-gray-200 shadow-xl bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-200 border-b-4 border-gray-300">
                <CardTitle className="text-gray-700 font-black text-lg">Observações</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Observações adicionais..."
                  className="border-2 border-gray-200 focus:border-gray-500 resize-y text-lg p-4"
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Progresso e Ações */}
            <Card className="border-4 border-red-200 shadow-xl bg-gradient-to-br from-white to-red-50">
              <CardHeader className="bg-gradient-to-r from-red-100 to-red-200 border-b-4 border-red-300">
                <CardTitle className="text-red-700 font-black text-lg">Ações</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Indicador de Progresso */}
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

                {/* Botão Transformar em Artigo - SEMPRE VISÍVEL */}
                <Button
                  onClick={handleTransform}
                  className="w-full py-4 font-black text-lg transition-all duration-300 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-xl transform hover:scale-105 border-2 border-red-400"
                >
                  <ArrowRight className="h-6 w-6 mr-2" />
                  Transformar em Artigo
                  <Sparkles className="h-6 w-6 ml-2" />
                </Button>

                {/* Botão Salvar Rascunho */}
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentIdeaDetailModal;
