
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useCart } from './useCart';
import { useToast } from '@/hooks/use-toast';
import { Order, Address } from '@/types';

export const useCheckout = () => {
  const { user } = useAuth();
  const { cart, items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddresses, setShippingAddresses] = useState<Address[]>([]);
  const [billingAddresses, setBillingAddresses] = useState<Address[]>([]);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<string | null>(null);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<string | null>(null);
  const [useShippingForBilling, setUseShippingForBilling] = useState(true);
  
  // Função para carregar endereços do usuário
  const loadAddresses = async () => {
    if (!user) return;
    
    try {
      // Carregar endereços de entrega
      const { data: shippingData, error: shippingError } = await supabase
        .from('shipping_addresses')
        .select('*')
        .eq('customer_id', user.id);
        
      if (shippingError) throw shippingError;
      
      setShippingAddresses(shippingData as Address[]);
      
      // Carregar endereços de cobrança
      const { data: billingData, error: billingError } = await supabase
        .from('billing_addresses')
        .select('*')
        .eq('customer_id', user.id);
        
      if (billingError) throw billingError;
      
      setBillingAddresses(billingData as Address[]);
      
      // Selecionar endereços padrão
      const defaultShipping = shippingData.find(addr => addr.is_default);
      if (defaultShipping) setSelectedShippingAddress(defaultShipping.id);
      
      const defaultBilling = billingData.find(addr => addr.is_default);
      if (defaultBilling) setSelectedBillingAddress(defaultBilling.id);
    } catch (error) {
      console.error('Error loading addresses:', error);
      toast({
        title: "Erro ao carregar endereços",
        description: "Não foi possível carregar seus endereços. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  // Função para adicionar um novo endereço de entrega
  const addShippingAddress = async (addressData: Omit<Address, 'id' | 'customer_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para adicionar um endereço.",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('shipping_addresses')
        .insert({
          ...addressData,
          customer_id: user.id
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Atualizar a lista de endereços
      setShippingAddresses([...shippingAddresses, data as Address]);
      
      // Se for o primeiro endereço ou definido como padrão, selecioná-lo
      if (shippingAddresses.length === 0 || addressData.is_default) {
        setSelectedShippingAddress(data.id);
      }
      
      toast({
        title: "Endereço adicionado",
        description: "O endereço de entrega foi adicionado com sucesso.",
      });
      
      return data as Address;
    } catch (error) {
      console.error('Error adding shipping address:', error);
      toast({
        title: "Erro ao adicionar endereço",
        description: "Não foi possível adicionar o endereço de entrega.",
        variant: "destructive"
      });
      return null;
    }
  };
  
  // Função para adicionar um novo endereço de cobrança
  const addBillingAddress = async (addressData: Omit<Address, 'id' | 'customer_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para adicionar um endereço.",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('billing_addresses')
        .insert({
          ...addressData,
          customer_id: user.id
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Atualizar a lista de endereços
      setBillingAddresses([...billingAddresses, data as Address]);
      
      // Se for o primeiro endereço ou definido como padrão, selecioná-lo
      if (billingAddresses.length === 0 || addressData.is_default) {
        setSelectedBillingAddress(data.id);
      }
      
      toast({
        title: "Endereço adicionado",
        description: "O endereço de cobrança foi adicionado com sucesso.",
      });
      
      return data as Address;
    } catch (error) {
      console.error('Error adding billing address:', error);
      toast({
        title: "Erro ao adicionar endereço",
        description: "Não foi possível adicionar o endereço de cobrança.",
        variant: "destructive"
      });
      return null;
    }
  };
  
  // Função para processar o checkout
  const processCheckout = async (paymentMethod: string, schedulingPreferences?: { 
    preferred_date_1?: Date, 
    preferred_date_2?: Date, 
    preferred_date_3?: Date, 
    notes?: string 
  }) => {
    if (!user || !cart || items.length === 0) {
      toast({
        title: "Erro no checkout",
        description: "Verifique se você está logado e se o carrinho não está vazio.",
        variant: "destructive"
      });
      return null;
    }
    
    if (!selectedShippingAddress) {
      toast({
        title: "Endereço necessário",
        description: "Por favor, selecione um endereço de entrega.",
        variant: "destructive"
      });
      return null;
    }
    
    if (!useShippingForBilling && !selectedBillingAddress) {
      toast({
        title: "Endereço necessário",
        description: "Por favor, selecione um endereço de cobrança.",
        variant: "destructive"
      });
      return null;
    }
    
    setIsProcessing(true);
    
    try {
      // Gerar código de referência único
      const referenceCode = `ORDER-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      // Criar o pedido
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: user.id,
          total_amount: totalPrice,
          payment_method: paymentMethod,
          status: 'pending', // Inicial como pendente
          shipping_address_id: selectedShippingAddress,
          billing_address_id: useShippingForBilling ? selectedShippingAddress : selectedBillingAddress,
          reference_code: referenceCode
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Adicionar itens ao pedido
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
        
      if (itemsError) throw itemsError;
      
      // Adicionar preferências de agendamento, se fornecidas
      if (schedulingPreferences) {
        const { error: scheduleError } = await supabase
          .from('scheduling_preferences')
          .insert({
            order_id: order.id,
            preferred_date_1: schedulingPreferences.preferred_date_1?.toISOString(),
            preferred_date_2: schedulingPreferences.preferred_date_2?.toISOString(),
            preferred_date_3: schedulingPreferences.preferred_date_3?.toISOString(),
            notes: schedulingPreferences.notes
          });
          
        if (scheduleError) throw scheduleError;
      }
      
      // Chamar Edge Function para processar a integração
      const { data: integrationResult, error: integrationError } = await supabase.functions.invoke('create-order', {
        body: { order_id: order.id }
      });
      
      if (integrationError) {
        console.error('Integration error:', integrationError);
        // Ainda assim prosseguimos com o pedido, mas logamos o erro
      }
      
      // Limpar o carrinho após o pedido bem-sucedido
      await clearCart();
      
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      toast({
        title: "Pedido realizado",
        description: `Seu pedido foi realizado com sucesso! Código: ${referenceCode}`,
      });
      
      return order as Order;
    } catch (error) {
      console.error('Error processing checkout:', error);
      toast({
        title: "Erro no processamento",
        description: "Não foi possível processar seu pedido. Por favor, tente novamente.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    shippingAddresses,
    billingAddresses,
    selectedShippingAddress,
    selectedBillingAddress,
    useShippingForBilling,
    setSelectedShippingAddress,
    setSelectedBillingAddress,
    setUseShippingForBilling,
    loadAddresses,
    addShippingAddress,
    addBillingAddress,
    processCheckout
  };
};
