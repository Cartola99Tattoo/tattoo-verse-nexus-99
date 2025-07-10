
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, User, Clock, Share2, Heart, MessageCircle, ChevronRight, Eye, ShoppingCart, Calendar as CalendarIcon, Star, ExternalLink } from "lucide-react";
import { getArticleBySlug, getRelatedArticles, BlogArticle } from "@/services/mock/mockBlogService";

const TattooArtistsBlogArticle = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogArticle[]>([]);

  useEffect(() => {
    if (articleId) {
      const foundArticle = getArticleBySlug(articleId);
      if (foundArticle) {
        setArticle(foundArticle);
        setLikes(foundArticle.stats.likes);
        setRelatedPosts(getRelatedArticles(foundArticle));
      }
    }
  }, [articleId]);

  const handleLike = () => {
    setLikes(prev => liked ? prev - 1 : prev + 1);
    setLiked(!liked);
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Artigo não encontrado</h2>
          <p className="text-gray-600 mb-8 text-lg">
            O artigo que você está procurando não existe ou foi removido.
          </p>
          <Button 
            onClick={() => navigate('/tatuadores-da-nova-era/blog')}
            className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Blog
          </Button>
        </div>
      </div>
    );
  }

  // Componente de Anúncio de Produto
  const ProductAd = ({ product }: { product: any }) => (
    <div className="my-12 p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <Badge className="bg-blue-600 text-white font-bold">{product.badge}</Badge>
        {product.discount && <Badge variant="outline" className="border-green-500 text-green-600 font-bold">{product.discount}</Badge>}
      </div>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-48 object-cover rounded-xl shadow-lg"
          />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-blue-800 mb-3">{product.name}</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">{product.description}</p>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-black text-green-600">{product.price}</span>
            {product.originalPrice && <span className="text-lg text-gray-500 line-through">{product.originalPrice}</span>}
          </div>
          <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold shadow-lg hover:shadow-xl">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Comprar Agora
          </Button>
        </div>
      </div>
    </div>
  );

  // Componente de Anúncio de Serviço
  const ServiceAd = ({ service }: { service: any }) => (
    <div className="my-12 p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl shadow-xl">
      <Badge className="bg-purple-600 text-white font-bold mb-4">{service.badge}</Badge>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <img 
            src={service.image} 
            alt={service.title}
            className="w-full h-48 object-cover rounded-xl shadow-lg"
          />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-purple-800 mb-3">{service.title}</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">{service.description}</p>
          <ul className="space-y-2 mb-4">
            {service.features.map((feature: string, index: number) => (
              <li key={index} className="flex items-center text-gray-700">
                <Star className="h-4 w-4 mr-2 text-yellow-500" />
                {feature}
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-black text-purple-600">{service.price}</span>
          </div>
          <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold shadow-lg hover:shadow-xl">
            <ExternalLink className="h-5 w-5 mr-2" />
            {service.cta}
          </Button>
        </div>
      </div>
    </div>
  );

  // Componente de Anúncio de Evento
  const EventAd = ({ event }: { event: any }) => (
    <div className="my-12 p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl shadow-xl">
      <Badge className="bg-orange-600 text-white font-bold mb-4">{event.badge}</Badge>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-48 object-cover rounded-xl shadow-lg"
          />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-orange-800 mb-3">{event.title}</h3>
          <p className="text-gray-700 mb-4 leading-relaxed">{event.description}</p>
          <div className="space-y-2 mb-4 text-gray-700">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2 text-orange-600" />
              <span className="font-semibold">{event.date}</span>
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-orange-600" />
              <span>{event.instructor}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold">📍 {event.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-black text-green-600">{event.price}</span>
            {event.originalPrice && <span className="text-lg text-gray-500 line-through">{event.originalPrice}</span>}
          </div>
          <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-800 hover:from-orange-700 hover:to-orange-900 text-white font-bold shadow-lg hover:shadow-xl">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Inscreva-se Agora
          </Button>
        </div>
      </div>
    </div>
  );

  // Função para inserir anúncios estratégicos no conteúdo
  const insertStrategicAds = (content: string) => {
    const paragraphs = content.split('</p>');
    let modifiedContent = '';
    
    paragraphs.forEach((paragraph, index) => {
      modifiedContent += paragraph;
      if (paragraph.includes('<p')) {
        modifiedContent += '</p>';
      }
      
      // Inserir anúncios em posições estratégicas
      if (index === 1 && article.products.length > 0) {
        // Após o primeiro/segundo parágrafo - Anúncio de produto
        modifiedContent += `<div id="product-ad-1"></div>`;
      } else if (index === Math.floor(paragraphs.length * 0.5) && article.services.length > 0) {
        // No meio do artigo - Anúncio de serviço
        modifiedContent += `<div id="service-ad-1"></div>`;
      } else if (index === paragraphs.length - 3 && article.events.length > 0) {
        // Antes da conclusão - Anúncio de evento
        modifiedContent += `<div id="event-ad-1"></div>`;
      }
    });
    
    return modifiedContent;
  };

  const processedContent = insertStrategicAds(article.content);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-12">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/tatuadores-da-nova-era/blog')}
            className="text-white hover:bg-white/10 mb-6 font-semibold"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar ao Blog
          </Button>
          
          <div className="max-w-4xl">
            <Badge variant="outline" className="border-white text-white hover:bg-white hover:text-red-600 mb-6 font-bold">
              {article.category}
            </Badge>
            
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-red-100 text-lg">
              <div className="flex items-center">
                <User className="h-6 w-6 mr-3" />
                <span className="font-semibold">{article.author.name}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-6 w-6 mr-3" />
                <span>{new Date(article.publishDate).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-6 w-6 mr-3" />
                <span>{article.stats.readTime} de leitura</span>
              </div>
              <div className="flex items-center">
                <Eye className="h-6 w-6 mr-3" />
                <span>{article.stats.views.toLocaleString()} visualizações</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Image */}
            <div className="mb-12">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-2xl"
              />
            </div>

            {/* Article Body with Strategic Ads */}
            <Card className="bg-gradient-to-br from-white to-gray-50 border-red-200 shadow-2xl rounded-2xl overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="mb-12">
                  <p className="text-2xl text-gray-700 leading-relaxed italic border-l-4 border-red-600 pl-8 mb-12 font-medium bg-red-50 py-4 rounded-r-xl">
                    {article.excerpt}
                  </p>
                </div>

                {/* Renderizar conteúdo com anúncios integrados */}
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: processedContent }}
                />

                {/* Inserir anúncios reais nas posições marcadas */}
                <div className="space-y-8">
                  {article.products.length > 0 && <ProductAd product={article.products[0]} />}
                  {article.services.length > 0 && <ServiceAd service={article.services[0]} />}
                  {article.events.length > 0 && <EventAd event={article.events[0]} />}
                </div>

                {/* Tags */}
                <div className="mt-16 pt-8 border-t-2 border-red-200">
                  <h3 className="text-2xl font-bold text-red-600 mb-6">Tags do Artigo</h3>
                  <div className="flex flex-wrap gap-3">
                    {article.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-red-50 border-red-200 text-red-600 px-4 py-2 text-base font-semibold">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Engagement Section */}
                <div className="mt-12 pt-8 border-t-2 border-red-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        onClick={handleLike}
                        className={`border-red-200 hover:bg-red-50 font-bold ${
                          liked ? 'bg-red-50 text-red-700 border-red-400' : 'text-red-600'
                        }`}
                      >
                        <Heart className={`h-5 w-5 mr-2 ${liked ? 'fill-current' : ''}`} />
                        {likes} Curtidas
                      </Button>
                      <Button variant="outline" size="lg" className="border-red-200 text-red-600 hover:bg-red-50 font-bold">
                        <MessageCircle className="h-5 w-5 mr-2" />
                        {article.stats.comments} Comentários
                      </Button>
                    </div>
                    <Button className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg hover:shadow-xl font-bold" size="lg">
                      <Share2 className="h-5 w-5 mr-2" />
                      Compartilhar Artigo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Author Info */}
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-2xl rounded-2xl">
              <CardContent className="p-8 text-center">
                <img
                  src={article.author.image}
                  alt={article.author.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 shadow-lg object-cover"
                />
                <h3 className="font-bold text-red-600 mb-3 text-xl">{article.author.name}</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {article.author.bio}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.author.specialties.map(specialty => (
                    <Badge key={specialty} variant="outline" className="text-xs border-red-200 text-red-600">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full border-red-200 text-red-600 hover:bg-red-50 font-semibold">
                  Ver Perfil Completo
                </Button>
              </CardContent>
            </Card>

            {/* Article Stats */}
            <Card className="bg-gradient-to-br from-white to-gray-50 border-red-200 shadow-2xl rounded-2xl">
              <CardContent className="p-8">
                <h3 className="font-bold text-red-600 mb-6 text-xl">Estatísticas do Artigo</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-semibold">Visualizações</span>
                    <span className="font-black text-red-600 text-xl">{article.stats.views.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-semibold">Curtidas</span>
                    <span className="font-black text-red-600 text-xl">{likes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-semibold">Comentários</span>
                    <span className="font-black text-red-600 text-xl">{article.stats.comments}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-semibold">Compartilhamentos</span>
                    <span className="font-black text-red-600 text-xl">{article.stats.shares}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <Card className="bg-gradient-to-br from-white to-gray-50 border-red-200 shadow-2xl rounded-2xl">
                <CardContent className="p-8">
                  <h3 className="font-bold text-red-600 mb-6 text-xl">Artigos Relacionados</h3>
                  <div className="space-y-6">
                    {relatedPosts.map(post => (
                      <div
                        key={post.id}
                        className="group cursor-pointer"
                        onClick={() => navigate(`/tatuadores-da-nova-era/blog/${post.slug}`)}
                      >
                        <div className="flex gap-4">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-20 h-20 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-red-600 group-hover:text-red-700 transition-colors line-clamp-2 mb-2 leading-snug">
                              {post.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{post.stats.readTime}</span>
                              <span>•</span>
                              <span>{post.stats.views} views</span>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors flex-shrink-0 mt-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Newsletter CTA */}
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-2xl rounded-2xl">
              <CardContent className="p-8 text-center">
                <h3 className="font-bold text-purple-600 mb-3 text-xl">📧 Newsletter Exclusiva</h3>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  Receba semanalmente conteúdos exclusivos direto no seu e-mail!
                </p>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white shadow-lg hover:shadow-xl font-bold">
                  Quero Receber!
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
