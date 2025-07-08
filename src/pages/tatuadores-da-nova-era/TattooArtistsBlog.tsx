
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Clock, Search, ArrowRight, Eye, Filter, SlidersHorizontal } from "lucide-react";

// Dados mock expandidos e mais abundantes
const blogPosts = [
  {
    id: 1,
    title: "Tendências de Tatuagem 2024: O Que Está Dominando o Mercado",
    slug: "tendencias-tatuagem-2024",
    excerpt: "Explore as principais tendências que estão moldando o mundo da tatuagem neste ano, desde o minimalismo até técnicas inovadoras que revolucionam a arte corporal.",
    author: "Carolina Silva",
    date: "2024-01-15",
    category: "Tendências",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=800&auto=format&fit=crop&q=60",
    featured: true,
    views: 2450,
    likes: 189,
    tags: ["tendências", "2024", "estilos", "minimalismo"]
  },
  {
    id: 2,
    title: "Cuidados Pós-Tatuagem: Guia Completo para Cicatrização Perfeita",
    slug: "cuidados-pos-tatuagem-guia-completo",
    excerpt: "Um guia detalhado e científico sobre como cuidar adequadamente de uma tatuagem recém-feita para garantir a melhor cicatrização e preservar as cores.",
    author: "Dr. Ricardo Mendes",
    date: "2024-01-12",
    category: "Cuidados",
    readTime: "10 min",
    image: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?w=800&auto=format&fit=crop&q=60",
    featured: false,
    views: 1890,
    likes: 234,
    tags: ["cuidados", "cicatrização", "pomadas", "saúde"]
  },
  {
    id: 3,
    title: "Marketing Digital para Tatuadores: Construindo sua Marca Online",
    slug: "marketing-digital-tatuadores",
    excerpt: "Estratégias eficazes de marketing digital para tatuadores que querem expandir sua clientela, fortalecer sua marca pessoal e aumentar o faturamento do estúdio.",
    author: "Ana Paula Costa",
    date: "2024-01-10",
    category: "Marketing",
    readTime: "12 min",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&auto=format&fit=crop&q=60",
    featured: false,
    views: 1340,
    likes: 98,
    tags: ["marketing", "redes sociais", "instagram", "negócios"]
  },
  {
    id: 4,
    title: "Técnicas de Sombreamento: Dominando o Blackwork Contemporâneo",
    slug: "tecnicas-sombreamento-blackwork",
    excerpt: "Aprenda as técnicas fundamentais e avançadas de sombreamento no estilo blackwork. Domine as transições, contrastes e efeitos tridimensionais.",
    author: "Marcos Oliveira",
    date: "2024-01-08",
    category: "Técnicas",
    readTime: "15 min",
    image: "https://images.unsplash.com/photo-1543767271-7c5f36dc5310?w=800&auto=format&fit=crop&q=60",
    featured: false,
    views: 890,
    likes: 145,
    tags: ["blackwork", "sombreamento", "técnicas", "tutorial"]
  },
  {
    id: 5,
    title: "História da Tatuagem: Das Origens Ancestrais aos Dias Atuais",
    slug: "historia-tatuagem-origens",
    excerpt: "Uma jornada fascinante através da rica história da tatuagem, desde suas origens ancestrais até as tendências modernas que moldaram esta arte milenar.",
    author: "Prof. Helena Ribeiro",
    date: "2024-01-05",
    category: "História",
    readTime: "18 min",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=60",
    featured: false,
    views: 1230,
    likes: 156,
    tags: ["história", "cultura", "tradição", "ancestral"]
  },
  {
    id: 6,
    title: "Equipamentos Essenciais: O Kit Completo do Tatuador Profissional 2024",
    slug: "equipamentos-essenciais-tatuador-2024",
    excerpt: "Descubra quais são os equipamentos indispensáveis para qualquer tatuador profissional, desde máquinas até materiais de higiene e segurança.",
    author: "Roberto Santos",
    date: "2024-01-03",
    category: "Equipamentos",
    readTime: "14 min",
    image: "https://images.unsplash.com/photo-1606830713264-f1b9f00a0e4d?w=800&auto=format&fit=crop&q=60",
    featured: false,
    views: 1100,
    likes: 87,
    tags: ["equipamentos", "máquinas", "materiais", "profissional"]
  },
  {
    id: 7,
    title: "Tatuagem Realista: Segredos dos Mestres da Arte Hiper-Realista",
    slug: "tatuagem-realista-segredos-mestres",
    excerpt: "Entre no universo da tatuagem realista e descubra as técnicas secretas dos grandes mestres para criar obras de arte que parecem fotografias na pele.",
    author: "Luciana Ferreira",
    date: "2024-01-01",
    category: "Estilos",
    readTime: "16 min",
    image: "https://images.unsplash.com/photo-1564131072-6c4d41e23ba6?w=800&auto=format&fit=crop&q=60",
    featured: false,
    views: 980,
    likes: 201,
    tags: ["realismo", "técnicas", "mestres", "hiper-realista"]
  },
  {
    id: 8,
    title: "Precificação de Tatuagens: Como Cobrar o Valor Justo pelo seu Trabalho",
    slug: "precificacao-tatuagens-valor-justo",
    excerpt: "Aprenda a calcular corretamente o preço das suas tatuagens considerando tempo, materiais, experiência e valor de mercado. Valorize seu trabalho!",
    author: "Fernando Almeida",
    date: "2023-12-28",
    category: "Negócios",
    readTime: "11 min",
    image: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&auto=format&fit=crop&q=60",
    featured: false,
    views: 1560,
    likes: 312,
    tags: ["precificação", "negócios", "valores", "estúdio"]
  }
];

