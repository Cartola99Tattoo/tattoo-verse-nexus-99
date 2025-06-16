
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Image, Edit, Trash2, Eye, Search, Filter, Star } from "lucide-react";
import TatuadoresLayout from "@/components/layouts/TatuadoresLayout";

// Mock data para portfólio do tatuador
const mockPortfolioItems = [
  {
    id: "1",
    title: "Leão Realista",
    description: "Tatuagem realista de leão no braço, técnica de sombreamento avançada",
    style: "Realismo",
    bodyPart: "Braço",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&q=80",
    featured: true,
    createdAt: "2024-01-15",
    likes: 45,
    views: 230
  },
  {
    id: "2",
    title: "Mandala Geométrica",
    description: "Design geométrico inspirado em mandalas tradicionais",
    style: "Geométrico",
    bodyPart: "Costas",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80",
    featured: false,
    createdAt: "2024-01-10",
    likes: 32,
    views: 180
  },
  {
    id: "3",
    title: "Rosa Fineline",
    description: "Delicada rosa em técnica fineline no antebraço",
    style: "Fineline",
    bodyPart: "Antebraço",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&q=80",
    featured: true,
    createdAt: "2024-01-08",
    likes: 67,
    views: 310
  },
  {
    id: "4",
    title: "Borboleta Colorida",
    description: "Borboleta vibrante com cores intensas",
    style: "Colorido",
    bodyPart: "Ombro",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80",
    featured: false,
    createdAt: "2024-01-05",
    likes: 28,
    views: 150
  }
];

const styles = ["Todos", "Realismo", "Geométrico", "Fineline", "Colorido", "Blackwork", "Tradicional"];
const bodyParts = ["Braço", "Antebraço", "Ombro", "Costas", "Perna", "Peito", "Mão", "Pescoço"];

const Portfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState(mockPortfolioItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("Todos");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    style: "",
    bodyPart: "",
    image: ""
  });

  const filteredItems = portfolioItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStyle = selectedStyle === "Todos" || item.style === selectedStyle;
    
    return matchesSearch && matchesStyle;
  });

  const featuredItems = filteredItems.filter(item => item.featured);
  const regularItems = filteredItems.filter(item => !item.featured);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      // Editar item existente
      setPortfolioItems(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData }
          : item
      ));
    } else {
      // Adicionar novo item
      const newItem = {
        id: Date.now().toString(),
        ...formData,
        featured: false,
        createdAt: new Date().toISOString(),
        likes: 0,
        views: 0
      };
      setPortfolioItems(prev => [newItem, ...prev]);
    }
    
    handleCloseDialog();
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      style: item.style,
      bodyPart: item.bodyPart,
      image: item.image
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setPortfolioItems(prev => prev.filter(item => item.id !== id));
  };

  const handleToggleFeatured = (id: string) => {
    setPortfolioItems(prev => prev.map(item =>
      item.id === id ? { ...item, featured: !item.featured } : item
    ));
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingItem(null);
    setFormData({ title: "", description: "", style: "", bodyPart: "", image: "" });
  };

  const getStyleColor = (style: string) => {
    const colors = {
      "Realismo": "bg-red-100 text-red-800",
      "Geométrico": "bg-blue-100 text-blue-800",
      "Fineline": "bg-purple-100 text-purple-800",
      "Colorido": "bg-green-100 text-green-800",
      "Blackwork": "bg-gray-100 text-gray-800",
      "Tradicional": "bg-orange-100 text-orange-800"
    };
    return colors[style as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <TatuadoresLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-red-800">Meu Portfólio</h1>
            <p className="text-lg text-gray-600 mt-2">
              Gerencie seus trabalhos e mostre sua arte ao mundo
            </p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Trabalho
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-red-800">
                  {editingItem ? "Editar Trabalho" : "Adicionar Novo Trabalho"}
                </DialogTitle>
                <DialogDescription>
                  {editingItem ? "Edite as informações do trabalho" : "Adicione um novo trabalho ao seu portfólio"}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-red-600">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Leão Realista"
                    className="border-red-200 focus:border-red-600"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-red-600">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva o trabalho..."
                    className="border-red-200 focus:border-red-600"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-red-600">Estilo</Label>
                    <Select 
                      value={formData.style} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, style: value }))}
                      required
                    >
                      <SelectTrigger className="border-red-200 focus:border-red-600">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {styles.filter(s => s !== "Todos").map((style) => (
                          <SelectItem key={style} value={style}>{style}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-red-600">Local do Corpo</Label>
                    <Select 
                      value={formData.bodyPart} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, bodyPart: value }))}
                      required
                    >
                      <SelectTrigger className="border-red-200 focus:border-red-600">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {bodyParts.map((part) => (
                          <SelectItem key={part} value={part}>{part}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="image" className="text-red-600">URL da Imagem</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="border-red-200 focus:border-red-600"
                    type="url"
                    required
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">
                    {editingItem ? "Salvar Alterações" : "Adicionar Trabalho"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar trabalhos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-red-200 focus:border-red-600"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {styles.map((style) => (
              <Button
                key={style}
                variant={selectedStyle === style ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStyle(style)}
                className={selectedStyle === style ? "bg-red-600 hover:bg-red-700" : "border-red-200 text-red-600 hover:bg-red-50"}
              >
                <Filter className="h-3 w-3 mr-1" />
                {style}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Items */}
        {featuredItems.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-red-800">Trabalhos em Destaque</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden border-red-200 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-red-600 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Destaque
                    </Badge>
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(item)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className={getStyleColor(item.style)}>
                        {item.style}
                      </Badge>
                      <Badge variant="outline">{item.bodyPart}</Badge>
                    </div>
                    <CardTitle className="text-lg text-red-900">{item.title}</CardTitle>
                    <CardDescription className="text-gray-600 line-clamp-2">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{item.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          <span>{item.likes}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleFeatured(item.id)}
                        className="text-xs"
                      >
                        {item.featured ? "Remover Destaque" : "Destacar"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Items */}
        {regularItems.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-red-800">Todos os Trabalhos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {regularItems.map((item) => (
                <Card key={item.id} className="overflow-hidden border-red-200 hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(item)}
                        className="h-7 w-7 p-0 opacity-80 hover:opacity-100"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                        className="h-7 w-7 p-0 opacity-80 hover:opacity-100"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getStyleColor(item.style)} variant="secondary">
                        {item.style}
                      </Badge>
                      <Badge variant="outline" className="text-xs">{item.bodyPart}</Badge>
                    </div>
                    <CardTitle className="text-sm text-red-900 line-clamp-1">{item.title}</CardTitle>
                    <CardDescription className="text-xs text-gray-600 line-clamp-2">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{item.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          <span>{item.likes}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleFeatured(item.id)}
                        className="h-6 text-xs p-1"
                      >
                        <Star className={`h-3 w-3 ${item.featured ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {portfolioItems.length === 0 ? "Nenhum trabalho cadastrado" : "Nenhum trabalho encontrado"}
            </h3>
            <p className="text-gray-500 mb-4">
              {portfolioItems.length === 0 
                ? "Comece adicionando seus primeiros trabalhos ao portfólio" 
                : "Tente ajustar sua busca ou filtros"
              }
            </p>
            {portfolioItems.length === 0 && (
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Trabalho
              </Button>
            )}
          </div>
        )}
      </div>
    </TatuadoresLayout>
  );
};

export default Portfolio;
