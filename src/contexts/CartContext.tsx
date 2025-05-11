
import { ReactNode, createContext, useContext } from 'react';
import { CartItem, Product } from '@/types';
import { useCart as useCartHook } from '@/hooks/useCart';

// Definição da interface para o contexto do carrinho
interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  isAdding: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateCartItemQuantity: (itemId: string, newQuantity: number) => Promise<void>;
  removeCartItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

// Criação do contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider do contexto
export function CartProvider({ children }: { children: ReactNode }) {
  const {
    items,
    totalItems,
    totalPrice,
    isLoading,
    isAdding,
    addToCart,
    updateCartItemQuantity: updateQuantity,
    removeCartItem: removeItem,
    clearCart
  } = useCartHook();

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        isLoading,
        isAdding,
        addToCart,
        updateCartItemQuantity: updateQuantity,
        removeCartItem: removeItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook para utilizar o contexto
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
