
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { 
  ProductType, 
  CategoryType, 
  TattooDetails, 
  SchedulingPreferences,
  TattooStyle,
  TattooSize,
  BodyPart
} from '@/services/interfaces/IProductService';

// Definir o tipo para os itens do carrinho
export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  artist: string;
  category: string;
  quantity: number;
  product_type?: ProductType;
  category_type?: CategoryType;
  tattoo_details?: TattooDetails;
  scheduling_preferences?: SchedulingPreferences;
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
  | { type: 'UPDATE_TATTOO_DETAILS'; payload: { id: number; tattoo_details: TattooDetails } }
  | { type: 'UPDATE_SCHEDULING_PREFERENCES'; payload: { id: number; scheduling_preferences: SchedulingPreferences } }
  | { type: 'CLEAR_CART' };

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

    case 'UPDATE_TATTOO_DETAILS': {
      const { id, tattoo_details } = action.payload;
      
      const updatedItems = state.items.map(item => 
        item.id === id ? { ...item, tattoo_details } : item
      );
      
      return {
        ...state,
        items: updatedItems,
      };
    }
    
    case 'UPDATE_SCHEDULING_PREFERENCES': {
      const { id, scheduling_preferences } = action.payload;
      
      const updatedItems = state.items.map(item => 
        item.id === id ? { ...item, scheduling_preferences } : item
      );
      
      return {
        ...state,
        items: updatedItems,
      };
    }
    
    case 'CLEAR_CART': {
      return initialState;
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
  updateTattooDetails: (id: number, tattoo_details: TattooDetails) => void;
  updateSchedulingPreferences: (id: number, scheduling_preferences: SchedulingPreferences) => void;
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
  useEffect(() => {
    localStorage.setItem('99tattoo-cart', JSON.stringify(cart.items));
  }, [cart.items]);
  
  // Carregar do localStorage na inicialização
  useEffect(() => {
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
    
    // Notificação de toast melhorada com posição e estilo específicos
    toast({
      title: `${product.name} adicionado ao carrinho`,
      description: `Quantidade: ${quantity} • Preço: R$ ${product.price.toFixed(2)}`,
      variant: "default",
      className: "bg-green-50 border-green-200 text-green-800",
    });
  };
  
  const removeFromCart = (id: number) => {
    // Obtém o nome do produto antes de removê-lo para usar na notificação
    const productToRemove = cart.items.find(item => item.id === id);
    const productName = productToRemove ? productToRemove.name : "Item";
    
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    
    // Notificação mais específica para remoção
    toast({
      title: `${productName} removido`,
      description: "O item foi removido do seu carrinho.",
      variant: "destructive",
    });
  };
  
  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    
    if (quantity > 0) {
      const item = cart.items.find(item => item.id === id);
      if (item) {
        toast({
          title: "Quantidade atualizada",
          description: `${item.name}: ${quantity} ${quantity === 1 ? 'unidade' : 'unidades'}`,
          variant: "default",
        });
      }
    }
  };

  const updateTattooDetails = (id: number, tattoo_details: TattooDetails) => {
    dispatch({ type: 'UPDATE_TATTOO_DETAILS', payload: { id, tattoo_details } });
    
    // Mensagem mais informativa quando os detalhes da tatuagem são atualizados
    toast({
      title: "Detalhes da tatuagem atualizados",
      description: "As especificações da sua tatuagem foram salvas com sucesso.",
      variant: "default",
      className: "bg-blue-50 border-blue-200 text-blue-800",
    });
  };
  
  const updateSchedulingPreferences = (id: number, scheduling_preferences: SchedulingPreferences) => {
    dispatch({ 
      type: 'UPDATE_SCHEDULING_PREFERENCES', 
      payload: { id, scheduling_preferences } 
    });
    
    // Notificação para atualização das preferências de agendamento
    toast({
      title: "Preferências de agendamento salvas",
      description: "Suas datas e horários preferenciais foram registrados.",
      variant: "default",
      className: "bg-blue-50 border-blue-200 text-blue-800",
    });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    
    // Notificação de limpeza do carrinho
    toast({
      title: "Carrinho esvaziado",
      description: "Todos os itens foram removidos do carrinho.",
      variant: "default",
    });
  };
  
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateTattooDetails,
    updateSchedulingPreferences,
    clearCart,
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
