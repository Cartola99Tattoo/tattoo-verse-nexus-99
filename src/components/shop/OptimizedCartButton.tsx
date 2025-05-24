
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check, Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/components/ui/use-toast";

interface OptimizedCartButtonProps {
  productId: string;
  productName: string;
  price: number;
  variant?: "default" | "outline" | "secondary";
  size?: "sm" | "default" | "lg";
  className?: string;
}

const OptimizedCartButton = ({ 
  productId, 
  productName, 
  price, 
  variant = "default",
  size = "default",
  className = ""
}: OptimizedCartButtonProps) => {
  const { addToCart, items } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isInCart = items.some(item => item.id === productId);

  const handleAddToCart = async () => {
    if (isAdding || justAdded) return;

    setIsAdding(true);
    
    try {
      await addToCart({
        id: productId,
        name: productName,
        price: price,
        quantity: 1,
        image: '/placeholder.svg'
      });

      setJustAdded(true);
      
      toast({
        title: "Produto adicionado!",
        description: `${productName} foi adicionado ao carrinho.`,
        duration: 2000,
      });

      // Reset the "just added" state after animation
      setTimeout(() => {
        setJustAdded(false);
      }, 2000);

    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto ao carrinho.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const getButtonContent = () => {
    if (isAdding) {
      return (
        <>
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
          Adicionando...
        </>
      );
    }

    if (justAdded) {
      return (
        <>
          <Check className="h-4 w-4 mr-2 animate-scale-in" />
          Adicionado!
        </>
      );
    }

    if (isInCart) {
      return (
        <>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Mais
        </>
      );
    }

    return (
      <>
        <ShoppingCart className="h-4 w-4 mr-2" />
        Adicionar ao Carrinho
      </>
    );
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding}
      variant={justAdded ? "secondary" : variant}
      size={size}
      className={`transition-all duration-200 hover:scale-105 ${
        justAdded ? "bg-green-100 text-green-800 border-green-300" : ""
      } ${className}`}
    >
      {getButtonContent()}
    </Button>
  );
};

export default OptimizedCartButton;
