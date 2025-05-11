import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShoppingCart, ArrowRight, Plus, Minus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const { items, removeCartItem, updateCartItemQuantity, totalPrice, clearCart } = useCart();
  
  const subtotal = totalPrice;
  const shipping = items.length > 0 ? 0 : 0; // Free shipping in this example
  const total = subtotal + shipping;
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Meu Carrinho</h1>
        
        {items.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="hidden md:grid grid-cols-12 gap-4 mb-4 text-gray-500 font-medium">
                  <div className="col-span-6">Produto</div>
                  <div className="col-span-2 text-center">Preço</div>
                  <div className="col-span-2 text-center">Quantidade</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>
                
                <Separator className="mb-6 md:hidden" />
                
                {items.map(item => (
                  <div key={item.id} className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* Product Info */}
                      <div className="md:col-span-6 flex items-center gap-4">
                        <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                          {item.product && item.product.images && item.product.images.length > 0 ? (
                            <img 
                              src={item.product.images[0]} 
                              alt={item.product.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-xs">Sem imagem</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <Link 
                            to={`/shop/${item.product_id}`}
                            className="font-medium hover:text-red-500 transition-colors"
                          >
                            {item.product ? item.product.name : 'Produto indisponível'}
                          </Link>
                          {item.product && item.product.artist && (
                            <p className="text-gray-500 text-sm">Por {typeof item.product.artist === 'string' 
                              ? item.product.artist 
                              : item.product.artist.name}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="md:col-span-2 text-center">
                        <div className="md:hidden text-gray-500 mb-1">Preço:</div>
                        <span>R$ {item.price}</span>
                      </div>
                      
                      {/* Quantity */}
                      <div className="md:col-span-2 flex justify-center">
                        <div className="md:hidden text-gray-500 mb-1">Quantidade:</div>
                        <div className="flex items-center">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-3 w-6 text-center">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Total */}
                      <div className="md:col-span-2 text-right">
                        <div className="md:hidden text-gray-500 mb-1">Total:</div>
                        <span className="font-medium">R$ {item.price * item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="ml-2 text-gray-400 hover:text-red-500"
                          onClick={() => removeCartItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Separator className="my-6" />
                  </div>
                ))}
                
                <div className="flex justify-between">
                  <Button asChild variant="outline">
                    <Link to="/shop">
                      Continuar Comprando
                    </Link>
                  </Button>
                  <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => clearCart()}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar Carrinho
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold mb-4">Resumo do Pedido</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>R$ {subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frete</span>
                    <span>{shipping === 0 ? "Grátis" : `R$ ${shipping}`}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>R$ {total}</span>
                  </div>
                </div>
                
                <Button asChild className="w-full bg-red-500 hover:bg-red-600 text-white">
                  <Link to="/checkout">
                    Finalizar Compra
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                
                <div className="mt-6 text-sm text-gray-500">
                  <p>Métodos de pagamento aceitos:</p>
                  <div className="flex gap-2 mt-2">
                    <div className="bg-gray-100 rounded p-2">Visa</div>
                    <div className="bg-gray-100 rounded p-2">Mastercard</div>
                    <div className="bg-gray-100 rounded p-2">Pix</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold mb-2">Seu carrinho está vazio</h2>
            <p className="text-gray-600 mb-6">Explore nossa loja para encontrar a tatuagem perfeita para você!</p>
            <Button asChild>
              <Link to="/shop">
                Explorar Tatuagens
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
