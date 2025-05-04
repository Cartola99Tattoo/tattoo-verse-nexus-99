
import React from 'react';

interface BlogPost {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
}

const BlogSection: React.FC = () => {
  const blogPosts: BlogPost[] = [
    {
      title: "Como escolher o estilo perfeito para sua primeira tatuagem",
      excerpt: "Dicas essenciais para quem está pensando em fazer sua primeira tatuagem e deseja acertar na escolha do estilo.",
      image: "https://images.unsplash.com/photo-1569385210018-127685230669?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      date: "12 mai 2023",
      category: "Guia"
    },
    {
      title: "Cuidados essenciais após fazer sua tatuagem",
      excerpt: "Aprenda como cuidar corretamente da sua tatuagem recém-feita para garantir uma cicatrização perfeita.",
      image: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      date: "03 mai 2023",
      category: "Cuidados"
    },
    {
      title: "As tendências de tatuagem para 2023",
      excerpt: "Descubra quais são os estilos, designs e técnicas que estão em alta este ano no mundo da tatuagem.",
      image: "https://images.unsplash.com/photo-1590246813608-3b4072d865a6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      date: "28 abr 2023",
      category: "Tendências"
    }
  ];

  return (
    <section id="blog" className="py-20 bg-tattoo-darkgray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Últimas do <span className="text-tattoo-red">Blog</span></h2>
          <div className="red-line mx-auto w-24 my-4"></div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Acompanhe nosso blog para dicas, tendências e histórias inspiradoras sobre o mundo da tatuagem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <article 
              key={index} 
              className="bg-tattoo-black rounded-lg overflow-hidden futuristic-border hover:shadow-lg hover:shadow-tattoo-red/10 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className="bg-tattoo-red px-3 py-1 rounded text-xs">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-400 mb-2">{post.date}</p>
                <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                <p className="text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>
                <a 
                  href="#" 
                  className="text-tattoo-red hover:text-tattoo-red/80 inline-flex items-center transition-colors"
                >
                  Ler mais
                  <span className="ml-1">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-transparent border border-tattoo-red text-tattoo-red px-6 py-3 rounded hover:bg-tattoo-red hover:text-white transition-all duration-300">
            Ver Todos os Artigos
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
