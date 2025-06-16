
import React from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Clock, Eye, Tag, Share2, Heart, Bookmark } from "lucide-react";
import TatuadoresLayout from "@/components/layouts/TatuadoresLayout";

// Mock data para artigos (mesmo do index)
const mockArticles = [
  {
    id: "1",
    title: "Dominando a Arte do Realismo: Técnicas Avançadas",
    excerpt: "Descubra as técnicas profissionais para criar tatuagens realistas impressionantes que destacam seu trabalho no mercado.",
    content: `
      <h2>Introdução ao Realismo na Tatuagem</h2>
      <p>O realismo na tatuagem é uma das técnicas mais desafiadoras e recompensadoras do mundo da arte corporal. Requer não apenas habilidade técnica excepcional, mas também uma compreensão profunda de luz, sombra e proporção.</p>
      
      <h3>Técnicas Fundamentais</h3>
      <p>Para dominar o realismo, você precisa focar em alguns aspectos fundamentais:</p>
      <ul>
        <li><strong>Sombreamento gradual:</strong> A chave para criar profundidade e dimensão</li>
        <li><strong>Detalhamento preciso:</strong> Cada linha deve ter propósito e significado</li>
        <li><strong>Contraste controlado:</strong> Balanceamento entre áreas claras e escuras</li>
        <li><strong>Textura realística:</strong> Reproduzir fielmente as superfícies</li>
      </ul>
      
      <h3>Equipamentos Recomendados</h3>
      <p>Para trabalhos realistas, recomendamos:</p>
      <ul>
        <li>Máquina rotativa de alta precisão</li>
        <li>Cartuchos de diferentes configurações (3RL, 5RL, 7RS, 9RS)</li>
        <li>Tintas de alta qualidade com boa pigmentação</li>
        <li>Fontes de luz adequadas para visualização precisa</li>
      </ul>
      
      <h3>Dicas Práticas</h3>
      <p>Algumas dicas importantes para melhorar seus trabalhos realistas:</p>
      <ol>
        <li>Estude anatomia e proporções constantemente</li>
        <li>Pratique com diferentes referências fotográficas</li>
        <li>Desenvolva seu olhar para detalhes</li>
        <li>Não tenha pressa - o realismo exige tempo</li>
        <li>Invista em materiais de qualidade</li>
      </ol>
      
      <h3>Conclusão</h3>
      <p>O domínio do realismo na tatuagem é uma jornada contínua de aprendizado e prática. Com dedicação e as técnicas corretas, você pode elevar seu trabalho a um novo patamar de excelência artística.</p>
    `,
    author: "Carlos Silva",
    publishedAt: "2024-01-15",
    category: "Técnicas",
    tags: ["realismo", "técnicas avançadas", "sombreamento"],
    readTime: 8,
    views: 1250,
    featured: true,
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=1200&q=80"
  },
  // ... outros artigos aqui
];

const BlogPost = () => {
  const { id } = useParams();
  const article = mockArticles.find(a => a.id === id);

  if (!article) {
    return (
      <TatuadoresLayout>
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-red-800 mb-4">Artigo não encontrado</h1>
          <Link to="/tatuadores-da-nova-era/blog">
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Blog
            </Button>
          </Link>
        </div>
      </TatuadoresLayout>
    );
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      "Técnicas": "bg-red-100 text-red-800",
      "Marketing": "bg-blue-100 text-blue-800", 
      "Estilos": "bg-purple-100 text-purple-800",
      "Negócios": "bg-green-100 text-green-800",
      "Segurança": "bg-yellow-100 text-yellow-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <TatuadoresLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Link to="/tatuadores-da-nova-era/blog" className="hover:text-red-600 transition-colors">
            Blog
          </Link>
          <span>/</span>
          <span className="text-red-600">{article.title}</span>
        </div>

        {/* Back Button */}
        <Link to="/tatuadores-da-nova-era/blog">
          <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Blog
          </Button>
        </Link>

        {/* Article Header */}
        <div className="space-y-4">
          <Badge className={getCategoryColor(article.category)}>
            {article.category}
          </Badge>
          
          <h1 className="text-4xl font-black text-red-800 leading-tight">
            {article.title}
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed">
            {article.excerpt}
          </p>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{article.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(article.publishedAt).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{article.readTime} min de leitura</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>{article.views} visualizações</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                <Heart className="h-4 w-4 mr-1" />
                Curtir
              </Button>
              <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                <Bookmark className="h-4 w-4 mr-1" />
                Salvar
              </Button>
              <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                <Share2 className="h-4 w-4 mr-1" />
                Compartilhar
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="aspect-video overflow-hidden rounded-lg shadow-xl">
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Content */}
        <Card className="border-red-200">
          <CardContent className="p-8">
            <div 
              className="prose prose-lg max-w-none prose-red prose-headings:text-red-800 prose-a:text-red-600 prose-strong:text-red-900"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </CardContent>
        </Card>

        {/* Tags */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-red-800">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="hover:bg-red-100 hover:text-red-800 transition-colors cursor-pointer">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Author Bio */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Sobre o Autor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {article.author.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 mb-2">{article.author}</h4>
                <p className="text-gray-600 text-sm">
                  Tatuador profissional com mais de 10 anos de experiência, especialista em realismo e técnicas avançadas. 
                  Instrutor certificado e mentor de novos tatuadores na 99Tattoo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Articles */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-red-800">Artigos Relacionados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockArticles.filter(a => a.id !== article.id).slice(0, 2).map((relatedArticle) => (
              <Card key={relatedArticle.id} className="border-red-200 hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img 
                    src={relatedArticle.image} 
                    alt={relatedArticle.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <Badge className={getCategoryColor(relatedArticle.category)} style={{ width: 'fit-content' }}>
                    {relatedArticle.category}
                  </Badge>
                  <CardTitle className="text-lg text-red-900 hover:text-red-700 transition-colors">
                    <Link to={`/tatuadores-da-nova-era/blog/${relatedArticle.id}`}>
                      {relatedArticle.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link to={`/tatuadores-da-nova-era/blog/${relatedArticle.id}`}>
                    <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                      Ler Artigo
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </TatuadoresLayout>
  );
};

export default BlogPost;
