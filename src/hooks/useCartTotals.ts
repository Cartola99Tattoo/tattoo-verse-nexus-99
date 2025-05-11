
import { useMemo } from 'react';
import { useCart } from './useCart';

export const useCartTotals = () => {
  const { cart } = useCart();
  
  const cartTotalPrice = useMemo(() => {
    if (!cart || !cart.length) return 0;
    
    return cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }, [cart]);
  
  const cartTotalItems = useMemo(() => {
    if (!cart || !cart.length) return 0;
    
    return cart.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  }, [cart]);
  
  const cartSubtotal = cartTotalPrice;
  
  // Aqui você poderia adicionar cálculos para impostos, frete, etc.
  
  return {
    cartTotalPrice,
    cartTotalItems,
    cartSubtotal
  };
};
