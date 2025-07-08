
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  ShoppingBag, 
  BookOpen, 
  Users, 
  Award, 
  Star,
  ArrowRight,
  Brush,
  Heart,
  TrendingUp
} from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";

const TattooArtistsLanding = () => {
  const features = [
    {
      icon: <Palette className="h-8 w-8 text-red-500" />,
      title: "Portfólio Profissional",
      description: "Mostre seu trabalho com galerias organizadas e de alta qualidade",
      link: "/tatuadores-da-nova-era/portfolio",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: <ShoppingBag className="h-8 w-8 text-blue-500" />,
      title: "Loja Personalizada",
      description: "Venda seus produtos e mercadorias diretamente aos clientes",
      link: "/tatuadores-da-nova-era/shop",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-green-500" />,
      title: "Blog & Conteúdo",
      description: "Compartilhe conhecimento e construa sua marca pessoal",
      link: "/tatuadores-da-nova-era/blog",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-500" />,
      title: "Rede de Contatos",
      description: "Conecte-se com outros profissionais e clientes",
      link: "/tatuadores-da-nova-era/networking",
      color: "from-purple-500 to-violet-500"
    }
  ];

  const stats = [
    { number: "500+", label: "Tatuadores Ativos", icon: <Brush className="h-5 w-5" /> },
    { number: "10k+", label: "Clientes Atendidos", icon: <Heart className="h-5 w-5" /> },
    { number: "95%", label: "Satisfação", icon: <Star className="h-5 w-5" /> },
    { number: "50%", label: "Crescimento Mensal", icon: <TrendingUp className="h-5 w-5" /> }
  ];

  return (
    <TattooArtistLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <Badge className="mb-6 bg-red-100 text-red-800 hover:bg-red-200">
              Plataforma para Tatuadores Profissionais
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent">
              Tatuadores da Nova Era
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              A plataforma mais completa para tatuadores profissionais. 
              Gerencie seu portfólio, venda produtos, publique conteúdo e construa sua marca no mercado de tatuagem.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 text-lg">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50 px-8 py-4 text-lg">
                Ver Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-6 bg-white/80 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2 text-red-600">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">
                Tudo que você precisa para crescer
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Ferramentas profissionais para tatuadores que querem se destacar no mercado
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-4 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-red-700 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    <Link to={feature.link}>
                      <Button variant="outline" className="w-full group-hover:bg-red-50 group-hover:border-red-300 group-hover:text-red-700 transition-colors">
                        Explorar
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-red-600 to-red-800">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Award className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl font-bold mb-6">
              Pronto para revolucionar sua carreira?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Junte-se aos tatuadores da nova era e tenha acesso às melhores ferramentas do mercado
            </p>
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
              Cadastrar-se Gratuitamente
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistsLanding;
