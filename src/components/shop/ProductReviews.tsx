
import { useState } from "react";
import { Star } from "lucide-react";

interface ProductReviewsProps {
  productId: number;
  rating: number;
  reviewCount: number;
}

// Dados simulados - em produção, isso viria de uma API
const getReviews = (productId: number) => {
  const reviews = [
    {
      id: 1,
      productId: 1,
      user: "Ana Silva",
      avatar: "https://i.pravatar.cc/150?img=1",
      rating: 5,
      date: "2024-03-20",
      comment: "Experiência incrível! A tatuagem ficou exatamente como eu queria e a artista foi muito profissional. Recomendo totalmente!",
    },
    {
      id: 2,
      productId: 1,
      user: "Carlos Mendes",
      avatar: "https://i.pravatar.cc/150?img=8",
      rating: 5,
      date: "2024-03-18",
      comment: "Impressionado com o resultado. O processo foi tranquilo e o estúdio é extremamente limpo e profissional. Já estou planejando minha próxima!",
    },
    {
      id: 3,
      productId: 1,
      user: "Pedro Almeida",
      avatar: "https://i.pravatar.cc/150?img=12",
      rating: 4,
      date: "2024-03-15",
      comment: "Gostei muito do resultado final, embora o processo tenha sido um pouco mais doloroso do que eu esperava. A artista foi atenciosa e muito habilidosa.",
    },
    {
      id: 4,
      productId: 2,
      user: "Mariana Freitas",
      avatar: "https://i.pravatar.cc/150?img=5",
      rating: 5,
      date: "2024-03-22",
      comment: "Perfeita! A mandala ficou incrivelmente simétrica e com detalhes impressionantes. Rafael é um verdadeiro artista.",
    },
    {
      id: 5,
      productId: 2,
      user: "Lucas Sousa",
      avatar: "https://i.pravatar.cc/150?img=11",
      rating: 4,
      date: "2024-03-10",
      comment: "Uma experiência muito boa. O design geométrico ficou impecável e adoro os detalhes finos. Só achei que poderia ter sido um pouco mais rápido.",
    },
    {
      id: 6,
      productId: 3,
      user: "Camila Oliveira",
      avatar: "https://i.pravatar.cc/150?img=3",
      rating: 5,
      date: "2024-04-08",
      comment: "Simplesmente espetacular! As cores são vibrantes e o efeito aquarela ficou perfeito. Juliana é uma artista incrível!",
    },
  ];
  
  return reviews.filter(review => review.productId === productId);
};

const ProductReviews = ({ productId, rating, reviewCount }: ProductReviewsProps) => {
  const [reviews] = useState(getReviews(productId));
  
  // Calcular distribuição de avaliações
  const ratings = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <div>
      {/* Rating summary */}
      <div className="flex flex-col md:flex-row gap-10 mb-10">
        <div className="md:w-1/3">
          <div className="flex flex-col items-center">
            <div className="text-5xl font-bold text-red-600 mb-2">{rating.toFixed(1)}</div>
            <div className="flex mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="text-gray-500 text-sm">{reviewCount} avaliações</div>
          </div>
        </div>
        
        <div className="md:w-2/3">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center mb-2">
              <div className="flex items-center w-16">
                <span className="mr-2">{star}</span>
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              </div>
              <div className="flex-grow h-2 mx-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-red-500 rounded-full"
                  style={{
                    width: `${
                      reviewCount > 0
                        ? (ratings[star as keyof typeof ratings] / reviewCount) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <div className="w-10 text-gray-500 text-sm">
                {ratings[star as keyof typeof ratings]}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Reviews list */}
      <div className="space-y-8">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="pb-6 border-b">
              <div className="flex gap-4 mb-3">
                <img
                  src={review.avatar}
                  alt={review.user}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium">{review.user}</h4>
                  <div className="flex items-center">
                    <div className="flex mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Ainda não há avaliações para este produto.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
