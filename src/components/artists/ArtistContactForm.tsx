
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";

interface ArtistContactFormProps {
  artistName: string;
  artistId: string;
}

const ArtistContactForm = ({ artistName, artistId }: ArtistContactFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Solicitação enviada!",
        description: "Entraremos em contato com você em breve sobre este tatuador.",
        variant: "default",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    }, 1000);
    
    // In a real application, you would send this data to your backend
    console.log("Contact request for artist:", artistId, formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">
        Interessado no trabalho de {artistName}?
      </h3>
      <p className="text-gray-600 mb-6">
        Preencha o formulário abaixo e a 99Tattoo entrará em contato para conectar você com este tatuador.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            name="name"
            placeholder="Seu nome"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="email"
            type="email"
            placeholder="Seu e-mail"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <Input
            name="phone"
            type="tel"
            placeholder="Seu telefone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Textarea
            name="message"
            placeholder="Descreva brevemente o que você está procurando (estilo, tamanho, local do corpo, etc)"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-red-500 hover:bg-red-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>Enviando...</>
          ) : (
            <>Solicitar contato</>
          )}
        </Button>
        
        <p className="text-xs text-gray-500 text-center mt-2">
          Ao enviar, você concorda com nossos Termos de Serviço e Política de Privacidade.
        </p>
      </form>
    </div>
  );
};

export default ArtistContactForm;
