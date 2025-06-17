
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Palette, TrendingUp, Users, Zap, CheckCircle } from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";

const TattooArtistsLanding = () => {
  const [formData, setFormData] = useState({
    name: "",
    studioName: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formData);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        studioName: "",
        email: "",
        phone: "",
        message: ""
      });
    }, 3000);
  };

  return (
    <TattooArtistLayout>
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center text-white mb-16">
          <h1 className="text-6xl font-bold mb-6">
            Digitalize Seu Estúdio de Tatuagem para a 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600"> Nova Era!</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
            Atraia clientes qualificados, otimize agendamentos e foque no que você faz de melhor: criar arte na pele. 
            Transforme seu estúdio com nossa plataforma completa de digitalização.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Benefits Section */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white mb-8">Por que digitalizar seu estúdio?</h2>
            
            <div className="grid gap-6">
              {[
                {
                  icon: <Users className="h-8 w-8 text-red-400" />,
                  title: "Mais Clientes Qualificados",
                  description: "Atraia pessoas que realmente valorizam seu trabalho através de nossa plataforma"
                },
                {
                  icon: <TrendingUp className="h-8 w-8 text-red-400" />,
                  title: "Agendamentos Otimizados",
                  description: "Sistema inteligente que maximiza sua agenda e reduz tempo ocioso"
                },
                {
                  icon: <Palette className="h-8 w-8 text-red-400" />,
                  title: "Foco na sua Arte",
                  description: "Menos tempo com burocracia, mais tempo criando tatuagens incríveis"
                },
                {
                  icon: <Zap className="h-8 w-8 text-red-400" />,
                  title: "Presença Digital Profissional",
                  description: "Portfólio online, redes sociais integradas e muito mais"
                }
              ].map((benefit, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-red-500/20 hover:bg-white/15 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {benefit.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                        <p className="text-gray-300">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                  Quero Digitalizar Meu Estúdio!
                </CardTitle>
                <p className="text-gray-600">
                  Preencha o formulário e nossa equipe entrará em contato
                </p>
              </CardHeader>
              <CardContent className="p-8">
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-green-600 mb-2">Obrigado!</h3>
                    <p className="text-gray-600">
                      Recebemos seu contato e nossa equipe entrará em contato em breve!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-gray-700 font-semibold">
                        Nome Completo *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-2 border-gray-300 focus:border-red-500"
                        placeholder="Seu nome completo"
                      />
                    </div>

                    <div>
                      <Label htmlFor="studioName" className="text-gray-700 font-semibold">
                        Nome do Estúdio
                      </Label>
                      <Input
                        id="studioName"
                        name="studioName"
                        type="text"
                        value={formData.studioName}
                        onChange={handleInputChange}
                        className="mt-2 border-gray-300 focus:border-red-500"
                        placeholder="Nome do seu estúdio (opcional)"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-gray-700 font-semibold">
                        E-mail *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-2 border-gray-300 focus:border-red-500"
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-gray-700 font-semibold">
                        Telefone (WhatsApp) *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-2 border-gray-300 focus:border-red-500"
                        placeholder="(11) 99999-9999"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-gray-700 font-semibold">
                        Conte-nos sobre seu estúdio
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="mt-2 border-gray-300 focus:border-red-500"
                        placeholder="Conte-nos um pouco sobre seu estúdio e o que você busca..."
                        rows={4}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 text-lg"
                    >
                      Quero Digitalizar Meu Estúdio!
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistsLanding;
