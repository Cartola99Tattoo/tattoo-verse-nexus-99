
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import CartDrawer from "./CartDrawer";
import { useCart } from "@/contexts/CartContext";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";

const CartButton = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useCart();

  return (
    <>
      <Button
        onClick={() => setIsCartOpen(true)}
        variant="ghost"
        size="icon"
        className="relative"
        aria-label="Abrir carrinho de compras"
      >
        <ShoppingCart className="h-5 w-5" />
        {cart.totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cart.totalItems}
          </span>
        )}
      </Button>
      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
};

export default CartButton;
