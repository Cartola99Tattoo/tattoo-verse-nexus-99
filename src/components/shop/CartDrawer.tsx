
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ShoppingBag, Info } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { TattooDetails } from "@/services/interfaces/IProductService";
import TattooDetailsForm from "./TattooDetailsForm";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onOpenChange }) => {
  const { cart, removeFromCart, updateQuantity, clearCart, updateTattooDetails, updateSchedulingPreferences } = useCart();
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  
  // Lista de artistas disponíveis (em um sistema real, isso viria do backend)
  const availableArtists = ["João Silva", "Maria Souza", "Pedro Alves", "Ana Lima"];
  
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

  // Handle saving tattoo details
  const handleSaveTattooDetails = (id: number, details: TattooDetails) => {
    updateTattooDetails(id, details);
    setEditingItemId(null);
  };

  // Verifica se todos os itens de tatuagem têm detalhes preenchidos
  const allTattooDetailsComplete = !cart.items.some(
    item => item.product_type === 'tattoo' && (!item.tattoo_details || !item.tattoo_details.bodyPart)
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="mb-5">
          <SheetTitle>Seu Carrinho ({cart.totalItems} itens)</SheetTitle>
        </SheetHeader>
        
        <div className="flex-grow overflow-auto mb-4">
          {cart.items.map((item) => (
            <div key={item.id} className="border-b py-4">
              <div className="flex">
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
                  <p className="font-bold mb-2">R$ {item.price.toFixed(2)}</p>
                  
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

                  {/* Mostrar tipo do produto */}
                  {item.product_type && (
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100">
                        {item.product_type === 'tattoo' ? 'Tatuagem' : 'Produto'}
                      </span>
                      {item.category_type && (
                        <span className="inline-block ml-2 px-2 py-1 text-xs rounded-full bg-gray-100">
                          {item.category_type === 'exclusive' ? 'Arte Exclusiva' : 'Inspiração'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Tattoo details summary (if product is a tattoo and details are provided) */}
              {item.product_type === 'tattoo' && item.tattoo_details && editingItemId !== item.id && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-semibold text-sm">Detalhes da Tatuagem</h5>
                    <button
                      onClick={() => setEditingItemId(item.id)}
                      className="text-xs text-blue-500 hover:underline flex items-center"
                    >
                      <span>Editar</span>
                    </button>
                  </div>
                  
                  <div className="space-y-1">
                    {item.tattoo_details.style && (
                      <p><span className="font-medium">Estilo:</span> {item.tattoo_details.style}</p>
                    )}
                    {item.tattoo_details.bodyPart && (
                      <p><span className="font-medium">Local:</span> {item.tattoo_details.bodyPart}</p>
                    )}
                    {item.tattoo_details.size && (
                      <p><span className="font-medium">Tamanho:</span> {item.tattoo_details.size}</p>
                    )}
                    {item.tattoo_details.estimatedTime && (
                      <p><span className="font-medium">Tempo estimado:</span> {item.tattoo_details.estimatedTime}</p>
                    )}
                    {item.tattoo_details.estimatedSessions && (
                      <p><span className="font-medium">Sessões estimadas:</span> {item.tattoo_details.estimatedSessions}</p>
                    )}
                    {item.tattoo_details.preferredArtist && (
                      <p><span className="font-medium">Artista preferido:</span> {item.tattoo_details.preferredArtist}</p>
                    )}
                    {item.tattoo_details.description && (
                      <p><span className="font-medium">Descrição:</span> {item.tattoo_details.description}</p>
                    )}
                  </div>
                  
                  {/* Reference images */}
                  {item.tattoo_details.referenceImages && item.tattoo_details.referenceImages.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium mb-1">Imagens de referência:</p>
                      <div className="flex flex-wrap gap-2">
                        {item.tattoo_details.referenceImages.map((img, idx) => (
                          <div key={idx} className="w-14 h-14 rounded-md overflow-hidden">
                            <img src={img} alt={`Referência ${idx + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tattoo details form (if product is a tattoo and in edit mode) */}
              {item.product_type === 'tattoo' && editingItemId === item.id && (
                <TattooDetailsForm
                  initialDetails={item.tattoo_details}
                  artistName={item.artist}
                  availableArtists={availableArtists}
                  onSave={(details) => handleSaveTattooDetails(item.id, details)}
                />
              )}

              {/* Add details button if product is a tattoo and no details are provided yet */}
              {item.product_type === 'tattoo' && !item.tattoo_details && editingItemId !== item.id && (
                <div className="mt-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingItemId(item.id)}
                    className="w-full text-sm"
                  >
                    Adicionar detalhes da tatuagem
                  </Button>
                </div>
              )}
              
              {/* Copyright notice for tattoos */}
              {item.product_type === 'tattoo' && (
                <TattooCopyrightNotice artistName={item.artist} />
              )}
            </div>
          ))}
          
          {/* Alert for tattoo products without details */}
          {cart.items.some(item => item.product_type === 'tattoo' && !item.tattoo_details) && (
            <Alert className="mt-4 bg-amber-50 border-amber-200">
              <Info className="h-5 w-5 text-amber-500" />
              <AlertDescription className="text-amber-800 text-sm">
                Por favor, adicione os detalhes necessários para sua(s) tatuagem(ns) antes de prosseguir para o checkout.
              </AlertDescription>
            </Alert>
          )}
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
              <Button 
                asChild 
                className="flex-grow bg-red-500 hover:bg-red-600"
                disabled={cart.items.some(item => item.product_type === 'tattoo' && !item.tattoo_details)}
              >
                <Link to="/checkout">Finalizar Compra</Link>
              </Button>
            </SheetClose>
          </div>
          
          {/* Checkout message */}
          {cart.items.some(item => item.product_type === 'tattoo') && (
            <p className="text-xs text-gray-500 mt-4 text-center">
              Após a confirmação do pagamento, o artista entrará em contato para discutir 
              os detalhes da sua tatuagem, agendar a sessão e fornecer um orçamento final. 
              Este valor é uma estimativa inicial.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
