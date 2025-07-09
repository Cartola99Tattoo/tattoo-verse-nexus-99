
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, UserPlus, Sparkles, Shuffle } from 'lucide-react';

interface PopulateArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (config: GenerationConfig) => Promise<void>;
  isGenerating?: boolean;
}

interface GenerationConfig {
  artistType: 'beginner' | 'intermediate' | 'expert';
  completeDiagnostic: boolean;
  monthsOfMetrics: number;
  mixedSharing: boolean;
}

const PopulateArtistModal: React.FC<PopulateArtistModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  isGenerating = false
}) => {
  const [config, setConfig] = useState<GenerationConfig>({
    artistType: 'intermediate',
    completeDiagnostic: true,
    monthsOfMetrics: 4,
    mixedSharing: true
  });

  const handleGenerate = async () => {
    await onGenerate(config);
    onClose();
  };

  const artistTypeOptions = [
    {
      value: 'beginner',
      label: 'Iniciante',
      description: 'Poucos dados, perfil básico',
      emoji: '🌱'
    },
    {
      value: 'intermediate',
      label: 'Intermediário',
      description: 'Perfil moderadamente completo',
      emoji: '🎯'
    },
    {
      value: 'expert',
      label: 'Experiente',
      description: 'Perfil completo com dados ricos',
      emoji: '⭐'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <UserPlus className="h-6 w-6 text-purple-600" />
            Gerar Novo Tatuador
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tipo de Tatuador */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Perfil do Tatuador</Label>
            <Select 
              value={config.artistType} 
              onValueChange={(value: 'beginner' | 'intermediate' | 'expert') => 
                setConfig(prev => ({ ...prev, artistType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {artistTypeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <span>{option.emoji}</span>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Configurações do Diagnóstico */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="completeDiagnostic"
                  checked={config.completeDiagnostic}
                  onCheckedChange={(checked) => 
                    setConfig(prev => ({ ...prev, completeDiagnostic: checked as boolean }))
                  }
                />
                <div>
                  <Label htmlFor="completeDiagnostic" className="text-sm font-medium">
                    Diagnóstico SPIN Completo
                  </Label>
                  <p className="text-xs text-gray-600">
                    Todas as 4 seções preenchidas com respostas realistas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configurações das Métricas */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Meses de Métricas</Label>
            <Select 
              value={config.monthsOfMetrics.toString()} 
              onValueChange={(value) => 
                setConfig(prev => ({ ...prev, monthsOfMetrics: parseInt(value) }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 mês</SelectItem>
                <SelectItem value="2">2 meses</SelectItem>
                <SelectItem value="3">3 meses</SelectItem>
                <SelectItem value="4">4 meses</SelectItem>
                <SelectItem value="5">5 meses</SelectItem>
                <SelectItem value="6">6 meses</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Configuração de Compartilhamento */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mixedSharing"
                  checked={config.mixedSharing}
                  onCheckedChange={(checked) => 
                    setConfig(prev => ({ ...prev, mixedSharing: checked as boolean }))
                  }
                />
                <div>
                  <Label htmlFor="mixedSharing" className="text-sm font-medium">
                    Compartilhamento Misto
                  </Label>
                  <p className="text-xs text-gray-600">
                    Alguns meses compartilhados, outros privados
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isGenerating}
              className="flex-1"
            >
              Cancelar
            </Button>
            
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Gerar Tatuador
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PopulateArtistModal;
