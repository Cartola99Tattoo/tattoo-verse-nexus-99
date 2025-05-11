
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
];

const FeaturedTattoos = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const categories = ["Todos", "Realismo", "Blackwork", "Aquarela", "Colorido"];

  const filteredTattoos = activeCategory === "Todos"
    ? tattoosData
    : tattoosData.filter(tattoo => tattoo.category === activeCategory);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-4">
            Tatuagens <span className="text-red-500">em Destaque</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Explore nossa seleção de tatuagens mais populares, criadas por nossos talentosos artistas.
            Encontre inspiração para sua próxima arte corporal.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeCategory === category
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTattoos.map((tattoo) => (
            <div
              key={tattoo.id}
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={tattoo.image}
                  alt={tattoo.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold">{tattoo.name}</h3>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span className="text-sm font-medium">{tattoo.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">Por {tattoo.artist}</p>
                <p className="text-sm text-gray-500 mb-3">Categoria: {tattoo.category}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">R$ {tattoo.price}</span>
                  <Link 
                    to={`/shop/${tattoo.id}`}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    Ver detalhes
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild className="bg-red-500 hover:bg-red-600 text-white">
            <Link to="/shop">Ver Catálogo Completo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTattoos;
