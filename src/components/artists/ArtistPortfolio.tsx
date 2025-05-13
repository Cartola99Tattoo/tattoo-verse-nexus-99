
import { useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PortfolioItem } from "@/services/interfaces/IArtistsService";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Image } from "lucide-react";

interface ArtistPortfolioProps {
  portfolio: PortfolioItem[];
  artistName: string;
  isLoading?: boolean;
}

const ArtistPortfolio = ({ 
  portfolio, 
  artistName, 
  isLoading = false 
}: ArtistPortfolioProps) => {
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="overflow-hidden bg-gray-100 animate-pulse">
            <div className="aspect-square"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (portfolio.length === 0) {
    return (
      <Card className="w-full p-8 text-center">
        <CardContent className="pt-6 flex flex-col items-center">
          <Image className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Portfólio vazio</h3>
          <p className="text-gray-600">
            Este tatuador ainda não adicionou imagens ao seu portfólio.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {portfolio.map((item) => (
          <Card 
            key={item.id} 
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedImage(item)}
          >
            <AspectRatio ratio={1/1} className="bg-gray-100">
              <img 
                src={item.image_url} 
                alt={item.description || `Trabalho de ${artistName}`} 
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-300" 
              />
            </AspectRatio>
            {item.category && (
              <div className="p-2">
                <Badge variant="secondary" className="text-xs">
                  {item.category}
                </Badge>
              </div>
            )}
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Trabalho de {artistName}</DialogTitle>
            {selectedImage?.description && (
              <DialogDescription>
                {selectedImage.description}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="overflow-hidden">
            <img 
              src={selectedImage?.image_url} 
              alt={selectedImage?.description || `Trabalho de ${artistName}`}
              className="w-full object-contain max-h-[70vh]"
            />
          </div>
          <div className="flex justify-between items-center">
            {selectedImage?.category && (
              <Badge>{selectedImage.category}</Badge>
            )}
            <Button variant="outline" onClick={() => setSelectedImage(null)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ArtistPortfolio;
