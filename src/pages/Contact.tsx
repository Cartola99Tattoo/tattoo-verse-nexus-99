
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Mensagem enviada",
      description: "Agradecemos seu contato! Responderemos em breve.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Entre em Contato</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Input id="subject" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea id="message" rows={5} required />
                </div>
                
                <Button type="submit" className="w-full bg-red-500 hover:bg-red-600">
                  Enviar Mensagem
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Informações de Contato</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Endereço</h3>
                <p className="text-gray-600">Av. Paulista, 1000</p>
                <p className="text-gray-600">São Paulo, SP</p>
              </div>
              
              <div>
                <h3 className="font-semibold">Telefone</h3>
                <p className="text-gray-600">(11) 99999-9999</p>
              </div>
              
              <div>
                <h3 className="font-semibold">E-mail</h3>
                <p className="text-gray-600">contato@99tattoo.com.br</p>
              </div>
              
              <div>
                <h3 className="font-semibold">Horário de Funcionamento</h3>
                <p className="text-gray-600">Segunda a Sexta: 10h às 19h</p>
                <p className="text-gray-600">Sábado: 10h às 16h</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Redes Sociais</h3>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm">Instagram</Button>
                <Button variant="outline" size="sm">Facebook</Button>
                <Button variant="outline" size="sm">Twitter</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
