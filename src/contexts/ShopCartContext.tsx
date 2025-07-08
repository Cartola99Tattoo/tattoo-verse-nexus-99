
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

export type CartProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
};

type CartState = {
  items: CartProduct[];
  totalItems: number;
  totalPrice: number;
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Omit<CartProduct, 'quantity'>; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

const calculateTotals = (items: CartProduct[]): { totalItems: number; totalPrice: number } => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { totalItems, totalPrice };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.product.id);
      
      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        const totals = calculateTotals(updatedItems);
        return {
          items: updatedItems,
          ...totals,
        };
      } else {
        const newItem: CartProduct = {
          ...action.payload.product,
          quantity: action.payload.quantity,
        };
        const updatedItems = [...state.items, newItem];
        const totals = calculateTotals(updatedItems);
        return {
          items: updatedItems,
          ...totals,
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload.id);
      const totals = calculateTotals(updatedItems);
      return {
        items: updatedItems,
        ...totals,
      };
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { id: action.payload.id } });
      }
      
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
      );
      const totals = calculateTotals(updatedItems);
      return {
        items: updatedItems,
        ...totals,
      };
    }
    
    case 'CLEAR_CART': {
      return initialState;
    }
    
    default:
      return state;
  }
};

type CartContextType = {
  cart: CartState;
  addToCart: (product: Omit<CartProduct, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};

type CartProviderProps = {
  children: ReactNode;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  const { toast } = useToast();
  
  const addToCart = (product: Omit<CartProduct, 'quantity'>, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho com sucesso.`,
    });
  };
  
  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    toast({
      title: "Item removido",
      description: "O item foi removido do seu carrinho.",
      variant: "destructive",
    });
  };
  
  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast({
      title: "Carrinho limpo",
      description: "Todos os itens foram removidos do carrinho.",
    });
  };
  
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
