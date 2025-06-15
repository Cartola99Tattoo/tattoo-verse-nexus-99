
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  ExternalLink, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Tag, 
  ShoppingCart,
  Star,
  Palette,
  User
} from "lucide-react";
import { IEvent } from "@/services/interfaces/IEventService";

interface EventLandingPageModalProps {
  event: IEvent;
  isOpen: boolean;
  onClose: () => void;
}

const EventLandingPageModal: React.FC<EventLandingPageModalProps> = ({ event, isOpen, onClose }) => {
  const [couponCode, setCouponCode] = useState("");

  // Mock data for demonstration
  const mockCoupons = [
    {
      id: "1",
      code: "99FLASH2025",
      discount: "20% desconto",
      validCategories: ["Fineline", "Minimalista"],
      validArtists: ["Ana Silva", "Carlos Santos"]
    }
  ];

  const mockTattoos = [
    {
      id: "1",
      name: "Flor Minimalista",
      artist: "Ana Silva",
      category: "Fineline",
      price: 250,
      image: "https://images.unsplash.com/photo-1565058379802-bbe93b2731bb?q=80&w=400",
      available: true
    },
    {
      id: "2",
      name: "Mandala Delicada",
      artist: "Carlos Santos", 
      category: "Minimalista",
      price: 300,
      image: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=400",
      available: true
    },
    {
      id: "3",
      name: "Linha Contínua",
      artist: "Ana Silva",
      category: "Fineline", 
      price: 200,
      image: "https://images.unsplash.com/photo-1590246814883-57c511547d4c?q=80&w=400",
      available: true
    }
  ];

  const formatPrice = (price: number, hasDiscount = false, discountPercent = 0) => {
    if (hasDiscount) {
      const discountedPrice = price * (1 - discountPercent / 100);
      return (
        <div className="flex items-center gap-2">
          <span className="line-through text-gray-500 text-sm">R$ {price.toFixed(2)}</span>
          <span className="font-bold text-green-600">R$ {discountedPrice.toFixed(2)}</span>
        </div>
      );
    }
    return <span className="font-bold">R$ {price.toFixed(2)}</span>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-white to-red-50 border-red-200">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-red-800 font-black text-xl">
              Landing Page do Evento: {event.name}
            </DialogTitle>
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => window.open(`https://99tattoo.com/events/${event.id}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Landing Page Pública
            </Button>
          </div>
        </DialogHeader>

        {/* Preview da Landing Page */}
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="relative rounded-lg overflow-hidden">
            <div 
              className="h-64 bg-gradient-to-br from-red-600 via-red-700 to-black flex items-center justify-center"
              style={{
                backgroundImage: event.featuredImage ? `url(${event.featuredImage})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-red-900/50 to-black/70" />
              <div className="relative z-10 text-center text-white">
                <h1 className="text-3xl md:text-4xl font-black mb-4">{event.name}</h1>
                <p className="text-lg md:text-xl mb-4">{event.description}</p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(event.startDate).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {event.startTime} - {event.endTime}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seção de Cupons */}
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-yellow-100 to-orange-100 border-b border-yellow-200">
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Tag className="h-5 w-5 text-orange-600" />
                Cupons Promocionais Exclusivos
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input
                    placeholder="Digite seu código de cupom"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="border-orange-200 focus:border-orange-500 focus:ring-orange-200"
                  />
                  <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white">
                    Aplicar Cupom
                  </Button>
                </div>
                
                {mockCoupons.map((coupon) => (
                  <div key={coupon.id} className="bg-white rounded-lg p-4 border border-orange-200 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-orange-100 text-orange-800 border-orange-200 font-bold">
                          {coupon.code}
                        </Badge>
                        <span className="font-bold text-green-600">{coupon.discount}</span>
                      </div>
                      <Button size="sm" className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                        Usar Cupom
                      </Button>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Válido para: {coupon.validCategories.join(", ")}</p>
                      <p>Tatuadores: {coupon.validArtists.join(", ")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mini Loja Integrada */}
          <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200">
              <CardTitle className="flex items-center gap-2 text-red-800">
                <ShoppingCart className="h-5 w-5 text-red-600" />
                Loja Exclusiva do Evento - Tatuagens Disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockTattoos.map((tattoo) => (
                  <Card key={tattoo.id} className="bg-white border-red-200 shadow-lg hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 transform hover:scale-105">
                    <div className="aspect-square overflow-hidden rounded-t-lg">
                      <img 
                        src={tattoo.image} 
                        alt={tattoo.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-red-800 mb-2">{tattoo.name}</h3>
                      
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-center gap-2 text-red-600">
                          <User className="h-3 w-3" />
                          <span>{tattoo.artist}</span>
                        </div>
                        <div className="flex items-center gap-2 text-red-600">
                          <Palette className="h-3 w-3" />
                          <span>{tattoo.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        {formatPrice(tattoo.price, couponCode === "99FLASH2025", 20)}
                        <div className="flex items-center gap-2">
                          <Button size="sm" className="bg-gradient-to-r from-red-600 to-red-800 text-white">
                            Reservar
                          </Button>
                          {tattoo.available && (
                            <div className="flex items-center gap-1 text-green-600">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span className="text-xs">Disponível</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-3">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Finalizar Reservas do Evento
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Informações Adicionais do Evento */}
          {event.detailedDescription && (
            <Card className="bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-gray-800">Detalhes do Evento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{event.detailedDescription}</p>
                {event.participatingArtists && event.participatingArtists.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Tatuadores Participantes:</h4>
                    <div className="flex flex-wrap gap-2">
                      {event.participatingArtists.map((artist, index) => (
                        <Badge key={index} className="bg-red-100 text-red-800 border-red-200">
                          {artist}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventLandingPageModal;
