// Serviço centralizado para dados mock do blog
export interface Author {
  name: string;
  bio: string;
  image: string;
  specialties: string[];
  experience: string;
}

export interface ArticleStats {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  readTime: string;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  description: string;
  badge?: string;
  discount?: string;
  category: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  features: string[];
  price: string;
  image: string;
  badge?: string;
  cta: string;
}

export interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  price: string;
  originalPrice?: string;
  badge?: string;
  instructor: string;
}

export interface BlogArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  status: 'published' | 'draft';
  author: Author;
  publishDate: string;
  stats: ArticleStats;
  featured: boolean;
  coverImage: string;
  inlineImages: string[];
  tags: string[];
  products: Product[];
  services: Service[];
  events: Event[];
}

// Interface para parâmetros do serviço de blog
export interface BlogServiceParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: 'latest' | 'popular' | 'oldest';
}

// Autores mock
const mockAuthors: Author[] = [
  {
    name: "Carolina Silva",
    bio: "Tatuadora há 12 anos, especialista em Fine Line e fundadora do estúdio Ink Revolution. Palestrante em convenções internacionais.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b002?w=150&h=150&fit=crop&crop=face",
    specialties: ["Fine Line", "Minimalismo", "Lettering"],
    experience: "12 anos"
  },
  {
    name: "Dr. Ricardo Mendes",
    bio: "Dermatologista especializado em cuidados com tatuagens e saúde da pele. Autor de diversos artigos científicos sobre cicatrização.",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face",
    specialties: ["Dermatologia", "Cicatrização", "Cuidados"],
    experience: "15 anos"
  },
  {
    name: "Ana Paula Costa",
    bio: "Consultora de marketing digital especializada em nichos criativos. Ajuda tatuadores a crescerem online há 8 anos.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    specialties: ["Marketing Digital", "Redes Sociais", "Branding"],
    experience: "8 anos"
  },
  {
    name: "Marcos Oliveira",
    bio: "Mestre em Blackwork e Realismo. Referência nacional em técnicas de sombreamento. Instrutor em workshops pelo Brasil.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    specialties: ["Blackwork", "Realismo", "Sombreamento"],
    experience: "18 anos"
  },
  {
    name: "Prof. Helena Ribeiro",
    bio: "Historiadora especializada em arte corporal e simbolismo. Autora do livro 'Tatuagem: Arte Milenar'.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    specialties: ["História", "Simbolismo", "Antropologia"],
    experience: "20 anos"
  }
];

// Produtos mock expandidos
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Máquina Rotativa Bishop V6",
    price: "R$ 2.899,99",
    originalPrice: "R$ 3.499,99",
    image: "https://placehold.co/400x300/FF0000/FFFFFF?text=Máquina+Bishop+V6",
    description: "A máquina mais avançada do mercado. Motor japonês silencioso, precisão extrema e durabilidade comprovada por profissionais do mundo todo.",
    badge: "LANÇAMENTO",
    discount: "17% OFF",
    category: "máquinas"
  },
  {
    id: 2,
    name: "Kit Agulhas Cheyenne Premium",
    price: "R$ 449,99",
    originalPrice: "R$ 649,99",
    image: "https://placehold.co/400x300/000000/FFFFFF?text=Kit+Agulhas+Cheyenne",
    description: "Kit completo com 25 agulhas Cheyenne de diferentes calibres. Qualidade hospitalar, esterilizadas individualmente.",
    badge: "MAIS VENDIDO",
    discount: "31% OFF",
    category: "agulhas"
  },
  {
    id: 3,
    name: "Tintas Eternal Ink Set Completo",
    price: "R$ 1.299,99",
    image: "https://placehold.co/400x300/8B0000/FFFFFF?text=Tintas+Eternal",
    description: "Set completo com 30 cores das famosas tintas Eternal Ink. Pigmentação vegana, aprovada pela FDA e ANVISA.",
    badge: "PROFISSIONAL",
    category: "tintas"
  },
  {
    id: 4,
    name: "Mesa Cirúrgica Ajustável Pro",
    price: "R$ 3.999,99",
    originalPrice: "R$ 4.899,99",
    image: "https://placehold.co/400x300/2F4F4F/FFFFFF?text=Mesa+Cirúrgica",
    description: "Mesa cirúrgica com 8 posições de ajuste, estofado em couro sintético e estrutura em aço inox.",
    badge: "PREMIUM",
    discount: "18% OFF",
    category: "móveis"
  },
  {
    id: 5,
    name: "Fonte Digital Power Supply X1",
    price: "R$ 899,99",
    image: "https://placehold.co/400x300/4169E1/FFFFFF?text=Fonte+Digital",
    description: "Fonte digital com display LED, controle preciso de voltagem e proteção contra sobrecarga.",
    category: "fontes"
  }
];

