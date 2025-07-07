import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, User, Clock, Share2, Heart, MessageCircle, ChevronRight, Eye, ThumbsUp, ShoppingCart, Calendar as CalendarIcon, Star, ExternalLink } from "lucide-react";

// Dados mock unificados e expandidos
const mockBlogPosts = [
  {
    id: 1,
    title: "Tendências de Tatuagem 2024: O Que Está Dominando o Mercado",
    slug: "tendencias-tatuagem-2024",
    excerpt: "Explore as principais tendências que estão moldando o mundo da tatuagem neste ano, desde o minimalismo até técnicas inovadoras.",
    content: `
      <div class="prose prose-lg max-w-none">
        <p class="text-xl text-gray-700 leading-relaxed mb-8 font-medium">O mundo da tatuagem nunca parou de evoluir, e 2024 está sendo um ano revolucionário para nossa arte. Depois de anos observando o mercado e conversando com os principais tatuadores do Brasil e do mundo, compilamos as tendências mais marcantes que estão definindo este ano.</p>

        <h2 class="text-red-600 font-black text-3xl mt-12 mb-8 border-b-4 border-red-200 pb-4">🎨 Minimalismo e Fine Line: A Beleza da Simplicidade</h2>
        
        <p class="mb-6 leading-relaxed text-gray-700 text-lg">O minimalismo continua sendo uma das tendências mais fortes de 2024, mas agora com uma abordagem ainda mais refinada. As tatuagens fine line não são apenas sobre traços finos - elas representam uma filosofia de design onde cada elemento tem um propósito específico.</p>
        
        <div class="bg-red-50 border-l-4 border-red-600 p-6 my-8 rounded-r-lg">
          <h3 class="text-red-600 font-bold text-xl mb-4">✨ Características do Fine Line em 2024:</h3>
          <ul class="list-disc ml-6 space-y-3">
            <li class="leading-relaxed text-gray-700 text-lg">Designs geométricos com precisão matemática</li>
            <li class="leading-relaxed text-gray-700 text-lg">Símbolos minimalistas carregados de significado</li>
            <li class="leading-relaxed text-gray-700 text-lg">Lettering delicado com tipografias exclusivas</li>
            <li class="leading-relaxed text-gray-700 text-lg">Ilustrações botânicas ultra-detalhadas</li>
            <li class="leading-relaxed text-gray-700 text-lg">Micro-realismos impressionantes</li>
          </ul>
        </div>

        <p class="mb-8 leading-relaxed text-gray-700 text-lg">O que mais me impressiona é como os tatuadores estão dominando técnicas de <strong class="text-red-600">single needle</strong> para criar obras que parecem desenhos a lápis na pele. A demanda por esse estilo cresceu 340% no último ano, segundo dados da nossa plataforma.</p>

        <h2 class="text-red-600 font-black text-3xl mt-12 mb-8 border-b-4 border-red-200 pb-4">🌈 Aquarela e Cores Vibrantes: Quando a Pele Vira Tela</h2>
        
        <p class="mb-6 leading-relaxed text-gray-700 text-lg">A técnica de aquarela evoluiu tremendamente em 2024. Não estamos mais falando apenas de cores que "escorrem" - os tatuadores estão criando verdadeiras pinturas na pele, com técnicas de sobreposição de cores que criam profundidade e movimento únicos.</p>
        
        <div class="grid md:grid-cols-2 gap-6 my-8">
          <div class="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
            <h3 class="text-purple-600 font-bold text-xl mb-4">🎨 Técnicas Quentes</h3>
            <ul class="space-y-2 text-gray-700">
              <li>• Splash de cores controlado</li>
              <li>• Degradês suaves e naturais</li>
              <li>• Sobreposições cromáticas</li>
              <li>• Efeitos de transparência</li>
            </ul>
          </div>
          <div class="bg-gradient-to-br from-green-50 to-yellow-50 p-6 rounded-xl border border-green-200">
            <h3 class="text-green-600 font-bold text-xl mb-4">🔥 Cores Trending</h3>
            <ul class="space-y-2 text-gray-700">
              <li>• Azuis oceânicos profundos</li>
              <li>• Rosas sunset vibrantes</li>
              <li>• Verdes jade luminosos</li>
              <li>• Laranjas terracota</li>
            </ul>
          </div>
        </div>

        <blockquote class="border-l-4 border-red-600 pl-6 py-4 my-8 bg-red-50 rounded-r-lg italic text-lg text-gray-800">
          "A aquarela em tatuagem não é sobre imprecisão - é sobre controlar o caos e transformá-lo em arte. Cada gota de tinta tem que ser intencional." 
          <cite class="block mt-2 text-red-600 font-semibold not-italic">- Marina Santos, tatuadora especialista em aquarela</cite>
        </blockquote>

        <h2 class="text-red-600 font-black text-3xl mt-12 mb-8 border-b-4 border-red-200 pb-4">⚫ Blackwork Contemporâneo: Geometria e Misticismo</h2>
        
        <p class="mb-6 leading-relaxed text-gray-700 text-lg">O blackwork de 2024 incorporou elementos que vão muito além do tradicional. Estamos vendo uma fusão entre geometria sagrada, elementos arquitetônicos e symbolism contemporâneo que cria peças verdadeiramente únicas.</p>
        
        <div class="bg-gray-900 text-white p-8 rounded-xl my-8">
          <h3 class="text-white font-bold text-2xl mb-6">🔥 Estilos Blackwork em Alta:</h3>
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h4 class="text-red-400 font-bold mb-3">Geométrico Avançado</h4>
              <ul class="space-y-2 text-gray-300">
                <li>→ Padrões fractais complexos</li>
                <li>→ Mandalas tridimensionais</li>
                <li>→ Optical illusions</li>
                <li>→ Sacred geometry moderna</li>
              </ul>
            </div>
            <div>
              <h4 class="text-red-400 font-bold mb-3">Orgânico Abstrato</h4>
              <ul class="space-y-2 text-gray-300">
                <li>→ Formas arquitetônicas fluidas</li>
                <li>→ Elementos tribais modernos</li>
                <li>→ Brush strokes estilizados</li>
                <li>→ Negative space criativo</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 class="text-red-600 font-black text-3xl mt-12 mb-8 border-b-4 border-red-200 pb-4">📊 Dados do Mercado: O Que os Números Revelam</h2>
        
        <p class="mb-6 leading-relaxed text-gray-700 text-lg">Nossa análise de mais de 50.000 tatuagens realizadas em 2024 revelou insights fascinantes sobre as preferências do público:</p>
        
        <div class="grid md:grid-cols-3 gap-6 my-8">
          <div class="text-center bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border-2 border-red-200">
            <div class="text-4xl font-black text-red-600 mb-2">68%</div>
            <div class="text-gray-700 font-semibold">Optam por designs minimalistas</div>
          </div>
          <div class="text-center bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200">
            <div class="text-4xl font-black text-blue-600 mb-2">45%</div>
            <div class="text-gray-700 font-semibold">Preferem cores vibrantes</div>
          </div>
          <div class="text-center bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200">
            <div class="text-4xl font-black text-purple-600 mb-2">32%</div>
            <div class="text-gray-700 font-semibold">Escolhem blackwork puro</div>
          </div>
        </div>

        <h2 class="text-red-600 font-black text-3xl mt-12 mb-8 border-b-4 border-red-200 pb-4">🔮 Previsões para o Segundo Semestre</h2>
        
        <p class="mb-6 leading-relaxed text-gray-700 text-lg">Baseado nas tendências internacionais e no comportamento do mercado brasileiro, algumas previsões para os próximos meses:</p>
        
        <div class="space-y-4 mb-8">
          <div class="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span class="text-white font-bold text-sm">1</span>
            </div>
            <div>
              <h4 class="font-bold text-green-800 mb-2">Micro-Realismo Extremo</h4>
              <p class="text-gray-700">Tatuagens hiper-realistas em escalas minúsculas, com detalhamento que desafia os limites da técnica.</p>
            </div>
          </div>
          
          <div class="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span class="text-white font-bold text-sm">2</span>
            </div>
            <div>
              <h4 class="font-bold text-blue-800 mb-2">Neo-Traditional Brasileiro</h4>
              <p class="text-gray-700">Fusão entre técnicas tradicionais e elementos da cultura brasileira contemporânea.</p>
            </div>
          </div>
          
          <div class="flex items-start gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div class="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span class="text-white font-bold text-sm">3</span>
            </div>
            <div>
              <h4 class="font-bold text-purple-800 mb-2">Tatuagens Interativas</h4>
              <p class="text-gray-700">Designs que mudam de perspectiva com o movimento do corpo, criando efeitos visuais dinâmicos.</p>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-red-600 to-red-800 text-white p-8 rounded-xl my-12">
          <h3 class="text-2xl font-black mb-4">💡 Dica de Ouro para Tatuadores</h3>
          <p class="text-red-100 text-lg leading-relaxed">Não tente seguir todas as tendências ao mesmo tempo. Escolha 2-3 estilos que mais ressoam com sua personalidade artística e domine-os completamente. A especialização é o que diferencia bons tatuadores de tatuadores extraordinários em 2024.</p>
        </div>

        <h2 class="text-red-600 font-black text-3xl mt-12 mb-8 border-b-4 border-red-200 pb-4">🎯 Conclusão: O Futuro é Agora</h2>
        
        <p class="mb-6 leading-relaxed text-gray-700 text-lg">As tendências de 2024 mostram que a tatuagem está se tornando cada vez mais uma forma de arte sofisticada e personalizada. Os clientes estão mais educados, exigentes e dispostos a investir em qualidade.</p>
        
        <p class="mb-8 leading-relaxed text-gray-700 text-lg">Para nós, tatuadores, isso significa uma oportunidade única de elevar nosso craft e construir carreiras verdadeiramente sustentáveis. O mercado está aquecido, as oportunidades são infinitas, e a única limitação é nossa própria criatividade.</p>
        
        <div class="bg-yellow-50 border-2 border-yellow-300 p-6 rounded-xl">
          <p class="text-yellow-800 font-semibold text-lg">👉 <strong>E você, qual tendência mais te chamou atenção?</strong> Conta pra gente nos comentários qual estilo você pretende explorar nos próximos meses!</p>
        </div>
      </div>
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
    tags: ["tendências", "2024", "estilos", "técnicas"],
    authorBio: "Tatuadora há 12 anos, especialista em Fine Line e fundadora do estúdio Ink Revolution. Palestrante em convenções internacionais.",
    authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b002?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    title: "Cuidados Pós-Tatuagem: Guia Completo para Cicatrização Perfeita",
    slug: "cuidados-pos-tatuagem-guia-completo",
    excerpt: "Um guia detalhado e científico sobre como cuidar adequadamente de uma tatuagem recém-feita para garantir a melhor cicatrização e preservar as cores.",
    content: `
      <div class="prose prose-lg max-w-none">
        <p class="text-xl text-gray-700 leading-relaxed mb-8 font-medium">Cuidar da sua tatuagem após a sessão é fundamental para garantir que ela cicatrize bem e mantenha a beleza por muitos anos. Este guia completo vai te ajudar a entender cada etapa do processo.</p>

        <h2 class="text-red-600 font-black text-3xl mt-12 mb-8 border-b-4 border-red-200 pb-4">🕒 Primeiras 24 Horas: O Que Fazer e Evitar</h2>
        
        <p class="mb-6 leading-relaxed text-gray-700 text-lg">As primeiras horas são decisivas para a cicatrização. Siga estas recomendações para evitar infecções e garantir a melhor recuperação:</p>
        
        <ul class="list-disc ml-6 space-y-3">
          <li class="leading-relaxed text-gray-700 text-lg">Mantenha a proteção aplicada pelo tatuador por 2 a 4 horas.</li>
          <li class="leading-relaxed text-gray-700 text-lg">Lave as mãos antes de tocar na tatuagem.</li>
          <li class="leading-relaxed text-gray-700 text-lg">Remova a proteção cuidadosamente.</li>
          <li class="leading-relaxed text-gray-700 text-lg">Lave a área com água morna e sabão neutro, sem esfregar.</li>
          <li class="leading-relaxed text-gray-700 text-lg">Seque com papel toalha, sem esfregar.</li>
        </ul>

        <h2 class="text-red-600 font-black text-3xl mt-12 mb-8 border-b-4 border-red-200 pb-4">🧴 Produtos Recomendados para Cicatrização</h2>
        
        <p class="mb-6 leading-relaxed text-gray-700 text-lg">A escolha dos produtos certos faz toda a diferença. Evite pomadas com fragrâncias ou ingredientes agressivos.</p>
        
        <h3 class="text-red-600 font-bold text-2xl mt-8 mb-4">Pomadas Cicatrizantes</h3>
        <p class="mb-6 leading-relaxed text-gray-700 text-lg">Use pomadas específicas para tatuagem ou hidratantes sem perfume. Aplique uma camada fina 2 a 3 vezes ao dia, conforme orientação do seu tatuador.</p>

        <h3 class="text-red-600 font-bold text-2xl mt-8 mb-4">Hidratantes e Protetores</h3>
        <p class="mb-6 leading-relaxed text-gray-700 text-lg">Após a cicatrização inicial, mantenha a pele hidratada e protegida do sol para preservar as cores e evitar desbotamento.</p>

        <blockquote class="border-l-4 border-red-600 pl-6 py-4 my-8 bg-red-50 rounded-r-lg italic text-lg text-gray-800">
          "A paciência e o cuidado são os melhores aliados para uma tatuagem perfeita. Nunca subestime a importância da cicatrização." 
          <cite class="block mt-2 text-red-600 font-semibold not-italic">- Dr. Ricardo Mendes, Dermatologista</cite>
        </blockquote>
      </div>
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
    tags: ["cuidados", "cicatrização", "pomadas", "saúde"],
    authorBio: "Dermatologista especializado em cuidados com tatuagens e saúde da pele. Autor de diversos artigos científicos.",
    authorImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 3,
    title: "Marketing Digital para Tatuadores: Construindo sua Marca Online",
    slug: "marketing-digital-tatuadores",
    excerpt: "Estratégias eficazes de marketing digital para tatuadores que querem expandir sua clientela, fortalecer sua marca pessoal e aumentar o faturamento do estúdio.",
    content: `
      <div class="prose prose-lg max-w-none">
        <p class="text-xl text-gray-700 leading-relaxed mb-8 font-medium">No mundo digital atual, ter uma presença online forte é essencial para qualquer tatuador que deseja crescer e se destacar. Este artigo traz dicas práticas para você construir sua marca e atrair mais clientes.</p>

        <h2 class="text-red-600 font-black text-3xl mt-12 mb-8 border-b-4 border-red-200 pb-4">📱 Presença nas Redes Sociais</h2>
        
        <p class="mb-6 leading-relaxed text-gray-700 text-lg">Instagram e TikTok são as plataformas mais relevantes para tatuadores. Use-as para mostrar seu portfólio, processos e depoimentos de clientes.</p>
        
        <ul class="list-disc ml-6 space-y-3">
          <li class="leading-relaxed text-gray-700 text-lg">Poste conteúdo consistente e de qualidade.</li>
          <li class="leading-relaxed text-gray-700 text-lg">Use hashtags relevantes e específicas para seu nicho.</li>
          <li class="leading-relaxed text-gray-700 text-lg">Interaja com seus seguidores e responda dúvidas.</li>
          <li class="leading-relaxed text-gray-700 text-lg">Compartilhe o processo de criação e bastidores.</li>
        </ul>

        <h2 class="text-red-600 font-black text-3xl mt-12 mb-8 border-b-4 border-red-200 pb-4">📸 Fotografia Profissional</h2>
        
        <p class="mb-6 leading-relaxed text-gray-700 text-lg">Fotos de alta qualidade são fundamentais para atrair clientes. Invista em iluminação, ângulos e edição para destacar seu trabalho.</p>

        <h2 class="text-red-600 font-black text-3xl mt-12 mb-8 border-b-4 border-red-200 pb-4">💡 Estratégias de Marketing</h2>
        
        <ul class="list-disc ml-6 space-y-3">
          <li class="leading-relaxed text-gray-700 text-lg">Crie um site profissional com portfólio e contato.</li>
          <li class="leading-relaxed text-gray-700 text-lg">Utilize anúncios pagos para alcançar novos públicos.</li>
          <li class="leading-relaxed text-gray-700 text-lg">Parcerias com influenciadores e eventos locais.</li>
          <li class="leading-relaxed text-gray-700 text-lg">Ofereça promoções e programas de fidelidade.</li>
        </ul>

        <blockquote class="border-l-4 border-red-600 pl-6 py-4 my-8 bg-red-50 rounded-r-lg italic text-lg text-gray-800">
          "Marketing não é só vender, é construir relacionamentos duradouros com seus clientes." 
          <cite class="block mt-2 text-red-600 font-semibold not-italic">- Ana Paula Costa, Especialista em Marketing Digital</cite>
        </blockquote>
      </div>
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
    tags: ["marketing", "redes sociais", "instagram", "negócios"],
    authorBio: "Consultora de marketing digital especializada em nichos criativos. Ajuda tatuadores a crescerem online.",
    authorImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face"
  }
];

// Mock data para anúncios estratégicos
const mockAds = {
  products: [
    {
      id: 1,
      name: "Máquina Rotativa Profissional X1 Pro",
      price: "R$ 899,99",
      originalPrice: "R$ 1.299,99",
      image: "https://images.unsplash.com/photo-1606830713264-f1b9f00a0e4d?w=400&h=300&fit=crop",
      description: "A máquina preferida dos profissionais. Motor silencioso, precisão extrema e durabilidade comprovada.",
      badge: "OFERTA LIMITADA",
      discount: "31% OFF"
    },
    {
      id: 2,
      name: "Kit Completo de Agulhas Premium",
      price: "R$ 299,99",
      originalPrice: "R$ 449,99",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
      description: "50 agulhas esterilizadas de diferentes calibres. Qualidade hospitalar garantida.",
      badge: "MAIS VENDIDO",
      discount: "33% OFF"
    }
  ],
  services: [
    {
      id: 1,
      title: "Consultoria de Marketing Digital para Estúdios",
      description: "Transforme seu estúdio em uma máquina de vendas. Estratégias personalizadas para tatuadores que querem crescer.",
      features: ["Estratégia para Instagram", "Gestão de Google Ads", "Site profissional", "Consultoria 1:1"],
      price: "A partir de R$ 497/mês",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
      badge: "RESULTADO GARANTIDO"
    },
    {
      id: 2,
      title: "Curso Master Class: Fine Line Profissional",
      description: "Domine as técnicas mais requisitadas do mercado com mentoria individual de experts.",
      features: ["8 horas de video-aulas", "Material exclusivo", "Suporte vitalício", "Certificado"],
      price: "12x de R$ 97,90",
      image: "https://images.unsplash.com/photo-1543767271-7c5f36dc5310?w=400&h=300&fit=crop",
      badge: "ÚLTIMAS VAGAS"
    }
  ],
  events: [
    {
      id: 1,
      title: "Workshop Intensivo: Realismo em Tatuagem",
      date: "15-17 de Março, 2024",
      location: "São Paulo - SP",
      description: "3 dias intensivos com os maiores mestres do realismo no Brasil. Vagas limitadas!",
      image: "https://images.unsplash.com/photo-1564131072-6c4d41e23ba6?w=400&h=300&fit=crop",
      price: "R$ 1.497,00",
      originalPrice: "R$ 1.997,00",
      badge: "EARLY BIRD",
      instructor: "Carlos Montenegro"
    },
    {
      id: 2,
      title: "Convenção 99Tattoo 2024",
      date: "22-24 de Junho, 2024",
      location: "Rio de Janeiro - RJ",
      description: "O maior evento de tatuagem do Brasil! Competições, workshops e networking.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      price: "R$ 299,00",
      originalPrice: "R$ 499,00",
      badge: "SUPER EARLY BIRD",
      instructor: "Vários especialistas"
    }
  ]
};

const TattooArtistsBlogArticle = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  // Buscar artigo por ID ou slug
  const article = mockBlogPosts.find(post => 
    post.id.toString() === articleId || post.slug === articleId
  );

  const relatedPosts = mockBlogPosts.filter(post => 
    post.id !== article?.id && post.category === article?.category
  ).slice(0, 3);

  React.useEffect(() => {
    if (article) {
      setLikes(article.likes);
    }
  }, [article]);

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
        <Badge variant="outline" className="border-green-500 text-green-600 font-bold">{product.discount}</Badge>
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
            <span className="text-lg text-gray-500 line-through">{product.originalPrice}</span>
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
            Saiba Mais
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
            <span className="text-lg text-gray-500 line-through">{event.originalPrice}</span>
          </div>
          <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-800 hover:from-orange-700 hover:to-orange-900 text-white font-bold shadow-lg hover:shadow-xl">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Inscreva-se Agora
          </Button>
        </div>
      </div>
    </div>
  );

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
                <span className="font-semibold">{article.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-6 w-6 mr-3" />
                <span>{new Date(article.publishDate).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-6 w-6 mr-3" />
                <span>{article.readTime} de leitura</span>
              </div>
              <div className="flex items-center">
                <Eye className="h-6 w-6 mr-3" />
                <span>{article.views.toLocaleString()} visualizações</span>
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
                src={article.cover_image}
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

                {/* Primeiro parágrafo do conteúdo */}
                <div dangerouslySetInnerHTML={{ __html: article.content.split('<h2')[0] }} />

                {/* ANÚNCIO ESTRATÉGICO 1 - Produto */}
                <ProductAd product={mockAds.products[0]} />

                {/* Segunda seção do conteúdo */}
                <div dangerouslySetInnerHTML={{ 
                  __html: '<h2' + article.content.split('<h2')[1]?.split('<h2')[0] || ''
                }} />

                {/* ANÚNCIO ESTRATÉGICO 2 - Serviço */}
                <ServiceAd service={mockAds.services[0]} />

                {/* Terceira seção do conteúdo */}
                <div dangerouslySetInnerHTML={{ 
                  __html: article.content.split('<h2')[2] ? '<h2' + article.content.split('<h2')[2]?.split('<h2')[0] : ''
                }} />

                {/* ANÚNCIO ESTRATÉGICO 3 - Evento */}
                <EventAd event={mockAds.events[0]} />

                {/* Resto do conteúdo */}
                <div dangerouslySetInnerHTML={{ 
                  __html: article.content.split('<h2').slice(3).map(section => '<h2' + section).join('')
                }} />

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
                        {article.comments} Comentários
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
                  src={article.authorImage}
                  alt={article.author}
                  className="w-20 h-20 rounded-full mx-auto mb-4 shadow-lg object-cover"
                />
                <h3 className="font-bold text-red-600 mb-3 text-xl">{article.author}</h3>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  {article.authorBio}
                </p>
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
                    <span className="font-black text-red-600 text-xl">{article.views.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-semibold">Curtidas</span>
                    <span className="font-black text-red-600 text-xl">{likes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-semibold">Comentários</span>
                    <span className="font-black text-red-600 text-xl">{article.comments}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-semibold">Tempo de leitura</span>
                    <span className="font-black text-red-600 text-xl">{article.readTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Product Ad */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-2xl rounded-2xl">
              <CardContent className="p-6">
                <Badge className="bg-green-600 text-white font-bold mb-4">OFERTA ESPECIAL</Badge>
                <img 
                  src={mockAds.products[1].image}
                  alt={mockAds.products[1].name}
                  className="w-full h-32 object-cover rounded-lg mb-4 shadow-lg"
                />
                <h4 className="font-bold text-green-800 mb-2">{mockAds.products[1].name}</h4>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-black text-green-600">{mockAds.products[1].price}</span>
                  <Badge variant="outline" className="border-green-500 text-green-600 text-xs">{mockAds.products[1].discount}</Badge>
                </div>
                <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold">
                  Ver Oferta
                </Button>
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
                            src={post.cover_image}
                            alt={post.title}
                            className="w-20 h-20 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-red-600 group-hover:text-red-700 transition-colors line-clamp-2 mb-2 leading-snug">
                              {post.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{post.readTime}</span>
                              <span>•</span>
                              <span>{post.views} views</span>
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
