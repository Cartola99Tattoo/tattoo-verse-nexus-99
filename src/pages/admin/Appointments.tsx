
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users, TrendingUp, BarChart3, CalendarDays, Kanban, Sun } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getClientService } from "@/services/serviceFactory";
import DailyAppointmentsKanban from "@/components/admin/DailyAppointmentsKanban";
import WeeklyAppointmentsKanban from "@/components/admin/WeeklyAppointmentsKanban";
import EnhancedMonthlyCalendar from "@/components/admin/EnhancedMonthlyCalendar";
import EnhancedWeeklyView from "@/components/admin/EnhancedWeeklyView";
import StudioDayByDay from "@/components/admin/StudioDayByDay";
import AppointmentModal from "@/components/admin/AppointmentModal";
import StudioDayByDayEnhanced from "@/components/admin/StudioDayByDayEnhanced";
import { format, addDays, subDays } from "date-fns";
import { Appointment, Client } from "@/services/interfaces/IClientService";

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentDate] = useState(new Date());
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [modalSelectedDate, setModalSelectedDate] = useState<Date | undefined>();
  const [studioDayByDayDate, setStudioDayByDayDate] = useState<Date>(new Date());
  const [showEnhancedDayView, setShowEnhancedDayView] = useState(false);
  const [enhancedDayViewDate, setEnhancedDayViewDate] = useState<Date>(new Date());
  const queryClient = useQueryClient();
  const clientService = getClientService();

  // Agendamentos expandidos para demonstrar todas as funcionalidades
  const mockAppointments: Appointment[] = [
    // Hoje (2024-12-21)
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
      status: "in_progress",
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
      status: "completed",
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
    // Amanhã (2024-12-22)
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
    {
      id: "22a",
      client_id: "6",
      artist_id: "1",
      date: "2024-12-22",
      time: "09:00",
      duration_minutes: 240,
      service_type: "tattoo",
      status: "confirmed",
      service_description: "Tatuagem Oriental - Manga Completa",
      estimated_price: 1800,
      notes: "Sessão inicial da manga",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    {
      id: "22b",
      client_id: "7",
      artist_id: "4",
      date: "2024-12-22",
      time: "17:00",
      duration_minutes: 75,
      service_type: "piercing",
      status: "scheduled",
      service_description: "Piercing Industrial",
      estimated_price: 200,
      notes: "Cliente experiente",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    // Segunda (2024-12-23)
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
      service_type: "consultation",
      status: "confirmed",
      service_description: "Consulta - Remoção a Laser",
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
    {
      id: "23c",
      client_id: "8",
      artist_id: "3",
      date: "2024-12-23",
      time: "11:00",
      duration_minutes: 120,
      service_type: "tattoo",
      status: "confirmed",
      service_description: "Tatuagem Tribal - Ombro",
      estimated_price: 650,
      notes: "Primeira tatuagem",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    {
      id: "23d",
      client_id: "9",
      artist_id: "2",
      date: "2024-12-23",
      time: "15:00",
      duration_minutes: 180,
      service_type: "tattoo",
      status: "scheduled",
      service_description: "Tatuagem Realista - Panturrilha",
      estimated_price: 1100,
      notes: "Retrato realista",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    // Terça (2024-12-24)
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
    {
      id: "24a",
      client_id: "10",
      artist_id: "4",
      date: "2024-12-24",
      time: "11:30",
      duration_minutes: 60,
      service_type: "consultation",
      status: "confirmed",
      service_description: "Consulta - Cover Up",
      estimated_price: 150,
      notes: "Avaliação para cobertura",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    {
      id: "24b",
      client_id: "6",
      artist_id: "2",
      date: "2024-12-24",
      time: "14:00",
      duration_minutes: 150,
      service_type: "tattoo",
      status: "scheduled",
      service_description: "Tatuagem Aquarela - Braço",
      estimated_price: 950,
      notes: "Técnica especial",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    // Quarta (2024-12-25) - Natal com menos agendamentos
    {
      id: "25a",
      client_id: "7",
      artist_id: "3",
      date: "2024-12-25",
      time: "14:00",
      duration_minutes: 90,
      service_type: "piercing",
      status: "scheduled",
      service_description: "Piercing Daith",
      estimated_price: 170,
      notes: "Natal especial",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    // Quinta (2024-12-26)
    {
      id: "26a",
      client_id: "8",
      artist_id: "1",
      date: "2024-12-26",
      time: "10:00",
      duration_minutes: 180,
      service_type: "tattoo",
      status: "confirmed",
      service_description: "Tatuagem Biomecânica - Braço",
      estimated_price: 1300,
      notes: "Design complexo",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    {
      id: "26b",
      client_id: "9",
      artist_id: "4",
      date: "2024-12-26",
      time: "15:30",
      duration_minutes: 120,
      service_type: "tattoo",
      status: "scheduled",
      service_description: "Tatuagem Lettering - Costela",
      estimated_price: 600,
      notes: "Frase motivacional",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    {
      id: "26c",
      client_id: "1",
      artist_id: "2",
      date: "2024-12-26",
      time: "09:00",
      duration_minutes: 90,
      service_type: "consultation",
      status: "confirmed",
      service_description: "Consulta - Segunda Sessão",
      estimated_price: 120,
      notes: "Continuação do trabalho",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    {
      id: "26d",
      client_id: "5",
      artist_id: "5",
      date: "2024-12-26",
      time: "13:00",
      duration_minutes: 150,
      service_type: "tattoo",
      status: "confirmed",
      service_description: "Tatuagem Mandala - Costas",
      estimated_price: 850,
      notes: "Trabalho detalhado",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    // Sexta (2024-12-27)
    {
      id: "27a",
      client_id: "4",
      artist_id: "3",
      date: "2024-12-27",
      time: "11:00",
      duration_minutes: 60,
      service_type: "piercing",
      status: "scheduled",
      service_description: "Piercing Conch",
      estimated_price: 160,
      notes: "Segundo piercing",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    {
      id: "27b",
      client_id: "10",
      artist_id: "1",
      date: "2024-12-27",
      time: "14:30",
      duration_minutes: 210,
      service_type: "tattoo",
      status: "confirmed",
      service_description: "Tatuagem Japonesa - Perna",
      estimated_price: 1400,
      notes: "Estilo tradicional japonês",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    {
      id: "27c",
      client_id: "6",
      artist_id: "2",
      date: "2024-12-27",
      time: "09:30",
      duration_minutes: 120,
      service_type: "tattoo",
      status: "in_progress",
      service_description: "Tatuagem Fine Line - Antebraço",
      estimated_price: 750,
      notes: "Linhas delicadas",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    // Sábado (2024-12-28) - Dia mais movimentado
    {
      id: "28a",
      client_id: "7",
      artist_id: "4",
      date: "2024-12-28",
      time: "09:00",
      duration_minutes: 180,
      service_type: "tattoo",
      status: "confirmed",
      service_description: "Tatuagem Neo Tradicional - Braço",
      estimated_price: 1200,
      notes: "Cores vibrantes",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    {
      id: "28b",
      client_id: "8",
      artist_id: "5",
      date: "2024-12-28",
      time: "13:30",
      duration_minutes: 150,
      service_type: "tattoo",
      status: "scheduled",
      service_description: "Tatuagem Dotwork - Costas",
      estimated_price: 900,
      notes: "Técnica pontilhismo",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    {
      id: "28c",
      client_id: "3",
      artist_id: "1",
      date: "2024-12-28",
      time: "16:30",
      duration_minutes: 90,
      service_type: "consultation",
      status: "confirmed",
      service_description: "Consulta - Projeto Grande",
      estimated_price: 200,
      notes: "Planejamento de múltiplas sessões",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    {
      id: "28d",
      client_id: "9",
      artist_id: "3",
      date: "2024-12-28",
      time: "11:00",
      duration_minutes: 120,
      service_type: "piercing",
      status: "confirmed",
      service_description: "Piercing Múltiplos - Orelha",
      estimated_price: 350,
      notes: "3 piercings simultâneos",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    },
    {
      id: "28e",
      client_id: "2",
      artist_id: "2",
      date: "2024-12-28",
      time: "18:00",
      duration_minutes: 60,
      service_type: "consultation",
      status: "scheduled",
      service_description: "Consulta - Retoque",
      estimated_price: 80,
      notes: "Avaliação pós-cicatrização",
      created_at: "2024-12-20T10:00:00Z",
      updated_at: "2024-12-20T10:00:00Z"
    }
  ];

  const mockClients: Client[] = [
    {
      id: "1",
      name: "João Silva",
      email: "joao@email.com",
      phone: "(11) 99999-0001",
      status: "vip",
      total_spent: 2500,
      total_orders: 3,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria@email.com",
      phone: "(11) 99999-0002",
      status: "returning",
      total_spent: 1800,
      total_orders: 2,
      created_at: "2024-01-02T00:00:00Z",
      updated_at: "2024-01-02T00:00:00Z"
    },
    {
      id: "3",
      name: "Pedro Costa",
      email: "pedro@email.com",
      phone: "(11) 99999-0003",
      status: "completed",
      total_spent: 1200,
      total_orders: 1,
      created_at: "2024-01-03T00:00:00Z",
      updated_at: "2024-01-03T00:00:00Z"
    },
    {
      id: "4",
      name: "Ana Oliveira",
      email: "ana@email.com",
      phone: "(11) 99999-0004",
      status: "interested",
      total_spent: 350,
      total_orders: 1,
      created_at: "2024-01-04T00:00:00Z",
      updated_at: "2024-01-04T00:00:00Z"
    },
    {
      id: "5",
      name: "Carlos Mendes",
      email: "carlos@email.com",
      phone: "(11) 99999-0005",
      status: "new",
      total_spent: 950,
      total_orders: 1,
      created_at: "2024-01-05T00:00:00Z",
      updated_at: "2024-01-05T00:00:00Z"
    },
    {
      id: "6",
      name: "Luciana Ferreira",
      email: "luciana@email.com",
      phone: "(11) 99999-0006",
      status: "returning",
      total_spent: 2750,
      total_orders: 3,
      created_at: "2024-01-06T00:00:00Z",
      updated_at: "2024-01-06T00:00:00Z"
    },
    {
      id: "7",
      name: "Rafael Batista",
      email: "rafael@email.com",
      phone: "(11) 99999-0007",
      status: "vip",
      total_spent: 1570,
      total_orders: 4,
      created_at: "2024-01-07T00:00:00Z",
      updated_at: "2024-01-07T00:00:00Z"
    },
    {
      id: "8",
      name: "Camila Rodrigues",
      email: "camila@email.com",
      phone: "(11) 99999-0008",
      status: "interested",
      total_spent: 1950,
      total_orders: 2,
      created_at: "2024-01-08T00:00:00Z",
      updated_at: "2024-01-08T00:00:00Z"
    },
    {
      id: "9",
      name: "Fernando Lima",
      email: "fernando@email.com",
      phone: "(11) 99999-0009",
      status: "returning",
      total_spent: 1700,
      total_orders: 2,
      created_at: "2024-01-09T00:00:00Z",
      updated_at: "2024-01-09T00:00:00Z"
    },
    {
      id: "10",
      name: "Beatriz Alves",
      email: "beatriz@email.com",
      phone: "(11) 99999-0010",
      status: "new",
      total_spent: 1550,
      total_orders: 1,
      created_at: "2024-01-10T00:00:00Z",
      updated_at: "2024-01-10T00:00:00Z"
    }
  ];

  const handleReschedule = (appointmentId: string, newDate: string) => {
    toast({
      title: "Agendamento reagendado",
      description: `Agendamento ${appointmentId} movido para ${newDate}`,
    });
  };

  const handleCreateAppointment = (date: Date, timeSlot?: string) => {
    setModalSelectedDate(date);
    setShowAppointmentModal(true);
  };

  // Handler specifically for calendar monthly view
  const handleCreateAppointmentFromCalendar = (appointmentData: Partial<Appointment>) => {
    console.log("Creating appointment from calendar:", appointmentData);
    toast({
      title: "Agendamento criado",
      description: "Novo agendamento foi criado com sucesso!",
    });
  };

  // Handler for appointment creation in modal
  const handleAppointmentCreated = (appointmentData: any) => {
    console.log("Appointment created:", appointmentData);
    toast({
      title: "Agendamento criado",
      description: "Novo agendamento foi criado com sucesso!",
    });
    setShowAppointmentModal(false);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    toast({
      title: "Editar agendamento",
      description: `Editando agendamento de ${appointment.service_description}`,
    });
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    toast({
      title: "Agendamento removido",
      description: `Agendamento ${appointmentId} foi removido`,
      variant: "destructive"
    });
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  // Nova função para abrir o painel diário aprimorado
  const handleDayClickEnhanced = (date: Date) => {
    setEnhancedDayViewDate(date);
    setShowEnhancedDayView(true);
  };

  const handleStudioDayChange = (date: Date) => {
    setStudioDayByDayDate(date);
  };

  // Handler para drag and drop no painel diário aprimorado
  const handleAppointmentStatusChange = (appointmentId: string, newStatus: 'scheduled' | 'in_progress' | 'completed') => {
    toast({
      title: "Status atualizado",
      description: `Agendamento movido para: ${newStatus === 'scheduled' ? 'Agendados' : newStatus === 'in_progress' ? 'Em Andamento' : 'Atendimento Realizado'}`,
    });
  };

  return (
    <div className="space-y-8 bg-gradient-to-br from-gray-50 via-red-50/30 to-white min-h-screen">
      {/* Header Principal */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-8 rounded-2xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-2">🎨 99TATTOO - Gestão de Agendamentos</h1>
          <p className="text-red-100 text-lg font-medium">Sistema Completo de Agendamentos com Kanban Semanal</p>
        </div>
      </div>

      {/* Tabs de Navegação */}
      <Tabs defaultValue="kanban-semanal" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white border-2 border-red-200 shadow-xl rounded-2xl p-2">
          <TabsTrigger 
            value="kanban-semanal" 
            className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white transition-all duration-300 rounded-xl font-bold"
          >
            <Kanban className="h-4 w-4" />
            Kanban Semanal
          </TabsTrigger>
          <TabsTrigger 
            value="calendario" 
            className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white transition-all duration-300 rounded-xl font-bold"
          >
            <Calendar className="h-4 w-4" />
            Calendário
          </TabsTrigger>
          <TabsTrigger 
            value="dia-a-dia" 
            className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white transition-all duration-300 rounded-xl font-bold"
          >
            <Sun className="h-4 w-4" />
            Dia a Dia
          </TabsTrigger>
          <TabsTrigger 
            value="estatisticas" 
            className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white transition-all duration-300 rounded-xl font-bold"
          >
            <BarChart3 className="h-4 w-4" />
            Estatísticas
          </TabsTrigger>
        </TabsList>

        {/* Kanban Semanal - Painel Principal */}
        <TabsContent value="kanban-semanal" className="mt-8">
          <WeeklyAppointmentsKanban
            appointments={mockAppointments}
            clients={mockClients}
            currentDate={currentDate}
            onReschedule={handleReschedule}
            onDayClick={handleDayClickEnhanced}
            onCreateAppointment={handleCreateAppointment}
            onEditAppointment={handleEditAppointment}
            onDeleteAppointment={handleDeleteAppointment}
          />
        </TabsContent>

        {/* Calendário Mensal */}
        <TabsContent value="calendario" className="mt-8">
          <EnhancedMonthlyCalendar
            appointments={mockAppointments}
            clients={mockClients}
            currentDate={currentDate}
            onDayClick={handleDayClick}
            onCreateAppointment={handleCreateAppointmentFromCalendar}
          />
        </TabsContent>

        {/* Visão Dia a Dia */}
        <TabsContent value="dia-a-dia" className="mt-8">
          <StudioDayByDay
            appointments={mockAppointments}
            clients={mockClients}
            selectedDate={studioDayByDayDate}
            onDateChange={handleStudioDayChange}
          />
        </TabsContent>

        {/* Estatísticas */}
        <TabsContent value="estatisticas" className="mt-8">
          <div className="grid gap-6">
            <Card className="bg-gradient-to-br from-white to-red-50 border-2 border-red-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Estatísticas Gerais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
                    <div className="text-2xl font-black text-red-800">{mockAppointments.length}</div>
                    <div className="text-red-600 font-medium">Total de Agendamentos</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="text-2xl font-black text-green-800">
                      R$ {mockAppointments.reduce((sum, apt) => sum + (apt.estimated_price || 0), 0).toLocaleString()}
                    </div>
                    <div className="text-green-600 font-medium">Receita Total</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="text-2xl font-black text-blue-800">
                      {mockAppointments.filter(apt => apt.status === 'confirmed').length}
                    </div>
                    <div className="text-blue-600 font-medium">Confirmados</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="text-2xl font-black text-purple-800">
                      {mockAppointments.filter(apt => apt.status === 'completed').length}
                    </div>
                    <div className="text-purple-600 font-medium">Concluídos</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <DailyAppointmentsKanban
        selectedDate={selectedDate}
        appointments={mockAppointments}
        clients={mockClients}
        onClose={() => setSelectedDate(null)}
        onReschedule={handleReschedule}
      />

      <AppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        selectedDate={modalSelectedDate}
        onCreateAppointment={handleAppointmentCreated}
        clients={mockClients}
      />

      {/* Novo Painel Diário Aprimorado */}
      <StudioDayByDayEnhanced
        isOpen={showEnhancedDayView}
        onClose={() => setShowEnhancedDayView(false)}
        selectedDate={enhancedDayViewDate}
        appointments={mockAppointments}
        clients={mockClients}
        onStatusChange={handleAppointmentStatusChange}
        onEditAppointment={handleEditAppointment}
        onDeleteAppointment={handleDeleteAppointment}
      />
    </div>
  );
};

export default Appointments;
