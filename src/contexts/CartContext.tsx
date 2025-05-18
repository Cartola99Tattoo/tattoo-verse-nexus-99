import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';

// Definir o tipo para os itens do carrinho
export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  artist: string;
  category: string;
  quantity: number;
  productType?: 'tattoo' | 'product';
  categoryType?: 'exclusive' | 'inspiration';
  // Campos específicos para tatuagens
  bodyPart?: string;
  size?: string;
  artDescription?: string;
  estimatedTime?: string;
  estimatedSessions?: number;
  // Campos específicos para produtos
  packageSize?: string;
  weight?: string;
};

// Estado do carrinho
type CartState = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
};

// Ações possíveis para o carrinho
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'UPDATE_ITEM'; payload: { id: number; data: Partial<CartItem> } };

// Valores iniciais do carrinho
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Função para calcular totais
const calculateCartTotals = (items: CartItem[]): { totalItems: number; totalPrice: number } => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { totalItems, totalPrice };
};

// Função de redução do carrinho
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (existingItemIndex > -1) {
        // Item já existe, atualizar quantidade
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        
        const totals = calculateCartTotals(updatedItems);
        return {
          ...state,
          items: updatedItems,
          ...totals,
        };
      } else {
        // Novo item
        const updatedItems = [...state.items, action.payload];
        const totals = calculateCartTotals(updatedItems);
        return {
          ...state,
          items: updatedItems,
          ...totals,
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload.id);
      const totals = calculateCartTotals(updatedItems);
      return {
        ...state,
        items: updatedItems,
        ...totals,
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        // Se a quantidade for 0 ou menos, remover o item
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { id } });
      }
      
      const updatedItems = state.items.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
      
      const totals = calculateCartTotals(updatedItems);
      return {
        ...state,
        items: updatedItems,
        ...totals,
      };
    }
    
    case 'CLEAR_CART': {
      return initialState;
    }
    
    case 'UPDATE_ITEM': {
      const { id, data } = action.payload;
      const updatedItems = state.items.map(item => 
        item.id === id ? { ...item, ...data } : item
      );
      
      return {
        ...state,
        items: updatedItems,
      };
    }
    
    default:
      return state;
  }
};

// Criar o contexto
type CartContextType = {
  cart: CartState;
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  updateCartItem: (id: number, data: Partial<CartItem>) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook personalizado para usar o contexto
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};

// Provedor do contexto
type CartProviderProps = {
  children: ReactNode;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  
  // Salvar no localStorage quando o carrinho mudar
  React.useEffect(() => {
    localStorage.setItem('99tattoo-cart', JSON.stringify(cart.items));
  }, [cart.items]);
  
  // Carregar do localStorage na inicialização
  React.useEffect(() => {
    const savedCart = localStorage.getItem('99tattoo-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        parsedCart.forEach((item: CartItem) => {
          dispatch({ type: 'ADD_ITEM', payload: item });
        });
      } catch (error) {
        console.error('Erro ao carregar o carrinho do localStorage:', error);
        localStorage.removeItem('99tattoo-cart');
      }
    }
  }, []);
  
  const addToCart = (product: Omit<CartItem, 'quantity'>, quantity = 1) => {
    dispatch({ 
      type: 'ADD_ITEM', 
      payload: { ...product, quantity } 
    });
    toast({
      title: 'Item adicionado',
      description: `${product.name} foi adicionado ao seu carrinho.`,
    });
  };
  
  const removeFromCart = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    toast({
      title: 'Item removido',
      description: 'O item foi removido do seu carrinho.',
      variant: 'destructive',
    });
  };
  
  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };
  
  const updateCartItem = (id: number, data: Partial<CartItem>) => {
    dispatch({ 
      type: 'UPDATE_ITEM', 
      payload: { id, data } 
    });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast({
      title: 'Carrinho limpo',
      description: 'Todos os itens foram removidos do carrinho.',
    });
  };
  
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateCartItem,
    clearCart,
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
