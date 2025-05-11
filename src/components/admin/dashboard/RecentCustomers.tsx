
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  avatar_url?: string;
}

export default function RecentCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, avatar_url, created_at')
          .eq('role', 'cliente')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setCustomers(data || []);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${(firstName || '').charAt(0)}${(lastName || '').charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum cliente encontrado.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {customers.map((customer) => (
        <div key={customer.id} className="flex items-center gap-3">
          {customer.avatar_url ? (
            <img
              src={customer.avatar_url}
              alt={`${customer.first_name} ${customer.last_name}`}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-sm font-medium">
              {getInitials(customer.first_name, customer.last_name)}
            </div>
          )}
          <div>
            <h4 className="font-medium text-sm">
              {customer.first_name} {customer.last_name}
            </h4>
            <p className="text-xs text-gray-500">
              {customer.email || 'Sem email'} • {formatDate(customer.created_at)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
