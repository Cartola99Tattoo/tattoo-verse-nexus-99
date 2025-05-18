
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import CartDrawer from "./CartDrawer";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

const CartButton = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useCart();

  return (
    <>
      <Button
        onClick={() => setIsCartOpen(true)}
        variant="ghost"
        size="icon"
        className="relative md:static fixed bottom-4 right-4 md:bottom-auto md:right-auto z-50 md:z-auto bg-red-500 md:bg-transparent text-white md:text-inherit hover:bg-red-600 md:hover:bg-transparent shadow-lg md:shadow-none rounded-full md:rounded-md h-12 w-12 md:h-10 md:w-10"
        aria-label="Abrir carrinho de compras"
      >
        <ShoppingCart className="h-5 w-5" />
        {cart.totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 md:bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cart.totalItems}
          </span>
        )}
      </Button>
      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
};

export default CartButton;
