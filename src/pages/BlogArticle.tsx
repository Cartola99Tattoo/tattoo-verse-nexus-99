
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
    <p>Parabéns! Você acabou de fazer uma nova tatuagem. Agora vem a parte crucial: os cuidados pós-tatuagem. Uma cicatrização adequada é essencial para garantir que sua arte corporal mantenha suas cores vibrantes e linhas nítidas por toda a vida.</p>

    <h2>Primeiras 24 Horas</h2>
    <p>As primeiras horas após fazer a tatuagem são as mais críticas. Durante este período, sua pele está vulnerável e precisa de cuidados especiais:</p>
    
    <ul>
      <li>Mantenha a proteção aplicada pelo tatuador por pelo menos 2-4 horas</li>
      <li>Remova a proteção cuidadosamente e lave as mãos antes</li>
      <li>Lave a tatuagem suavemente com água morna e sabão neutro</li>
      <li>Seque delicadamente com uma toalha limpa, sem esfregar</li>
    </ul>

    <h2>Produtos Recomendados</h2>
    <p>A escolha dos produtos certos faz toda a diferença na cicatrização. Aqui estão nossas recomendações:</p>
    
    <h3>Pomadas Cicatrizantes</h3>
    <p>Use uma pomada específica para tatuagem ou um hidratante sem perfume. Aplique uma camada fina, 2-3 vezes ao dia.</p>
    
    <h3>Sabonetes Neutros</h3>
    <p>Sempre use sabonetes neutros, sem perfume e com pH balanceado para não irritar a pele sensível.</p>

    <h2>O Que Evitar</h2>
    <p>Durante o processo de cicatrização, alguns cuidados são fundamentais:</p>
    
    <ul>
      <li>Não coce ou remova as casquinhas</li>
      <li>Evite exposição ao sol direto</li>
      <li>Não entre em piscinas ou mar nas primeiras 2 semanas</li>
      <li>Evite roupas apertadas na região tatuada</li>
      <li>Não use produtos com álcool ou perfume</li>
    </ul>

    <h2>Sinais de Alerta</h2>
    <p>Fique atento a sinais que podem indicar infecção ou outros problemas:</p>
    
    <ul>
      <li>Vermelhidão excessiva após 48 horas</li>
      <li>Inchaço que não diminui</li>
      <li>Pus ou secreção com mau cheiro</li>
      <li>Febre ou calafrios</li>
      <li>Dor intensa que piora com o tempo</li>
    </ul>

    <p>Se notar qualquer um desses sinais, procure seu tatuador ou um médico imediatamente.</p>

    <h2>Cicatrização Completa</h2>
    <p>O processo completo de cicatrização leva de 2 a 4 semanas, mas pode variar de pessoa para pessoa. Durante este período, é normal que a tatuagem:</p>
    
    <ul>
      <li>Forme casquinhas superficiais</li>
      <li>Coce levemente (não coce!)</li>
      <li>Descame como uma queimadura de sol</li>
      <li>Pareça mais opaca temporariamente</li>
    </ul>

    <h2>Dicas Finais</h2>
    <p>Para garantir o melhor resultado possível da sua tatuagem:</p>
    
    <ul>
      <li>Mantenha a pele hidratada mesmo após a cicatrização</li>
      <li>Use protetor solar quando exposta ao sol</li>
      <li>Mantenha um estilo de vida saudável</li>
      <li>Faça retoques quando necessário</li>
    </ul>

    <p>Lembre-se: uma tatuagem bem cuidada é uma tatuagem que durará a vida toda com qualidade. Invista tempo nos cuidados iniciais e você será recompensado com uma arte corporal linda por muitos anos.</p>
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
            <Card variant="tattoo" className="bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-xl">
              <CardContent className="p-8 md:p-12">
                <div 
                  className="prose prose-lg max-w-none prose-headings:text-red-600 prose-h2:text-red-600 prose-h3:text-red-600 prose-links:text-red-600 prose-strong:text-gray-800"
                  dangerouslySetInnerHTML={{ 
                    __html: article.content.replace(
                      /<h([1-6])/g, 
                      '<h$1 class="text-red-600 font-bold mt-8 mb-4"'
                    ).replace(
                      /<h2/g,
                      '<h2 class="text-red-600 font-bold text-3xl mt-10 mb-6 border-b-2 border-red-200 pb-2"'
                    ).replace(
                      /<h3/g,
                      '<h3 class="text-red-600 font-bold text-2xl mt-8 mb-4"'
                    ).replace(
                      /<ul/g,
                      '<ul class="list-disc ml-6 mb-4 space-y-2"'
                    ).replace(
                      /<li/g,
                      '<li class="mb-2 leading-relaxed text-gray-700"'
                    ).replace(
                      /<p/g,
                      '<p class="mb-6 leading-relaxed text-gray-700 text-lg"'
                    )
                  }}
                />

                {/* Tags */}
                <div className="mt-12 pt-8 border-t border-red-200">
                  <h3 className="text-lg font-bold text-red-600 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map(tag => (
                      <Badge key={tag} variant="tattooOutline" className="cursor-pointer hover:bg-red-50 border-red-200 text-red-600">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Share Section */}
                <div className="mt-8 pt-8 border-t border-red-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button variant="tattooOutline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                        <Heart className="h-4 w-4 mr-2" />
                        Curtir
                      </Button>
                      <Button variant="tattooOutline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Comentar
                      </Button>
                    </div>
                    <Button variant="tattoo" size="sm" className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 shadow-lg hover:shadow-xl">
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
            <Card variant="tattooRed" className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-red-600 mb-2">{article.author}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Tatuadora especialista em realismo com mais de 8 anos de experiência.
                </p>
                <Button variant="tattooOutline" size="sm" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                  Ver Perfil
                </Button>
              </CardContent>
            </Card>

            {/* Related Posts */}
            <Card variant="tattoo" className="bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-xl">
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
            <Card variant="tattoo" className="bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-xl">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-red-600 mb-2">Pronto para fazer sua tatuagem?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Agende uma consulta com nossos artistas especializados.
                </p>
                <Button variant="tattoo" className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 shadow-lg hover:shadow-xl">
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
