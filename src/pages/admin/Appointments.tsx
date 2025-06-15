
import React, { useState, useCallback } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Calendar as CalendarIcon, Users, Clock, MapPin, Sparkles, Expand, Minimize, X, Eye, Scissors, User, BarChart3, TrendingUp, Timer, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import AppointmentForm from "@/components/admin/AppointmentForm";
import AppointmentEditModal from "@/components/admin/AppointmentEditModal";
import DailyAppointmentsKanban from "@/components/admin/DailyAppointmentsKanban";
import DailyAppointmentStatusKanban from "@/components/admin/DailyAppointmentStatusKanban";
import AppointmentsDashboard from "@/components/admin/AppointmentsDashboard";
import WeeklyAppointmentsKanban from "@/components/admin/WeeklyAppointmentsKanban";
import { Client, Appointment } from "@/services/interfaces/IClientService";
import { getClientService } from "@/services/serviceFactory";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/styles/calendar.css";

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 0 }),
  getDay,
  locales,
});

// Dados simulados expandidos significativamente para demonstração completa
const mockAppointments: Appointment[] = [
  // Dezembro 2024 - Semana 1
  {
    id: '1',
    client_id: '1',
    artist_id: '1',
    bed_id: '1',
    date: '2024-12-09',
    time: '09:00',
    duration_minutes: 120,
    service_type: 'tattoo',
    status: 'confirmed',
    service_description: 'Tatuagem dragão no braço',
    notes: 'Cliente regular',
    estimated_price: 300,
    created_at: '2024-12-08T10:00:00Z',
    updated_at: '2024-12-08T10:00:00Z',
  },
  {
    id: '2',
    client_id: '2',
    artist_id: '2',
    bed_id: '2',
    date: '2024-12-09',
    time: '10:30',
    duration_minutes: 90,
    service_type: 'tattoo',
    status: 'scheduled',
    service_description: 'Rosa no ombro',
    notes: 'Primeira sessão',
    estimated_price: 200,
    created_at: '2024-12-08T15:30:00Z',
    updated_at: '2024-12-08T15:30:00Z',
  },
  {
    id: '3',
    client_id: '3',
    artist_id: '1',
    bed_id: '1',
    date: '2024-12-09',
    time: '14:00',
    duration_minutes: 180,
    service_type: 'tattoo',
    status: 'confirmed',
    service_description: 'Mandala nas costas',
    notes: 'Sessão longa',
    estimated_price: 500,
    created_at: '2024-12-07T12:00:00Z',
    updated_at: '2024-12-07T12:00:00Z',
  },
  {
    id: '4',
    client_id: '4',
    artist_id: '3',
    bed_id: '3',
    date: '2024-12-10',
    time: '09:30',
    duration_minutes: 60,
    service_type: 'tattoo',
    status: 'scheduled',
    service_description: 'Retoque em tatuagem',
    notes: 'Cliente antigo',
    estimated_price: 100,
    created_at: '2024-12-09T09:00:00Z',
    updated_at: '2024-12-09T09:00:00Z',
  },
  {
    id: '5',
    client_id: '5',
    artist_id: '2',
    bed_id: '2',
    date: '2024-12-10',
    time: '15:30',
    duration_minutes: 150,
    service_type: 'tattoo',
    status: 'confirmed',
    service_description: 'Tatuagem tribal',
    notes: 'Design personalizado',
    estimated_price: 400,
    created_at: '2024-12-06T14:20:00Z',
    updated_at: '2024-12-06T14:20:00Z',
  },
  {
    id: '6',
    client_id: '1',
    artist_id: '1',
    bed_id: '1',
    date: '2024-12-11',
    time: '09:30',
    duration_minutes: 240,
    service_type: 'tattoo',
    status: 'confirmed',
    service_description: 'Sleeve completa',
    notes: 'Sessão 2 de 4',
    estimated_price: 800,
    created_at: '2024-12-05T16:45:00Z',
    updated_at: '2024-12-05T16:45:00Z',
  },
  {
    id: '7',
    client_id: '6',
    artist_id: '3',
    bed_id: '3',
    date: '2024-12-11',
    time: '16:00',
    duration_minutes: 90,
    service_type: 'tattoo',
    status: 'scheduled',
    service_description: 'Borboleta colorida',
    notes: 'Primeira tatuagem',
    estimated_price: 250,
    created_at: '2024-12-10T11:30:00Z',
    updated_at: '2024-12-10T11:30:00Z',
  },
  {
    id: '8',
    client_id: '7',
    artist_id: '1',
    bed_id: '1',
    date: '2024-12-12',
    time: '10:00',
    duration_minutes: 120,
    service_type: 'tattoo',
    status: 'confirmed',
    service_description: 'Lobo geométrico',
    notes: 'Cliente VIP',
    estimated_price: 450,
    created_at: '2024-12-11T08:00:00Z',
    updated_at: '2024-12-11T08:00:00Z',
  },
  {
    id: '9',
    client_id: '8',
    artist_id: '2',
    bed_id: '2',
    date: '2024-12-12',
    time: '14:30',
    duration_minutes: 90,
    service_type: 'piercing',
    status: 'scheduled',
    service_description: 'Piercing no nariz',
    notes: 'Primeira vez',
    estimated_price: 80,
    created_at: '2024-12-11T10:00:00Z',
    updated_at: '2024-12-11T10:00:00Z',
  },
  {
    id: '10',
    client_id: '9',
    artist_id: '3',
    bed_id: '3',
    date: '2024-12-13',
    time: '11:00',
    duration_minutes: 180,
    service_type: 'tattoo',
    status: 'confirmed',
    service_description: 'Fênix colorida',
    notes: 'Design complexo',
    estimated_price: 600,
    created_at: '2024-12-12T16:00:00Z',
    updated_at: '2024-12-12T16:00:00Z',
  },
  // Agendamentos adicionais para semana 2
  {
    id: '11',
    client_id: '10',
    artist_id: '1',
    bed_id: '1',
    date: '2024-12-16',
    time: '09:00',
    duration_minutes: 60,
    service_type: 'consultation',
    status: 'scheduled',
    service_description: 'Consulta para nova tatuagem',
    notes: 'Orçamento',
    estimated_price: 0,
    created_at: '2024-12-15T12:00:00Z',
    updated_at: '2024-12-15T12:00:00Z',
  },
  {
    id: '12',
    client_id: '2',
    artist_id: '2',
    bed_id: '2',
    date: '2024-12-16',
    time: '15:00',
    duration_minutes: 120,
    service_type: 'tattoo',
    status: 'confirmed',
    service_description: 'Continuação rosa no ombro',
    notes: 'Segunda sessão',
    estimated_price: 300,
    created_at: '2024-12-15T09:00:00Z',
    updated_at: '2024-12-15T09:00:00Z',
  },
  {
    id: '13',
    client_id: '3',
    artist_id: '3',
    bed_id: '3',
    date: '2024-12-17',
    time: '10:30',
    duration_minutes: 90,
    service_type: 'tattoo',
    status: 'confirmed',
    service_description: 'Finalizando mandala',
    notes: 'Última sessão',
    estimated_price: 250,
    created_at: '2024-12-16T14:00:00Z',
    updated_at: '2024-12-16T14:00:00Z',
  },
  {
    id: '14',
    client_id: '4',
    artist_id: '1',
    bed_id: '1',
    date: '2024-12-17',
    time: '14:00',
    duration_minutes: 120,
    service_type: 'tattoo',
    status: 'scheduled',
    service_description: 'Nova tatuagem perna',
    notes: 'Cliente fiel',
    estimated_price: 350,
    created_at: '2024-12-16T10:30:00Z',
    updated_at: '2024-12-16T10:30:00Z',
  },
  {
    id: '15',
    client_id: '5',
    artist_id: '2',
    bed_id: '2',
    date: '2024-12-18',
    time: '09:00',
    duration_minutes: 180,
    service_type: 'tattoo',
    status: 'confirmed',
    service_description: 'Tribal no braço direito',
    notes: 'Continuação do projeto',
    estimated_price: 450,
    created_at: '2024-12-17T11:00:00Z',
    updated_at: '2024-12-17T11:00:00Z',
  },
  // Semana 3 - Mais agendamentos
  {
    id: '16',
    client_id: '6',
    artist_id: '3',
    bed_id: '3',
    date: '2024-12-19',
    time: '13:30',
    duration_minutes: 150,
    service_type: 'tattoo',
    status: 'scheduled',
    service_description: 'Borboleta colorida - sessão 2',
    notes: 'Adicionando cores',
    estimated_price: 300,
    created_at: '2024-12-18T15:00:00Z',
    updated_at: '2024-12-18T15:00:00Z',
  },
  {
    id: '17',
    client_id: '7',
    artist_id: '1',
    bed_id: '1',
    date: '2024-12-20',
    time: '11:00',
    duration_minutes: 90,
    service_type: 'tattoo',
    status: 'confirmed',
    service_description: 'Retoque lobo geométrico',
    notes: 'Ajustes finais',
    estimated_price: 150,
    created_at: '2024-12-19T09:30:00Z',
    updated_at: '2024-12-19T09:30:00Z',
  },
  {
    id: '18',
    client_id: '8',
    artist_id: '2',
    bed_id: '2',
    date: '2024-12-20',
    time: '16:00',
    duration_minutes: 60,
    service_type: 'piercing',
    status: 'scheduled',
    service_description: 'Segundo piercing orelha',
    notes: 'Complementando o primeiro',
    estimated_price: 90,
    created_at: '2024-12-19T12:00:00Z',
    updated_at: '2024-12-19T12:00:00Z',
  },
  {
    id: '19',
    client_id: '9',
    artist_id: '3',
    bed_id: '3',
    date: '2024-12-21',
    time: '10:00',
    duration_minutes: 240,
    service_type: 'tattoo',
    status: 'confirmed',
    service_description: 'Fênix - sessão final',
    notes: 'Finalizando projeto grande',
    estimated_price: 600,
    created_at: '2024-12-20T08:00:00Z',
    updated_at: '2024-12-20T08:00:00Z',
  },
  // Agendamentos para o dia atual (hoje)
  {
    id: '20',
    client_id: '1',
    artist_id: '1',
    bed_id: '1',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    duration_minutes: 120,
    service_type: 'tattoo',
    status: 'confirmed',
    service_description: 'Tatuagem águia peito',
    notes: 'Agendamento de hoje',
    estimated_price: 400,
    created_at: '2024-12-14T08:00:00Z',
    updated_at: '2024-12-14T08:00:00Z',
  },
  {
    id: '21',
    client_id: '2',
    artist_id: '2',
    bed_id: '2',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '11:30',
    duration_minutes: 90,
    service_type: 'tattoo',
    status: 'in_progress',
    service_description: 'Rosa - adicionando detalhes',
    notes: 'Em atendimento agora',
    estimated_price: 200,
    created_at: '2024-12-14T09:00:00Z',
    updated_at: '2024-12-14T09:00:00Z',
  },
  {
    id: '22',
    client_id: '3',
    artist_id: '3',
    bed_id: '3',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '14:00',
    duration_minutes: 60,
    service_type: 'piercing',
    status: 'scheduled',
    service_description: 'Piercing labret',
    notes: 'Agendado para hoje',
    estimated_price: 100,
    created_at: '2024-12-14T10:00:00Z',
    updated_at: '2024-12-14T10:00:00Z',
  },
  {
    id: '23',
    client_id: '4',
    artist_id: '1',
    bed_id: '1',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '16:30',
    duration_minutes: 150,
    service_type: 'tattoo',
    status: 'confirmed',
    service_description: 'Continuação sleeve',
    notes: 'Sessão 3 de 4',
    estimated_price: 500,
    created_at: '2024-12-14T11:00:00Z',
    updated_at: '2024-12-14T11:00:00Z',
  },
  // Agendamentos para próximos dias
  {
    id: '24',
    client_id: '5',
    artist_id: '2',
    bed_id: '2',
    date: '2024-12-23',
    time: '10:00',
    duration_minutes: 180,
    service_type: 'tattoo',
    status: 'scheduled',
    service_description: 'Tribal costas completo',
    notes: 'Projeto grande',
    estimated_price: 700,
    created_at: '2024-12-21T14:00:00Z',
    updated_at: '2024-12-21T14:00:00Z',
  },
  {
    id: '25',
    client_id: '6',
    artist_id: '3',
    bed_id: '3',
    date: '2024-12-24',
    time: '09:00',
    duration_minutes: 120,
    service_type: 'tattoo',
    status: 'confirmed',
    service_description: 'Tatuagem natalina especial',
    notes: 'Véspera de Natal',
    estimated_price: 300,
    created_at: '2024-12-22T10:00:00Z',
    updated_at: '2024-12-22T10:00:00Z',
  },
  // Novos agendamentos para testar todas as funcionalidades
  {
    id: '26',
    client_id: '1',
    artist_id: '1',
    bed_id: '1',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '08:00',
    duration_minutes: 90,
    service_type: 'consultation',
    status: 'scheduled',
    service_description: 'Consulta inicial',
    notes: 'Primeira consulta',
    estimated_price: 0,
    created_at: '2024-12-15T07:00:00Z',
    updated_at: '2024-12-15T07:00:00Z',
  },
  {
    id: '27',
    client_id: '3',
    artist_id: '2',
    bed_id: '2',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '10:00',
    duration_minutes: 180,
    service_type: 'tattoo',
    status: 'confirmed',
    service_description: 'Sleeve completa - sessão 1',
    notes: 'Projeto grande',
    estimated_price: 800,
    created_at: '2024-12-15T08:00:00Z',
    updated_at: '2024-12-15T08:00:00Z',
  },
  {
    id: '28',
    client_id: '5',
    artist_id: '3',
    bed_id: '3',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '15:30',
    duration_minutes: 120,
    service_type: 'tattoo',
    status: 'in_progress',
    service_description: 'Tatuagem minimalista',
    notes: 'Em andamento',
    estimated_price: 350,
    created_at: '2024-12-15T14:00:00Z',
    updated_at: '2024-12-15T14:00:00Z',
  },
  {
    id: '29',
    client_id: '7',
    artist_id: '1',
    bed_id: '1',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '18:00',
    duration_minutes: 60,
    service_type: 'piercing',
    status: 'completed',
    service_description: 'Piercing helix',
    notes: 'Finalizado',
    estimated_price: 120,
    created_at: '2024-12-15T17:00:00Z',
    updated_at: '2024-12-15T17:00:00Z',
  },
  // Mais agendamentos para os próximos dias
  {
    id: '30',
    client_id: '2',
    artist_id: '2',
    bed_id: '2',
    date: '2024-12-16',
    time: '09:00',
    duration_minutes: 150,
    service_type: 'tattoo',
    status: 'confirmed',
    service_description: 'Tatuagem geométrica',
    notes: 'Design personalizado',
    estimated_price: 450,
    created_at: '2024-12-15T15:00:00Z',
    updated_at: '2024-12-15T15:00:00Z',
  },
  {
    id: '31',
    client_id: '4',
    artist_id: '3',
    bed_id: '3',
    date: '2024-12-16',
    time: '14:00',
    duration_minutes: 90,
    service_type: 'tattoo',
    status: 'scheduled',
    service_description: 'Retoque tatuagem antiga',
    notes: 'Manutenção',
    estimated_price: 150,
    created_at: '2024-12-15T13:00:00Z',
    updated_at: '2024-12-15T13:00:00Z',
  },
  {
    id: '32',
    client_id: '6',
    artist_id: '1',
    bed_id: '1',
    date: '2024-12-17',
    time: '11:00',
    duration_minutes: 240,
    service_type: 'tattoo',
    status: 'confirmed',
    service_description: 'Tatuagem tribal costas',
    notes: 'Sessão longa',
    estimated_price: 700,
    created_at: '2024-12-16T10:00:00Z',
    updated_at: '2024-12-16T10:00:00Z',
  },
  {
    id: '33',
    client_id: '8',
    artist_id: '2',
    bed_id: '2',
    date: '2024-12-17',
    time: '16:30',
    duration_minutes: 75,
    service_type: 'piercing',
    status: 'scheduled',
    service_description: 'Piercing nostril',
    notes: 'Cliente experiente',
    estimated_price: 100,
    created_at: '2024-12-16T15:00:00Z',
    updated_at: '2024-12-16T15:00:00Z',
  },
  {
    id: '34',
    client_id: '9',
    artist_id: '3',
    bed_id: '3',
    date: '2024-12-18',
    time: '13:00',
    duration_minutes: 180,
    service_type: 'tattoo',
    status: 'confirmed',
    service_description: 'Mandala colorida',
    notes: 'Arte complexa',
    estimated_price: 600,
    created_at: '2024-12-17T12:00:00Z',
    updated_at: '2024-12-17T12:00:00Z',
  },
  {
    id: '35',
    client_id: '10',
    artist_id: '1',
    bed_id: '1',
    date: '2024-12-19',
    time: '10:30',
    duration_minutes: 120,
    service_type: 'tattoo',
    status: 'scheduled',
    service_description: 'Primeira tatuagem',
    notes: 'Cliente nervoso',
    estimated_price: 300,
    created_at: '2024-12-18T09:00:00Z',
    updated_at: '2024-12-18T09:00:00Z',
  }
];