// Serviços mock expandidos
const mockServices: Service[] = [
  {
    id: 1,
    title: "Mentoria Completa para Iniciantes",
    description: "Programa de 3 meses com acompanhamento individual para quem está começando na tatuagem.",
    features: ["12 sessões 1:1", "Material didático exclusivo", "Acesso vitalício ao grupo", "Certificado"],
    price: "3x de R$ 497,00",
    image: "https://placehold.co/400x300/228B22/FFFFFF?text=Mentoria+Iniciantes",
    badge: "RESULTADO GARANTIDO",
    cta: "Quero Começar Agora"
  },
  {
    id: 2,
    title: "Consultoria de Marketing Digital",
    description: "Estratégia completa para crescer seu estúdio online e atrair clientes de alto valor.",
    features: ["Auditoria completa", "Estratégia personalizada", "Templates prontos", "3 meses de suporte"],
    price: "R$ 1.997,00",
    image: "https://placehold.co/400x300/FF6347/FFFFFF?text=Marketing+Digital",
    badge: "MAIS PROCURADO",
    cta: "Quero Crescer Online"
  },
  {
    id: 3,
    title: "Gestão Financeira para Estúdios",
    description: "Sistema completo para organizar as finanças do seu estúdio e aumentar a lucratividade.",
    features: ["Planilhas personalizadas", "Treinamento completo", "Suporte por 6 meses", "Grupo exclusivo"],
    price: "R$ 797,00",
    image: "https://placehold.co/400x300/DAA520/FFFFFF?text=Gestão+Financeira",
    cta: "Organizar Finanças"
  }
];

// Eventos mock expandidos
const mockEvents: Event[] = [
  {
    id: 1,
    title: "Workshop Intensivo: Realismo Extremo",
    date: "15-17 de Março, 2024",
    location: "São Paulo - SP",
    description: "3 dias intensivos com os maiores mestres do realismo no Brasil. Aprenda técnicas secretas que levaram anos para dominar.",
    image: "https://placehold.co/400x300/8B008B/FFFFFF?text=Workshop+Realismo",
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
    description: "O maior evento de tatuagem do Brasil! 3 dias de competições, workshops e networking com os melhores profissionais.",
    image: "https://placehold.co/400x300/DC143C/FFFFFF?text=Convenção+2024",
    price: "R$ 299,00",
    originalPrice: "R$ 499,00",
    badge: "SUPER EARLY BIRD",
    instructor: "Vários especialistas"
  },
  {
    id: 3,
    title: "Curso Online: Fine Line Mastery",
    date: "Turma de Abril 2024",
    location: "Online - Ao Vivo",
    description: "Curso completo de Fine Line com certificação internacional. 40 horas de conteúdo prático.",
    image: "https://placehold.co/400x300/00CED1/FFFFFF?text=Fine+Line+Course",
    price: "6x de R$ 197,00",
    badge: "CERTIFICAÇÃO INTERNACIONAL",
    instructor: "Marina Santos"
  }
];

