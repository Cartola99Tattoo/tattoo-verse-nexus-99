
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Users, Palette, Award, TrendingUp, Globe, Heart } from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";

const TattooArtistsLanding = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular envio
    console.log("Formulário enviado:", formData);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <TattooArtistLayout>
      {/* Hero Section */}
      <section className="hero-gradient text-white py-24 lg:py-32 relative overflow-hidden">
        <div className="hero-overlay absolute inset-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
              <span className="text-gradient-red">Digitalize</span>
              <br />
              Seu Negócio
            </h1>
            <p className="text-xl lg:text-2xl text-gray-200 mb-12 leading-relaxed">
              Transforme seu estúdio de tatuagem com as melhores ferramentas digitais do mercado. 
              Gerencie clientes, agendamentos e maximize seus resultados.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Users className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Gestão de Clientes</h3>
                <p className="text-gray-300">Sistema completo para gerenciar sua base de clientes</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Palette className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Portfolio Digital</h3>
                <p className="text-gray-300">Showcase profissional dos seus trabalhos</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <TrendingUp className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Crescimento</h3>
                <p className="text-gray-300">Ferramentas para expandir seu negócio</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-black text-gray-800 mb-6">
                Pronto para <span className="text-gradient-red">Evoluir?</span>
              </h2>
              <p className="text-xl text-gray-600">
                Entre em contato conosco e descubra como podemos transformar seu estúdio
              </p>
            </div>

            {isSubmitted ? (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Mensagem Enviada!</h3>
                  <p className="text-green-700">
                    Obrigado pelo seu interesse. Nossa equipe entrará em contato em breve.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-2xl shadow-red-200/20">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                          Nome Completo *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="border-red-200 focus:border-red-500 focus:ring-red-500"
                          placeholder="Seu nome completo"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                          Telefone/WhatsApp *
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="border-red-200 focus:border-red-500 focus:ring-red-500"
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                        E-mail *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border-red-200 focus:border-red-500 focus:ring-red-500"
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
                        Mensagem
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="border-red-200 focus:border-red-500 focus:ring-red-500"
                        placeholder="Conte-nos sobre seu estúdio e como podemos ajudar..."
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg"
                      className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-4"
                    >
                      Quero Digitalizar Meu Negócio
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 section-bg-red">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-800 mb-4">
              Por que Escolher a <span className="text-gradient-red">99Tattoo?</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Award,
                title: "Experiência Comprovada",
                description: "Anos de experiência no mercado de tatuagem e tecnologia"
              },
              {
                icon: Globe,
                title: "Plataforma Completa",
                description: "Tudo que você precisa em um só lugar"
              },
              {
                icon: Heart,
                title: "Suporte Especializado",
                description: "Equipe dedicada que entende do seu negócio"
              },
              {
                icon: TrendingUp,
                title: "Resultados Reais",
                description: "Aumento comprovado na eficiência e lucros"
              },
              {
                icon: Users,
                title: "Comunidade Ativa",
                description: "Rede de tatuadores e estúdios parceiros"
              },
              {
                icon: Palette,
                title: "Foco na Arte",
                description: "Ferramentas pensadas especificamente para tatuadores"
              }
            ].map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="card-interactive hover:shadow-red-glow">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </TattooArtistLayout>
  );
};

export default TattooArtistsLanding;
