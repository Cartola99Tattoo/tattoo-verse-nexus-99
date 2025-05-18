
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CartItem } from "@/contexts/CartContext";
import { TattooDetails, SchedulingPreferences } from "@/services/interfaces/IProductService";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CheckoutSummaryProps {
  items: CartItem[];
  totalPrice: number;
  hasTattoos: boolean;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  items,
  totalPrice,
  hasTattoos,
}) => {
  // Function to format date for display
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="space-y-2 pb-3 border-b">
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                  <img 
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <span className="font-medium text-sm">R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-xs">
                    <span>{item.quantity}x R$ {item.price.toFixed(2)}</span>
                    <span>Artista: {item.artist}</span>
                  </div>
                  
                  {item.product_type && (
                    <div className="mt-1">
                      <Badge variant="outline" className="text-xs bg-gray-50">
                        {item.product_type === 'tattoo' ? 'Tatuagem' : 'Produto'}
                      </Badge>
                      {item.category_type && (
                        <Badge variant="outline" className="ml-1 text-xs bg-gray-50">
                          {item.category_type === 'exclusive' ? 'Arte Exclusiva' : 'Inspiração'}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Mostrar detalhes da tatuagem no resumo se disponíveis */}
              {item.product_type === 'tattoo' && item.tattoo_details && (
                <div className="pl-3 border-l-2 border-gray-200 text-xs text-gray-500 space-y-1">
                  <div className="grid grid-cols-2 gap-1">
                    {item.tattoo_details.style && (
                      <p>Estilo: {item.tattoo_details.style}</p>
                    )}
                    {item.tattoo_details.bodyPart && (
                      <p>Local: {item.tattoo_details.bodyPart}</p>
                    )}
                    {item.tattoo_details.size && (
                      <p>Tamanho: {item.tattoo_details.size}</p>
                    )}
                    {item.tattoo_details.estimatedTime && (
                      <p>Tempo: {item.tattoo_details.estimatedTime}</p>
                    )}
                    {item.tattoo_details.estimatedSessions && (
                      <p>Sessões: {item.tattoo_details.estimatedSessions}</p>
                    )}
                    {item.tattoo_details.preferredArtist && (
                      <p>Artista: {item.tattoo_details.preferredArtist}</p>
                    )}
                  </div>
                  
                  {/* Show reference images if available */}
                  {item.tattoo_details.referenceImages && item.tattoo_details.referenceImages.length > 0 && (
                    <div className="mt-2">
                      <p className="mb-1 text-xs font-medium">Referências:</p>
                      <div className="flex gap-1">
                        {item.tattoo_details.referenceImages.map((img, idx) => (
                          <div key={idx} className="w-10 h-10 rounded-md overflow-hidden">
                            <img 
                              src={img} 
                              alt={`Ref ${idx + 1}`} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Show scheduling preferences if available */}
              {item.product_type === 'tattoo' && item.scheduling_preferences && item.scheduling_preferences.preferredDates?.length > 0 && (
                <div className="mt-2 pl-3 border-l-2 border-gray-200 text-xs text-gray-500">
                  <p className="font-medium mb-1">Preferências de Agendamento:</p>
                  <p>Período: {item.scheduling_preferences.preferredTime}</p>
                  <p>Flexibilidade: {item.scheduling_preferences.isFlexible ? 'Sim' : 'Não'}</p>
                  <p className="mb-1">Datas selecionadas:</p>
                  <div className="flex flex-wrap gap-1">
                    {item.scheduling_preferences.preferredDates.map((date, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className="bg-red-50 text-red-800 text-xs px-2 py-0.5"
                      >
                        {formatDate(date)}
                      </Badge>
                    ))}
                  </div>
                  
                  {item.scheduling_preferences.additionalNotes && (
                    <div className="mt-2">
                      <p className="font-medium">Notas adicionais:</p>
                      <p className="italic">{item.scheduling_preferences.additionalNotes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          <div className="pt-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span>R$ {totalPrice.toFixed(2)}</span>
            </div>
            
            <Separator className="my-2" />
            
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>R$ {totalPrice.toFixed(2)}</span>
            </div>
            
            {hasTattoos && (
              <div className="mt-3 text-xs text-gray-500 bg-blue-50 p-2 rounded-md border border-blue-100">
                <p className="italic">
                  * Valor estimado inicial para a tatuagem, sujeito a ajustes após consulta detalhada com o artista.
                </p>
                <p className="mt-1">
                  O estúdio entrará em contato para confirmar os detalhes e fornecer o valor final.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutSummary;