// Artigos mock expandidos (15+ artigos)
export const mockBlogArticles: BlogArticle[] = [
  {
    id: 1,
    title: "Tendências de Tatuagem 2024: O Que Está Dominando o Mercado",
    slug: "tendencias-tatuagem-2024",
    excerpt: "Explore as principais tendências que estão moldando o mundo da tatuagem neste ano, desde o minimalismo até técnicas inovadoras que revolucionam a arte corporal.",
    content: `
      <div class="article-content">
        <p class="text-xl text-gray-700 leading-relaxed mb-8 font-medium">O mundo da tatuagem nunca parou de evoluir, e 2024 está sendo um ano revolucionário para nossa arte. Depois de anos observando o mercado e conversando com os principais tatuadores do Brasil e do mundo, compilamos as tendências mais marcantes que estão definindo este ano.</p>

        <p class="mb-6 leading-relaxed text-gray-700 text-lg">A indústria da tatuagem movimentou mais de R$ 2 bilhões no Brasil em 2023, e as projeções para 2024 são ainda mais otimistas. O que temos visto é uma sofisticação sem precedentes tanto nas técnicas quanto na demanda dos clientes.</p>

        <img src="https://placehold.co/800x400/FF0000/FFFFFF?text=Tendências+2024" alt="Tendências de Tatuagem 2024" class="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg mb-8" />

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

        <img src="https://placehold.co/600x400/000000/FFFFFF?text=Fine+Line+Examples" alt="Exemplos de Fine Line" class="w-full h-64 object-cover rounded-xl shadow-lg mb-8" />

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

        <img src="https://placehold.co/700x500/FF69B4/FFFFFF?text=Aquarela+Técnicas" alt="Técnicas de Aquarela" class="w-full h-64 object-cover rounded-xl shadow-lg mb-8" />

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

        <img src="https://placehold.co/800x300/4169E1/FFFFFF?text=Dados+Estatísticas" alt="Estatísticas do Mercado" class="w-full h-48 object-cover rounded-xl shadow-lg mb-8" />

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
    author: mockAuthors[0],
    publishDate: "2024-01-15",
    stats: {
      views: 2450,
      likes: 189,
      comments: 34,
      shares: 67,
      readTime: "8 min"
    },
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=800&auto=format&fit=crop&q=60",
    inlineImages: [
      "https://placehold.co/800x400/FF0000/FFFFFF?text=Tendências+2024",
      "https://placehold.co/600x400/000000/FFFFFF?text=Fine+Line+Examples",
      "https://placehold.co/700x500/FF69B4/FFFFFF?text=Aquarela+Técnicas",
      "https://placehold.co/800x300/4169E1/FFFFFF?text=Dados+Estatísticas"
    ],
    tags: ["tendências", "2024", "estilos", "técnicas"],
    products: [mockProducts[0], mockProducts[1]],
    services: [mockServices[0]],
    events: [mockEvents[0]]
  },
  {
    id: 2,
    title: "Cuidados Essenciais com Tatuagem Recém-Feita: Guia Completo",
    slug: "cuidados-tatuagem-recem-feita-guia-completo",
    excerpt: "Descubra todos os cuidados necessários para garantir uma cicatrização perfeita da sua nova tatuagem, desde os primeiros minutos até a cicatrização completa.",
    content: `
      <div class="article-content">
        <p class="text-xl text-gray-700 leading-relaxed mb-8 font-medium">Uma tatuagem bem cuidada é uma tatuagem que durará toda a vida com as cores vibrantes e traços definidos. Aqui está tudo que você precisa saber sobre cuidados pós-tatuagem.</p>
        
        <h2 class="text-red-600 font-black text-3xl mt-12 mb-8">Primeiras 24 Horas: Críticas para o Sucesso</h2>
        <p class="mb-6 leading-relaxed text-gray-700 text-lg">As primeiras horas após fazer a tatuagem são fundamentais para uma boa cicatrização. Neste período, sua pele está mais vulnerável e precisa de cuidados específicos.</p>
        
        <ul class="list-disc ml-6 space-y-3 mb-8">
          <li>Mantenha o filme plástico por 2-4 horas</li>
          <li>Lave com sabão neutro e água morna</li>
          <li>Seque com papel toalha limpo</li>
          <li>Aplique pomada cicatrizante em camada fina</li>
        </ul>
      </div>
    `,
    category: "Cuidados",
    status: "published",
    author: mockAuthors[1],
    publishDate: "2024-01-10",
    stats: {
      views: 1890,
      likes: 156,
      comments: 28,
      shares: 45,
      readTime: "6 min"
    },
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&auto=format&fit=crop&q=60",
    inlineImages: [],
    tags: ["cuidados", "cicatrização", "saúde", "dicas"],
    products: [mockProducts[2]],
    services: [],
    events: []
  },
  {
    id: 3,
    title: "Marketing Digital para Tatuadores: Como Atrair Mais Clientes",
    slug: "marketing-digital-tatuadores-atrair-clientes",
    excerpt: "Estratégias comprovadas de marketing digital específicas para tatuadores que querem expandir sua clientela e construir uma marca forte no mercado.",
    content: `
      <div class="article-content">
        <p class="text-xl text-gray-700 leading-relaxed mb-8 font-medium">No mundo digital de hoje, ter talento não é suficiente. É preciso saber como mostrar seu trabalho para as pessoas certas. Vou compartilhar as estratégias que funcionam de verdade.</p>
        
        <h2 class="text-red-600 font-black text-3xl mt-12 mb-8">Instagram: Sua Vitrine Principal</h2>
        <p class="mb-6 leading-relaxed text-gray-700 text-lg">O Instagram continua sendo a plataforma mais importante para tatuadores. Mas não basta apenas postar fotos - é preciso ter estratégia.</p>
      </div>
    `,
    category: "Marketing",
    status: "published",
    author: mockAuthors[2],
    publishDate: "2024-01-08",
    stats: {
      views: 2100,
      likes: 187,
      comments: 42,
      shares: 89,
      readTime: "7 min"
    },
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&auto=format&fit=crop&q=60",
    inlineImages: [],
    tags: ["marketing", "redes sociais", "negócios", "estratégia"],
    products: [],
    services: [mockServices[1]],
    events: []
  },
  {
    id: 4,
    title: "Técnicas de Sombreamento: Dominando o Realismo",
    slug: "tecnicas-sombreamento-dominando-realismo",
    excerpt: "Aprenda as técnicas avançadas de sombreamento que separam tatuadores iniciantes dos mestres, com foco em realismo e profundidade.",
    content: `
      <div class="article-content">
        <p class="text-xl text-gray-700 leading-relaxed mb-8 font-medium">O sombreamento é a alma do realismo em tatuagem. É o que transforma um desenho plano em uma obra tridimensional que ganha vida na pele.</p>
      </div>
    `,
    category: "Técnicas",
    status: "published",
    author: mockAuthors[3],
    publishDate: "2024-01-05",
    stats: {
      views: 1650,
      likes: 142,
      comments: 31,
      shares: 38,
      readTime: "9 min"
    },
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=800&auto=format&fit=crop&q=60",
    inlineImages: [],
    tags: ["técnicas", "realismo", "sombreamento", "avançado"],
    products: [mockProducts[0]],
    services: [],
    events: [mockEvents[0]]
  },
  {
    id: 5,
    title: "História da Tatuagem: Das Origens aos Dias Atuais",
    slug: "historia-tatuagem-origens-dias-atuais",
    excerpt: "Uma jornada fascinante pela história milenar da tatuagem, desde as primeiras civilizações até as tendências contemporâneas.",
    content: `
      <div class="article-content">
        <p class="text-xl text-gray-700 leading-relaxed mb-8 font-medium">A tatuagem é uma das formas de arte mais antigas da humanidade, com evidências que remontam a mais de 5.000 anos. Vamos explorar essa rica história.</p>
      </div>
    `,
    category: "História",
    status: "published",
    author: mockAuthors[4],
    publishDate: "2024-01-03",
    stats: {
      views: 1420,
      likes: 98,
      comments: 22,
      shares: 31,
      readTime: "12 min"
    },
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=60",
    inlineImages: [],
    tags: ["história", "cultura", "antropologia", "tradições"],
    products: [],
    services: [],
    events: []
  }
];

// Mock blog service implementation
export const mockBlogService = {
  fetchBlogPosts: async (params: BlogServiceParams = {}) => {
    const { page = 1, limit = 10, category, search, sort = 'latest' } = params;
    
    let filteredArticles = [...mockBlogArticles];
    
    // Filter by category
    if (category && category !== 'Todos') {
      filteredArticles = filteredArticles.filter(article => article.category === category);
    }
    
    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filteredArticles = filteredArticles.filter(article => 
        article.title.toLowerCase().includes(searchLower) ||
        article.excerpt.toLowerCase().includes(searchLower) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Sort articles
    if (sort === 'popular') {
      filteredArticles.sort((a, b) => b.stats.views - a.stats.views);
    } else if (sort === 'oldest') {
      filteredArticles.sort((a, b) => new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime());
    } else {
      filteredArticles.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
    
    return {
      posts: paginatedArticles.map(article => ({
        id: article.id.toString(),
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        cover_image: article.coverImage,
        category: article.category,
        author: article.author.name,
        published_at: article.publishDate,
        created_at: article.publishDate,
        updated_at: article.publishDate,
        status: article.status,
        tags: article.tags,
        views: article.stats.views,
        likes: article.stats.likes,
        comments_count: article.stats.comments
      })),
      totalPosts: filteredArticles.length,
      totalPages: Math.ceil(filteredArticles.length / limit),
      currentPage: page
    };
  },

  fetchBlogCategories: async () => {
    const categories = Array.from(new Set(mockBlogArticles.map(article => article.category)));
    return categories.map(category => ({
      id: category.toLowerCase().replace(/\s+/g, '-'),
      name: category,
      description: `Artigos sobre ${category}`,
      created_at: new Date().toISOString()
    }));
  },

  fetchBlogPost: async (idOrSlug: string) => {
    const article = mockBlogArticles.find(article => 
      article.id.toString() === idOrSlug || article.slug === idOrSlug
    );
    
    if (!article) return null;
    
    return {
      id: article.id.toString(),
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt,
      cover_image: article.coverImage,
      category: article.category,
      author: article.author.name,
      published_at: article.publishDate,
      created_at: article.publishDate,
      updated_at: article.publishDate,
      status: article.status,
      tags: article.tags,
      views: article.stats.views,
      likes: article.stats.likes,
      comments_count: article.stats.comments,
      meta_title: article.title,
      meta_description: article.excerpt,
      meta_keywords: article.tags.join(', ')
    };
  },

  fetchRelatedPosts: async (postId: string, limit = 3) => {
    const currentArticle = mockBlogArticles.find(article => article.id.toString() === postId);
    if (!currentArticle) return [];
    
    const relatedArticles = mockBlogArticles
      .filter(article => 
        article.id.toString() !== postId && 
        article.category === currentArticle.category
      )
      .slice(0, limit);
    
    return relatedArticles.map(article => ({
      id: article.id.toString(),
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      cover_image: article.coverImage,
      category: article.category,
      author: article.author.name,
      published_at: article.publishDate,
      created_at: article.publishDate,
      updated_at: article.publishDate,
      status: article.status,
      tags: article.tags,
      views: article.stats.views,
      likes: article.stats.likes,
      comments_count: article.stats.comments
    }));
  },

  fetchTagsList: async () => {
    const allTags = mockBlogArticles.flatMap(article => article.tags);
    return Array.from(new Set(allTags));
  },

  searchBlogPosts: async (query: string) => {
    const searchLower = query.toLowerCase();
    const filteredArticles = mockBlogArticles.filter(article => 
      article.title.toLowerCase().includes(searchLower) ||
      article.excerpt.toLowerCase().includes(searchLower) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
    
    return filteredArticles.map(article => ({
      id: article.id.toString(),
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      cover_image: article.coverImage,
      category: article.category,
      author: article.author.name,
      published_at: article.publishDate,
      created_at: article.publishDate,
      updated_at: article.publishDate,
      status: article.status,
      tags: article.tags,
      views: article.stats.views,
      likes: article.stats.likes,
      comments_count: article.stats.comments
    }));
  }
};

// Function exports for compatibility
export const getArticleBySlug = (slug: string): BlogArticle | undefined => {
  return mockBlogArticles.find(article => article.slug === slug);
};

export const getRelatedArticles = (currentArticle: BlogArticle, limit: number = 3): BlogArticle[] => {
  return mockBlogArticles
    .filter(article => 
      article.id !== currentArticle.id && 
      article.category === currentArticle.category
    )
    .slice(0, limit);
};

export const getAllArticles = (): BlogArticle[] => {
  return mockBlogArticles;
};

export const getArticlesByCategory = (category: string): BlogArticle[] => {
  if (category === "Todos") return mockBlogArticles;
  return mockBlogArticles.filter(article => article.category === category);
};
