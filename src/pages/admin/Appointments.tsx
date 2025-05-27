
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getClientService, getBedService } from "@/services/serviceFactory";
import { formatDate } from "@/lib/utils";
import { Calendar, Clock, User, Plus, Search, Filter, Eye, Edit, Trash2, CheckCircle, XCircle, Bed, LayoutGrid, List } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import QuickAppointmentForm from "@/components/admin/QuickAppointmentForm";
import AppointmentForm from "@/components/admin/AppointmentForm";
import AppointmentCalendar from "@/components/admin/AppointmentCalendar";
import BedManagement from "@/components/admin/BedManagement";

const Appointments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [bedFilter, setBedFilter] = useState<string>("all");
  const [isQuickFormOpen, setIsQuickFormOpen] = useState(false);
  const [isFullFormOpen, setIsFullFormOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [viewMode, setViewMode] = useState<"calendar" | "table" | "beds">("calendar");

  const queryClient = useQueryClient();
  const clientService = getClientService();
  const bedService = getBedService();

  // Buscar agendamentos
  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => clientService.fetchUpcomingAppointments(100),
  });

  // Buscar clientes para o formulário
  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.fetchClients({ limit: 100 }),
  });

  // Buscar macas
  const { data: beds = [], isLoading: bedsLoading } = useQuery({
    queryKey: ['beds'],
    queryFn: () => bedService.fetchBeds(),
  });

  // Mutação para atualizar status do agendamento
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      clientService.updateAppointmentStatus(id, status as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Status atualizado",
        description: "O status do agendamento foi atualizado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do agendamento.",
        variant: "destructive"
      });
    }
  });

  // Mutação para excluir agendamento
  const deleteAppointmentMutation = useMutation({
    mutationFn: (id: string) => clientService.deleteAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Agendamento excluído",
        description: "O agendamento foi excluído com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o agendamento.",
        variant: "destructive"
      });
    }
  });

  // Mutações para gestão de macas
  const addBedMutation = useMutation({
    mutationFn: (bedData: any) => bedService.createBed(bedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
    }
  });

  const updateBedMutation = useMutation({
    mutationFn: ({ bedId, updates }: { bedId: string; updates: any }) => 
      bedService.updateBed(bedId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
    }
  });

  const deleteBedMutation = useMutation({
    mutationFn: (bedId: string) => bedService.deleteBed(bedId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
    }
  });

  const handleAppointmentCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['appointments'] });
    setIsQuickFormOpen(false);
    setIsFullFormOpen(false);
    setSelectedSlot(null);
  };

  const handleDeleteAppointment = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este agendamento?")) {
      deleteAppointmentMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: { class: "bg-blue-100 text-blue-800", label: "Agendado" },
      confirmed: { class: "bg-green-100 text-green-800", label: "Confirmado" },
      in_progress: { class: "bg-yellow-100 text-yellow-800", label: "Em Andamento" },
      completed: { class: "bg-gray-100 text-gray-800", label: "Concluído" },
      cancelled: { class: "bg-red-100 text-red-800", label: "Cancelado" },
      no_show: { class: "bg-purple-100 text-purple-800", label: "Não Compareceu" },
    };

    const variant = variants[status as keyof typeof variants];
    return (
      <Badge className={variant?.class}>
        {variant?.label || status}
      </Badge>
    );
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = searchTerm === "" || 
      appointment.client_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.service_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    const matchesBed = bedFilter === "all" || 
      (bedFilter === "none" && !appointment.bed_id) ||
      appointment.bed_id === bedFilter;
    
    return matchesSearch && matchesStatus && matchesBed;
  });

  const checkConflicts = (appointmentData: {
    artist_id: string;
    bed_id?: string;
    date: string;
    time: string;
    duration_minutes: number;
  }) => {
    return appointments.filter(existing => {
      const existingStart = new Date(`${existing.date}T${existing.time}`);
      const existingEnd = new Date(existingStart.getTime() + existing.duration_minutes * 60000);
      
      const newStart = new Date(`${appointmentData.date}T${appointmentData.time}`);
      const newEnd = new Date(newStart.getTime() + appointmentData.duration_minutes * 60000);
      
      // Verifica sobreposição de horários
      const hasTimeConflict = (newStart < existingEnd && newEnd > existingStart);
      
      if (!hasTimeConflict) return false;
      
      // Verifica conflito de artista
      if (existing.artist_id === appointmentData.artist_id) return true;
      
      // Verifica conflito de maca se especificada
      if (appointmentData.bed_id && existing.bed_id === appointmentData.bed_id) return true;
      
      return false;
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header e Controles */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
          <p className="text-gray-600">Gerencie os agendamentos do estúdio</p>
        </div>

        <div className="flex gap-2">
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("calendar")}
              className="rounded-r-none"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Calendário
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-none"
            >
              <List className="h-4 w-4 mr-1" />
              Lista
            </Button>
            <Button
              variant={viewMode === "beds" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("beds")}
              className="rounded-l-none"
            >
              <Bed className="h-4 w-4 mr-1" />
              Macas
            </Button>
          </div>

          <Dialog open={isQuickFormOpen} onOpenChange={setIsQuickFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Agendamento Rápido
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Novo Agendamento Rápido</DialogTitle>
                <DialogDescription>
                  Crie um agendamento de forma rápida e simples
                </DialogDescription>
              </DialogHeader>
              <QuickAppointmentForm
                selectedSlot={selectedSlot}
                clients={clients}
                onSuccess={handleAppointmentCreated}
                onConflict={(message) => {
                  toast({
                    title: "Conflito de horário",
                    description: message,
                    variant: "destructive"
                  });
                }}
                checkConflicts={checkConflicts}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isFullFormOpen} onOpenChange={setIsFullFormOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Agendamento Completo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Novo Agendamento Completo</DialogTitle>
                <DialogDescription>
                  Crie um agendamento com todas as informações detalhadas
                </DialogDescription>
              </DialogHeader>
              <AppointmentForm
                selectedSlot={selectedSlot}
                clients={clients}
                onSuccess={handleAppointmentCreated}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros */}
      {(viewMode === "table" || viewMode === "calendar") && (
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por cliente ou serviço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="scheduled">Agendado</SelectItem>
              <SelectItem value="confirmed">Confirmado</SelectItem>
              <SelectItem value="in_progress">Em Andamento</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
              <SelectItem value="no_show">Não Compareceu</SelectItem>
            </SelectContent>
          </Select>

          <Select value={bedFilter} onValueChange={setBedFilter}>
            <SelectTrigger className="w-[180px]">
              <Bed className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Maca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Macas</SelectItem>
              <SelectItem value="none">Sem Maca Específica</SelectItem>
              {beds.filter(bed => bed.isActive).map((bed) => (
                <SelectItem key={bed.id} value={bed.id}>
                  {bed.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Conteúdo Principal */}
      {viewMode === "calendar" && (
        <AppointmentCalendar
          appointments={filteredAppointments}
          clients={clients}
          onAppointmentCreated={handleAppointmentCreated}
        />
      )}

      {viewMode === "table" && (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Agendamentos</CardTitle>
            <CardDescription>
              Visualize e gerencie todos os agendamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Artista</TableHead>
                    <TableHead>Maca</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointmentsLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        Carregando agendamentos...
                      </TableCell>
                    </TableRow>
                  ) : filteredAppointments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        Nenhum agendamento encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className="font-medium">{appointment.client_id}</div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <span className="text-sm">{formatDate(appointment.date)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-sm">{appointment.time}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {appointment.service_type}
                          </Badge>
                        </TableCell>
                        <TableCell>{appointment.duration_minutes}min</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{appointment.artist_id}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {appointment.bed_id ? (
                            <div className="flex items-center gap-1">
                              <Bed className="h-3 w-3 text-gray-400" />
                              <span className="text-sm">{appointment.bed_id}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(appointment.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteAppointment(appointment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            {appointment.status === 'scheduled' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => updateStatusMutation.mutate({ 
                                  id: appointment.id, 
                                  status: 'confirmed' 
                                })}
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === "beds" && (
        <BedManagement
          beds={beds}
          onAddBed={(bedData) => addBedMutation.mutate(bedData)}
          onUpdateBed={(bedId, updates) => updateBedMutation.mutate({ bedId, updates })}
          onDeleteBed={(bedId) => deleteBedMutation.mutate(bedId)}
        />
      )}
    </div>
  );
};

export default Appointments;
