import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Cart, CartItem, Product } from '@/types';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export const useCart = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cart, setCart] = useState<Cart | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Função para sincronizar o carrinho do localStorage com o Supabase quando o usuário fizer login
  const syncLocalCartWithDatabase = async (localCart: Cart) => {
    if (!user) return;
    
    try {
      // Buscar carrinho existente do usuário
      const { data: existingCart } = await supabase
        .from('carts')
        .select('*')
        .eq('customer_id', user.id)
        .maybeSingle();
      
      if (existingCart) {
        // Se existe um carrinho, deletar seus itens para sincronizar com o local
        await supabase.from('cart_items').delete().eq('cart_id', existingCart.id);
        
        // Adicionar itens do carrinho local
        if (localCart.items && localCart.items.length > 0) {
          const cartItemsToInsert = localCart.items.map(item => ({
            cart_id: existingCart.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
          }));
          
          await supabase.from('cart_items').insert(cartItemsToInsert);
        }
        
        // Atualizar carrinho
        setCart(existingCart);
        fetchCartItems(existingCart.id);
      } else {
        // Se não existe um carrinho, criar um novo
        const { data: newCart, error } = await supabase
          .from('carts')
          .insert({ customer_id: user.id })
          .select()
          .single();
        
        if (error) throw error;
        
        // Adicionar itens do carrinho local
        if (localCart.items && localCart.items.length > 0) {
          const cartItemsToInsert = localCart.items.map(item => ({
            cart_id: newCart.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
          }));
          
          await supabase.from('cart_items').insert(cartItemsToInsert);
        }
        
        // Atualizar carrinho
        setCart(newCart);
        fetchCartItems(newCart.id);
      }
      
      // Limpar localStorage após sincronização
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Error syncing cart:', error);
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível sincronizar seu carrinho. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  // Função para carregar o carrinho
  const loadCart = async () => {
    setIsLoading(true);
    
    try {
      if (user) {
        // Se o usuário estiver logado, buscar o carrinho do Supabase
        const { data, error } = await supabase
          .from('carts')
          .select('*')
          .eq('customer_id', user.id)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          setCart(data as Cart);
          fetchCartItems(data.id);
        } else {
          // Se não tiver carrinho, verificar se existe carrinho local para sincronizar
          const localCartString = localStorage.getItem('cart');
          if (localCartString) {
            const localCart = JSON.parse(localCartString);
            syncLocalCartWithDatabase(localCart);
          } else {
            // Criar um novo carrinho vazio
            const { data: newCart, error } = await supabase
              .from('carts')
              .insert({ customer_id: user.id })
              .select()
              .single();
              
            if (error) throw error;
            
            setCart(newCart as Cart);
            setItems([]);
          }
        }
      } else {
        // Se o usuário não estiver logado, usar localStorage
        const localCartString = localStorage.getItem('cart');
        if (localCartString) {
          const localCart = JSON.parse(localCartString);
          setCart(localCart);
          setItems(localCart.items || []);
          calculateTotals(localCart.items || []);
        } else {
          // Criar um carrinho local vazio
          const newCart = {
            id: `local-${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            items: []
          };
          localStorage.setItem('cart', JSON.stringify(newCart));
          setCart(newCart);
          setItems([]);
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      toast({
        title: "Erro ao carregar carrinho",
        description: "Não foi possível carregar seu carrinho. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para buscar os itens do carrinho
  const fetchCartItems = async (cartId: string) => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(*)
        `)
        .eq('cart_id', cartId);
        
      if (error) throw error;
      
      // Convert the data to the expected type
      const cartItems = data.map(item => ({
        ...item,
        status: 'available', // Add the missing status property
      })) as CartItem[];
      
      setItems(cartItems);
      calculateTotals(cartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  // Função para calcular totais
  const calculateTotals = (cartItems: CartItem[]) => {
    const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const price = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setTotalItems(total);
    setTotalPrice(price);
  };

  // Updated addToCart function to properly accept a Product object
  const addToCart = async (product: Product, quantity: number = 1) => {
    setIsAdding(true);
    
    try {
      if (user && cart) {
        // Verificar se o produto já está no carrinho
        const existingItem = items.find(item => item.product_id === product.id);
        
        if (existingItem) {
          // Atualizar quantidade do item existente
          const { error } = await supabase
            .from('cart_items')
            .update({ 
              quantity: existingItem.quantity + quantity,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingItem.id);
            
          if (error) throw error;
        } else {
          // Adicionar novo item
          const { error } = await supabase
            .from('cart_items')
            .insert({
              cart_id: cart.id,
              product_id: product.id,
              quantity,
              price: product.price
            });
            
          if (error) throw error;
        }
        
        // Recarregar itens do carrinho
        fetchCartItems(cart.id);
      } else {
        // Carrinho local
        const localCartString = localStorage.getItem('cart');
        const localCart = localCartString ? JSON.parse(localCartString) : {
          id: `local-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          items: []
        };
        
        const cartItems = localCart.items || [];
        const existingItemIndex = cartItems.findIndex((item: CartItem) => item.product_id === product.id);
        
        if (existingItemIndex >= 0) {
          // Atualizar quantidade do item existente
          cartItems[existingItemIndex].quantity += quantity;
        } else {
          // Adicionar novo item
          cartItems.push({
            id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            cart_id: localCart.id,
            product_id: product.id,
            quantity,
            price: product.price,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            product,
            status: 'available'
          });
        }
        
        localCart.items = cartItems;
        localCart.updated_at = new Date().toISOString();
        
        localStorage.setItem('cart', JSON.stringify(localCart));
        setCart(localCart);
        setItems(cartItems);
        calculateTotals(cartItems);
      }
      
      toast({
        title: "Produto adicionado",
        description: "O produto foi adicionado ao seu carrinho.",
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Erro ao adicionar produto",
        description: "Não foi possível adicionar o produto ao seu carrinho.",
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  };

  // Função para atualizar quantidade de um item
  const updateCartItemQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      if (user && cart) {
        const { error } = await supabase
          .from('cart_items')
          .update({ 
            quantity: newQuantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', itemId);
          
        if (error) throw error;
        
        fetchCartItems(cart.id);
      } else {
        // Carrinho local
        const localCartString = localStorage.getItem('cart');
        if (!localCartString) return;
        
        const localCart = JSON.parse(localCartString);
        const cartItems = localCart.items || [];
        
        const updatedItems = cartItems.map((item: CartItem) => {
          if (item.id === itemId) {
            return { ...item, quantity: newQuantity, updated_at: new Date().toISOString() };
          }
          return item;
        });
        
        localCart.items = updatedItems;
        localCart.updated_at = new Date().toISOString();
        
        localStorage.setItem('cart', JSON.stringify(localCart));
        setItems(updatedItems);
        calculateTotals(updatedItems);
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      toast({
        title: "Erro ao atualizar carrinho",
        description: "Não foi possível atualizar a quantidade do produto.",
        variant: "destructive"
      });
    }
  };

  // Função para remover um item do carrinho
  const removeCartItem = async (itemId: string) => {
    try {
      if (user && cart) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', itemId);
          
        if (error) throw error;
        
        fetchCartItems(cart.id);
      } else {
        // Carrinho local
        const localCartString = localStorage.getItem('cart');
        if (!localCartString) return;
        
        const localCart = JSON.parse(localCartString);
        const cartItems = localCart.items || [];
        
        const updatedItems = cartItems.filter((item: CartItem) => item.id !== itemId);
        
        localCart.items = updatedItems;
        localCart.updated_at = new Date().toISOString();
        
        localStorage.setItem('cart', JSON.stringify(localCart));
        setItems(updatedItems);
        calculateTotals(updatedItems);
      }
      
      toast({
        title: "Produto removido",
        description: "O produto foi removido do seu carrinho.",
      });
    } catch (error) {
      console.error('Error removing cart item:', error);
      toast({
        title: "Erro ao remover produto",
        description: "Não foi possível remover o produto do seu carrinho.",
        variant: "destructive"
      });
    }
  };

  // Função para limpar o carrinho
  const clearCart = async () => {
    try {
      if (user && cart) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', cart.id);
          
        if (error) throw error;
        
        setItems([]);
        setTotalItems(0);
        setTotalPrice(0);
      } else {
        // Carrinho local
        const localCartString = localStorage.getItem('cart');
        if (!localCartString) return;
        
        const localCart = JSON.parse(localCartString);
        
        localCart.items = [];
        localCart.updated_at = new Date().toISOString();
        
        localStorage.setItem('cart', JSON.stringify(localCart));
        setItems([]);
        setTotalItems(0);
        setTotalPrice(0);
      }
      
      toast({
        title: "Carrinho limpo",
        description: "Todos os produtos foram removidos do seu carrinho.",
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Erro ao limpar carrinho",
        description: "Não foi possível limpar seu carrinho.",
        variant: "destructive"
      });
    }
  };

  // Carregar carrinho ao inicializar e quando o usuário mudar
  useEffect(() => {
    loadCart();
  }, [user?.id]);

  return {
    cart,
    items,
    isLoading,
    isAdding,
    totalItems,
    totalPrice,
    addToCart,
    updateCartItemQuantity,
    removeCartItem,
    clearCart,
    syncLocalCartWithDatabase
  };
};
