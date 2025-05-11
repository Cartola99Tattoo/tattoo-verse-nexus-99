import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import TattooCard from "@/components/shop/TattooCard";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useBlogPost } from "@/hooks/useBlogPost";

type BlogPost = {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  author: string;
};

type Tattoo = {
  id: number;
  name: string;
  artist: string;
  category: string;
  image: string;
  price: number;
  rating: number;
};

// Mock data for related tattoos (we'll keep this for now, but it would be better to fetch from API)
const relatedTattoos = [
  {
    id: 1,
    name: "Dragão Oriental",
    artist: "Mariana Silva",
    category: "Colorido",
    image: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=2070&auto=format&fit=crop",
    price: 750,
    rating: 4.9,
  },
  {
    id: 5,
    name: "Flor de Cerejeira",
    artist: "Juliana Mendes",
    category: "Aquarela",
    image: "https://images.unsplash.com/photo-1542727365-19732c00842f?q=80&w=1976&auto=format&fit=crop",
    price: 450,
    rating: 4.7,
  },
  {
    id: 7,
    name: "Rosa Realista",
    artist: "Mariana Silva",
    category: "Realismo",
    image: "https://images.unsplash.com/photo-1524012435847-659cf8c3dee9?q=80&w=1974&auto=format&fit=crop",
    price: 600,
    rating: 4.9,
  },
];

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  // Use our improved hook
  const { post, isLoading, error } = useBlogPost(id || "");

  // Show loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-4xl">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded w-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error state
  if (error || !post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Artigo não encontrado</AlertTitle>
            <AlertDescription>
              {error?.details || "O artigo que você está procurando não existe ou foi removido."}
            </AlertDescription>
          </Alert>
          
          <div className="text-center mt-8">
            <Button asChild>
              <Link to="/blog">Voltar para o Blog</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero section */}
      <div className="w-full h-96 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="container mx-auto px-4 absolute bottom-0 left-0 right-0 z-20 pb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link to="/blog" className="text-white hover:text-red-500 transition-colors">
              Blog
            </Link>
            <span className="text-white">/</span>
            <span className="text-gray-300">{post.category}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{post.title}</h1>
          <div className="flex items-center text-white">
            <span className="mr-4">{post.date}</span>
            <span className="mr-4">|</span>
            <span>Por {post.author}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <Separator className="my-8" />

              {/* Author info */}
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                <div>
                  <p className="font-bold">{post.author}</p>
                  <p className="text-sm text-gray-600">Artista Tatuador na 99Tattoo</p>
                </div>
              </div>
            </div>

            {/* Share buttons */}
            <div className="mt-8 flex gap-4">
              <Button variant="outline" className="flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                </svg>
                Compartilhar no Twitter
              </Button>
              <Button variant="outline" className="flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                </svg>
                Compartilhar no Facebook
              </Button>
            </div>

            {/* Comments section - placeholder */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold mb-6">Comentários (0)</h3>
              <div className="border-b pb-6 mb-6">
                <textarea 
                  placeholder="Deixe seu comentário..." 
                  className="w-full border rounded-md p-3 h-24"
                ></textarea>
                <Button className="mt-4 bg-red-500 hover:bg-red-600">Comentar</Button>
              </div>
              <div className="text-center text-gray-500">
                Seja o primeiro a comentar!
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            {/* Related tattoos */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 border-b border-red-500 pb-2 inline-block">
                Tatuagens Relacionadas
              </h3>
              <div className="space-y-6 mt-4">
                {relatedTattoos.map(tattoo => (
                  <TattooCard key={tattoo.id} tattoo={tattoo} />
                ))}
              </div>
              <Button asChild variant="outline" className="w-full mt-4 border-black text-black hover:bg-black hover:text-white">
                <Link to="/shop">Ver Mais Tatuagens</Link>
              </Button>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4 border-b border-red-500 pb-2 inline-block">
                Categorias
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/blog?category=Cuidados" className="flex justify-between items-center hover:text-red-500">
                    Cuidados <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">5</span>
                  </Link>
                </li>
                <li>
                  <Link to="/blog?category=Tendências" className="flex justify-between items-center hover:text-red-500">
                    Tendências <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">8</span>
                  </Link>
                </li>
                <li>
                  <Link to="/blog?category=Informação" className="flex justify-between items-center hover:text-red-500">
                    Informação <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">12</span>
                  </Link>
                </li>
                <li>
                  <Link to="/blog?category=Dicas" className="flex justify-between items-center hover:text-red-500">
                    Dicas <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">6</span>
                  </Link>
                </li>
                <li>
                  <Link to="/blog?category=História" className="flex justify-between items-center hover:text-red-500">
                    História <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">3</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPost;
