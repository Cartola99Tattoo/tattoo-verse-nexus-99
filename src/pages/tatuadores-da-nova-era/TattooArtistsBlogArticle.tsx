
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, User, Clock, Share2, Heart, MessageCircle, ChevronRight, Eye, ThumbsUp } from "lucide-react";

// Dados mock unificados - mesmos dados da Nave-Mãe
const mockBlogPosts = [
  {
    id: 1,
    title: "Tendências de Tatuagem 2024: O Que Está Dominando o Mercado",
    slug: "tendencias-tatuagem-2024",
    excerpt: "Explore as principais tendências que estão moldando o mundo da tatuagem neste ano, desde o minimalismo até técnicas inovadoras.",
    content: `
      <h2 class="text-red-600 font-bold text-3xl mt-10 mb-6 border-b-2 border-red-200 pb-2">Minimalismo e Fine Line</h2>
      <p class="mb-6 leading-relaxed text-gray-700 text-lg">O minimalismo continua sendo uma das tendências mais fortes de 2024. As tatuagens fine line, com traços delicados e designs simples, estão conquistando cada vez mais espaço.</p>
      
      <ul class="list-disc ml-6 mb-6 space-y-2">
        <li class="mb-2 leading-relaxed text-gray-700">Designs geométricos simples</li>
        <li class="mb-2 leading-relaxed text-gray-700">Símbolos minimalistas</li>
        <li class="mb-2 leading-relaxed text-gray-700">Lettering delicado</li>
        <li class="mb-2 leading-relaxed text-gray-700">Ilustrações botânicas simplificadas</li>
      </ul>

      <h2 class="text-red-600 font-bold text-3xl mt-10 mb-6 border-b-2 border-red-200 pb-2">Aquarela e Cores Vibrantes</h2>
      <p class="mb-6 leading-relaxed text-gray-700 text-lg">A técnica de aquarela está revolucionando o mundo das tatuagens coloridas. Os efeitos de tinta escorrendo e as transições suaves de cores criam resultados impressionantes.</p>
      
      <h3 class="text-red-600 font-bold text-2xl mt-8 mb-4">Técnicas Populares</h3>
      <p class="mb-6 leading-relaxed text-gray-700 text-lg">Splash de cores, degradês suaves e sobreposições cromáticas estão entre as técnicas mais requisitadas pelos clientes.</p>

      <h2 class="text-red-600 font-bold text-3xl mt-10 mb-6 border-b-2 border-red-200 pb-2">Blackwork Contemporâneo</h2>
      <p class="mb-6 leading-relaxed text-gray-700 text-lg">O blackwork evoluiu para formas mais contemporâneas, incorporando elementos geométricos e abstratos:</p>
      
      <ul class="list-disc ml-6 mb-6 space-y-2">
        <li class="mb-2 leading-relaxed text-gray-700">Padrões geométricos complexos</li>
        <li class="mb-2 leading-relaxed text-gray-700">Mandalas modernas</li>
        <li class="mb-2 leading-relaxed text-gray-700">Optical illusions</li>
        <li class="mb-2 leading-relaxed text-gray-700">Formas arquitetônicas</li>
      </ul>
    `,
    category: "Tendências",
    status: "published",
    author: "Carolina Silva",
    publishDate: "2024-01-15",
    views: 2450,
    likes: 189,
    comments: 34,
    readTime: "8 min",
    featured: true,
    cover_image: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=800&auto=format&fit=crop&q=60",
    tags: ["tendências", "2024", "estilos", "técnicas"]
  },
  {
    id: 2,
    title: "Cuidados Pós-Tatuagem: Guia Completo para Cicatrização",
    slug: "cuidados-pos-tatuagem-guia-completo",
    excerpt: "Um guia detalhado sobre como cuidar adequadamente de uma tatuagem recém-feita para garantir a melhor cicatrização.",
    content: `
      <h2 class="text-red-600 font-bold text-3xl mt-10 mb-6 border-b-2 border-red-200 pb-2">Primeiras 24 Horas</h2>
      <p class="mb-6 leading-relaxed text-gray-700 text-lg">As primeiras horas após fazer a tatuagem são cruciais para uma cicatrização adequada. Siga estas diretrizes essenciais:</p>
      
      <ul class="list-disc ml-6 mb-6 space-y-2">
        <li class="mb-2 leading-relaxed text-gray-700">Mantenha a proteção aplicada pelo tatuador por 2-4 horas</li>
        <li class="mb-2 leading-relaxed text-gray-700">Lave as mãos antes de tocar na tatuagem</li>
        <li class="mb-2 leading-relaxed text-gray-700">Remova a proteção cuidadosamente</li>
        <li class="mb-2 leading-relaxed text-gray-700">Lave com água morna e sabão neutro</li>
      </ul>

      <h2 class="text-red-600 font-bold text-3xl mt-10 mb-6 border-b-2 border-red-200 pb-2">Produtos Recomendados</h2>
      <p class="mb-6 leading-relaxed text-gray-700 text-lg">A escolha dos produtos certos é fundamental para uma cicatrização perfeita:</p>
      
      <h3 class="text-red-600 font-bold text-2xl mt-8 mb-4">Pomadas Cicatrizantes</h3>
      <p class="mb-6 leading-relaxed text-gray-700 text-lg">Use pomadas específicas para tatuagem ou hidratantes sem perfume. Aplique uma camada fina 2-3 vezes ao dia.</p>
    `,
    category: "Cuidados",
    status: "published",
    author: "Dr. Ricardo Mendes",
    publishDate: "2024-01-12",
    views: 1890,
    likes: 234,
    comments: 67,
    readTime: "10 min",
    cover_image: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?w=800&auto=format&fit=crop&q=60",
    tags: ["cuidados", "cicatrização", "saúde", "dicas"]
  },
  {
    id: 3,
    title: "Marketing Digital para Tatuadores: Construindo sua Marca Online",
    slug: "marketing-digital-tatuadores",
    excerpt: "Estratégias eficazes de marketing digital para tatuadores que querem expandir sua clientela e fortalecer sua marca.",
    content: `
      <h2 class="text-red-600 font-bold text-3xl mt-10 mb-6 border-b-2 border-red-200 pb-2">Presença nas Redes Sociais</h2>
      <p class="mb-6 leading-relaxed text-gray-700 text-lg">Instagram e TikTok são ferramentas essenciais para tatuadores modernos. Aprenda como usá-las estrategicamente:</p>
      
      <ul class="list-disc ml-6 mb-6 space-y-2">
        <li class="mb-2 leading-relaxed text-gray-700">Poste conteúdo consistente e de qualidade</li>
        <li class="mb-2 leading-relaxed text-gray-700">Use hashtags relevantes e específicas</li>
        <li class="mb-2 leading-relaxed text-gray-700">Interaja com seus seguidores</li>
        <li class="mb-2 leading-relaxed text-gray-700">Compartilhe o processo de criação</li>
      </ul>

      <h2 class="text-red-600 font-bold text-3xl mt-10 mb-6 border-b-2 border-red-200 pb-2">Fotografia Profissional</h2>
      <p class="mb-6 leading-relaxed text-gray-700 text-lg">A qualidade das fotos das suas tatuagens é crucial para atrair novos clientes online.</p>
    `,
    category: "Marketing",
    status: "published",
    author: "Ana Paula Costa",
    publishDate: "2024-01-10",
    views: 1340,
    likes: 98,
    comments: 23,
    readTime: "12 min",
    cover_image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&auto=format&fit=crop&q=60",
    tags: ["marketing", "digital", "negócios", "redes sociais"]
  }
];

