
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Send, Phone, Mail, MessageCircle, Calendar, Target, Users, Check, CheckCircle } from 'lucide-react';
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
  const [formSubmitted, setFormSubmitted] = useState(false);
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
      await clientService.createClient({
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

      // Set form as submitted
      setFormSubmitted(true);
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

  const resetForm = () => {
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
    setFormSubmitted(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      onClose();
      // Reset form when closing the dialog
      setTimeout(resetForm, 300);
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 to-black border border-red-500 shadow-2xl">
        <DialogHeader className="border-b border-red-500/30 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">
              Transforme Seu Evento Com a 99Tattoo
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
            Preencha os dados abaixo e nossa equipe entrará em contato para desenvolver uma proposta personalizada para seu evento.
          </p>
        </DialogHeader>

        {formSubmitted ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">Solicitação Enviada com Sucesso!</h3>
            <p className="text-gray-300 max-w-md mx-auto">
              Obrigado pelo seu interesse! Nossa equipe especializada entrará em contato em breve para discutir seu projeto e criar uma proposta personalizada.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button 
                onClick={() => {
                  onClose();
                  setTimeout(resetForm, 300);
                }}
                className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white"
              >
                Fechar
              </Button>
              <Button
                variant="outline"
                onClick={resetForm}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Enviar Nova Solicitação
              </Button>
            </div>
          </div>
        ) : (
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
                    <SelectItem value="aniversario">Aniversário</SelectItem>
                    <SelectItem value="confraternizacao">Confraternização</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventDate" className="text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-red-500" />
                  Data Prevista do Evento
                </Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => handleInputChange('eventDate', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white focus:border-red-500"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="estimatedParticipants" className="text-white flex items-center gap-2">
                  <Users className="h-4 w-4 text-red-500" />
                  Número de Participantes Estimado
                </Label>
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
              <Label htmlFor="message" className="text-white flex items-center gap-2">
                <Target className="h-4 w-4 text-red-500" />
                Mensagem / Descrição do Projeto
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Descreva seu projeto, expectativas, e qualquer informação adicional relevante..."
                rows={4}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 resize-none"
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
                    className="border-red-500 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                  />
                  <Label htmlFor="email-pref" className="text-white flex items-center gap-2 cursor-pointer">
                    <Mail className="h-4 w-4 text-red-500" />
                    E-mail
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="phone-pref"
                    checked={formData.contactPreferences.phone}
                    onCheckedChange={(checked) => handleContactPreferenceChange('phone', checked as boolean)}
                    className="border-red-500 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                  />
                  <Label htmlFor="phone-pref" className="text-white flex items-center gap-2 cursor-pointer">
                    <Phone className="h-4 w-4 text-red-500" />
                    Telefone
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="whatsapp-pref"
                    checked={formData.contactPreferences.whatsapp}
                    onCheckedChange={(checked) => handleContactPreferenceChange('whatsapp', checked as boolean)}
                    className="border-red-500 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                  />
                  <Label htmlFor="whatsapp-pref" className="text-white flex items-center gap-2 cursor-pointer">
                    <MessageCircle className="h-4 w-4 text-red-500" />
                    WhatsApp
                  </Label>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-900/30 to-black/30 p-4 rounded-lg border border-red-500/50 mt-6">
              <h4 className="text-red-400 font-medium mb-2">Tipos de Evento que Atendemos:</h4>
              <ul className="text-gray-300 text-sm grid grid-cols-2 md:grid-cols-4 gap-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-red-500" />
                  <span>Corporativos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-red-500" />
                  <span>Casamentos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-red-500" />
                  <span>Festas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-red-500" />
                  <span>Festivais</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-red-500" />
                  <span>Convenções</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-red-500" />
                  <span>Aniversários</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-red-500" />
                  <span>Workshops</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-red-500" />
                  <span>E muito mais!</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Send className="h-5 w-5 mr-2" />
                {isSubmitting ? 'Enviando...' : 'Receber Proposta Personalizada'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="border-gray-600 text-gray-300 hover:bg-gray-800">
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventB2BForm;
