
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Star, ChevronLeft, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import RelatedProducts from "@/components/shop/RelatedProducts";
import ProductGallery from "@/components/shop/ProductGallery";
import ArtistInfo from "@/components/shop/ArtistInfo";
import ProductReviews from "@/components/shop/ProductReviews";

// Dados simulados - em produção, isso viria de uma API
const getProductById = (id: number) => {
  const products = [
    {
      id: 1,
      name: "Dragão Oriental",
      artist: "Mariana Silva",
      artistId: 1,
      artistBio: "Especialista em tatuagens orientais com mais de 10 anos de experiência. Formada em artes visuais, Mariana traz um olhar único para cada design que cria.",
      artistAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
      category: "Colorido",
      style: "Oriental",
      images: [
        "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1531894611845-0902c7d1e2fa?q=80&w=1974&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1607761395354-30ae883a01b8?q=80&w=1974&auto=format&fit=crop"
      ],
      price: 750,
      rating: 4.9,
      reviewCount: 28,
      description: "Esta impressionante peça de dragão oriental apresenta cores vibrantes e detalhes meticulosos. Inspirada na mitologia asiática, esta tatuagem simboliza força, sabedoria e boa sorte. Ideal para costas ou braço inteiro, o design é totalmente personalizável em termos de cor e elementos adicionais.",
      size: "Grande (25-30cm)",
      bodyLocation: "Costas, Braço inteiro",
      time: "6-8 horas (pode requerer múltiplas sessões)",
      createdAt: "2024-03-15"
    },
    {
      id: 2,
      name: "Mandala Geométrica",
      artist: "Rafael Costa",
      artistId: 2,
      artistBio: "Especialista em desenhos geométricos e blackwork, com formação em design gráfico e arquitetura. Rafael cria padrões precisos e simétricos.",
      artistAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop",
      category: "Blackwork",
      style: "Geométrico",
      images: [
        "https://images.unsplash.com/photo-1562962230-16e4623d36e7?q=80&w=1974&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1583337954725-403805f66bf2?q=80&w=1964&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1609554507736-eb1641beb6c9?q=80&w=1974&auto=format&fit=crop"
      ],
      price: 550,
      rating: 4.8,
      reviewCount: 36,
      description: "Uma mandala geométrica intrincada com padrões simétricos perfeitos. Esta peça combina elementos tradicionais de mandala com formas geométricas modernas, criando um visual único e contemporâneo. Ideal para aqueles que apreciam precisão e equilíbrio em seus designs.",
      size: "Médio (15-20cm)",
      bodyLocation: "Peito, Costas, Antebraço",
      time: "4-5 horas",
      createdAt: "2024-02-22"
    },
    {
      id: 3,
      name: "Leão Aquarela",
      artist: "Juliana Mendes",
      artistId: 3,
      artistBio: "Pioneira no estilo aquarela no Brasil, Juliana é conhecida por suas composições coloridas e fluidas que parecem pinturas em movimento na pele.",
      artistAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
      category: "Aquarela",
      style: "Aquarela",
      images: [
        "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=1974&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1630402532640-af34c524143a?q=80&w=1976&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1630402539621-8f9197347ca2?q=80&w=2070&auto=format&fit=crop"
      ],
      price: 850,
      rating: 5.0,
      reviewCount: 42,
      description: "Esta majestosa tatuagem de leão em estilo aquarela combina a força e dignidade do rei da selva com a fluidez e vibração de cores do estilo aquarela. As cores se misturam organicamente, criando um efeito dramático e artístico que parece transcender os limites tradicionais da tatuagem.",
      size: "Grande (20-25cm)",
      bodyLocation: "Ombro, Coxa, Costas",
      time: "5-7 horas",
      createdAt: "2024-04-05"
    },
    {
      id: 4,
      name: "Lobo Selvagem",
      artist: "Mariana Silva",
      artistId: 1,
      artistBio: "Especialista em tatuagens orientais com mais de 10 anos de experiência. Formada em artes visuais, Mariana traz um olhar único para cada design que cria.",
      artistAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
      category: "Realismo",
      style: "Realismo",
      images: [
        "https://images.unsplash.com/photo-1543767271-7c5f36dc5310?q=80&w=1974&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1559087114-e33abd3aa229?q=80&w=1974&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1589729142340-d7bf1b25c744?q=80&w=1997&auto=format&fit=crop"
      ],
      price: 900,
      rating: 4.9,
      reviewCount: 31,
      description: "Um lobo selvagem retratado com detalhes incrivelmente realistas. Esta tatuagem captura perfeitamente a essência selvagem e o espírito livre do lobo, com textura de pelos, expressão intensa e olhos penetrantes. Um tributo à natureza selvagem e à independência.",
      size: "Grande (20-30cm)",
      bodyLocation: "Costas, Peito, Braço inteiro",
      time: "8-10 horas (múltiplas sessões)",
      createdAt: "2024-01-18"
    },
  ];
  
  return products.find(product => product.id === id);
};

const ProductDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  
  useEffect(() => {
    // Em um cenário real, aqui seria feita uma chamada à API
    if (id) {
      const productData = getProductById(Number(id));
      setProduct(productData);
      setLoading(false);
    }
  }, [id]);
  
  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        artist: product.artist,
        category: product.category,
      }, quantity);
      toast({
        title: "Adicionado ao carrinho",
        description: `${product.name} foi adicionado ao seu carrinho.`,
      });
    }
  };
  
  const increaseQuantity = () => setQuantity(q => q + 1);
  const decreaseQuantity = () => setQuantity(q => (q > 1 ? q - 1 : 1));
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-16 h-16 border-t-2 border-red-500 border-solid rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Carregando detalhes da tatuagem...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center h-64">
            <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
            <p className="text-gray-600 mb-6">O produto que você está procurando não está disponível.</p>
            <Button asChild className="bg-red-500 hover:bg-red-600">
              <Link to="/shop">Voltar para a loja</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Helmet>
        <title>{product.name} - 99Tattoo</title>
        <meta name="description" content={`${product.name} - ${product.description.substring(0, 160)}...`} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6 text-sm">
          <Link to="/shop" className="text-gray-500 hover:text-red-500 flex items-center">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Voltar para a loja
          </Link>
        </div>
        
        {/* Product Details */}
        <div className="flex flex-col lg:flex-row gap-10 mb-16">
          {/* Product Gallery */}
          <div className="lg:w-1/2">
            <ProductGallery images={product.images} name={product.name} />
          </div>
          
          {/* Product Info */}
          <div className="lg:w-1/2">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-3">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) 
                        ? "text-yellow-500 fill-yellow-500" 
                        : "text-gray-300"
                    }`} 
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating} ({product.reviewCount} avaliações)
                </span>
              </div>
            </div>
            
            <p className="text-3xl font-bold text-red-600 mb-6">
              R$ {product.price.toFixed(2)}
            </p>
            
            <div className="mb-6">
              <p className="text-gray-500 mb-2">Artista:</p>
              <Link to={`/artists/${product.artistId}`} className="flex items-center hover:text-red-500 transition-colors">
                <img 
                  src={product.artistAvatar} 
                  alt={product.artist} 
                  className="w-10 h-10 rounded-full object-cover mr-2"
                />
                <span className="font-medium">{product.artist}</span>
              </Link>
            </div>
            
            <div className="mb-8">
              <p className="text-gray-500 mb-2">Estilo: <span className="text-gray-800">{product.style}</span></p>
              <p className="text-gray-500 mb-2">Tamanho: <span className="text-gray-800">{product.size}</span></p>
              <p className="text-gray-500 mb-2">Local recomendado: <span className="text-gray-800">{product.bodyLocation}</span></p>
              <p className="text-gray-500 mb-2">Tempo estimado: <span className="text-gray-800">{product.time}</span></p>
            </div>
            
            <div className="flex items-center mb-8">
              <p className="mr-4 text-gray-600">Quantidade:</p>
              <div className="flex items-center border rounded-md">
                <button 
                  onClick={decreaseQuantity}
                  className="px-3 py-1 border-r hover:bg-gray-100"
                  aria-label="Diminuir quantidade"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-1 text-center w-12">{quantity}</span>
                <button 
                  onClick={increaseQuantity}
                  className="px-3 py-1 border-l hover:bg-gray-100"
                  aria-label="Aumentar quantidade"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Adicionar ao carrinho
              </Button>
              <Button
                asChild
                className="bg-black hover:bg-gray-800"
              >
                <Link to="/checkout">Comprar agora</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mb-16">
          <div className="border-b mb-6">
            <div className="flex gap-8">
              <button
                className={`pb-4 px-2 text-lg font-medium relative ${
                  activeTab === 'description' 
                    ? 'text-red-600 border-b-2 border-red-600' 
                    : 'text-gray-500 hover:text-red-600'
                }`}
                onClick={() => setActiveTab('description')}
              >
                Descrição
              </button>
              <button
                className={`pb-4 px-2 text-lg font-medium relative ${
                  activeTab === 'artist' 
                    ? 'text-red-600 border-b-2 border-red-600' 
                    : 'text-gray-500 hover:text-red-600'
                }`}
                onClick={() => setActiveTab('artist')}
              >
                Sobre o Artista
              </button>
              <button
                className={`pb-4 px-2 text-lg font-medium relative ${
                  activeTab === 'reviews' 
                    ? 'text-red-600 border-b-2 border-red-600' 
                    : 'text-gray-500 hover:text-red-600'
                }`}
                onClick={() => setActiveTab('reviews')}
              >
                Avaliações ({product.reviewCount})
              </button>
            </div>
          </div>
          
          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{product.description}</p>
              </div>
            )}
            
            {activeTab === 'artist' && (
              <ArtistInfo 
                name={product.artist}
                avatar={product.artistAvatar}
                bio={product.artistBio}
                id={product.artistId}
              />
            )}
            
            {activeTab === 'reviews' && (
              <ProductReviews productId={product.id} rating={product.rating} reviewCount={product.reviewCount} />
            )}
          </div>
        </div>
        
        {/* Related Products */}
        <RelatedProducts currentProductId={product.id} category={product.category} />
      </div>
    </Layout>
  );
};

export default ProductDetail;
