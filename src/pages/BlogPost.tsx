
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import TattooCard from "@/components/shop/TattooCard";
import { toast } from "@/components/ui/use-toast";

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

// Mock data for related tattoos
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

// Mock data for blog posts (this should be fetched from an API in a real application)
const blogPosts = [
  {
    id: 1,
    title: "Como Cuidar da Sua Tatuagem nos Primeiros Dias",
    excerpt: "Dicas essenciais para garantir a cicatrização perfeita da sua nova tatuagem e manter as cores vibrantes por mais tempo. Aprenda sobre os cuidados necessários durante a recuperação.",
    content: `<p>Parabéns pela sua nova tatuagem! Agora que você tem essa obra de arte na sua pele, é essencial saber como cuidar dela corretamente, especialmente nos primeiros dias após a sessão. Uma boa cicatrização não só garante que sua tatuagem mantenha as cores vibrantes e os detalhes nítidos, mas também previne infecções e complicações.</p>
    
    <h2>Os Primeiros Cuidados (24-48 horas)</h2>
    
    <p>Nas primeiras 24 a 48 horas, sua tatuagem é essencialmente uma ferida aberta. Siga estas recomendações:</p>
    
    <ul>
      <li><strong>Mantenha o curativo inicial:</strong> Seu tatuador aplicou um curativo protetor. Deixe-o no local pelo tempo recomendado (geralmente entre 2 a 24 horas, dependendo do tipo de curativo).</li>
      <li><strong>Lave delicadamente:</strong> Ao remover o curativo, lave a área com água morna e sabão neutro. Use apenas as pontas dos dedos, sem esfregar.</li>
      <li><strong>Seque com cuidado:</strong> Não esfregue com a toalha. Dê leves batidinhas com uma toalha limpa ou deixe secar naturalmente.</li>
      <li><strong>Aplique pomada cicatrizante:</strong> Use uma fina camada de pomada recomendada pelo seu tatuador.</li>
    </ul>
    
    <h2>Cuidados nos Primeiros Dias (Dias 3-7)</h2>
    
    <p>Nesta fase, sua tatuagem começará o processo de cicatrização:</p>
    
    <ul>
      <li><strong>Lave regularmente:</strong> Continue lavando a tatuagem 2-3 vezes por dia.</li>
      <li><strong>Hidratação leve:</strong> Aplique uma fina camada de creme hidratante específico para tatuagens após cada lavagem.</li>
      <li><strong>Não coce:</strong> A pele começará a descamar naturalmente. Resistir à tentação de coçar é fundamental.</li>
      <li><strong>Evite exposição solar:</strong> Mantenha sua tatuagem nova longe do sol direto.</li>
      <li><strong>Nada de piscinas, mar ou banheiras:</strong> Evite submergir a tatuagem em água por longos períodos.</li>
    </ul>
    
    <h2>Sinais de Alerta</h2>
    
    <p>Fique atento a estes sinais que podem indicar problemas na cicatrização:</p>
    
    <ul>
      <li>Vermelhidão excessiva ou que se espalha além da área tatuada</li>
      <li>Inchaço que piora em vez de melhorar</li>
      <li>Secreção de pus ou líquido com odor</li>
      <li>Febre</li>
      <li>Dor intensa e persistente</li>
    </ul>
    
    <p>Se notar qualquer um desses sinais, entre em contato com seu tatuador ou procure atendimento médico.</p>
    
    <h2>Cuidados a Longo Prazo</h2>
    
    <p>Mesmo após a cicatrização completa (geralmente 2-4 semanas), sua tatuagem precisa de cuidados constantes:</p>
    
    <ul>
      <li>Use sempre protetor solar (mínimo FPS 30) na área tatuada quando exposta ao sol</li>
      <li>Mantenha a pele hidratada</li>
      <li>Evite bronzeamento artificial</li>
    </ul>
    
    <p>Seguindo essas dicas, você garantirá que sua tatuagem permaneça vibrante e bonita por muitos anos. Lembre-se de que cada pele reage de forma diferente, então não hesite em consultar seu tatuador se tiver dúvidas específicas sobre os cuidados com a sua arte.</p>`,
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
];

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get post data
    setIsLoading(true);
    setTimeout(() => {
      const foundPost = blogPosts.find(post => post.id === Number(id));
      if (foundPost) {
        setPost(foundPost);
      } else {
        toast({
          title: "Post não encontrado",
          description: "O artigo que você está procurando não existe ou foi removido.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 500);
  }, [id]);

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

  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Artigo não encontrado</h1>
          <p className="text-gray-600 mb-6">O artigo que você está procurando não existe ou foi removido.</p>
          <Button asChild>
            <Link to="/blog">Voltar para o Blog</Link>
          </Button>
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
