
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
      {/* Shop header */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Catálogo de Tatuagens</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Escolha entre nossa seleção de tatuagens exclusivas, criadas por artistas talentosos.
          </p>
        </div>
      </div>

      {/* Shop content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6 pb-4 border-b">Filtros</h2>
              
              {/* Search */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3">Buscar</h3>
                <Input 
                  type="search"
                  placeholder="Busque por nome, artista..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Categories */}
              <CategoryFilter 
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
              
              {/* Price range */}
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
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>R$ {priceRange[0]}</span>
                    <span>R$ {priceRange[1]}</span>
                  </div>
                </div>
              </div>
              
              {/* Artist filter would go here */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3">Artistas</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input id="artist-mariana" type="checkbox" className="h-4 w-4 text-red-500" />
                    <label htmlFor="artist-mariana" className="ml-2 text-gray-700">Mariana Silva</label>
                  </div>
                  <div className="flex items-center">
                    <input id="artist-rafael" type="checkbox" className="h-4 w-4 text-red-500" />
                    <label htmlFor="artist-rafael" className="ml-2 text-gray-700">Rafael Costa</label>
                  </div>
                  <div className="flex items-center">
                    <input id="artist-juliana" type="checkbox" className="h-4 w-4 text-red-500" />
                    <label htmlFor="artist-juliana" className="ml-2 text-gray-700">Juliana Mendes</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="md:w-3/4">
            {/* Sort controls */}
            <div className="flex justify-between items-center mb-8">
              <p className="text-gray-600">{filteredTattoos.length} resultados encontrados</p>
              <div className="flex items-center">
                <span className="text-gray-700 mr-2">Ordenar por:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Popularidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularidade</SelectItem>
                    <SelectItem value="price-asc">Menor Preço</SelectItem>
                    <SelectItem value="price-desc">Maior Preço</SelectItem>
                    <SelectItem value="rating">Melhor Avaliação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Tattoo grid */}
            {filteredTattoos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTattoos.map((tattoo) => (
                  <TattooCard key={tattoo.id} tattoo={tattoo} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold mb-2">Nenhum resultado encontrado</h3>
                <p className="text-gray-600">Tente ajustar seus filtros para encontrar mais opções.</p>
              </div>
            )}
            
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
