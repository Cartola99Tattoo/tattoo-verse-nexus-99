
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import CartDrawer from "./CartDrawer";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";
import { Toaster } from "sonner";

const CartButton = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useCart();
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [previousItemCount, setPreviousItemCount] = useState(cart.totalItems);

  // Função para detectar mudanças no carrinho e aplicar efeito de destaque
  useEffect(() => {
    if (cart.totalItems > previousItemCount) {
      setIsHighlighted(true);
      
      // Remover o destaque após a animação
      const timer = setTimeout(() => {
        setIsHighlighted(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
    
    setPreviousItemCount(cart.totalItems);
  }, [cart.totalItems, previousItemCount]);

  // Função para abrir o carrinho
  const handleOpenCart = () => {
    setIsCartOpen(true);
  };

  return (
    <>
      <Button
        onClick={handleOpenCart}
        variant="ghost"
        size="icon"
        className={`relative md:static fixed bottom-4 right-4 md:bottom-auto md:right-auto z-50 md:z-auto 
          ${isHighlighted ? 'animate-scale-in bg-red-600' : 'bg-red-500'} 
          md:bg-transparent text-white md:text-inherit 
          hover:bg-red-600 md:hover:bg-transparent 
          shadow-lg md:shadow-none rounded-full md:rounded-md 
          h-12 w-12 md:h-10 md:w-10 transition-all duration-200`}
        aria-label="Abrir carrinho de compras"
      >
        <ShoppingCart className={`h-5 w-5 ${isHighlighted ? 'animate-pulse' : ''}`} />
        {cart.totalItems > 0 && (
          <span className={`absolute -top-1 -right-1 
            bg-red-600 md:bg-red-500 text-white text-xs 
            rounded-full w-5 h-5 flex items-center justify-center
            ${isHighlighted ? 'animate-scale-in' : ''}`}>
            {cart.totalItems}
          </span>
        )}
      </Button>
      
      {/* Toaster para exibir notificações próximas ao ícone do carrinho */}
      <Toaster position="top-right" closeButton richColors />
      
      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
};

export default CartButton;
