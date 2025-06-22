
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users, TrendingUp, BarChart3, CalendarDays, Kanban } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getClientService } from "@/services/serviceFactory";
import DailyAppointmentsKanban from "@/components/admin/DailyAppointmentsKanban";
import WeeklyAppointmentsKanban from "@/components/admin/WeeklyAppointmentsKanban";
import EnhancedMonthlyCalendar from "@/components/admin/EnhancedMonthlyCalendar";
import EnhancedWeeklyView from "@/components/admin/EnhancedWeeklyView";
import { format } from "date-fns";
import { Appointment, Client } from "@/services/interfaces/IClientService";

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentDate] = useState(new Date());
  const queryClient = useQueryClient();
  const clientService = getClientService();

  // Mock appointments data with enhanced variety and complete properties - EXPANDED
  const mockAppointments: Appointment[] = [
    // Dias 21-24 (dados originais expandidos)
    {
      id: "1",
      client_id: "1",
      artist_id: "1",
      date: "2024-12-21",
      time: "09:00",
      duration_minutes: 120,
      service_type: "tattoo",
      status: "confirmed",
      service_description: "Tatuagem Realista - Braço",
      estimated_price: 800,
      notes: "Primeira sessão",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    {
      id: "2",
      client_id: "2", 
      artist_id: "2",
      date: "2024-12-21",
      time: "11:30",
      duration_minutes: 90,
      service_type: "tattoo",
      status: "scheduled",
      service_description: "Tatuagem Blackwork - Perna",
      estimated_price: 600,
      notes: "Cliente regular",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    {
      id: "3",
      client_id: "3",
      artist_id: "1",
      date: "2024-12-21",
      time: "14:00",
      duration_minutes: 180,
      service_type: "tattoo",
      status: "confirmed",
      service_description: "Tatuagem Colorida - Costas",
      estimated_price: 1200,
      notes: "Sessão longa",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    {
      id: "21a",
      client_id: "4",
      artist_id: "3",
      date: "2024-12-21",
      time: "16:30",
      duration_minutes: 60,
      service_type: "piercing",
      status: "confirmed",
      service_description: "Piercing Nostril",
      estimated_price: 150,
      notes: "Primeiro piercing",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    {
      id: "21b",
      client_id: "5",
      artist_id: "4",
      date: "2024-12-21",
      time: "18:00",
      duration_minutes: 45,
      service_type: "consultation",
      status: "scheduled",
      service_description: "Consulta - Tatuagem Oriental",
      estimated_price: 100,
      notes: "Primeira consulta",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    
    // Dia 22
    {
      id: "4",
      client_id: "4",
      artist_id: "3",
      date: "2024-12-22",
      time: "10:00",
      duration_minutes: 60,
      service_type: "tattoo",
      status: "scheduled",
      service_description: "Retoque - Braço",
      estimated_price: 200,
      notes: "Retoque gratuito",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    {
      id: "5",
      client_id: "5",
      artist_id: "2",
      date: "2024-12-22",
      time: "15:30",
      duration_minutes: 150,
      service_type: "tattoo",
      status: "confirmed",
      service_description: "Tatuagem Geométrica - Antebraço",
      estimated_price: 900,
      notes: "Design personalizado",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    
    // Dia 23 
    {
      id: "6",
      client_id: "1",
      artist_id: "4",
      date: "2024-12-23",
      time: "13:00",
      duration_minutes: 240,
      service_type: "tattoo",
      status: "scheduled",
      service_description: "Tatuagem Oriental - Braço Completo",
      estimated_price: 1500,
      notes: "Sessão de fechamento",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    {
      id: "23a",
      client_id: "2",
      artist_id: "1",
      date: "2024-12-23",
      time: "09:30",
      duration_minutes: 90,
      service_type: "removal",
      status: "confirmed",
      service_description: "Remoção a Laser - Pulso",
      estimated_price: 400,
      notes: "Segunda sessão",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    {
      id: "23b",
      client_id: "3",
      artist_id: "5",
      date: "2024-12-23",
      time: "17:30",
      duration_minutes: 75,
      service_type: "piercing",
      status: "scheduled",
      service_description: "Piercing Helix",
      estimated_price: 180,
      notes: "Múltiplos piercings",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    
    // Dia 24
    {
      id: "7",
      client_id: "2",
      artist_id: "1",
      date: "2024-12-24",
      time: "09:30",
      duration_minutes: 90,
      service_type: "tattoo",
      status: "confirmed",
      service_description: "Tatuagem Minimalista - Pulso",
      estimated_price: 300,
      notes: "Design delicado",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    {
      id: "8",
      client_id: "3",
      artist_id: "5",
      date: "2024-12-24",
      time: "16:00",
      duration_minutes: 120,
      service_type: "tattoo",
      status: "completed",
      service_description: "Tatuagem Tradicional - Panturrilha",
      estimated_price: 700,
      notes: "Estilo old school",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    
    // NOVOS DIAS COM ABUNDANTE VARIEDADE
    
    // Dia 16 (segunda-feira movimentada)
    {
      id: "16a",
      client_id: "1",
      artist_id: "1",
      date: "2024-12-16",
      time: "08:00",
      duration_minutes: 180,
      service_type: "tattoo",
      status: "confirmed",
      service_description: "Tatuagem Realista - Retrato",
      estimated_price: 1000,
      notes: "Sessão matinal",
      created_at: "2024-12-15T10:00:00Z",
      updated_at: "2024-12-15T10:00:00Z"
    },
    {
      id: "16b",
      client_id: "2",
      artist_id: "2",
      date: "2024-12-16",
      time: "10:30",
      duration_minutes: 120,
      service_type: "tattoo",
      status: "confirmed",
      service_description: "Tatuagem Tribal - Ombro",
      estimated_price: 750,
      notes: "Estilo tradicional",
      created_at: "2024-12-15T10:00:00Z",
      updated_at: "2024-12-15T10:00:00Z"
    },
    {
      id: "16c",
      client_id: "3",
      artist_id: "3",
      date: "2024-12-16",
      time: "14:00",
      duration_minutes: 60,
      service_type: "piercing",
      status: "scheduled",
      service_description: "Piercing Industrial",
      estimated_price: 200,
      notes: "Piercing complexo",
      created_at: "2024-12-15T10:00:00Z",
      updated_at: "2024-12-15T10:00:00Z"
    },
    {
      id: "16d",
      client_id: "4",
      artist_id: "4",
      date: "2024-12-16",
      time: "16:30",
      duration_minutes: 90,
      service_type: "removal",
      status: "confirmed",
      service_description: "Remoção a Laser - Antebraço",
      estimated_price: 500,
      notes: "Primeira sessão",
      created_at: "2024-12-15T10:00:00Z",
      updated_at: "2024-12-15T10:00:00Z"
    },
    {
      id: "16e",
      client_id: "5",
      artist_id: "5",
      date: "2024-12-16",
      time: "18:00",
      duration_minutes: 45,
      service_type: "consultation",
      status: "scheduled",
      service_description: "Consulta - Cover Up",
      estimated_price: 150,
      notes: "Avaliação cobertura",
      created_at: "2024-12-15T10:00:00Z",
      updated_at: "2024-12-15T10:00:00Z"
    },
    
    // Dia 17 (terça-feira moderada)
    {
      id: "17a",
      client_id: "1",
      artist_id: "2",
      date: "2024-12-17",
      time: "09:00",
      duration_minutes: 150,
      service_type: "tattoo",
      status: "confirmed",
      service_description: "Tatuagem Neo-tradicional - Perna",
      estimated_price: 900,
      notes: "Cores vibrantes",
      created_at: "2024-12-16T10:00:00Z",
      updated_at: "2024-12-16T10:00:00Z"
    },
    {
      id: "17b",
      client_id: "3",
      artist_id: "4",
      date: "2024-12-17",
      time: "15:00",
      duration_minutes: 120,
      service_type: "tattoo",
      status: "scheduled",
      service_description: "Tatuagem Aquarela - Costas",
      estimated_price: 850,
      notes: "Técnica especial",
      created_at: "2024-12-16T10:00:00Z",
      updated_at: "2024-12-16T10:00:00Z"
    },
    
    // Dia 18 (quarta-feira intensa)
    {
      id: "18a",
      client_id: "2",
      artist_id: "1",
      date: "2024-12-18",
      time: "08:30",
      duration_minutes: 240,
      service_type: "tattoo",
      status: "confirmed",
      service_description: "Tatuagem Japonesa - Braço Completo",
      estimated_price: 1800,
      notes: "Sessão longa - Dragão",
      created_at: "2024-12-17T10:00:00Z",
      updated_at: "2024-12-17T10:00:00Z"
    },
    {
      id: "18b",
      client_id: "4",
      artist_id: "3",
      date: "2024-12-18",
      time: "13:30",
      duration_minutes: 90,
      service_type: "piercing",
      status: "confirmed",
      service_description: "Piercing Daith + Conch",
      estimated_price: 250,
      notes: "Combo piercings",
      created_at: "2024-12-17T10:00:00Z",
      updated_at: "2024-12-17T10:00:00Z"
    },
    {
      id: "18c",
      client_id: "5",
      artist_id: "5",
      date: "2024-12-18",
      time: "16:00",
      duration_minutes: 180,
      service_type: "tattoo",
      status: "scheduled",
      service_description: "Tatuagem Biomecânica - Perna",
      estimated_price: 1200,
      notes: "Estilo futurista",
      created_at: "2024-12-17T10:00:00Z",
      updated_at: "2024-12-17T10:00:00Z"
    },
    
    // Dia 19 (quinta-feira focada)
    {
      id: "19a",
      client_id: "1",
      artist_id: "4",
      date: "2024-12-19",
      time: "10:00",
      duration_minutes: 120,
      service_type: "removal",
      status: "confirmed",
      service_description: "Remoção a Laser - Ombro",
      estimated_price: 600,
      notes: "Terceira sessão",
      created_at: "2024-12-18T10:00:00Z",
      updated_at: "2024-12-18T10:00:00Z"
    },
    {
      id: "19b",
      client_id: "3",
      artist_id: "2",
      date: "2024-12-19",
      time: "14:30",
      duration_minutes: 150,
      service_type: "tattoo",
      status: "scheduled",
      service_description: "Tatuagem Pontilhismo - Antebraço",
      estimated_price: 800,
      notes: "Técnica detalhada",
      created_at: "2024-12-18T10:00:00Z",
      updated_at: "2024-12-18T10:00:00Z"
    },
    
    // Dia 20 (sexta-feira completa)
    {
      id: "20a",
      client_id: "2",
      artist_id: "1",
      date: "2024-12-20",
      time: "09:00",
      duration_minutes: 180,
      service_type: "tattoo",
      status: "confirmed",
      service_description: "Tatuagem Surrealista - Costela",
      estimated_price: 1100,
      notes: "Arte conceitual",
      created_at: "2024-12-19T10:00:00Z",
      updated_at: "2024-12-19T10:00:00Z"
    },
    {
      id: "20b",
      client_id: "4",
      artist_id: "3",
      date: "2024-12-20",
      time: "13:00",
      duration_minutes: 75,
      service_type: "piercing",
      status: "confirmed",
      service_description: "Piercing Septum + Bridge",
      estimated_price: 300,
      notes: "Piercings faciais",
      created_at: "2024-12-19T10:00:00Z",
      updated_at: "2024-12-19T10:00:00Z"
    },
    {
      id: "20c",
      client_id: "5",
      artist_id: "5",
      date: "2024-12-20",
      time: "15:30",
      duration_minutes: 60,
      service_type: "consultation",
      status: "scheduled",
      service_description: "Consulta - Tatuagem Chicano",
      estimated_price: 120,
      notes: "Estilo específico",
      created_at: "2024-12-19T10:00:00Z",
      updated_at: "2024-12-19T10:00:00Z"
    },
    {
      id: "20d",
      client_id: "1",
      artist_id: "4",
      date: "2024-12-20",
      time: "17:00",
      duration_minutes: 90,
      service_type: "tattoo",
      status: "confirmed",
      service_description: "Tatuagem Fine Line - Pulso",
      estimated_price: 400,
      notes: "Traços delicados",
      created_at: "2024-12-19T10:00:00Z",
      updated_at: "2024-12-19T10:00:00Z"
    },
    
    // Mais dias para testar abundância
    // Dia 25 (sábado especial)
    {
      id: "25a",
      client_id: "1",
      artist_id: "1",
      date: "2024-12-25",
      time: "10:00",
      duration_minutes: 150,
      service_type: "tattoo",
      status: "scheduled",
      service_description: "Tatuagem Natalina - Especial",
      estimated_price: 650,
      notes: "Edição limitada",
      created_at: "2024-12-24T10:00:00Z",
      updated_at: "2024-12-24T10:00:00Z"
    },
    
    // Dia 26 (domingo relaxado)
    {
      id: "26a",
      client_id: "2",
      artist_id: "2",
      date: "2024-12-26",
      time: "14:00",
      duration_minutes: 90,
      service_type: "consultation",
      status: "scheduled",
      service_description: "Consulta - Projeto Grande",
      estimated_price: 200,
      notes: "Planejamento sleeve",
      created_at: "2024-12-25T10:00:00Z",
      updated_at: "2024-12-25T10:00:00Z"
    },
    {
      id: "26b",
      client_id: "3",
      artist_id: "3",
      date: "2024-12-26",
      time: "16:30",
      duration_minutes: 120,
      service_type: "piercing",
      status: "confirmed",
      service_description: "Piercing Genital - Consulta",
      estimated_price: 350,
      notes: "Procedimento especializado",
      created_at: "2024-12-25T10:00:00Z",
      updated_at: "2024-12-25T10:00:00Z"
    }
  ];

  const mockClients: Client[] = [
    { 
      id: "1", 
      name: "Maria Silva", 
      phone: "(11) 99999-1234", 
      email: "maria@email.com",
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-12-20T10:00:00Z",
      total_spent: 2300,
      total_orders: 3
    },
    { 
      id: "2", 
      name: "João Santos", 
      phone: "(11) 88888-5678", 
      email: "joao@email.com",
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-12-20T10:00:00Z",
      total_spent: 900,
      total_orders: 2
    },
    { 
      id: "3", 
      name: "Ana Costa", 
      phone: "(11) 77777-9012", 
      email: "ana@email.com",
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-12-20T10:00:00Z",
      total_spent: 1900,
      total_orders: 2
    },
    { 
      id: "4", 
      name: "Pedro Oliveira", 
      phone: "(11) 66666-3456", 
      email: "pedro@email.com",
      status: "new",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-12-20T10:00:00Z",
      total_spent: 200,
      total_orders: 1
    },
    { 
      id: "5", 
      name: "Carla Mendes", 
      phone: "(11) 55555-7890", 
      email: "carla@email.com",
      status: "active",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-12-20T10:00:00Z",
      total_spent: 1600,
      total_orders: 2
    }
  ];

  const { data: appointments = mockAppointments } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => mockAppointments,
  });

  const { data: clients = mockClients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => mockClients,
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (appointmentData: any) => {
      // Simular criação
      return { ...appointmentData, id: Date.now().toString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Agendamento criado",
        description: "O agendamento foi criado com sucesso.",
      });
    },
  });

  const rescheduleAppointmentMutation = useMutation({
    mutationFn: async ({ appointmentId, newDate }: { appointmentId: string; newDate: string }) => {
      // Simular reagendamento
      return { appointmentId, newDate };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast({
        title: "Agendamento reagendado",
        description: "O agendamento foi reagendado com sucesso.",
      });
    },
  });

  const handleCreateAppointment = (appointmentData: any) => {
    createAppointmentMutation.mutate(appointmentData);
  };

  const handleReschedule = (appointmentId: string, newDate: string) => {
    rescheduleAppointmentMutation.mutate({ appointmentId, newDate });
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCreateAppointmentForDate = (date: Date) => {
    handleCreateAppointment({
      date: format(date, 'yyyy-MM-dd'),
      time: "10:00",
      client_id: "1",
      artist_id: "1",
      duration_minutes: 60,
      status: "scheduled",
      service_description: "Nova tatuagem",
      estimated_price: 500
    });
  };

  // Calcular estatísticas
  const totalAppointments = appointments.length;
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length;
  const totalRevenue = appointments.reduce((sum, apt) => sum + (apt.estimated_price || 0), 0);
  const avgDuration = Math.round(
    appointments.reduce((sum, apt) => sum + (apt.duration_minutes || 0), 0) / appointments.length
  );

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas - DASHBOARD ORIGINAL PRESERVADO */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-6 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black">Gestão de Agendamentos</h1>
            <p className="text-red-100 font-medium">99Tattoo Dashboard Completo e Calendário Inteligente</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            <BarChart3 className="h-8 w-8" />
          </div>
        </div>

        {/* Estatísticas em Cards - DASHBOARD ORIGINAL PRESERVADO */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Total</p>
                <p className="text-2xl font-black">{totalAppointments}</p>
              </div>
              <Calendar className="h-6 w-6 text-red-200" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Confirmados</p>
                <p className="text-2xl font-black">{confirmedAppointments}</p>
              </div>
              <Clock className="h-6 w-6 text-green-300" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Receita</p>
                <p className="text-2xl font-black">R$ {totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-300" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Duração Média</p>
                <p className="text-2xl font-black">{avgDuration}min</p>
              </div>
              <Users className="h-6 w-6 text-blue-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de Visualização - LAYOUT ORIGINAL PRESERVADO */}
      <Tabs defaultValue="monthly" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-2">
          <TabsTrigger 
            value="monthly" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white font-bold transition-all duration-300"
          >
            <CalendarDays className="h-4 w-4 mr-2" />
            Calendário Mensal
          </TabsTrigger>
          <TabsTrigger 
            value="weekly" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white font-bold transition-all duration-300"
          >
            <Kanban className="h-4 w-4 mr-2" />
            Visão Semanal
          </TabsTrigger>
          <TabsTrigger 
            value="kanban" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white font-bold transition-all duration-300"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Kanban Semanal
          </TabsTrigger>
          <TabsTrigger 
            value="daily" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white font-bold transition-all duration-300"
          >
            <Clock className="h-4 w-4 mr-2" />
            Visualização Diária
          </TabsTrigger>
        </TabsList>

        {/* Calendário Mensal com Mini-Dashboards - COMPONENTE APRIMORADO */}
        <TabsContent value="monthly">
          <EnhancedMonthlyCalendar
            appointments={appointments}
            clients={clients}
            currentDate={currentDate}
            onCreateAppointment={handleCreateAppointment}
            onDayClick={handleDayClick}
          />
        </TabsContent>

        {/* Visualização Semanal Gráfica e Fluida */}
        <TabsContent value="weekly">
          <EnhancedWeeklyView
            appointments={appointments}
            clients={clients}
            currentDate={currentDate}
            onReschedule={handleReschedule}
            onDayClick={handleDayClick}
            onCreateAppointment={handleCreateAppointmentForDate}
          />
        </TabsContent>

        {/* Kanban Semanal Original */}
        <TabsContent value="kanban">
          <WeeklyAppointmentsKanban
            appointments={appointments}
            clients={clients}
            currentDate={currentDate}
            onReschedule={handleReschedule}
            onDayClick={handleDayClick}
            onCreateAppointment={handleCreateAppointmentForDate}
            onEditAppointment={(apt) => console.log('Edit appointment:', apt)}
            onDeleteAppointment={(id) => console.log('Delete appointment:', id)}
          />
        </TabsContent>

        {/* Visualização Diária */}
        <TabsContent value="daily">
          <Card className="bg-gradient-to-br from-white to-red-50 border-2 border-red-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-t-xl">
              <CardTitle className="text-xl font-black flex items-center gap-2">
                <Clock className="h-6 w-6" />
                Visualização Diária Detalhada
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <Clock className="h-16 w-16 mx-auto mb-4 text-red-400" />
                <h3 className="text-xl font-bold text-red-800 mb-2">Clique em um dia no calendário</h3>
                <p className="text-red-600">Para visualizar os agendamentos detalhados daquele dia</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Visualização Diária */}
      <DailyAppointmentsKanban
        selectedDate={selectedDate}
        appointments={appointments}
        clients={clients}
        onClose={() => setSelectedDate(null)}
        onReschedule={handleReschedule}
      />
    </div>
  );
};

export default Appointments;
