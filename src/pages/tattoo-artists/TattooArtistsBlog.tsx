
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, ArrowRight } from "lucide-react";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";

const TattooArtistsBlog = () => {
  return (
    <TattooArtistLayout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-16">
          <h1 className="text-5xl font-bold mb-6">
            Blog para 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600"> Tatuadores</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Dicas, técnicas e estratégias para profissionais da tatuagem que querem evoluir seu negócio
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Preview Articles */}
          {[
            {
              title: "Como Precificar Suas Tatuagens de Forma Justa",
              excerpt: "Aprenda a calcular o valor ideal para seus trabalhos considerando tempo, complexidade e seu nível técnico.",
              date: "15 Jan 2024",
              author: "Equipe 99Tattoo"
            },
            {
              title: "Gestão de Agenda: Maximize Seu Tempo e Faturamento",
              excerpt: "Estratégias para organizar seus agendamentos e reduzir tempo ocioso no estúdio.",
              date: "12 Jan 2024",
              author: "Equipe 99Tattoo"
            },
            {
              title: "Marketing Digital para Tatuadores: Guia Completo",
              excerpt: "Como usar redes sociais e marketing online para atrair mais clientes qualificados.",
              date: "08 Jan 2024",
              author: "Equipe 99Tattoo"
            }
          ].map((article, index) => (
            <Card key={index} className="bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-105 cursor-pointer group">
              <CardHeader>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{article.author}</span>
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <div className="flex items-center text-red-600 font-semibold group-hover:text-red-700">
                  <span>Ler artigo</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Card className="bg-red-600/10 border-red-500/30 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-white mb-4">Em Breve!</h2>
              <p className="text-gray-300 text-lg">
                Estamos preparando conteúdo exclusivo para ajudar você a evoluir como tatuador e empresário. 
                Cadastre-se em nossa plataforma para ser notificado quando o blog estiver no ar!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistsBlog;
