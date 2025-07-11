
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload, Edit, Trash2, Eye, Tag, Image as ImageIcon } from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";

const mockPortfolioItems = [
  {
    id: 1,
    title: "Dragão Oriental",
    description: "Tatuagem em estilo oriental com detalhes em aquarela",
    image: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?w=400&h=400&fit=crop",
    category: "Oriental",
    tags: ["dragão", "aquarela", "colorido"],
    date: "2024-03-15",
    client: "Cliente Confidencial",
    duration: "8 horas",
    featured: true
  },
  {
    id: 2,
    title: "Mandala Geométrica",
    description: "Design geométrico com padrões mandala em blackwork",
    image: "https://images.unsplash.com/photo-1562962230-16e4623d36e7?w=400&h=400&fit=crop",
    category: "Blackwork",
    tags: ["mandala", "geométrico", "blackwork"],
    date: "2024-02-28",
    client: "Cliente Confidencial",
    duration: "6 horas",
    featured: false
  },
  {
    id: 3,
    title: "Leão Realista",
    description: "Retrato realista de leão com técnicas de sombreamento avançadas",
    image: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=400&h=400&fit=crop",
    category: "Realismo",
    tags: ["leão", "realismo", "animal"],
    date: "2024-01-20",
    client: "Cliente Confidencial",
    duration: "10 horas",
    featured: true
  }
];

const TattooArtistsPortfolioManagement = () => {
  const [portfolioItems, setPortfolioItems] = useState(mockPortfolioItems);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const categories = ["Todos", "Oriental", "Blackwork", "Realismo", "Aquarela", "Tradicional"];

  const handleAddNew = () => {
    setShowAddForm(true);
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    setPortfolioItems(portfolioItems.filter(item => item.id !== id));
  };

  const toggleFeatured = (id) => {
    setPortfolioItems(portfolioItems.map(item => 
      item.id === id ? { ...item, featured: !item.featured } : item
    ));
  };

  return (
    <TattooArtistLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-16">
          <h1 className="text-5xl font-bold mb-6">
            Gestão de
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600"> Portfólio</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Gerencie seu portfólio profissional e mostre seus melhores trabalhos
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">{portfolioItems.length}</div>
              <div className="text-gray-300">Total de Trabalhos</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">
                {portfolioItems.filter(item => item.featured).length}
              </div>
              <div className="text-gray-300">Em Destaque</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {new Set(portfolioItems.map(item => item.category)).size}
              </div>
              <div className="text-gray-300">Categorias</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">95%</div>
              <div className="text-gray-300">Taxa Aprovação</div>
            </CardContent>
          </Card>
        </div>

        {/* Botão Adicionar */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Meus Trabalhos</h2>
          <Button 
            onClick={handleAddNew}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Trabalho
          </Button>
        </div>

        {/* Formulário de Adição/Edição */}
        {showAddForm && (
          <Card className="bg-white/95 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle>{editingItem ? 'Editar Trabalho' : 'Adicionar Novo Trabalho'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Título</label>
                  <Input placeholder="Nome do trabalho" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Categoria</label>
                  <select className="w-full p-2 border rounded-md">
                    {categories.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <Textarea placeholder="Descreva o trabalho..." />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Duração</label>
                  <Input placeholder="Ex: 6 horas" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <Input placeholder="Separadas por vírgula" />
                </div>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-2">Clique para fazer upload da imagem</p>
                <p className="text-sm text-gray-500">PNG, JPG até 10MB</p>
              </div>
              
              <div className="flex gap-4">
                <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                  {editingItem ? 'Salvar Alterações' : 'Adicionar Trabalho'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Grid de Portfólio */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item) => (
            <Card key={item.id} className="bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-4">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    {item.featured && (
                      <Badge className="bg-yellow-500 text-white">
                        Destaque
                      </Badge>
                    )}
                    <Badge className="bg-red-500 text-white">
                      {item.category}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg font-bold">{item.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="text-xs text-gray-500">
                    <strong>Data:</strong> {new Date(item.date).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="text-xs text-gray-500">
                    <strong>Duração:</strong> {item.duration}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    Ver
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => toggleFeatured(item.id)}
                    className={item.featured ? "text-yellow-500" : ""}
                  >
                    <Tag className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {portfolioItems.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="h-16 w-16 mx-auto mb-4 text-white/50" />
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum trabalho no portfólio</h3>
            <p className="text-gray-300 mb-4">Comece adicionando seus melhores trabalhos</p>
            <Button 
              onClick={handleAddNew}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Trabalho
            </Button>
          </div>
        )}
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistsPortfolioManagement;
