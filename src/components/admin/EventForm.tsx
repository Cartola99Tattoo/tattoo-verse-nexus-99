import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Save, Plus, Trash2, Target, ShoppingCart, DollarSign, Users, TrendingUp } from "lucide-react";
import { IEvent, IEventSmartGoal } from "@/services/interfaces/IEventService";
import { getEventService } from "@/services/serviceFactory";
import { useProjects } from "@/hooks/useProjects";
import { useArtists } from "@/hooks/useArtists";
import { toast } from "@/hooks/use-toast";

interface EventFormProps {
  event: IEvent | null;
  onClose: () => void;
}

const EventForm = ({ event, onClose }: EventFormProps) => {
  const [formData, setFormData] = useState<Partial<IEvent>>({
    name: '',
    description: '',
    detailedDescription: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    fullAddress: '',
    featuredImage: '',
    eventType: 'flash_day',
    isPublic: true,
    price: 0,
    ticketLink: '',
    participatingArtists: [],
    status: 'pending',
    projectId: undefined,
    ticketProduct: {
      isEnabled: false,
      productName: '',
      productPrice: 0,
      ticketStock: 0,
      productCategory: 'Ingressos',
      productDescription: ''
    }
  });
  
  const [smartGoals, setSmartGoals] = useState<IEventSmartGoal[]>([]);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetValue: 0,
    unit: '',
    deadline: '',
    metricType: 'count' as 'currency' | 'count' | 'percentage'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const eventService = getEventService();
  const { data: projectsData = [] } = useProjects();
  const { artists: artistsData = [] } = useArtists();

  // Ensure projects and artists are always arrays
  const projects = Array.isArray(projectsData) ? projectsData : [];
  const artists = Array.isArray(artistsData) ? artistsData : [];

  useEffect(() => {
    if (event) {
      setFormData(event);
      loadSmartGoals(event.id);
    }
  }, [event]);

  const loadSmartGoals = async (eventId: string) => {
    try {
      const goals = await eventService.fetchEventSmartGoals(eventId);
      // Ensure goals is always an array
      setSmartGoals(Array.isArray(goals) ? goals : []);
    } catch (error) {
      console.error('Error loading smart goals:', error);
      setSmartGoals([]); // Ensure it's always an array
    }
  };

  const handleInputChange = (field: keyof IEvent, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-preenchimento quando um projeto é selecionado
    if (field === 'projectId' && value) {
      const selectedProject = projects.find(p => p.id === value);
      if (selectedProject) {
        setFormData(prev => ({
          ...prev,
          startDate: prev.startDate || selectedProject.startDate,
          endDate: prev.endDate || selectedProject.endDate,
          description: prev.description || selectedProject.description
        }));
      }
    }
    
    // Auto-preenchimento do ingresso quando o preço é alterado
    if (field === 'price' && value > 0 && formData.ticketProduct) {
      setFormData(prev => ({
        ...prev,
        ticketProduct: {
          ...prev.ticketProduct!,
          productPrice: value,
          productName: prev.ticketProduct!.productName || `Ingresso ${prev.name || 'Evento'}`,
          productDescription: prev.ticketProduct!.productDescription || prev.description || ''
        }
      }));
    }
  };

  const handleTicketProductChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      ticketProduct: {
        ...prev.ticketProduct!,
        [field]: value
      }
    }));
  };

  const handleArtistChange = (value: string) => {
    const artistsArray = value.split(',').map(artist => artist.trim()).filter(Boolean);
    handleInputChange('participatingArtists', artistsArray);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      toast({
        title: "Erro",
        description: "Nome do evento é obrigatório",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (event) {
        await eventService.updateEvent(event.id, formData);
        toast({
          title: "Sucesso",
          description: "Evento atualizado com sucesso!",
        });
      } else {
        await eventService.createEvent(formData as Omit<IEvent, 'id' | 'createdAt' | 'updatedAt'>);
        toast({
          title: "Sucesso",
          description: "Evento criado com sucesso!",
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar evento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSmartGoal = async () => {
    if (!newGoal.title.trim() || !event) return;

    try {
      const goal = await eventService.createEventSmartGoal({
        eventId: event.id,
        title: newGoal.title,
        description: newGoal.description,
        targetValue: newGoal.targetValue,
        currentValue: 0,
        unit: newGoal.unit,
        deadline: newGoal.deadline,
        metricType: newGoal.metricType
      });

      // Ensure smartGoals is always an array before spreading
      setSmartGoals(prev => [...(Array.isArray(prev) ? prev : []), goal]);
      setNewGoal({ title: '', description: '', targetValue: 0, unit: '', deadline: '', metricType: 'count' });

      toast({
        title: "Sucesso",
        description: "Meta SMART adicionada!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar meta SMART.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSmartGoal = async (goalId: string) => {
    try {
      await eventService.deleteEventSmartGoal(goalId);
      // Ensure smartGoals is always an array before filtering
      setSmartGoals(prev => (Array.isArray(prev) ? prev : []).filter(g => g.id !== goalId));
      toast({
        title: "Sucesso",
        description: "Meta SMART removida!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover meta SMART.",
        variant: "destructive",
      });
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return target > 0 ? Math.min((current / target) * 100, 100) : 0;
  };

  const getMetricIcon = (metricType: string) => {
    switch (metricType) {
      case 'currency': return <DollarSign className="h-4 w-4" />;
      case 'count': return <Users className="h-4 w-4" />;
      case 'percentage': return <TrendingUp className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onClose} className="border-red-200 text-red-600 hover:bg-red-50">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {event ? 'Editar Evento' : 'Novo Evento'}
          </h1>
          <p className="text-gray-600">Preencha as informações do evento</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="shadow-lg border-red-100">
          <CardHeader className="bg-gradient-to-r from-red-50 to-gray-50">
            <CardTitle className="text-red-800">Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="name">Nome do Evento *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: Flash Day Verão 2024"
                  required
                  className="border-red-200 focus:border-red-500 focus:ring-red-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectId">Associar a Projeto</Label>
                <Select
                  value={formData.projectId || ''}
                  onValueChange={(value) => handleInputChange('projectId', value || undefined)}
                >
                  <SelectTrigger className="border-red-200 focus:border-red-500">
                    <SelectValue placeholder="Selecione um projeto (opcional)" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-red-200 shadow-lg">
                    <SelectItem value="">Nenhum projeto</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventType">Tipo de Evento</Label>
                <Select
                  value={formData.eventType || 'flash_day'}
                  onValueChange={(value) => handleInputChange('eventType', value)}
                >
                  <SelectTrigger className="border-red-200 focus:border-red-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-red-200 shadow-lg">
                    <SelectItem value="flash_day">Flash Day</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="collection_launch">Lançamento de Coleção</SelectItem>
                    <SelectItem value="exhibition">Exposição</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="description">Descrição Curta</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Breve descrição do evento..."
                  rows={3}
                  className="border-red-200 focus:border-red-500 focus:ring-red-200"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="detailedDescription">Descrição Detalhada</Label>
                <Textarea
                  id="detailedDescription"
                  value={formData.detailedDescription || ''}
                  onChange={(e) => handleInputChange('detailedDescription', e.target.value)}
                  placeholder="Descrição completa para exibição na página pública..."
                  rows={5}
                  className="border-red-200 focus:border-red-500 focus:ring-red-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || 'pending'}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger className="border-red-200 focus:border-red-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-red-200 shadow-lg">
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-red-100">
          <CardHeader className="bg-gradient-to-r from-red-50 to-gray-50">
            <CardTitle className="text-red-800">Data e Local</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate || ''}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="border-red-200 focus:border-red-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Data de Fim</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate || ''}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="border-red-200 focus:border-red-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Horário de Início</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime || ''}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  className="border-red-200 focus:border-red-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">Horário de Fim</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime || ''}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className="border-red-200 focus:border-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Local</Label>
                <Input
                  id="location"
                  value={formData.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Ex: Estúdio 99Tattoo"
                  className="border-red-200 focus:border-red-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullAddress">Endereço Completo</Label>
                <Input
                  id="fullAddress"
                  value={formData.fullAddress || ''}
                  onChange={(e) => handleInputChange('fullAddress', e.target.value)}
                  placeholder="Endereço completo para GPS..."
                  className="border-red-200 focus:border-red-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-red-100">
          <CardHeader className="bg-gradient-to-r from-red-50 to-gray-50">
            <CardTitle className="text-red-800">Detalhes Adicionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="featuredImage">URL da Imagem de Destaque</Label>
              <Input
                id="featuredImage"
                value={formData.featuredImage || ''}
                onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
                className="border-red-200 focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price || ''}
                  onChange={(e) => handleInputChange('price', Number(e.target.value))}
                  placeholder="0.00"
                  className="border-red-200 focus:border-red-500"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="ticketLink">Link de Inscrição/Ingresso</Label>
                <Input
                  id="ticketLink"
                  value={formData.ticketLink || ''}
                  onChange={(e) => handleInputChange('ticketLink', e.target.value)}
                  placeholder="https://exemplo.com/ingressos"
                  className="border-red-200 focus:border-red-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="participatingArtists">Tatuadores Participantes</Label>
              <Select
                value={formData.participatingArtists?.join(', ') || ''}
                onValueChange={handleArtistChange}
              >
                <SelectTrigger className="border-red-200 focus:border-red-500">
                  <SelectValue placeholder="Selecione os tatuadores..." />
                </SelectTrigger>
                <SelectContent className="bg-white border-red-200 shadow-lg">
                  {artists.length > 0 ? (
                    artists.map((artist) => (
                      <SelectItem key={artist.id} value={`${artist.first_name} ${artist.last_name}`}>
                        {artist.first_name} {artist.last_name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>Nenhum artista encontrado</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-600">Ou digite manualmente separando por vírgulas</p>
              <Input
                value={formData.participatingArtists?.join(', ') || ''}
                onChange={(e) => handleArtistChange(e.target.value)}
                placeholder="Nome 1, Nome 2, Nome 3..."
                className="border-red-200 focus:border-red-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPublic"
                checked={formData.isPublic || false}
                onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                className="border-red-500 text-red-600"
              />
              <Label htmlFor="isPublic">Evento aberto ao público</Label>
            </div>
          </CardContent>
        </Card>

        {(formData.price || 0) > 0 && (
          <Card className="shadow-lg border-red-100">
            <CardHeader className="bg-gradient-to-r from-red-50 to-gray-50">
              <CardTitle className="flex items-center gap-2 text-red-800">
                <ShoppingCart className="h-5 w-5 text-red-600" />
                Configuração de Venda de Ingressos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ticketEnabled"
                  checked={formData.ticketProduct?.isEnabled || false}
                  onCheckedChange={(checked) => handleTicketProductChange('isEnabled', checked)}
                  className="border-red-500 text-red-600"
                />
                <Label htmlFor="ticketEnabled">Vincular à Loja como Produto</Label>
              </div>

              {formData.ticketProduct?.isEnabled && (
                <div className="space-y-4 border-l-4 border-red-500 pl-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="productName">Nome do Produto (Ingresso) *</Label>
                      <Input
                        id="productName"
                        value={formData.ticketProduct.productName || ''}
                        onChange={(e) => handleTicketProductChange('productName', e.target.value)}
                        placeholder={`Ingresso ${formData.name || 'Evento'}`}
                        required
                        className="border-red-200 focus:border-red-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productPrice">Preço do Ingresso *</Label>
                      <Input
                        id="productPrice"
                        type="number"
                        step="0.01"
                        value={formData.ticketProduct.productPrice || ''}
                        onChange={(e) => handleTicketProductChange('productPrice', Number(e.target.value))}
                        required
                        className="border-red-200 focus:border-red-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ticketStock">Estoque de Ingressos *</Label>
                      <Input
                        id="ticketStock"
                        type="number"
                        value={formData.ticketProduct.ticketStock || ''}
                        onChange={(e) => handleTicketProductChange('ticketStock', Number(e.target.value))}
                        placeholder="Ex: 50"
                        required
                        className="border-red-200 focus:border-red-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productCategory">Categoria do Produto</Label>
                      <Select
                        value={formData.ticketProduct.productCategory || 'Ingressos'}
                        onValueChange={(value) => handleTicketProductChange('productCategory', value)}
                      >
                        <SelectTrigger className="border-red-200 focus:border-red-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-red-200 shadow-lg">
                          <SelectItem value="Ingressos">Ingressos</SelectItem>
                          <SelectItem value="Eventos">Eventos</SelectItem>
                          <SelectItem value="Workshops">Workshops</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="productDescription">Descrição do Produto</Label>
                    <Textarea
                      id="productDescription"
                      value={formData.ticketProduct.productDescription || ''}
                      onChange={(e) => handleTicketProductChange('productDescription', e.target.value)}
                      placeholder={formData.description || 'Descrição do ingresso...'}
                      rows={3}
                      className="border-red-200 focus:border-red-500"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {event && (
          <Card className="shadow-lg border-red-100">
            <CardHeader className="bg-gradient-to-r from-red-50 to-gray-50">
              <CardTitle className="flex items-center gap-2 text-red-800">
                <Target className="h-5 w-5 text-red-600" />
                Metas SMART do Evento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border-2 border-dashed border-red-200 rounded-lg bg-red-50 space-y-4">
                <h4 className="font-medium text-red-800">Adicionar Nova Meta</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Título da meta"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    className="border-red-200 focus:border-red-500"
                  />
                  <Select
                    value={newGoal.metricType}
                    onValueChange={(value) => setNewGoal(prev => ({ ...prev, metricType: value as any }))}
                  >
                    <SelectTrigger className="border-red-200 focus:border-red-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-red-200 shadow-lg">
                      <SelectItem value="currency">Monetário (R$)</SelectItem>
                      <SelectItem value="count">Quantidade</SelectItem>
                      <SelectItem value="percentage">Percentual (%)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Valor alvo"
                    value={newGoal.targetValue || ''}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, targetValue: Number(e.target.value) }))}
                    className="border-red-200 focus:border-red-500"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Unidade (ex: pessoas, R$)"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                    className="border-red-200 focus:border-red-500"
                  />
                  <Textarea
                    placeholder="Descrição da meta"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    className="border-red-200 focus:border-red-500"
                  />
                  <Input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                    className="border-red-200 focus:border-red-500"
                  />
                </div>
                <Button 
                  type="button" 
                  onClick={handleAddSmartGoal}
                  disabled={!newGoal.title.trim()}
                  size="sm"
                  className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Meta
                </Button>
              </div>

              <div className="space-y-3">
                {Array.isArray(smartGoals) && smartGoals.length > 0 ? (
                  smartGoals.map((goal) => {
                    const progress = getProgressPercentage(goal.currentValue, goal.targetValue);
                    return (
                      <div key={goal.id} className="p-4 border rounded-lg bg-white shadow-sm border-red-100">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getMetricIcon(goal.metricType)}
                              <h5 className="font-medium text-red-800">{goal.title}</h5>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>Meta: {goal.targetValue} {goal.unit}</span>
                              <span>Atual: {goal.currentValue} {goal.unit}</span>
                              <span>Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSmartGoal(goal.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Progresso</span>
                            <span>{progress.toFixed(1)}%</span>
                          </div>
                          <Progress value={progress} className="h-2 bg-gray-200">
                            <div 
                              className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all" 
                              style={{ width: `${progress}%` }}
                            />
                          </Progress>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Target className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p>Nenhuma meta SMART criada ainda</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Salvando...' : (event ? 'Atualizar Evento' : 'Criar Evento')}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="border-gray-300 hover:bg-gray-50">
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
