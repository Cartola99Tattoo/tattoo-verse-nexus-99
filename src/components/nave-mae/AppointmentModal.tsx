
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Brush, DollarSign } from "lucide-react";

interface Appointment {
  id?: number;
  clientName: string;
  artistName: string;
  studioName: string;
  date: string;
  time: string;
  service: string;
  duration: string;
  price: number;
  status: string;
  city: string;
  description?: string;
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: Appointment | null;
  onSave: (appointment: Appointment) => void;
}

const AppointmentModal = ({ isOpen, onClose, appointment, onSave }: AppointmentModalProps) => {
  const [formData, setFormData] = useState<Appointment>({
    clientName: appointment?.clientName || "",
    artistName: appointment?.artistName || "",
    studioName: appointment?.studioName || "",
    date: appointment?.date || "",
    time: appointment?.time || "",
    service: appointment?.service || "",
    duration: appointment?.duration || "",
    price: appointment?.price || 0,
    status: appointment?.status || "pending",
    city: appointment?.city || "",
    description: appointment?.description || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: appointment?.id });
    onClose();
  };

  const handleChange = (field: keyof Appointment, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <Calendar className="h-5 w-5 text-purple-600" />
            {appointment ? "Editar Agendamento" : "Novo Agendamento"}
          </DialogTitle>
          <DialogDescription>
            {appointment ? "Atualize as informações do agendamento." : "Crie um novo agendamento."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Cliente</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Select value={formData.clientName} onValueChange={(value) => handleChange("clientName", value)}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ana Silva">Ana Silva</SelectItem>
                    <SelectItem value="Carlos Santos">Carlos Santos</SelectItem>
                    <SelectItem value="Mariana Costa">Mariana Costa</SelectItem>
                    <SelectItem value="Pedro Oliveira">Pedro Oliveira</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="artistName">Tatuador</Label>
              <div className="relative">
                <Brush className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Select value={formData.artistName} onValueChange={(value) => handleChange("artistName", value)}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Selecione o tatuador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="João Silva Santos">João Silva Santos</SelectItem>
                    <SelectItem value="Maria Fernanda Costa">Maria Fernanda Costa</SelectItem>
                    <SelectItem value="Carlos Roberto">Carlos Roberto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Horário</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange("time", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="service">Serviço</Label>
              <Select value={formData.service} onValueChange={(value) => handleChange("service", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de tatuagem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tatuagem Realista">Tatuagem Realista</SelectItem>
                  <SelectItem value="Tatuagem Aquarela">Tatuagem Aquarela</SelectItem>
                  <SelectItem value="Blackwork">Blackwork</SelectItem>
                  <SelectItem value="Fine Line">Fine Line</SelectItem>
                  <SelectItem value="Traditional">Traditional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duração</Label>
              <Select value={formData.duration} onValueChange={(value) => handleChange("duration", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tempo estimado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 hora">1 hora</SelectItem>
                  <SelectItem value="2 horas">2 horas</SelectItem>
                  <SelectItem value="3 horas">3 horas</SelectItem>
                  <SelectItem value="4 horas">4 horas</SelectItem>
                  <SelectItem value="5+ horas">5+ horas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Valor (R$)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange("price", Number(e.target.value))}
                  placeholder="0.00"
                  className="pl-10"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studioName">Estúdio</Label>
              <Select value={formData.studioName} onValueChange={(value) => handleChange("studioName", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estúdio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Black Art Studio">Black Art Studio</SelectItem>
                  <SelectItem value="Aquarela Ink">Aquarela Ink</SelectItem>
                  <SelectItem value="Ink Masters">Ink Masters</SelectItem>
                  <SelectItem value="Art & Soul Tattoo">Art & Soul Tattoo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="confirmed">Confirmado</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição/Observações</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Detalhes sobre a tatuagem, referências, observações especiais..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
              {appointment ? "Atualizar" : "Criar"} Agendamento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
