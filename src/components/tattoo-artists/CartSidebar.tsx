import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Minus, X, ShoppingBag } from "lucide-react";
import { useTattooArtistShop } from "@/contexts/TattooArtistShopContext";
import { useNavigate } from 'react-router-dom';

interface CartSidebarProps {
  children: React.ReactNode;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ children }) => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useTattooArtistShop();
  const navigate = useNavigate();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleCheckout = () => {
    navigate('/tatuadores-da-nova-era/carrinho');
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="relative">
          {children}
          {getCartCount() > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {getCartCount()}
            </Badge>
          )}
        </div>
      </SheetTrigger>
      
      <SheetContent className="w-[400px] sm:w-[540px] bg-gradient-to-b from-gray-50 to-red-50">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl font-bold">
            <ShoppingCart className="h-6 w-6 text-red-600" />
            Carrinho de Compras
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Carrinho Vazio</h3>
              <p className="text-gray-500 mb-4">
                Adicione produtos incríveis ao seu carrinho!
              </p>
              <Button 
                onClick={() => navigate('/tatuadores-da-nova-era/shop')}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              >
                Continuar Comprando
              </Button>
            </div>
          ) : (
            <>
              {/* Lista de Produtos */}
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm border border-red-100">
                    <div className="flex items-start gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                        <p className="text-sm text-gray-500 mb-2">por {item.artist}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0 rounded-full"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-medium px-2">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0 rounded-full"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 rounded-full"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {formatCurrency(item.price)} × {item.quantity}
                      </span>
                      <span className="font-bold text-red-600">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Resumo */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-red-100">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Frete:</span>
                    <span>A calcular</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-red-600">{formatCurrency(getCartTotal())}</span>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="space-y-3">
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3"
                >
                  Ver Carrinho Completo
                </Button>
                <Button
                  onClick={() => navigate('/tatuadores-da-nova-era/shop')}
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                >
                  Continuar Comprando
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;