const mockClients: Client[] = [
  { 
    id: '1', 
    name: 'Ana Silva', 
    email: 'ana@email.com', 
    phone: '(11) 99999-1111',
    status: 'active',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-12-10T10:00:00Z',
    total_spent: 1500,
    total_orders: 4
  },
  { 
    id: '2', 
    name: 'Bruno Costa', 
    email: 'bruno@email.com', 
    phone: '(11) 99999-2222',
    status: 'active',
    created_at: '2024-02-20T14:30:00Z',
    updated_at: '2024-12-09T15:30:00Z',
    total_spent: 700,
    total_orders: 3
  },
  { 
    id: '3', 
    name: 'Carla Santos', 
    email: 'carla@email.com', 
    phone: '(11) 99999-3333',
    status: 'vip',
    created_at: '2023-11-05T09:15:00Z',
    updated_at: '2024-12-08T12:00:00Z',
    total_spent: 2800,
    total_orders: 6
  },
  { 
    id: '4', 
    name: 'Diego Ferreira', 
    email: 'diego@email.com', 
    phone: '(11) 99999-4444',
    status: 'returning',
    created_at: '2023-08-12T16:20:00Z',
    updated_at: '2024-12-11T09:00:00Z',
    total_spent: 1200,
    total_orders: 5
  },
  { 
    id: '5', 
    name: 'Elena Rodrigues', 
    email: 'elena@email.com', 
    phone: '(11) 99999-5555',
    status: 'active',
    created_at: '2024-03-08T11:45:00Z',
    updated_at: '2024-12-07T14:20:00Z',
    total_spent: 850,
    total_orders: 2
  },
  { 
    id: '6', 
    name: 'Felipe Oliveira', 
    email: 'felipe@email.com', 
    phone: '(11) 99999-6666',
    status: 'active',
    created_at: '2024-12-10T11:30:00Z',
    updated_at: '2024-12-10T11:30:00Z',
    total_spent: 550,
    total_orders: 2
  },
  { 
    id: '7', 
    name: 'Gabriela Lima', 
    email: 'gabriela@email.com', 
    phone: '(11) 99999-7777',
    status: 'vip',
    created_at: '2023-10-22T14:00:00Z',
    updated_at: '2024-12-12T08:00:00Z',
    total_spent: 2100,
    total_orders: 5
  },
  { 
    id: '8', 
    name: 'Hugo Martins', 
    email: 'hugo@email.com', 
    phone: '(11) 99999-8888',
    status: 'active',
    created_at: '2024-12-13T10:00:00Z',
    updated_at: '2024-12-13T10:00:00Z',
    total_spent: 170,
    total_orders: 2
  },
  { 
    id: '9', 
    name: 'Isabela Rocha', 
    email: 'isabela@email.com', 
    phone: '(11) 99999-9999',
    status: 'active',
    created_at: '2024-05-18T11:30:00Z',
    updated_at: '2024-12-14T16:00:00Z',
    total_spent: 1200,
    total_orders: 2
  },
  { 
    id: '10', 
    name: 'João Pereira', 
    email: 'joao@email.com', 
    phone: '(11) 99999-0000',
    status: 'new',
    created_at: '2024-12-15T12:00:00Z',
    updated_at: '2024-12-15T12:00:00Z',
    total_spent: 0,
    total_orders: 1
  }
];

