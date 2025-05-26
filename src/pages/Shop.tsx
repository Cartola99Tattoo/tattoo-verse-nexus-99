
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import TattooCard from "@/components/shop/TattooCard";
import CategoryFilter from "@/components/shop/CategoryFilter";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const tattoosData = [
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
    id: 2,
    name: "Mandala Geométrica",
    artist: "Rafael Costa",
    category: "Blackwork",
    image: "https://images.unsplash.com/photo-1562962230-16e4623d36e7?q=80&w=1974&auto=format&fit=crop",
    price: 550,
    rating: 4.8,
  },
  {
    id: 3,
    name: "Leão Aquarela",
    artist: "Juliana Mendes",
    category: "Aquarela",
    image: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=1974&auto=format&fit=crop",
    price: 850,
    rating: 5.0,
  },
  {
    id: 4,
    name: "Lobo Selvagem",
    artist: "Mariana Silva",
    category: "Realismo",
    image: "https://images.unsplash.com/photo-1543767271-7c5f36dc5310?q=80&w=1974&auto=format&fit=crop",
    price: 900,
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
    id: 6,
    name: "Crânio Estilizado",
    artist: "Rafael Costa",
    category: "Blackwork",
    image: "https://images.unsplash.com/photo-1507101489873-a4bc1e72c4cc?q=80&w=1973&auto=format&fit=crop",
    price: 650,
    rating: 4.8,
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
  {
    id: 8,
    name: "Árvore da Vida",
    artist: "Rafael Costa",
    category: "Blackwork",
    image: "https://images.unsplash.com/photo-1577493340887-b7bfff550145?q=80&w=2070&auto=format&fit=crop",
    price: 700,
    rating: 4.7,
  },
];

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("popularity");
  
  const categories = ["Todos", "Realismo", "Blackwork", "Aquarela", "Colorido"];
  
  const filteredTattoos = tattoosData
    .filter(tattoo => 
      (activeCategory === "Todos" || tattoo.category === activeCategory) &&
      (searchQuery === "" || 
        tattoo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tattoo.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tattoo.category.toLowerCase().includes(searchQuery.toLowerCase())
      ) &&
      tattoo.price >= priceRange[0] && tattoo.price <= priceRange[1]
    )
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      // Default: popularity (arbitrary for this example)
      return 0;
    });

  return (
    <Layout>
      {/* Shop header with enhanced gradient */}
      <div className="hero-gradient text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 hero-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-transparent to-red-600/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl font-bold mb-6 text-gradient-red">Catálogo de Tatuagens</h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed">
            Escolha entre nossa seleção de tatuagens exclusivas, criadas por artistas talentosos.
          </p>
          <div className="mt-8">
            <div className="section-divider max-w-md mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Shop content with enhanced styling */}
      <div className="container mx-auto px-4 py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Enhanced Filters sidebar */}
          <div className="md:w-1/4">
            <div className="card-enhanced p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-gray-200 text-gradient-dark">Filtros</h2>
              
              {/* Enhanced Search */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3">Buscar</h3>
                <Input 
                  type="search"
                  placeholder="Busque por nome, artista..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input-enhanced"
                />
              </div>
              
              {/* Enhanced Categories */}
              <div className="mb-6">
                <CategoryFilter 
                  categories={categories}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
              </div>
              
              {/* Enhanced Price range */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3">Faixa de Preço</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={[0, 1000]}
                    min={0}
                    max={1000}
                    step={50}
                    onValueChange={setPriceRange}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-sm text-gray-600 font-medium">
                    <span>R$ {priceRange[0]}</span>
                    <span>R$ {priceRange[1]}</span>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Artist filter */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3">Artistas</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input id="artist-mariana" type="checkbox" className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded" />
                    <label htmlFor="artist-mariana" className="ml-3 text-gray-700 hover:text-red-600 transition-colors cursor-pointer">Mariana Silva</label>
                  </div>
                  <div className="flex items-center">
                    <input id="artist-rafael" type="checkbox" className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded" />
                    <label htmlFor="artist-rafael" className="ml-3 text-gray-700 hover:text-red-600 transition-colors cursor-pointer">Rafael Costa</label>
                  </div>
                  <div className="flex items-center">
                    <input id="artist-juliana" type="checkbox" className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded" />
                    <label htmlFor="artist-juliana" className="ml-3 text-gray-700 hover:text-red-600 transition-colors cursor-pointer">Juliana Mendes</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Main content */}
          <div className="md:w-3/4">
            {/* Enhanced Sort controls */}
            <div className="flex justify-between items-center mb-8 card-enhanced p-4">
              <p className="text-gray-600 font-medium">{filteredTattoos.length} resultados encontrados</p>
              <div className="flex items-center">
                <span className="text-gray-700 mr-3 font-medium">Ordenar por:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] form-input-enhanced">
                    <SelectValue placeholder="Popularidade" />
                  </SelectTrigger>
                  <SelectContent className="bg-white shadow-elevation-3 border-gray-200">
                    <SelectItem value="popularity">Popularidade</SelectItem>
                    <SelectItem value="price-asc">Menor Preço</SelectItem>
                    <SelectItem value="price-desc">Maior Preço</SelectItem>
                    <SelectItem value="rating">Melhor Avaliação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Enhanced Tattoo grid */}
            {filteredTattoos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTattoos.map((tattoo) => (
                  <div key={tattoo.id} className="product-card">
                    <TattooCard tattoo={tattoo} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 card-enhanced">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Nenhum resultado encontrado</h3>
                <p className="text-gray-600 text-lg">Tente ajustar seus filtros para encontrar mais opções.</p>
              </div>
            )}
            
            {/* Enhanced Pagination */}
            <div className="flex justify-center mt-16">
              <nav className="inline-flex shadow-elevation-2 rounded-lg overflow-hidden">
                <button className="px-6 py-3 text-gray-700 bg-white hover:bg-gray-50 border-r border-gray-200 transition-colors font-medium">
                  Anterior
                </button>
                <button className="px-6 py-3 text-white btn-gradient">1</button>
                <button className="px-6 py-3 text-gray-700 bg-white hover:bg-gray-50 border-l border-gray-200 transition-colors font-medium">2</button>
                <button className="px-6 py-3 text-gray-700 bg-white hover:bg-gray-50 border-l border-gray-200 transition-colors font-medium">3</button>
                <button className="px-6 py-3 text-gray-700 bg-white hover:bg-gray-50 border-l border-gray-200 transition-colors font-medium">
                  Próxima
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
