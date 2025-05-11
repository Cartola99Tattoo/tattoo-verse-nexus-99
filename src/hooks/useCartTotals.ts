
import { useMemo } from 'react';
import { useCart } from './useCart';

export const useCartTotals = () => {
  const { items } = useCart();
  
  const cartTotalPrice = useMemo(() => {
    if (!items || items.length === 0) return 0;
    
    return items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }, [items]);
  
  const cartTotalItems = useMemo(() => {
    if (!items || items.length === 0) return 0;
    
    return items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  }, [items]);
  
  const cartSubtotal = cartTotalPrice;
  
  // Aqui você poderia adicionar cálculos para impostos, frete, etc.
  
  return {
    cartTotalPrice,
    cartTotalItems,
    cartSubtotal
  };
};
