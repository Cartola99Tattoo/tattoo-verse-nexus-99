
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "Como Cuidar da Sua Tatuagem nos Primeiros Dias",
    excerpt: "Dicas essenciais para garantir a cicatrização perfeita da sua nova tatuagem e manter as cores vibrantes por mais tempo.",
    image: "https://images.unsplash.com/photo-1541127397299-0db99bb5edb3?q=80&w=2070&auto=format&fit=crop",
    date: "10 Mai 2023",
    category: "Cuidados",
    author: "Mariana Silva",
  },
  {
    id: 2,
    title: "Os Estilos de Tatuagem Mais Populares em 2023",
    excerpt: "Conheça as tendências de tatuagem que estão em alta este ano, desde o minimalismo até os designs geométricos complexos.",
    image: "https://images.unsplash.com/photo-1494797262163-102fae527c62?q=80&w=1964&auto=format&fit=crop",
    date: "22 Abr 2023",
    category: "Tendências",
    author: "Rafael Costa",
  },
  {
    id: 3,
    title: "Mitos e Verdades Sobre Tatuagem",
    excerpt: "Desmistificamos as crenças mais comuns sobre tatuagens e explicamos o que realmente acontece durante o processo.",
    image: "https://images.unsplash.com/photo-1522096491219-a2ae6199959c?q=80&w=2000&auto=format&fit=crop",
    date: "05 Mar 2023",
    category: "Informação",
    author: "Juliana Mendes",
  },
];

const BlogPreview = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-4">
            Últimas do <span className="text-red-500">Blog</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Artigos, dicas e novidades do mundo das tatuagens.
            Fique por dentro das tendências e aprenda a cuidar melhor da sua arte.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Link to={`/blog/${post.id}`} className="block h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </Link>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="bg-red-100 text-red-500 text-xs font-medium px-2 py-1 rounded">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500">{post.date}</span>
                </div>
                <Link to={`/blog/${post.id}`}>
                  <h3 className="text-xl font-bold mb-2 hover:text-red-500 transition-colors">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Por {post.author}</span>
                  <Link
                    to={`/blog/${post.id}`}
                    className="text-red-500 hover:text-red-700 transition-colors text-sm flex items-center"
                  >
                    Ler mais
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button asChild className="bg-black hover:bg-gray-800 text-white">
            <Link to="/blog">Ver Todos os Artigos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
