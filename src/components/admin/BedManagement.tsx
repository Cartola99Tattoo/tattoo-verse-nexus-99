
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Bed, Settings, User, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Bed {
  id: string;
  number: number;
  name: string;
  isActive: boolean;
  currentAppointment?: {
    clientName: string;
    artistName: string;
    startTime: string;
    endTime: string;
  };
}

interface BedManagementProps {
  beds: Bed[];
  onAddBed: (bed: Omit<Bed, 'id'>) => void;
  onUpdateBed: (bedId: string, updates: Partial<Bed>) => void;
  onDeleteBed: (bedId: string) => void;
}

const BedManagement = ({ beds, onAddBed, onUpdateBed, onDeleteBed }: BedManagementProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newBedNumber, setNewBedNumber] = useState("");
  const [newBedName, setNewBedName] = useState("");

  const handleAddBed = () => {
    if (!newBedNumber || !newBedName) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o número e nome da maca.",
        variant: "destructive"
      });
      return;
    }

    const bedNumber = parseInt(newBedNumber);
    if (beds.some(bed => bed.number === bedNumber)) {
      toast({
        title: "Número já existe",
        description: "Já existe uma maca com este número.",
        variant: "destructive"
      });
      return;
    }

    onAddBed({
      number: bedNumber,
      name: newBedName,
      isActive: true
    });

    setNewBedNumber("");
    setNewBedName("");
    setIsAddDialogOpen(false);
    
    toast({
      title: "Maca adicionada",
      description: "A nova maca foi adicionada com sucesso."
    });
  };

  const getBedStatus = (bed: Bed) => {
    if (!bed.isActive) return { label: "Inativa", color: "bg-gray-100 text-gray-800" };
    if (bed.currentAppointment) return { label: "Ocupada", color: "bg-red-100 text-red-800" };
    return { label: "Disponível", color: "bg-green-100 text-green-800" };
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bed className="h-5 w-5 text-blue-600" />
            Gestão de Macas ({beds.length})
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nova Maca
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Maca</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Número da Maca *</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 1"
                    value={newBedNumber}
                    onChange={(e) => setNewBedNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nome/Descrição *</Label>
                  <Input
                    placeholder="Ex: Maca Principal, Maca da Janela"
                    value={newBedName}
                    onChange={(e) => setNewBedName(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddBed} className="flex-1">
                    Adicionar Maca
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {beds.map((bed) => {
            const status = getBedStatus(bed);
            return (
              <div
                key={bed.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Bed className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Maca {bed.number}</span>
                  </div>
                  <Badge className={status.color}>
                    {status.label}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{bed.name}</p>
                
                {bed.currentAppointment && (
                  <div className="bg-gray-50 rounded p-3 mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">
                        {bed.currentAppointment.clientName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500">Artista:</span>
                      <span className="text-xs">{bed.currentAppointment.artistName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-500">
                        {bed.currentAppointment.startTime} - {bed.currentAppointment.endTime}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onUpdateBed(bed.id, { isActive: !bed.isActive })}
                  >
                    {bed.isActive ? "Desativar" : "Ativar"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm("Tem certeza que deseja excluir esta maca?")) {
                        onDeleteBed(bed.id);
                      }
                    }}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        
        {beds.length === 0 && (
          <div className="text-center py-8">
            <Bed className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma maca cadastrada
            </h3>
            <p className="text-gray-500 mb-4">
              Adicione macas para organizar melhor os agendamentos.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeira Maca
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BedManagement;
