
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CartItem } from "@/contexts/CartContext";
import { TattooDetails, SchedulingPreferences } from "@/services/interfaces/IProductService";

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
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.quantity}x {item.name}</span>
                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
              </div>

              {/* Mostrar detalhes da tatuagem no resumo se disponíveis */}
              {item.product_type === 'tattoo' && item.tattoo_details && (
                <div className="pl-3 border-l-2 border-gray-200 text-xs text-gray-500 space-y-1">
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
                  
                  {/* Show reference images if available */}
                  {item.tattoo_details.referenceImages && item.tattoo_details.referenceImages.length > 0 && (
                    <div className="mt-2">
                      <p className="mb-1">Referências:</p>
                      <div className="flex gap-1">
                        {item.tattoo_details.referenceImages.map((img, idx) => (
                          <div key={idx} className="w-8 h-8 rounded-md overflow-hidden">
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
                  <p>Período: {item.scheduling_preferences.preferredTime}</p>
                  <p>Flexibilidade: {item.scheduling_preferences.isFlexible ? 'Sim' : 'Não'}</p>
                  <p className="mb-1">Datas:</p>
                  <div className="flex flex-wrap gap-1">
                    {item.scheduling_preferences.preferredDates.map((date, idx) => (
                      <span key={idx} className="bg-red-50 px-2 py-0.5 rounded-full">
                        {formatDate(date)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          <div className="pt-2">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>R$ {totalPrice.toFixed(2)}</span>
            </div>
            
            {hasTattoos && (
              <p className="text-xs text-gray-500 mt-2 italic">
                * Valor estimado, sujeito a ajustes após consulta com o artista
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckoutSummary;
