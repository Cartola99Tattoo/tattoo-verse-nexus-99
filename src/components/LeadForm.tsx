
import React, { useState } from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LeadForm: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interests: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, value]
        : prev.interests.filter(interest => interest !== value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Em breve entraremos em contato.",
      });
      console.log('Form submitted:', formData);
      // Reset form after 2 seconds of showing success
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          interests: []
        });
        setIsSuccess(false);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-tattoo-darkgray rounded-lg futuristic-border p-6">
        <h3 className="text-2xl font-semibold mb-4 text-tattoo-white">
          Entre para o <span className="text-tattoo-red">Universo 99Tattoo</span>
        </h3>
        <div className="red-line mb-6"></div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nome completo</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-tattoo-black border border-tattoo-red/30 rounded py-2 px-3 text-white placeholder-gray-500 focus:border-tattoo-red focus:outline-none focus:ring-1 focus:ring-tattoo-red"
              placeholder="Seu nome"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-tattoo-black border border-tattoo-red/30 rounded py-2 px-3 text-white placeholder-gray-500 focus:border-tattoo-red focus:outline-none focus:ring-1 focus:ring-tattoo-red"
              placeholder="seu@email.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Telefone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-tattoo-black border border-tattoo-red/30 rounded py-2 px-3 text-white placeholder-gray-500 focus:border-tattoo-red focus:outline-none focus:ring-1 focus:ring-tattoo-red"
              placeholder="(00) 00000-0000"
              required
            />
          </div>
          
          <div>
            <p className="block text-sm font-medium text-gray-300 mb-1">Interesses</p>
            <div className="grid grid-cols-2 gap-2">
              {['Tatuagem Tradicional', 'Blackwork', 'Realismo', 'Aquarela'].map(interest => (
                <div key={interest} className="flex items-center">
                  <input
                    type="checkbox"
                    id={interest}
                    name="interests"
                    value={interest}
                    checked={formData.interests.includes(interest)}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 accent-tattoo-red mr-2"
                  />
                  <label htmlFor={interest} className="text-sm text-gray-300">{interest}</label>
                </div>
              ))}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className={`w-full py-2 px-4 mt-2 rounded font-medium flex items-center justify-center ${
              isSuccess 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-tattoo-red hover:bg-tattoo-red/80'
            } transition-colors duration-300`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </span>
            ) : isSuccess ? (
              <span className="flex items-center">
                <Check className="mr-2" size={18} />
                Cadastro Confirmado!
              </span>
            ) : (
              'Cadastrar'
            )}
          </button>
          
          <p className="text-xs text-gray-400 text-center mt-4">
            Ao se cadastrar, você concorda com nossa política de privacidade e termos de uso.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LeadForm;