const Appointments = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Appointment | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>('month');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedDayDate, setSelectedDayDate] = useState<Date | null>(null);
  const [selectedDayStatusDate, setSelectedDayStatusDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  const queryClient = useQueryClient();
  const clientService = getClientService();

  // Usar dados mock para demonstração
  const appointments = mockAppointments;
  const clients = mockClients;

  // Handler functions
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const handleSelectEvent = useCallback((event: any) => {
    const appointment = event.resource || event;
    setSelectedEvent(appointment);
    const client = clients.find(c => c.id === appointment.client_id);
    setSelectedClient(client || null);
  }, [clients]);

  const handleSelectSlot = useCallback((slotInfo: { start: Date; end: Date }) => {
    setSelectedSlot(slotInfo);
    setShowCreateForm(true);
  }, []);

  const handleViewChange = useCallback((view: View) => {
    setCurrentView(view);
  }, []);

  const handleDayStatusClick = useCallback((date: Date) => {
    setSelectedDayStatusDate(date);
  }, []);

  const handleCloseDayKanban = useCallback(() => {
    setSelectedDayDate(null);
  }, []);

  const handleCloseDayStatusKanban = useCallback(() => {
    setSelectedDayStatusDate(null);
  }, []);

  const handleCloseCreateForm = useCallback(() => {
    setShowCreateForm(false);
    setSelectedSlot(null);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setSelectedEvent(null);
    setSelectedClient(null);
  }, []);

  const handleFormSuccess = useCallback(() => {
    setShowCreateForm(false);
    setSelectedSlot(null);
    toast({
      title: "Agendamento criado",
      description: "O novo agendamento foi criado com sucesso.",
    });
  }, []);

  const handleEditSuccess = useCallback(() => {
    setSelectedEvent(null);
    setSelectedClient(null);
    toast({
      title: "Agendamento atualizado",
      description: "O agendamento foi atualizado com sucesso.",
    });
  }, []);

  const handleRescheduleAppointment = useCallback((appointment: Appointment) => {
    console.log('Reagendando:', appointment);
    toast({
      title: "Agendamento reagendado",
      description: "O agendamento foi reagendado com sucesso.",
    });
  }, []);

  const handleCreateAppointment = useCallback((date: Date) => {
    setSelectedSlot({ start: date, end: new Date(date.getTime() + 60 * 60 * 1000) });
    setShowCreateForm(true);
  }, []);

  const handleEditAppointment = useCallback((appointment: Appointment) => {
    setSelectedEvent(appointment);
    const client = clients.find(c => c.id === appointment.client_id);
    setSelectedClient(client || null);
  }, [clients]);

  const handleDeleteAppointment = useCallback((appointment: Appointment) => {
    console.log('Excluindo:', appointment);
    toast({
      title: "Agendamento excluído",
      description: "O agendamento foi excluído com sucesso.",
    });
  }, []);

  const calendarEvents = appointments.map(appointment => ({
    ...appointment,
    title: `${clients.find(c => c.id === appointment.client_id)?.name || 'Cliente'} - ${appointment.time}`,
    start: new Date(`${appointment.date}T${appointment.time}`),
    end: new Date(new Date(`${appointment.date}T${appointment.time}`).getTime() + appointment.duration_minutes * 60000),
    resource: appointment,
  }));

  // Função para determinar cor por tatuador/tipo de serviço
  const getAppointmentColor = (appointment: Appointment) => {
    // Cores por tatuador
    const artistColors = {
      '1': 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-600',
      '2': 'bg-gradient-to-r from-green-500 to-green-600 border-green-600',
      '3': 'bg-gradient-to-r from-purple-500 to-purple-600 border-purple-600',
    };

    // Cores por tipo de serviço
    const serviceColors = {
      'consultation': 'bg-gradient-to-r from-orange-500 to-orange-600 border-orange-600',
      'piercing': 'bg-gradient-to-r from-pink-500 to-pink-600 border-pink-600',
    };

    if (appointment.service_type === 'consultation') {
      return serviceColors.consultation;
    }
    if (appointment.service_type === 'piercing') {
      return serviceColors.piercing;
    }

    return artistColors[appointment.artist_id as keyof typeof artistColors] || 'bg-gradient-to-r from-red-500 to-red-600 border-red-600';
  };

  // Custom Day Cell Component para calendário compacto com tooltips
  const EnhancedDayCell = ({ date }: { date: Date }) => {
    const dayAppointments = appointments.filter(apt => 
      apt.date === format(date, 'yyyy-MM-dd')
    );
    
    const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
    
    return (
      <TooltipProvider>
        <div className="h-full min-h-[120px] p-2 bg-white border border-red-100 hover:bg-red-50/30 transition-all duration-300 cursor-pointer group hover:shadow-lg">
          <div className="flex flex-col h-full">
            {/* Cabeçalho do dia */}
            <div className="flex justify-between items-center mb-2">
              <span className={`text-lg font-bold ${isToday ? 'text-red-800' : 'text-red-700'}`}>
                {format(date, 'd')}
              </span>
              {dayAppointments.length > 0 && (
                <Badge className={`text-xs font-bold ${isToday ? 'bg-red-800' : 'bg-gradient-to-r from-red-600 to-red-800'} text-white`}>
                  {dayAppointments.length}
                </Badge>
              )}
            </div>
            
            {/* Lista compacta de agendamentos */}
            {dayAppointments.length > 0 && (
              <div className="flex-1 space-y-1 overflow-hidden">
                {dayAppointments.slice(0, 4).map((apt) => {
                  const client = clients.find(c => c.id === apt.client_id);
                  const colorClass = getAppointmentColor(apt);
                  
                  return (
                    <Tooltip key={apt.id}>
                      <TooltipTrigger asChild>
                        <div 
                          className={`text-xs ${colorClass} text-white p-1.5 rounded border-l-4 hover:shadow-md transition-all duration-200 cursor-pointer`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectEvent({ resource: apt });
                          }}
                        >
                          <div className="flex items-center justify-between gap-1 min-h-[16px]">
                            <span className="font-medium truncate">
                              {apt.time}
                            </span>
                            <span className="text-xs opacity-90 truncate max-w-[60px]">
                              {client?.name?.split(' ')[0] || 'Cliente'}
                            </span>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs p-3 bg-white border-2 border-red-200 shadow-xl">
                        <div className="space-y-2">
                          <div className="font-bold text-red-800 text-sm">
                            {client?.name || 'Cliente'} - {apt.time}
                          </div>
                          <div className="text-xs text-gray-600">
                            <div><strong>Tatuador:</strong> Artista {apt.artist_id}</div>
                            <div><strong>Serviço:</strong> {apt.service_description}</div>
                            <div><strong>Duração:</strong> {apt.duration_minutes} min</div>
                            <div><strong>Status:</strong> 
                              <Badge 
                                className={`ml-1 text-xs ${
                                  apt.status === 'confirmed' ? 'bg-green-500' :
                                  apt.status === 'scheduled' ? 'bg-blue-500' :
                                  apt.status === 'in_progress' ? 'bg-orange-500' :
                                  apt.status === 'completed' ? 'bg-purple-500' :
                                  'bg-gray-500'
                                }`}
                              >
                                {apt.status}
                              </Badge>
                            </div>
                            {apt.estimated_price && (
                              <div><strong>Valor:</strong> R$ {apt.estimated_price}</div>
                            )}
                            {apt.notes && (
                              <div><strong>Obs:</strong> {apt.notes}</div>
                            )}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
                
                {dayAppointments.length > 4 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-xs text-red-600 font-medium text-center bg-red-50 p-1 rounded border border-red-200 cursor-pointer hover:bg-red-100 transition-colors">
                        +{dayAppointments.length - 4} mais
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs p-3 bg-white border-2 border-red-200 shadow-xl">
                      <div className="space-y-1">
                        <div className="font-bold text-red-800 text-sm mb-2">
                          Agendamentos restantes:
                        </div>
                        {dayAppointments.slice(4).map((apt) => {
                          const client = clients.find(c => c.id === apt.client_id);
                          return (
                            <div key={apt.id} className="text-xs text-gray-600">
                              <strong>{apt.time}</strong> - {client?.name?.split(' ')[0] || 'Cliente'}
                            </div>
                          );
                        })}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            )}
            
            {/* Botão Ver Dia */}
            <div className="mt-auto pt-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDayStatusClick(date);
                }}
                variant="outline"
                className="w-full text-xs h-7 text-red-600 border-red-200 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-300 font-bold hover:border-red-300 hover:shadow-md"
              >
                <Eye className="h-3 w-3 mr-1" />
                Ver Dia
              </Button>
            </div>
          </div>
        </div>
      </TooltipProvider>
    );
  };

  // Mensagens em português brasileiro
  const messages = {
    today: 'Hoje',
    previous: '← Anterior',
    next: 'Próximo →',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    agenda: 'Agenda',
    date: 'Data',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'Não há agendamentos neste período',
    showMore: (total: number) => `+ ${total} agendamentos`,
    allDay: 'Dia inteiro',
    work_week: 'Semana de trabalho',
  };

  const containerClass = isFullscreen 
    ? "fixed inset-0 z-50 bg-gradient-to-br from-red-50 via-white to-red-50 overflow-auto p-4"
    : "p-4 bg-gradient-to-br from-red-50 via-white to-red-50 min-h-screen relative overflow-hidden";

  const calendarHeight = isFullscreen 
    ? 'calc(100vh - 280px)'
    : 'calc(100vh - 450px)';

  return (
    <div className={containerClass}>
      {/* Elementos decorativos de fundo */}
      {!isFullscreen && (
        <>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-red-100/20 via-transparent to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-red-100/15 via-transparent to-transparent rounded-full transform -translate-x-24 translate-y-24"></div>
        </>
      )}

      <div className="relative z-10">
        {/* Cabeçalho Principal */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-6 rounded-xl shadow-xl mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] animate-pulse"></div>
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-black">Gestão de Agendamentos 99Tattoo</h1>
                <p className="text-red-100 font-medium">Dashboard completo e calendário inteligente com fluxo Kanban</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={toggleFullscreen}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-bold"
              >
                {isFullscreen ? (
                  <>
                    <Minimize className="h-4 w-4 mr-2" />
                    Sair Tela Cheia
                  </>
                ) : (
                  <>
                    <Expand className="h-4 w-4 mr-2" />
                    Tela Cheia
                  </>
                )}
              </Button>
              
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-white text-red-700 hover:bg-red-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-bold"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Agendamento
              </Button>
            </div>
          </div>
        </div>

        {/* Navegação por Abas */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg mb-6">
            <TabsTrigger value="dashboard" className="text-white data-[state=active]:bg-white data-[state=active]:text-red-700 font-bold">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="monthly" className="text-white data-[state=active]:bg-white data-[state=active]:text-red-700 font-bold">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Mensal
            </TabsTrigger>
            <TabsTrigger value="weekly" className="text-white data-[state=active]:bg-white data-[state=active]:text-red-700 font-bold">
              <TrendingUp className="h-4 w-4 mr-2" />
              Semanal
            </TabsTrigger>
            <TabsTrigger value="daily" className="text-white data-[state=active]:bg-white data-[state=active]:text-red-700 font-bold">
              <Eye className="h-4 w-4 mr-2" />
              Diário
            </TabsTrigger>
          </TabsList>

          {/* Dashboard de Agendamentos */}
          <TabsContent value="dashboard" className="space-y-6">
            <AppointmentsDashboard 
              appointments={appointments} 
              clients={clients} 
            />
          </TabsContent>

          {/* Calendário Mensal Otimizado */}
          <TabsContent value="monthly" className="space-y-6">
            <div className="bg-white rounded-xl shadow-xl border-2 border-red-100/50 backdrop-blur-sm relative overflow-hidden">
              {/* Legenda de Cores */}
              <div className="p-4 bg-gradient-to-r from-red-50 to-white border-b border-red-200">
                <h3 className="text-sm font-bold text-red-800 mb-2">Legenda de Cores:</h3>
                <div className="flex flex-wrap gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
                    <span className="text-gray-700">Tatuador 1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded"></div>
                    <span className="text-gray-700">Tatuador 2</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded"></div>
                    <span className="text-gray-700">Tatuador 3</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded"></div>
                    <span className="text-gray-700">Consultas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-pink-600 rounded"></div>
                    <span className="text-gray-700">Piercings</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 p-2">
                <Calendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: calendarHeight }}
                  onSelectSlot={handleSelectSlot}
                  onSelectEvent={handleSelectEvent}
                  onNavigate={setCurrentDate}
                  onView={handleViewChange}
                  selectable
                  views={['month']}
                  view="month"
                  date={currentDate}
                  messages={messages}
                  culture="pt-BR"
                  className={cn(
                    "rounded-lg overflow-hidden",
                    isFullscreen ? "calendar-99tattoo-fullscreen" : "calendar-99tattoo-enhanced"
                  )}
                  eventPropGetter={(event) => ({
                    style: { display: 'none' }, // Esconder eventos padrão para usar componente customizado
                  })}
                  dayPropGetter={(date) => ({
                    className: cn(
                      "transition-colors duration-200 cursor-pointer",
                      format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && "today-cell"
                    ),
                  })}
                  components={{
                    dateCellWrapper: ({ children, value }) => (
                      <EnhancedDayCell date={value} />
                    ),
                  }}
                  formats={{
                    dayFormat: (date, culture, localizer) =>
                      localizer?.format(date, 'dd', culture) || '',
                    dayHeaderFormat: (date, culture, localizer) =>
                      localizer?.format(date, 'EEEE', culture) || '',
                    monthHeaderFormat: (date, culture, localizer) =>
                      localizer?.format(date, 'MMMM yyyy', culture) || '',
                  }}
                  step={30}
                  timeslots={2}
                  min={new Date(2024, 0, 1, 8, 0)}
                  max={new Date(2024, 0, 1, 20, 0)}
                  popup={false}
                />
              </div>
            </div>
          </TabsContent>

          {/* Calendário Semanal Kanban */}
          <TabsContent value="weekly" className="space-y-6">
            <WeeklyAppointmentsKanban
              appointments={appointments}
              clients={clients}
              currentDate={currentDate}
              onReschedule={handleRescheduleAppointment}
              onDayClick={handleDayStatusClick}
              onCreateAppointment={handleCreateAppointment}
              onEditAppointment={handleEditAppointment}
              onDeleteAppointment={handleDeleteAppointment}
            />
          </TabsContent>

          {/* Calendário Diário */}
          <TabsContent value="daily" className="space-y-6">
            <div className="text-center py-8">
              <CalendarIcon className="h-16 w-16 mx-auto mb-4 text-red-600" />
              <h3 className="text-xl font-bold text-red-800 mb-2">Visualização Diária</h3>
              <p className="text-red-600 mb-4">Clique em um dia no calendário mensal ou semanal para ver os detalhes</p>
              <Button
                onClick={() => handleDayStatusClick(new Date())}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-bold"
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Dia de Hoje
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal Criar Agendamento */}
      {showCreateForm && (
        <Dialog open={showCreateForm} onOpenChange={handleCloseCreateForm}>
          <DialogContent 
            className="max-w-5xl max-h-[95vh] overflow-auto bg-gradient-to-br from-white to-red-50 border-2 border-red-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <DialogHeader className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-6 rounded-xl -mx-6 -mt-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl font-black flex items-center gap-3">
                    <CalendarIcon className="h-6 w-6" />
                    Novo Agendamento
                  </DialogTitle>
                  <p className="text-red-100 text-lg">Preencha os dados para criar um novo agendamento</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCloseCreateForm} 
                  className="text-white hover:bg-white/20 transition-all duration-300"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </DialogHeader>
            
            <AppointmentForm
              selectedSlot={selectedSlot}
              clients={clients}
              onSuccess={handleFormSuccess}
              onClose={handleCloseCreateForm}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Modal Editar Agendamento */}
      <AppointmentEditModal
        appointment={selectedEvent}
        client={selectedClient}
        isOpen={!!selectedEvent}
        onClose={handleCloseEditModal}
        onUpdate={handleEditSuccess}
      />

      {/* Kanban Diário de Agendamentos (Horários) */}
      <DailyAppointmentsKanban
        selectedDate={selectedDayDate}
        appointments={appointments}
        clients={clients}
        onClose={handleCloseDayKanban}
        onReschedule={handleRescheduleAppointment}
      />

      {/* Kanban Diário de Status com Timer e CRUD Completo */}
      <DailyAppointmentStatusKanban
        selectedDate={selectedDayStatusDate}
        appointments={appointments}
        clients={clients}
        onClose={handleCloseDayStatusKanban}
        onUpdateAppointmentStatus={handleRescheduleAppointment}
        onCreateAppointment={handleCreateAppointment}
        onEditAppointment={handleEditAppointment}
        onDeleteAppointment={handleDeleteAppointment}
      />
    </div>
  );
};

export default Appointments;
