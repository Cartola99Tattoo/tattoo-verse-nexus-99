
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

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
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tatuagens{" "}
            <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              em Destaque
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg">
            Explore nossa seleção de tatuagens mais populares, criadas por nossos talentosos artistas.
            Encontre inspiração para sua próxima arte corporal.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                  activeCategory === category
                    ? "bg-gradient-to-r from-red-600 to-red-800 text-white shadow-red-glow"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredTattoos.map((tattoo) => (
            <Card
              key={tattoo.id}
              variant="tattoo"
              className="group overflow-hidden h-full"
            >
              <div className="relative">
                <Link to={`/shop/${tattoo.id}`}>
                  <div className="h-64 overflow-hidden">
                    <img
                      src={tattoo.image}
                      alt={tattoo.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </Link>
                <div className="absolute top-3 left-3">
                  <Badge variant="tattoo" className="font-semibold">
                    {tattoo.category}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <Link to={`/shop/${tattoo.id}`}>
                    <h3 className="text-lg font-bold hover:text-red-600 transition-colors">
                      {tattoo.name}
                    </h3>
                  </Link>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="text-sm font-medium">{tattoo.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">Por {tattoo.artist}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-red-600">R$ {tattoo.price}</span>
                  <Button asChild variant="tattooOutline" size="sm">
                    <Link to={`/shop/${tattoo.id}`}>
                      Ver detalhes
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="tattoo" size="lg" className="font-bold">
            <Link to="/shop">Ver Catálogo Completo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTattoos;
