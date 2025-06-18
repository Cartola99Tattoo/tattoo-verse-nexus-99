
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { TattooArtistPortfolioItem } from '@/services/interfaces/ITattooArtistService';
import { useDataQuery } from '@/hooks/useDataQuery';
import { getTattooArtistService } from '@/services/serviceFactory';

const portfolioCategories = [
  'Trabalho Original',
  'Cover Up', 
  'Retoque',
  'Sessão Única',
  'Projeto Longo',
  'Colaboração'
];

const tattooStyles = [
  'Realismo', 'Old School', 'New School', 'Aquarela', 'Geométrico',
  'Minimalista', 'Blackwork', 'Dotwork', 'Ornamental', 'Oriental', 'Fineline'
];

interface TattooArtistPortfolioProps {
  artistId: string;
  readOnly?: boolean;
}

const TattooArtistPortfolio = ({ artistId, readOnly = false }: TattooArtistPortfolioProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TattooArtistPortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    image_url: '',
    title: '',
    description: '',
    style: '',
    category: '',
    completion_date: '',
    client_name: '',
    session_duration: '',
    tags: ''
  });

  const { data: portfolioItems = [], loading, refresh } = useDataQuery(
    () => getTattooArtistService().getPortfolioItems(artistId),
    [artistId]
  );

  const handleSubmit = async () => {
    if (!formData.image_url || !formData.title || !formData.style) return;

    try {
      const itemData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };

      if (editingItem) {
        await getTattooArtistService().updatePortfolioItem(editingItem.id, itemData);
      } else {
        await getTattooArtistService().createPortfolioItem(artistId, itemData);
      }

      resetForm();
      refresh();
    } catch (error) {
      console.error('Erro ao salvar item do portfólio:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      image_url: '',
      title: '',
      description: '',
      style: '',
      category: '',
      completion_date: '',
      client_name: '',
      session_duration: '',
      tags: ''
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: TattooArtistPortfolioItem) => {
    setFormData({
      image_url: item.image_url,
      title: item.title,
      description: item.description,
      style: item.style,
      category: item.category,
      completion_date: item.completion_date,
      client_name: item.client_name || '',
      session_duration: item.session_duration || '',
      tags: item.tags?.join(', ') || ''
    });
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este trabalho?')) {
      try {
        await getTattooArtistService().deletePortfolioItem(id);
        refresh();
      } catch (error) {
        console.error('Erro ao deletar item:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="bg-gray-100 animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between text-xl font-black">
          <div className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Meu Portfólio
          </div>
          {!readOnly && (
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Trabalho
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {portfolioItems.length === 0 ? (
          <div className="text-center py-12">
            <Image className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Portfólio vazio</h3>
            <p className="text-gray-600 mb-4">Adicione seus trabalhos para showcasear seu talento</p>
            {!readOnly && (
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Trabalho
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg border border-red-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="relative overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {!readOnly && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => window.open(item.image_url, '_blank')}
                          className="bg-white/90 hover:bg-white border-none shadow-lg"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleEdit(item)}
                          className="bg-white/90 hover:bg-white border-none shadow-lg"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleDelete(item.id)}
                          className="bg-white/90 hover:bg-white border-none shadow-lg text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800 truncate">{item.title}</h4>
                    <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white font-medium text-xs">
                      {item.style}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                    <span>{item.category}</span>
                    <span>{new Date(item.completion_date).toLocaleDateString()}</span>
                  </div>
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dialog para adicionar/editar item */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl bg-gradient-to-br from-white to-red-50 border-red-200">
            <DialogHeader className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-6 rounded-lg -mx-6 -mt-6 mb-6">
              <DialogTitle className="text-xl font-black">
                {editingItem ? 'Editar Trabalho' : 'Adicionar Novo Trabalho'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-red-800 font-bold">Título do Trabalho</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Tatuagem de Leão Realista"
                    className="border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  />
                </div>
                <div>
                  <Label className="text-red-800 font-bold">Estilo</Label>
                  <Select value={formData.style} onValueChange={(value) => setFormData({ ...formData, style: value })}>
                    <SelectTrigger className="border-red-200 focus:border-red-500">
                      <SelectValue placeholder="Selecione o estilo" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-red-200 shadow-xl">
                      {tattooStyles.map((style) => (
                        <SelectItem key={style} value={style}>{style}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-red-800 font-bold">URL da Imagem</Label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                />
              </div>

              <div>
                <Label className="text-red-800 font-bold">Descrição do Trabalho</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva os detalhes, técnica utilizada, inspiração..."
                  className="border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-red-800 font-bold">Categoria</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="border-red-200 focus:border-red-500">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-red-200 shadow-xl">
                      {portfolioCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-red-800 font-bold">Data de Conclusão</Label>
                  <Input
                    type="date"
                    value={formData.completion_date}
                    onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
                    className="border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  />
                </div>
                <div>
                  <Label className="text-red-800 font-bold">Duração da Sessão</Label>
                  <Input
                    value={formData.session_duration}
                    onChange={(e) => setFormData({ ...formData, session_duration: e.target.value })}
                    placeholder="Ex: 4 horas"
                    className="border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  />
                </div>
              </div>

              <div>
                <Label className="text-red-800 font-bold">Tags (separadas por vírgula)</Label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Ex: realismo, preto-cinza, animal"
                  className="border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-red-200">
                <Button variant="outline" onClick={resetForm} className="border-gray-300 text-gray-700">
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.image_url || !formData.title || !formData.style}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold"
                >
                  {editingItem ? 'Atualizar' : 'Adicionar'} Trabalho
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TattooArtistPortfolio;
