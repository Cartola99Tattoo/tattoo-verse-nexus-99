
import { useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heart, ShoppingCart, Share2, ArrowLeft, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";

// Mock data - this would come from Supabase in a real implementation
const tattoosData = [
  {
    id: 1,
    name: "Dragão Oriental",
    artist: "Mariana Silva",
    category: "Colorido",
    images: [
      "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585862705417-671ae64f0eb7?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599456884999-d6524332276f?q=80&w=2070&auto=format&fit=crop"
    ],
    price: 750,
    rating: 4.9,
    description: "Um dragão no estilo oriental tradicional com cores vibrantes que representam força e sabedoria. Esta tatuagem é ideal para braços, costas ou peito, e pode ser dimensionada conforme necessário.",
    material: "Tintas veganas de alta qualidade",
    size: "Médio a Grande (20-35cm)",
    sessionTime: "5-7 horas",
    careInstructions: "Evite exposição ao sol e água por 2 semanas. Aplique o creme cicatrizante recomendado 3 vezes ao dia.",
    artistInfo: {
      name: "Mariana Silva",
      bio: "Especialista em estilos orientais e coloridos, com 7 anos de experiência em tatuagens de grande escala. Formada pela Escola de Artes Visuais de São Paulo.",
      image: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?q=80&w=1974&auto=format&fit=crop"
    },
    recommended: [2, 4, 5]
  },
  {
    id: 2,
    name: "Mandala Geométrica",
    artist: "Rafael Costa",
    category: "Blackwork",
    images: [
      "https://images.unsplash.com/photo-1562962230-16e4623d36e7?q=80&w=1974&auto=format&fit=crop"
    ],
    price: 550,
    rating: 4.8,
    description: "Mandala detalhada com padrões geométricos precisos em estilo blackwork. Ideal para antebraço, ombro ou perna.",
    material: "Tinta preta premium",
    size: "Médio (15-20cm)",
    sessionTime: "3-4 horas",
    careInstructions: "Evite exposição ao sol e água por 2 semanas. Aplique o creme cicatrizante recomendado 3 vezes ao dia.",
    artistInfo: {
      name: "Rafael Costa",
      bio: "Especialista em tatuagens geométricas e blackwork, com precisão milimétrica em seus desenhos. 5 anos de experiência e diversos prêmios em convenções.",
      image: "https://images.unsplash.com/photo-1607845378957-23c523aabec5?q=80&w=1974&auto=format&fit=crop"
    },
    recommended: [3, 6, 8]
  },
  {
    id: 3,
    name: "Leão Aquarela",
    artist: "Juliana Mendes",
    category: "Aquarela",
    images: [
      "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=1974&auto=format&fit=crop"
    ],
    price: 850,
    rating: 5.0,
    description: "Leão majestoso em estilo aquarela, representando força e coragem. Com pinceladas vibrantes e orgânicas.",
    material: "Tintas especiais para efeito aquarela",
    size: "Grande (25-30cm)",
    sessionTime: "4-6 horas",
    careInstructions: "Evite exposição ao sol e água por 2 semanas. Aplique o creme cicatrizante recomendado 3 vezes ao dia.",
    artistInfo: {
      name: "Juliana Mendes",
      bio: "Artista especializada na técnica de aquarela, transformando pele em verdadeiras obras de arte líquidas. Reconhecida internacionalmente.",
      image: "https://images.unsplash.com/photo-1581343109297-b0723670821a?q=80&w=1972&auto=format&fit=crop"
    },
    recommended: [4, 5, 7]
  },
  {
    id: 4,
    name: "Lobo Selvagem",
    artist: "Mariana Silva",
    category: "Realismo",
    images: [
      "https://images.unsplash.com/photo-1543767271-7c5f36dc5310?q=80&w=1974&auto=format&fit=crop"
    ],
    price: 900,
    rating: 4.9,
    description: "Lobo ultra-realista com detalhes impressionantes que capturam a essência selvagem do animal. Perfeito para amantes da natureza.",
    material: "Tintas especiais para realismo",
    size: "Grande (30-40cm)",
    sessionTime: "6-8 horas",
    careInstructions: "Evite exposição ao sol e água por 2 semanas. Aplique o creme cicatrizante recomendado 3 vezes ao dia.",
    artistInfo: {
      name: "Mariana Silva",
      bio: "Especialista em estilos orientais e coloridos, com 7 anos de experiência em tatuagens de grande escala. Formada pela Escola de Artes Visuais de São Paulo.",
      image: "https://images.unsplash.com/photo-1567894340315-735d7c361db0?q=80&w=1974&auto=format&fit=crop"
    },
    recommended: [1, 3, 7]
  }
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || "1");
  const product = tattoosData.find(item => item.id === productId);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
          <p className="mb-8">O produto que você está procurando não existe ou foi removido.</p>
          <Button asChild>
            <Link to="/shop">Voltar para a loja</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const recommendedProducts = product.recommended
    .map(id => tattoosData.find(item => item.id === id))
    .filter(Boolean);

  const handleAddToCart = () => {
    addToCart({
      id: product.id.toString(), // Convert number to string
      name: product.name,
      price: product.price,
      images: product.images,
      artist: product.artist, // This is now handled correctly with our updated CartItem type
      product_id: product.id.toString(), 
      quantity: 1,
      status: 'available',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, quantity);
    
    toast({
      title: "Adicionado ao carrinho",
      description: `${product.name} foi adicionado ao seu carrinho.`,
    });
  };

  const handleAddToFavorites = () => {
    toast({
      title: "Adicionado aos favoritos",
      description: `${product.name} foi adicionado aos seus favoritos.`,
    });
  };
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };
  
  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Link to="/shop" className="flex items-center text-gray-600 hover:text-red-500 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Voltar para a loja</span>
        </Link>
      </div>
      
      {/* Product Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Images */}
          <div className="lg:w-1/2">
            <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-lg mb-4">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button 
                    key={index} 
                    className={`h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                      selectedImage === index ? 'border-red-500' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} - imagem ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="lg:w-1/2">
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <span className="text-lg font-medium">{product.rating}</span>
                </div>
              </div>
              <p className="text-xl text-gray-600 mb-4">R$ {product.price.toLocaleString('pt-BR')}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {product.category}
                </span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  Por {product.artist}
                </span>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Descrição</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-700">Material</h3>
                <p>{product.material}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Tamanho</h3>
                <p>{product.size}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Tempo de Sessão</h3>
                <p>{product.sessionTime}</p>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-2">Instruções de Cuidado</h2>
              <p className="text-gray-700">{product.careInstructions}</p>
            </div>
            
            <div className="flex items-center mb-6">
              <span className="mr-4">Quantidade:</span>
              <div className="flex items-center border rounded">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 rounded-none"
                  onClick={() => handleQuantityChange(quantity - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 rounded-none"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleAddToCart}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Adicionar ao Carrinho
              </Button>
              <Button variant="outline" onClick={handleAddToFavorites}>
                <Heart className="mr-2 h-5 w-5" />
                Adicionar aos Favoritos
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Artist Information */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-4">Sobre o Artista</h2>
          <Separator className="mb-6" />
          
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="md:w-1/4">
              <img 
                src={product.artistInfo.image} 
                alt={product.artistInfo.name} 
                className="w-full aspect-square object-cover rounded-lg"
              />
            </div>
            <div className="md:w-3/4">
              <h3 className="text-xl font-bold mb-2">{product.artistInfo.name}</h3>
              <p className="text-gray-700">{product.artistInfo.bio}</p>
              
              <Button asChild variant="outline" className="mt-4">
                <Link to={`/artist/${product.artist.toLowerCase().replace(' ', '-')}`}>
                  Ver Perfil Completo
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Recommended Products */}
        {recommendedProducts && recommendedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-4">Você Também Pode Gostar</h2>
            <Separator className="mb-6" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedProducts.map(item => (
                <Link 
                  key={item?.id} 
                  to={`/shop/${item?.id}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="h-64 overflow-hidden">
                    <img
                      src={item?.images[0]}
                      alt={item?.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold">{item?.name}</h3>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <span className="text-sm font-medium">{item?.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Por {item?.artist}</p>
                    <p className="text-lg font-bold">R$ {item?.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