const categories = [
  "Todos", 
  "Tendências", 
  "Cuidados", 
  "Marketing", 
  "Técnicas", 
  "História", 
  "Equipamentos", 
  "Estilos", 
  "Negócios"
];

const TattooArtistsBlog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState("recent"); // recent, popular, alphabetical
  const navigate = useNavigate();

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "Todos" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Ordenação dos posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'popular': return b.views - a.views;
      case 'alphabetical': return a.title.localeCompare(b.title);
      case 'recent':
      default: return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = sortedPosts.filter(post => !post.featured);

  const handlePostClick = (post: any) => {
    navigate(`/tatuadores-da-nova-era/blog/${post.slug}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black mb-6 text-white drop-shadow-2xl">
              Blog <span className="text-white">99Tattoo</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto text-white leading-relaxed">
              Descubra dicas exclusivas, tendências revolucionárias e histórias inspiradoras do universo da tatuagem profissional
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-red-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Artigos Semanais</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Dicas de Profissionais</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>Tendências Exclusivas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Search and Filters */}
      <section className="py-8 bg-white shadow-xl border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="w-full lg:w-96 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-400 h-5 w-5" />
              <Input
                placeholder="Buscar por título, conteúdo ou tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 border-2 border-red-200 focus:border-red-600 focus:ring-4 focus:ring-red-200 shadow-lg text-lg rounded-xl"
              />
            </div>
            
            {/* Filters and Sort */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-red-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border-2 border-red-200 rounded-lg focus:border-red-600 focus:ring-2 focus:ring-red-200 bg-white shadow-md"
                >
                  <option value="recent">Mais Recentes</option>
                  <option value="popular">Mais Populares</option>
                  <option value="alphabetical">A-Z</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-red-600 to-red-800 text-white shadow-red-glow"
                        : "bg-white text-gray-700 border-2 border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Counter */}
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              <span className="font-bold text-red-600">{filteredPosts.length}</span> {filteredPosts.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
              {selectedCategory !== "Todos" && <span> na categoria <strong>{selectedCategory}</strong></span>}
              {searchTerm && <span> para "<strong>{searchTerm}</strong>"</span>}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Post */}
        {featuredPost && selectedCategory === "Todos" && !searchTerm && (
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-black text-red-600 mb-4">Artigo em Destaque</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-red-800 mx-auto rounded-full"></div>
            </div>
            <Card 
              className="group cursor-pointer overflow-hidden bg-gradient-to-br from-white via-red-50 to-white border-2 border-red-200 shadow-2xl hover:shadow-red-glow transition-all duration-500 transform hover:scale-[1.02] rounded-2xl"
              onClick={() => handlePostClick(featuredPost)}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="h-64 lg:h-auto overflow-hidden rounded-l-2xl">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 shadow-2xl"
                  />
                </div>
                <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-6">
                    <Badge className="bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 text-sm font-bold shadow-lg">
                      ⭐ Em Destaque
                    </Badge>
                    <Badge variant="outline" className="border-red-200 text-red-600 px-3 py-1 font-semibold">
                      {featuredPost.category}
                    </Badge>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-red-600 mb-6 group-hover:text-red-700 transition-colors leading-tight">
                    {featuredPost.title}
                  </h3>
                  
                  <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-8">
                    <div className="flex items-center">
                      <User className="h-5 w-5 mr-2 text-red-500" />
                      <span className="font-medium">{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-red-500" />
                      <span>{new Date(featuredPost.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-red-500" />
                      <span>{featuredPost.readTime} de leitura</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-5 w-5 mr-2 text-red-500" />
                      <span>{featuredPost.views.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <Button className="w-fit bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-3 text-lg font-bold rounded-xl">
                    Ler Artigo Completo
                    <ArrowRight className="h-5 w-5 ml-3" />
                  </Button>
                </CardContent>
              </div>
            </Card>
          </section>
        )}

        {/* Regular Posts Grid */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-red-600 mb-4">
              {selectedCategory === "Todos" ? "Últimos Artigos" : `Artigos - ${selectedCategory}`}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-red-800 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map(post => (
              <Card 
                key={post.id}
                className="group cursor-pointer overflow-hidden bg-gradient-to-br from-white to-gray-50 border-2 border-red-200 shadow-xl hover:shadow-2xl hover:border-red-400 transition-all duration-300 transform hover:scale-[1.05] rounded-2xl"
                onClick={() => handlePostClick(post)}
              >
                <div className="h-48 overflow-hidden rounded-t-2xl">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 shadow-lg"
                  />
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 font-semibold">
                      {post.category}
                    </Badge>
                    <div className="flex items-center text-xs text-gray-500">
                      <Eye className="h-3 w-3 mr-1" />
                      {post.views}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-red-600 mb-3 group-hover:text-red-700 transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1 text-red-500" />
                      <span className="font-medium">{post.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-red-500" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 font-medium">
                      {new Date(post.date).toLocaleDateString('pt-BR')}
                    </span>
                    <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400 font-semibold">
                      Ler mais
                      <ArrowRight className="h-3 w-3 ml-2" />
                    </Button>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-4">
                    {post.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs border-gray-300 text-gray-500 hover:border-red-300 hover:text-red-500">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-12 rounded-2xl border-2 border-red-200 max-w-md mx-auto">
                <h3 className="text-2xl font-bold text-red-600 mb-4">Nenhum artigo encontrado</h3>
                <p className="text-gray-600 mb-6">Tente ajustar os filtros de busca ou explore outras categorias</p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("Todos");
                  }}
                  className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white"
                >
                  Ver Todos os Artigos
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Newsletter CTA */}
        <section className="mt-16">
          <Card className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white border-none shadow-2xl rounded-2xl overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              <h3 className="text-2xl md:text-3xl font-black mb-4">
                Receba Conteúdo Exclusivo no seu E-mail!
              </h3>
              <p className="text-red-100 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
                Inscreva-se na nossa newsletter e receba semanalmente as melhores dicas, tendências e novidades do mundo da tatuagem profissional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input 
                  placeholder="Seu melhor e-mail" 
                  className="bg-white text-gray-900 border-none shadow-lg"
                />
                <Button className="bg-white text-red-600 hover:bg-red-50 font-bold shadow-lg">
                  Inscrever-se
                </Button>
              </div>
              <p className="text-xs text-red-200 mt-4">
                Sem spam. Cancele quando quiser.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default TattooArtistsBlog;
