
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
  User,
  Menu,
  Instagram,
  Facebook,
  Phone,
  Mail
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
      code: "X2Y7Z9A1B3",
      discount: "20% desconto",
      validCategories: ["Fineline", "Minimalista"],
      validArtists: ["Ana Silva", "Carlos Santos"],
      usageCount: 23,
      usageLimit: 50
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
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto bg-white border-0 p-0">
        <DialogHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-red-800 font-black text-xl">
              Preview da Landing Page Pública: {event.name}
            </DialogTitle>
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => window.open(event.landingPageUrl || `https://99tattoo.com.br/events/${event.id}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Abrir Landing Page
            </Button>
          </div>
        </DialogHeader>

        {/* Simulação da Landing Page Pública Completa */}
        <div className="bg-white">
          {/* Header/Menu do Site Principal */}
          <header className="bg-gradient-to-r from-red-600 via-red-700 to-black text-white shadow-2xl sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl md:text-3xl font-black tracking-wider">99TATTOO</h1>
                </div>
                
                <nav className="hidden md:flex items-center gap-6">
                  <a href="#" className="hover:text-red-200 transition-colors font-medium">Home</a>
                  <a href="#" className="hover:text-red-200 transition-colors font-medium">Artistas</a>
                  <a href="#" className="hover:text-red-200 transition-colors font-medium">Loja</a>
                  <a href="#" className="hover:text-red-200 transition-colors font-medium">Eventos</a>
                  <a href="#" className="hover:text-red-200 transition-colors font-medium">Contato</a>
                </nav>
                
                <Button variant="outline" className="md:hidden border-white text-white hover:bg-white hover:text-red-600">
                  <Menu className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Hero Section do Evento */}
          <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
            <div 
              className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-700 to-black"
              style={{
                backgroundImage: event.featuredImage ? `url(${event.featuredImage})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-red-900/50 to-black/70" />
            </div>
            
            <div className="relative z-10 container mx-auto px-4 text-center text-white">
              <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">{event.name}</h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">{event.description}</p>
              <div className="flex flex-wrap justify-center gap-6 text-lg mb-8">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <Calendar className="h-5 w-5" />
                  {new Date(event.startDate).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <Clock className="h-5 w-5" />
                  {event.startTime} - {event.endTime}
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <MapPin className="h-5 w-5" />
                  {event.location}
                </div>
              </div>
              
              <Button className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg px-8 py-4">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Explorar Tatuagens do Evento
              </Button>
            </div>
          </section>

          {/* Seção de Cupons Promocionais */}
          <section className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black text-orange-800 mb-4">
                  Cupons Promocionais Exclusivos
                </h2>
                <p className="text-lg text-orange-700">
                  Use seu código promocional e garanta desconto especial nas tatuagens do evento
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex gap-4">
                  <Input
                    placeholder="Digite seu código de cupom"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="border-orange-200 focus:border-orange-500 focus:ring-orange-200 text-lg py-3"
                  />
                  <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-3">
                    Aplicar Cupom
                  </Button>
                </div>
                
                {mockCoupons.map((coupon) => (
                  <Card key={coupon.id} className="bg-white border-2 border-orange-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-orange-100 text-orange-800 border-orange-200 font-bold text-lg px-4 py-2">
                            {coupon.code}
                          </Badge>
                          <span className="font-bold text-green-600 text-xl">{coupon.discount}</span>
                        </div>
                        <Button className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                          Usar Cupom
                        </Button>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><strong>Válido para:</strong> {coupon.validCategories.join(", ")}</p>
                        <p><strong>Tatuadores:</strong> {coupon.validArtists.join(", ")}</p>
                        <div className="flex items-center justify-between">
                          <p><strong>Utilizações:</strong> {coupon.usageCount}/{coupon.usageLimit}</p>
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${(coupon.usageCount / coupon.usageLimit) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Mini Loja Integrada do Evento */}
          <section className="py-16 bg-gradient-to-br from-white to-red-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black text-red-800 mb-4">
                  Loja Exclusiva do Evento - Tatuagens Disponíveis
                </h2>
                <p className="text-lg text-red-700">
                  Reserve sua tatuagem com antecedência e garante seu horário no evento
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {mockTattoos.map((tattoo) => (
                  <Card key={tattoo.id} className="bg-white border-2 border-red-200 shadow-xl hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 transform hover:scale-105">
                    <div className="aspect-square overflow-hidden rounded-t-lg">
                      <img 
                        src={tattoo.image} 
                        alt={tattoo.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-red-800 mb-3 text-lg">{tattoo.name}</h3>
                      
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-center gap-2 text-red-600">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{tattoo.artist}</span>
                        </div>
                        <div className="flex items-center gap-2 text-red-600">
                          <Palette className="h-4 w-4" />
                          <span>{tattoo.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-lg">
                          {formatPrice(tattoo.price, couponCode === "X2Y7Z9A1B3", 20)}
                        </div>
                        {tattoo.available && (
                          <div className="flex items-center gap-1 text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="text-xs font-medium">Disponível</span>
                          </div>
                        )}
                      </div>

                      <Button className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white">
                        Reservar Tatuagem
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Button className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-12 py-4 text-lg">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Finalizar Todas as Reservas
                </Button>
              </div>
            </div>
          </section>

          {/* Informações Detalhadas do Evento */}
          {event.detailedDescription && (
            <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-3xl font-black text-gray-800 mb-8 text-center">Sobre o Evento</h2>
                  <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
                    <p className="text-gray-700 leading-relaxed text-lg mb-6">{event.detailedDescription}</p>
                    
                    {event.participatingArtists && event.participatingArtists.length > 0 && (
                      <div>
                        <h4 className="font-bold text-gray-800 mb-4 text-xl">Tatuadores Participantes:</h4>
                        <div className="flex flex-wrap gap-3">
                          {event.participatingArtists.map((artist, index) => (
                            <Badge key={index} className="bg-red-100 text-red-800 border-red-200 px-4 py-2 text-sm">
                              <Users className="h-4 w-4 mr-2" />
                              {artist}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Footer do Site Principal */}
          <footer className="bg-gradient-to-r from-black via-red-900 to-black text-white py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-2xl font-black mb-4">99TATTOO</h3>
                  <p className="text-gray-300 mb-4">
                    Estúdio de tatuagem com os melhores artistas da cidade. 
                    Arte, qualidade e profissionalismo em cada trabalho.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-bold mb-4">Serviços</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li><a href="#" className="hover:text-red-300 transition-colors">Tatuagens Custom</a></li>
                    <li><a href="#" className="hover:text-red-300 transition-colors">Flash Tattoos</a></li>
                    <li><a href="#" className="hover:text-red-300 transition-colors">Workshops</a></li>
                    <li><a href="#" className="hover:text-red-300 transition-colors">Eventos Especiais</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-bold mb-4">Contato</h4>
                  <div className="space-y-2 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>(11) 99999-9999</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>contato@99tattoo.com.br</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>Rua das Artes, 99 - Centro</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold mb-4">Redes Sociais</h4>
                  <div className="flex gap-4">
                    <a href="#" className="text-gray-300 hover:text-red-300 transition-colors">
                      <Instagram className="h-6 w-6" />
                    </a>
                    <a href="#" className="text-gray-300 hover:text-red-300 transition-colors">
                      <Facebook className="h-6 w-6" />
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2025 99Tattoo. Todos os direitos reservados.</p>
              </div>
            </div>
          </footer>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventLandingPageModal;
