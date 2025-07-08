
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Mail, ArrowRight, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "cliente" | "estudio";
}

const RegistrationModal = ({ isOpen, onClose, type }: RegistrationModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envio do cadastro
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("Cadastro enviado:", { ...formData, type });

    toast({
      title: "Cadastro enviado com sucesso!",
      description: type === "cliente" 
        ? "Em breve entraremos em contato para ajudar você a encontrar o tatuador perfeito!"
        : "Nossa equipe entrará em contato para apresentar a plataforma e seus benefícios.",
      duration: 5000,
    });

    setIsSubmitting(false);
    setFormData({ name: "", email: "", whatsapp: "" });
    onClose();
  };

  const title = type === "cliente" 
    ? "Cadastre-se e Encontre Seu Tatuador Ideal" 
    : "Cadastre Sua Loja/Estúdio na 99Tattoo";

  const subtitle = type === "cliente"
    ? "Junte-se à comunidade 99Tattoo e transforme sua paixão em arte permanente!"
    : "Digitalize seu estúdio e expanda seus negócios com nossa plataforma completa!";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-white to-red-50 border-red-200">
        <DialogHeader className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-6 rounded-lg -mx-6 -mt-6 mb-6">
          <DialogTitle className="text-xl font-black text-center">{title}</DialogTitle>
          <p className="text-red-100 text-sm text-center mt-2">{subtitle}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium">
              {type === "cliente" ? "Seu Nome" : "Nome do Responsável"}
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder={type === "cliente" ? "João Silva" : "Maria Proprietária"}
                value={formData.name}
                onChange={handleInputChange}
                className="pl-10 border-red-200 focus:border-red-400"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">
              E-mail
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 border-red-200 focus:border-red-400"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="text-gray-700 font-medium">
              WhatsApp
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.whatsapp}
                onChange={handleInputChange}
                className="pl-10 border-red-200 focus:border-red-400"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-3 text-lg mt-6"
          >
            {isSubmitting ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4 animate-pulse" />
                Enviando Cadastro...
              </>
            ) : (
              <>
                Enviar Cadastro
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="text-center mt-4 p-3 bg-red-100 rounded-lg">
          <p className="text-xs text-red-700">
            {type === "cliente" 
              ? "Ao se cadastrar, você receberá acesso a tatuadores verificados e um processo transparente e seguro."
              : "Nossa equipe especializada irá apresentar todas as funcionalidades da plataforma e como ela pode revolucionar seu estúdio."
            }
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationModal;
