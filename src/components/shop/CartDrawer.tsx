
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onOpenChange }) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  
  if (cart.items.length === 0) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader className="mb-5">
            <SheetTitle>Seu Carrinho</SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-bold mb-2">Seu carrinho está vazio</h3>
            <p className="text-gray-500 text-center mb-6">
              Adicione algumas tatuagens incríveis ao seu carrinho!
            </p>
            <SheetClose asChild>
              <Button asChild className="bg-red-500 hover:bg-red-600">
                <Link to="/shop">Ir para a loja</Link>
              </Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="mb-5">
          <SheetTitle>Seu Carrinho ({cart.totalItems} itens)</SheetTitle>
        </SheetHeader>
        
        <div className="flex-grow overflow-auto mb-4">
          {cart.items.map((item) => (
            <div key={item.id} className="flex border-b py-4">
              <div className="w-20 h-20 rounded-md overflow-hidden mr-4 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-grow">
                <h4 className="font-medium text-sm mb-1">{item.name}</h4>
                <p className="text-gray-500 text-xs mb-2">Artista: {item.artist}</p>
                <p className="font-bold mb-2">R$ {item.price}</p>
                
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 border rounded-md"
                    aria-label="Diminuir quantidade"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="mx-2 text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 border rounded-md"
                    aria-label="Aumentar quantidade"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-auto p-1.5 text-red-500 hover:bg-red-50 rounded-md"
                    aria-label="Remover item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-medium">R$ {cart.totalPrice.toFixed(2)}</span>
          </div>
          {cart.totalPrice > 0 && (
            <div className="flex justify-between mb-4">
              <span className="text-gray-500">Total</span>
              <span className="font-bold text-lg">R$ {cart.totalPrice.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex gap-2">
            {cart.items.length > 0 && (
              <Button
                variant="outline" 
                className="border-red-500 text-red-500 hover:bg-red-50"
                onClick={clearCart}
              >
                Limpar
              </Button>
            )}
            <SheetClose asChild>
              <Button asChild className="flex-grow bg-red-500 hover:bg-red-600">
                <Link to="/checkout">Finalizar Compra</Link>
              </Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
