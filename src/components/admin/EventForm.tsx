import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Calendar, MapPin, Clock, Users, DollarSign, Globe, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getEventService } from "@/services/serviceFactory";
import { IEvent } from "@/services/interfaces/IEventService";
import EventLandingPageModal from "./EventLandingPageModal";

const eventSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  detailedDescription: z.string().optional(),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  endDate: z.string().min(1, "Data de fim é obrigatória"),
  startTime: z.string().min(1, "Horário de início é obrigatório"),
  endTime: z.string().min(1, "Horário de fim é obrigatório"),
  location: z.string().min(1, "Local é obrigatório"),
  fullAddress: z.string().optional(),
  featuredImage: z.string().optional(),
  eventType: z.enum(['flash_day', 'workshop', 'collection_launch', 'exhibition', 'other']),
  isPublic: z.boolean(),
  price: z.number().optional(),
  ticketLink: z.string().optional(),
  participatingArtists: z.array(z.string()).optional(),
  status: z.enum(['pending', 'active', 'completed', 'cancelled']),
  landingPageUrl: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  event?: IEvent | null;
  onClose: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<IEvent | null>(event || null);
  const eventService = getEventService();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: event ? {
      name: event.name,
      description: event.description,
      detailedDescription: event.detailedDescription || "",
      startDate: event.startDate.split('T')[0],
      endDate: event.endDate.split('T')[0],
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      fullAddress: event.fullAddress || "",
      featuredImage: event.featuredImage || "",
      eventType: event.eventType,
      isPublic: event.isPublic,
      price: event.price || 0,
      ticketLink: event.ticketLink || "",
      participatingArtists: event.participatingArtists || [],
      status: event.status,
      landingPageUrl: `https://99tattoo.com/events/${event.id}`,
    } : {
      name: "",
      description: "",
      detailedDescription: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      location: "",
      fullAddress: "",
      featuredImage: "",
      eventType: 'flash_day',
      isPublic: true,
      price: 0,
      ticketLink: "",
      participatingArtists: [],
      status: 'pending',
      landingPageUrl: "",
    }
  });

  const watchedEventType = watch('eventType');
  const watchedName = watch('name');

  // Auto-generate landing page URL when name changes
  useEffect(() => {
    if (watchedName && !event) {
      const slug = watchedName.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');
      setValue('landingPageUrl', `https://99tattoo.com/events/${slug}`);
    }
  }, [watchedName, event, setValue]);

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true);
    
    try {
      let savedEvent: IEvent;
      
      if (event) {
        savedEvent = await eventService.updateEvent(event.id, {
          ...data,
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        toast({
          title: "Evento atualizado!",
          description: "As informações do evento foram atualizadas com sucesso.",
        });
      } else {
        // Create the event data with proper typing
        const eventData: Omit<IEvent, 'id' | 'createdAt' | 'updatedAt'> = {
          name: data.name,
          description: data.description,
          detailedDescription: data.detailedDescription,
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
          startTime: data.startTime,
          endTime: data.endTime,
          location: data.location,
          fullAddress: data.fullAddress,
          featuredImage: data.featuredImage,
          eventType: data.eventType,
          isPublic: data.isPublic,
          price: data.price,
          ticketLink: data.ticketLink,
          participatingArtists: data.participatingArtists,
          status: data.status,
          landingPageUrl: data.landingPageUrl,
        };
        
        savedEvent = await eventService.createEvent(eventData);
        
        toast({
          title: "Evento criado!",
          description: "Novo evento foi criado com sucesso.",
        });
      }
      
      setCurrentEvent(savedEvent);
      
      // Don't close immediately, let user see the landing page option
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error("Error saving event:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar evento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEventTypeLabel = (type: string) => {
    const types = {
      'flash_day': 'Flash Day',
      'workshop': 'Workshop',
      'collection_launch': 'Lançamento de Coleção',
      'exhibition': 'Exposição',
      'other': 'Outro'
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-red-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                {event ? 'Editar Evento' : 'Criar Novo Evento'}
              </h1>
              <p className="text-red-600 font-medium">
                {event ? 'Atualize as informações do evento' : 'Preencha os detalhes do novo evento'}
              </p>
            </div>
          </div>
          
          {(event || currentEvent) && (
            <Button
              onClick={() => setShowLandingPage(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Globe className="h-4 w-4 mr-2" />
              Ver Landing Page
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações Básicas */}
          <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200">
              <CardTitle className="flex items-center gap-2 text-red-800">
                <Calendar className="h-5 w-5 text-red-600" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-red-700 font-bold">Nome do Evento</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Ex: Flash Day Verão 2025"
                    className="border-red-200 focus:border-red-500 focus:ring-red-200"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventType" className="text-red-700 font-bold">Tipo de Evento</Label>
                  <Select onValueChange={(value) => setValue('eventType', value as any)}>
                    <SelectTrigger className="border-red-200 focus:border-red-500">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-red-200">
                      <SelectItem value="flash_day">Flash Day</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                      <SelectItem value="collection_launch">Lançamento de Coleção</SelectItem>
                      <SelectItem value="exhibition">Exposição</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.eventType && <p className="text-red-500 text-sm">{errors.eventType.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-red-700 font-bold">Descrição</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Descrição breve do evento..."
                  className="border-red-200 focus:border-red-500 focus:ring-red-200 min-h-20"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="detailedDescription" className="text-red-700 font-bold">Descrição Detalhada (Opcional)</Label>
                <Textarea
                  id="detailedDescription"
                  {...register('detailedDescription')}
                  placeholder="Informações completas sobre o evento para a landing page..."
                  className="border-red-200 focus:border-red-500 focus:ring-red-200 min-h-32"
                />
              </div>
            </CardContent>
          </Card>

          {/* Data e Horário */}
          <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200">
              <CardTitle className="flex items-center gap-2 text-red-800">
                <Clock className="h-5 w-5 text-red-600" />
                Data e Horário
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-red-700 font-bold">Data de Início</Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...register('startDate')}
                    className="border-red-200 focus:border-red-500 focus:ring-red-200"
                  />
                  {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-red-700 font-bold">Data de Fim</Label>
                  <Input
                    id="endDate"
                    type="date"
                    {...register('endDate')}
                    className="border-red-200 focus:border-red-500 focus:ring-red-200"
                  />
                  {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-red-700 font-bold">Horário de Início</Label>
                  <Input
                    id="startTime"
                    type="time"
                    {...register('startTime')}
                    className="border-red-200 focus:border-red-500 focus:ring-red-200"
                  />
                  {errors.startTime && <p className="text-red-500 text-sm">{errors.startTime.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-red-700 font-bold">Horário de Fim</Label>
                  <Input
                    id="endTime"
                    type="time"
                    {...register('endTime')}
                    className="border-red-200 focus:border-red-500 focus:ring-red-200"
                  />
                  {errors.endTime && <p className="text-red-500 text-sm">{errors.endTime.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Local e Endereço */}
          <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200">
              <CardTitle className="flex items-center gap-2 text-red-800">
                <MapPin className="h-5 w-5 text-red-600" />
                Local e Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-red-700 font-bold">Local</Label>
                <Input
                  id="location"
                  {...register('location')}
                  placeholder="Ex: Estúdio 99Tattoo - Unidade Centro"
                  className="border-red-200 focus:border-red-500 focus:ring-red-200"
                />
                {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullAddress" className="text-red-700 font-bold">Endereço Completo (Opcional)</Label>
                <Input
                  id="fullAddress"
                  {...register('fullAddress')}
                  placeholder="Rua das Flores, 123 - Centro, São Paulo - SP"
                  className="border-red-200 focus:border-red-500 focus:ring-red-200"
                />
              </div>
            </CardContent>
          </Card>

          {/* Landing Page */}
          <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Globe className="h-5 w-5 text-blue-600" />
                Landing Page do Evento
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="landingPageUrl" className="text-blue-700 font-bold">URL da Landing Page</Label>
                <div className="flex gap-2">
                  <Input
                    id="landingPageUrl"
                    {...register('landingPageUrl')}
                    placeholder="https://99tattoo.com/events/nome-do-evento"
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-200 flex-1"
                    readOnly
                  />
                  {watch('landingPageUrl') && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => window.open(watch('landingPageUrl'), '_blank')}
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-blue-600">
                  Esta URL será gerada automaticamente após salvar o evento e será usada para divulgação pública.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Imagem Destacada */}
          <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200">
              <CardTitle className="flex items-center gap-2 text-red-800">
                <DollarSign className="h-5 w-5 text-red-600" />
                Detalhes Financeiros
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-red-700 font-bold">Preço (Opcional)</Label>
                <Input
                  id="price"
                  type="number"
                  {...register('price', { valueAsNumber: true })}
                  placeholder="Ex: 150.00"
                  className="border-red-200 focus:border-red-500 focus:ring-red-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticketLink" className="text-red-700 font-bold">Link para Ingressos (Opcional)</Label>
                <Input
                  id="ticketLink"
                  {...register('ticketLink')}
                  placeholder="https://seusite.com.br/evento"
                  className="border-red-200 focus:border-red-500 focus:ring-red-200"
                />
              </div>
            </CardContent>
          </Card>

          {/* Público e Status */}
          <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200">
              <CardTitle className="flex items-center gap-2 text-red-800">
                <Users className="h-5 w-5 text-red-600" />
                Público e Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isPublic" className="text-red-700 font-bold">Evento Público?</Label>
                <Switch
                  id="isPublic"
                  {...register('isPublic')}
                  className="border-red-200 focus:border-red-500 focus:ring-red-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-red-700 font-bold">Status do Evento</Label>
                <Select onValueChange={(value) => setValue('status', value as any)}>
                  <SelectTrigger className="border-red-200 focus:border-red-500">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-red-200">
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Imagem Destacada */}
          <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200">
              <CardTitle className="flex items-center gap-2 text-red-800">
                <Globe className="h-5 w-5 text-red-600" />
                Imagem Destacada (Opcional)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="featuredImage" className="text-red-700 font-bold">URL da Imagem</Label>
                <Input
                  id="featuredImage"
                  {...register('featuredImage')}
                  placeholder="https://seusite.com.br/imagem-destacada.jpg"
                  className="border-red-200 focus:border-red-500 focus:ring-red-200"
                />
              </div>
            </CardContent>
          </Card>

          {/* Artistas Participantes */}
          <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200">
              <CardTitle className="flex items-center gap-2 text-red-800">
                <Users className="h-5 w-5 text-red-600" />
                Artistas Participantes (Opcional)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="participatingArtists" className="text-red-700 font-bold">Lista de Artistas (Separados por vírgula)</Label>
                <Input
                  id="participatingArtists"
                  {...register('participatingArtists')}
                  placeholder="Ex: Ana Silva, Carlos Santos, Pedro Costa"
                  className="border-red-200 focus:border-red-500 focus:ring-red-200"
                />
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-red-200 text-red-600 hover:bg-red-50 flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Salvando...' : (event ? 'Atualizar Evento' : 'Criar Evento')}
            </Button>
          </div>
        </form>
      </div>

      {/* Landing Page Modal */}
      {showLandingPage && (currentEvent || event) && (
        <EventLandingPageModal
          event={currentEvent || event!}
          isOpen={showLandingPage}
          onClose={() => setShowLandingPage(false)}
        />
      )}
    </div>
  );
};

export default EventForm;
