
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
import { useCart } from "@/contexts/ShopCartContext";
import { Link } from "react-router-dom";

interface ShopCartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ShopCartDrawer: React.FC<ShopCartDrawerProps> = ({ open, onOpenChange }) => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  
  if (cart.items.length === 0) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md bg-white">
          <SheetHeader className="mb-8">
            <SheetTitle className="text-2xl font-bold text-gray-900">Seu Carrinho</SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-900">Seu carrinho está vazio</h3>
            <p className="text-gray-500 text-center mb-6">
              Adicione alguns produtos incríveis ao seu carrinho!
            </p>
            <SheetClose asChild>
              <Button asChild className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                <Link to="/tatuadores-da-nova-era/shop">Ir para a loja</Link>
              </Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-white">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold text-gray-900">
            Seu Carrinho ({cart.totalItems} {cart.totalItems === 1 ? 'item' : 'itens'})
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-grow overflow-auto mb-6">
          {cart.items.map((item) => (
            <div key={item.id} className="flex border-b border-gray-200 py-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-grow">
                <h4 className="font-bold text-sm mb-1 text-gray-900 line-clamp-2">{item.name}</h4>
                <p className="text-gray-500 text-xs mb-2">{item.category}</p>
                <p className="font-bold mb-3 text-red-600">R$ {item.price.toFixed(2)}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100 rounded-l-lg"
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-3 py-2 text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100 rounded-r-lg"
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    aria-label="Remover item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-bold">R$ {cart.totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-xl font-bold text-red-600">R$ {cart.totalPrice.toFixed(2)}</span>
          </div>
          
          <div className="flex gap-2 mb-4">
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
              <Button asChild className="flex-grow bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                <Link to="/tatuadores-da-nova-era/shop">Continuar Comprando</Link>
              </Button>
            </SheetClose>
          </div>
          
          <SheetClose asChild>
            <Button asChild className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white mb-2">
              <Link to="/tatuadores-da-nova-era/shop/checkout">Finalizar Compra</Link>
            </Button>
          </SheetClose>
          
          <p className="text-xs text-gray-500 text-center">
            Frete calculado no checkout
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShopCartDrawer;
