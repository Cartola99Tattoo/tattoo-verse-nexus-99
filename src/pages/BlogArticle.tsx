
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, User, Clock, Share2, Heart, MessageCircle, ChevronRight } from "lucide-react";

const article = {
  title: "Guia Completo: Como Cuidar da Sua Tatuagem Recém Feita",
  slug: "como-cuidar-tatuagem-recem-feita",
  author: "Mariana Silva",
  date: "2024-01-15",
  category: "Cuidados",
  readTime: "8 min",
  image: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=2070&auto=format&fit=crop",
  content: `
    <h2 class="text-red-600 font-bold text-3xl mt-10 mb-6 border-b-2 border-red-200 pb-2">Primeiras 24 Horas</h2>
    <p class="mb-6 leading-relaxed text-gray-700 text-lg">As primeiras horas após fazer a tatuagem são as mais críticas. Durante este período, sua pele está vulnerável e precisa de cuidados especiais:</p>
    
    <ul class="list-disc ml-6 mb-4 space-y-2">
      <li class="mb-2 leading-relaxed text-gray-700">Mantenha a proteção aplicada pelo tatuador por pelo menos 2-4 horas</li>
      <li class="mb-2 leading-relaxed text-gray-700">Remova a proteção cuidadosamente e lave as mãos antes</li>
      <li class="mb-2 leading-relaxed text-gray-700">Lave a tatuagem suavemente com água morna e sabão neutro</li>
      <li class="mb-2 leading-relaxed text-gray-700">Seque delicadamente com uma toalha limpa, sem esfregar</li>
    </ul>

    <h2 class="text-red-600 font-bold text-3xl mt-10 mb-6 border-b-2 border-red-200 pb-2">Produtos Recomendados</h2>
    <p class="mb-6 leading-relaxed text-gray-700 text-lg">A escolha dos produtos certos faz toda a diferença na cicatrização. Aqui estão nossas recomendações:</p>
    
    <h3 class="text-red-600 font-bold text-2xl mt-8 mb-4">Pomadas Cicatrizantes</h3>
    <p class="mb-6 leading-relaxed text-gray-700 text-lg">Use uma pomada específica para tatuagem ou um hidratante sem perfume. Aplique uma camada fina, 2-3 vezes ao dia.</p>
    
    <h3 class="text-red-600 font-bold text-2xl mt-8 mb-4">Sabonetes Neutros</h3>
    <p class="mb-6 leading-relaxed text-gray-700 text-lg">Sempre use sabonetes neutros, sem perfume e com pH balanceado para não irritar a pele sensível.</p>

    <h2 class="text-red-600 font-bold text-3xl mt-10 mb-6 border-b-2 border-red-200 pb-2">O Que Evitar</h2>
    <p class="mb-6 leading-relaxed text-gray-700 text-lg">Durante o processo de cicatrização, alguns cuidados são fundamentais:</p>
    
    <ul class="list-disc ml-6 mb-4 space-y-2">
      <li class="mb-2 leading-relaxed text-gray-700">Não coce ou remova as casquinhas</li>
      <li class="mb-2 leading-relaxed text-gray-700">Evite exposição ao sol direto</li>
      <li class="mb-2 leading-relaxed text-gray-700">Não entre em piscinas ou mar nas primeiras 2 semanas</li>
      <li class="mb-2 leading-relaxed text-gray-700">Evite roupas apertadas na região tatuada</li>
      <li class="mb-2 leading-relaxed text-gray-700">Não use produtos com álcool ou perfume</li>
    </ul>
  `,
  tags: ["cuidados", "cicatrização", "tatuagem nova", "dicas"],
  relatedPosts: [
    {
      title: "Tendências de Tatuagem 2024",
      slug: "tendencias-tatuagem-2024",
      image: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=1974&auto=format&fit=crop"
    },
    {
      title: "Escolhendo o Local Perfeito",
      slug: "escolhendo-local-primeira-tatuagem",
      image: "https://images.unsplash.com/photo-1562962230-16e4623d36e7?q=80&w=1974&auto=format&fit=crop"
    }
  ]
};

const BlogArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/blog')}
            className="text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Blog
          </Button>
          
          <div className="max-w-4xl">
            <Badge variant="outline" className="border-white text-white hover:bg-white hover:text-red-600 mb-4">
              {article.category}
            </Badge>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-red-100">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{new Date(article.date).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>{article.readTime} de leitura</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Image */}
            <div className="mb-8">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-xl"
              />
            </div>

            {/* Article Body */}
            <Card className="bg-gradient-to-br from-white to-gray-50 border-red-200 shadow-xl">
              <CardContent className="p-8 md:p-12">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Tags */}
                <div className="mt-12 pt-8 border-t border-red-200">
                  <h3 className="text-lg font-bold text-red-600 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-red-50 border-red-200 text-red-600">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Share Section */}
                <div className="mt-8 pt-8 border-t border-red-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                        <Heart className="h-4 w-4 mr-2" />
                        Curtir
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Comentar
                      </Button>
                    </div>
                    <Button className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg hover:shadow-xl" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartilhar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Author Info */}
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <User className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-red-600 mb-2">{article.author}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Tatuadora especialista em realismo com mais de 8 anos de experiência.
                </p>
                <Button variant="outline" size="sm" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                  Ver Perfil
                </Button>
              </CardContent>
            </Card>

            {/* Related Posts */}
            <Card className="bg-gradient-to-br from-white to-gray-50 border-red-200 shadow-xl">
              <CardContent className="p-6">
                <h3 className="font-bold text-red-600 mb-4">Artigos Relacionados</h3>
                <div className="space-y-4">
                  {article.relatedPosts.map(post => (
                    <div
                      key={post.slug}
                      className="group cursor-pointer"
                      onClick={() => navigate(`/blog/${post.slug}`)}
                    >
                      <div className="flex gap-3">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-16 h-16 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-red-600 group-hover:text-red-700 transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-red-500 transition-colors flex-shrink-0 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-gradient-to-br from-white to-gray-50 border-red-200 shadow-xl">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-red-600 mb-2">Pronto para fazer sua tatuagem?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Agende uma consulta com nossos artistas especializados.
                </p>
                <Button className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg hover:shadow-xl">
                  Agendar Consulta
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogArticle;