const TattooArtistsBlogArticle = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();

  // Buscar artigo por ID ou slug
  const article = mockBlogPosts.find(post => 
    post.id.toString() === articleId || post.slug === articleId
  );

  const relatedPosts = mockBlogPosts.filter(post => 
    post.id !== article?.id && post.category === article?.category
  ).slice(0, 2);

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Artigo não encontrado</h2>
          <p className="text-gray-600 mb-6">
            O artigo que você está procurando não existe ou foi removido.
          </p>
          <Button 
            onClick={() => navigate('/tatuadores-da-nova-era/blog')}
            className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg hover:shadow-xl"
          >
            Voltar ao Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-8">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/tatuadores-da-nova-era/blog')}
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
                <span>{new Date(article.publishDate).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>{article.readTime} de leitura</span>
              </div>
              <div className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                <span>{article.views.toLocaleString()} visualizações</span>
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
                src={article.cover_image}
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-xl"
              />
            </div>

            {/* Article Body */}
            <Card className="bg-gradient-to-br from-white to-gray-50 border-red-200 shadow-xl">
              <CardContent className="p-8 md:p-12">
                <div className="mb-8">
                  <p className="text-xl text-gray-700 leading-relaxed italic border-l-4 border-red-600 pl-6 mb-8">
                    {article.excerpt}
                  </p>
                </div>

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

                {/* Engagement Section */}
                <div className="mt-8 pt-8 border-t border-red-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                        <Heart className="h-4 w-4 mr-2" />
                        {article.likes} Curtidas
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {article.comments} Comentários
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
                  Especialista em tatuagem com mais de 10 anos de experiência no mercado.
                </p>
                <Button variant="outline" size="sm" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                  Ver Perfil
                </Button>
              </CardContent>
            </Card>

            {/* Article Stats */}
            <Card className="bg-gradient-to-br from-white to-gray-50 border-red-200 shadow-xl">
              <CardContent className="p-6">
                <h3 className="font-bold text-red-600 mb-4">Estatísticas</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Visualizações</span>
                    <span className="font-bold text-red-600">{article.views.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Curtidas</span>
                    <span className="font-bold text-red-600">{article.likes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Comentários</span>
                    <span className="font-bold text-red-600">{article.comments}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tempo de leitura</span>
                    <span className="font-bold text-red-600">{article.readTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <Card className="bg-gradient-to-br from-white to-gray-50 border-red-200 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="font-bold text-red-600 mb-4">Artigos Relacionados</h3>
                  <div className="space-y-4">
                    {relatedPosts.map(post => (
                      <div
                        key={post.id}
                        className="group cursor-pointer"
                        onClick={() => navigate(`/tatuadores-da-nova-era/blog/${post.slug}`)}
                      >
                        <div className="flex gap-3">
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-16 h-16 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-red-600 group-hover:text-red-700 transition-colors line-clamp-2 mb-1">
                              {post.title}
                            </h4>
                            <p className="text-xs text-gray-500">{post.readTime}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-red-500 transition-colors flex-shrink-0 mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CTA */}
            <Card className="bg-gradient-to-br from-white to-gray-50 border-red-200 shadow-xl">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-red-600 mb-2">Gostou do conteúdo?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Compartilhe com outros tatuadores e ajude a comunidade a crescer!
                </p>
                <Button className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg hover:shadow-xl">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar Artigo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TattooArtistsBlogArticle;
