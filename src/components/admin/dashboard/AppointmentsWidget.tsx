
import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface Appointment {
  id: string;
  client_name?: string;
  artist_name?: string;
  start_date: string;
  end_date: string;
  status: string;
  description?: string;
}

export default function AppointmentsWidget() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('id, start_date, end_date, status, description, client_id, artist_id')
          .gte('start_date', new Date().toISOString())
          .order('start_date', { ascending: true })
          .limit(5);

        if (error) throw error;

        // Para cada agendamento, buscar os nomes dos clientes e artistas
        if (data) {
          const appointmentsWithNames = await Promise.all(
            data.map(async (appointment) => {
              // Buscar nome do cliente
              let clientName = 'Cliente não identificado';
              if (appointment.client_id) {
                const { data: client } = await supabase
                  .from('clients')
                  .select('name')
                  .eq('id', appointment.client_id)
                  .single();
                
                if (client) {
                  clientName = client.name;
                }
              }

              // Buscar nome do artista
              let artistName = 'Artista não identificado';
              if (appointment.artist_id) {
                const { data: artist } = await supabase
                  .from('artists')
                  .select('name')
                  .eq('id', appointment.artist_id)
                  .single();
                
                if (artist) {
                  artistName = artist.name;
                }
              }

              return {
                ...appointment,
                client_name: clientName,
                artist_name: artistName
              };
            })
          );

          setAppointments(appointmentsWithNames);
        }
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatTimeOnly = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex gap-4 items-start">
            <Skeleton className="h-10 w-10 rounded-md" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum agendamento próximo encontrado.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="flex gap-4 items-start">
          <div className="bg-purple-100 text-purple-800 p-2 rounded-md">
            <Calendar size={20} />
          </div>
          <div>
            <h4 className="font-medium">
              {appointment.client_name} 
              <span className="text-gray-500 text-sm ml-1">
                com {appointment.artist_name}
              </span>
            </h4>
            <p className="text-sm text-gray-500">
              {formatDateTime(appointment.start_date)} - {formatTimeOnly(appointment.end_date)}
            </p>
            {appointment.description && (
              <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                {appointment.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
