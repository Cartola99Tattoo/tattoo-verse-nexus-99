import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Send, Phone, Mail, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getClientService } from '@/services/serviceFactory';

interface EventB2BFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const EventB2BForm = ({ isOpen, onClose }: EventB2BFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    eventType: '',
    eventDate: '',
    estimatedParticipants: '',
    message: '',
    contactPreferences: {
      email: false,
      phone: false,
      whatsapp: false
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const clientService = getClientService();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContactPreferenceChange = (preference: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      contactPreferences: {
        ...prev.contactPreferences,
        [preference]: checked
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Erro",
        description: "Nome e e-mail são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create a B2B event lead in the client service
      await clientService.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        notes: `LEAD B2B EVENTO: ${formData.eventType || 'Não especificado'}
Empresa/Evento: ${formData.company || 'Não informado'}
Data Prevista: ${formData.eventDate || 'Não informado'}
Participantes Estimados: ${formData.estimatedParticipants || 'Não informado'}
Preferências de Contato: ${Object.entries(formData.contactPreferences)
          .filter(([_, value]) => value)
          .map(([key, _]) => key)
          .join(', ') || 'Não especificado'}

Mensagem: ${formData.message || 'Nenhuma mensagem adicional'}`,
        status: 'interested'
      });

      toast({
        title: "Sucesso!",
        description: "Sua solicitação foi enviada! Entraremos em contato em breve.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        eventType: '',
        eventDate: '',
        estimatedParticipants: '',
        message: '',
        contactPreferences: {
          email: false,
          phone: false,
          whatsapp: false
        }
      });

      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar solicitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 to-black border border-red-500 shadow-2xl">
        <DialogHeader className="border-b border-red-500/30 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
              Converse Conosco Sobre Seu Projeto de Evento
            </DialogTitle>
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <p className="text-gray-300 mt-2">
            Preencha os dados abaixo e nossa equipe entrará em contato para desenvolver uma proposta personalizada.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Seu nome completo"
                required
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="seu@email.com"
                required
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(11) 99999-9999"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-white">Nome da Empresa / Evento</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Empresa ou nome do evento"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventType" className="text-white">Tipo de Evento</Label>
              <Select value={formData.eventType} onValueChange={(value) => handleInputChange('eventType', value)}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-red-500">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="corporativo">Corporativo</SelectItem>
                  <SelectItem value="festa">Festa</SelectItem>
                  <SelectItem value="casamento">Casamento</SelectItem>
                  <SelectItem value="festival">Festival</SelectItem>
                  <SelectItem value="convencao">Convenção</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventDate" className="text-white">Data Prevista do Evento</Label>
              <Input
                id="eventDate"
                type="date"
                value={formData.eventDate}
                onChange={(e) => handleInputChange('eventDate', e.target.value)}
                className="bg-gray-800 border-gray-600 text-white focus:border-red-500"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="estimatedParticipants" className="text-white">Número de Participantes Estimado</Label>
              <Input
                id="estimatedParticipants"
                type="number"
                value={formData.estimatedParticipants}
                onChange={(e) => handleInputChange('estimatedParticipants', e.target.value)}
                placeholder="Ex: 50"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-white">Mensagem / Descrição do Projeto</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Descreva seu projeto, expectativas, e qualquer informação adicional relevante..."
              rows={4}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-white">Preferência de Contato</Label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email-pref"
                  checked={formData.contactPreferences.email}
                  onCheckedChange={(checked) => handleContactPreferenceChange('email', checked as boolean)}
                  className="border-red-500 text-red-600"
                />
                <Label htmlFor="email-pref" className="text-white flex items-center gap-2">
                  <Mail className="h-4 w-4 text-red-500" />
                  E-mail
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="phone-pref"
                  checked={formData.contactPreferences.phone}
                  onCheckedChange={(checked) => handleContactPreferenceChange('phone', checked as boolean)}
                  className="border-red-500 text-red-600"
                />
                <Label htmlFor="phone-pref" className="text-white flex items-center gap-2">
                  <Phone className="h-4 w-4 text-red-500" />
                  Telefone
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="whatsapp-pref"
                  checked={formData.contactPreferences.whatsapp}
                  onCheckedChange={(checked) => handleContactPreferenceChange('whatsapp', checked as boolean)}
                  className="border-red-500 text-red-600"
                />
                <Label htmlFor="whatsapp-pref" className="text-white flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-red-500" />
                  WhatsApp
                </Label>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Send className="h-5 w-5 mr-2" />
              {isSubmitting ? 'Enviando...' : 'Enviar Proposta / Falar com um Consultor'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventB2BForm;
