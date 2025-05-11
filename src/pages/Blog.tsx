
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import BlogCard from "@/components/blog/BlogCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const blogPosts = [
  {
    id: 1,
    title: "Como Cuidar da Sua Tatuagem nos Primeiros Dias",
    excerpt: "Dicas essenciais para garantir a cicatrização perfeita da sua nova tatuagem e manter as cores vibrantes por mais tempo. Aprenda sobre os cuidados necessários durante a recuperação.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras porttitor metus velit, ut aliquam ipsum congue ut. Sed faucibus risus eu dui tincidunt, et porttitor risus sodales.",
    image: "https://images.unsplash.com/photo-1541127397299-0db99bb5edb3?q=80&w=2070&auto=format&fit=crop",
    date: "10 Mai 2023",
    category: "Cuidados",
    author: "Mariana Silva",
  },
  {
    id: 2,
    title: "Os Estilos de Tatuagem Mais Populares em 2023",
    excerpt: "Conheça as tendências de tatuagem que estão em alta este ano, desde o minimalismo até os designs geométricos complexos. Descubra qual estilo combina mais com você.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras porttitor metus velit, ut aliquam ipsum congue ut. Sed faucibus risus eu dui tincidunt, et porttitor risus sodales.",
    image: "https://images.unsplash.com/photo-1494797262163-102fae527c62?q=80&w=1964&auto=format&fit=crop",
    date: "22 Abr 2023",
    category: "Tendências",
    author: "Rafael Costa",
  },
  {
    id: 3,
    title: "Mitos e Verdades Sobre Tatuagem",
    excerpt: "Desmistificamos as crenças mais comuns sobre tatuagens e explicamos o que realmente acontece durante o processo. Conheça os fatos e deixe os mitos para trás.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras porttitor metus velit, ut aliquam ipsum congue ut. Sed faucibus risus eu dui tincidunt, et porttitor risus sodales.",
    image: "https://images.unsplash.com/photo-1522096491219-a2ae6199959c?q=80&w=2000&auto=format&fit=crop",
    date: "05 Mar 2023",
    category: "Informação",
    author: "Juliana Mendes",
  },
  {
    id: 4,
    title: "Qual o Melhor Local para sua Primeira Tatuagem?",
    excerpt: "Está pensando em fazer sua primeira tatuagem, mas não sabe onde? Neste artigo, abordamos os melhores locais para iniciantes, considerando dor, visibilidade e cicatrização.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras porttitor metus velit, ut aliquam ipsum congue ut. Sed faucibus risus eu dui tincidunt, et porttitor risus sodales.",
    image: "https://images.unsplash.com/photo-1606811856475-5e6fcbfe0a6c?q=80&w=1974&auto=format&fit=crop",
    date: "18 Fev 2023",
    category: "Dicas",
    author: "Rafael Costa",
  },
  {
    id: 5,
    title: "A História da Arte da Tatuagem Através dos Séculos",
    excerpt: "Uma jornada fascinante pela história das tatuagens, desde as civilizações antigas até os dias de hoje. Descubra como essa arte evoluiu e se tornou parte da cultura global.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras porttitor metus velit, ut aliquam ipsum congue ut. Sed faucibus risus eu dui tincidunt, et porttitor risus sodales.",
    image: "https://images.unsplash.com/photo-1599006273138-b87f29a7bdca?q=80&w=1776&auto=format&fit=crop",
    date: "01 Jan 2023",
    category: "História",
    author: "Mariana Silva",
  },
  {
    id: 6,
    title: "Tatuagem e Expressão Pessoal: Como Escolher o Design Perfeito",
    excerpt: "Aprenda como escolher uma tatuagem que realmente represente quem você é e o que valoriza. Dicas para transformar suas ideias em arte significativa e duradoura.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras porttitor metus velit, ut aliquam ipsum congue ut. Sed faucibus risus eu dui tincidunt, et porttitor risus sodales.",
    image: "https://images.unsplash.com/photo-1562962230-16e4623d36e7?q=80&w=1974&auto=format&fit=crop",
    date: "12 Dez 2022",
    category: "Inspiração",
    author: "Juliana Mendes",
  },
];

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  
  const categories = ["Todos", "Cuidados", "Tendências", "Informação", "Dicas", "História", "Inspiração"];
  
  const filteredPosts = blogPosts.filter(post => 
    (activeCategory === "Todos" || post.category === activeCategory) &&
    (searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Layout>
      {/* Blog header */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Blog da <span className="text-red-500">99Tattoo</span></h1>
          <p className="text-xl max-w-2xl mx-auto">
            Dicas, novidades e conteúdo sobre o mundo das tatuagens.
          </p>
        </div>
      </div>

      {/* Search and filter section */}
      <div className="bg-white py-8 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="md:w-1/3">
              <Input
                type="search"
                placeholder="Buscar no blog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    activeCategory === category
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Blog content */}
      <div className="container mx-auto px-4 py-12">
        {filteredPosts.length > 0 ? (
          <>
            {/* Featured post */}
            {activeCategory === "Todos" && searchQuery === "" && (
              <div className="mb-12">
                <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-12 lg:flex">
                  <div className="lg:w-1/2">
                    <img
                      src={blogPosts[0].image}
                      alt={blogPosts[0].title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="lg:w-1/2 p-8 flex flex-col justify-center">
                    <div className="flex items-center mb-4">
                      <span className="bg-red-100 text-red-500 text-xs font-medium px-2 py-1 rounded mr-2">
                        {blogPosts[0].category}
                      </span>
                      <span className="text-sm text-gray-500">{blogPosts[0].date}</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-4">{blogPosts[0].title}</h2>
                    <p className="text-gray-600 mb-6">{blogPosts[0].excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Por {blogPosts[0].author}</span>
                      <Button asChild variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                        <a href={`/blog/${blogPosts[0].id}`}>Ler artigo</a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Blog grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.slice(activeCategory === "Todos" && searchQuery === "" ? 1 : 0).map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <nav className="inline-flex">
                <button className="px-4 py-2 text-gray-500 bg-gray-200 rounded-l-md hover:bg-gray-300">
                  Anterior
                </button>
                <button className="px-4 py-2 text-white bg-red-500">1</button>
                <button className="px-4 py-2 text-gray-500 bg-gray-200 hover:bg-gray-300">2</button>
                <button className="px-4 py-2 text-gray-500 bg-gray-200 hover:bg-gray-300">3</button>
                <button className="px-4 py-2 text-gray-500 bg-gray-200 rounded-r-md hover:bg-gray-300">
                  Próxima
                </button>
              </nav>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-bold mb-2">Nenhum artigo encontrado</h3>
            <p className="text-gray-600 mb-4">Tente ajustar sua busca para encontrar mais conteúdo.</p>
            <Button onClick={() => {setSearchQuery(""); setActiveCategory("Todos");}}>
              Ver todos os artigos
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Blog;
