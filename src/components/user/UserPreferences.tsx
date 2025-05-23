
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X } from "lucide-react";

interface UserPreferencesProps {
  isEditing?: boolean;
}

const UserPreferences = ({ isEditing: initialEditing = false }: UserPreferencesProps) => {
  const [isEditing, setIsEditing] = useState(initialEditing);
  const [preferences, setPreferences] = useState({
    favoriteStyles: ['Realismo', 'Old School'],
    preferredBodyParts: ['Braço', 'Perna'],
    sizePreferences: 'Médio',
    colorPreferences: 'Colorido',
    notes: 'Gosto de tatuagens com significado pessoal, especialmente relacionadas à natureza.'
  });

  const tattooStyles = [
    'Realismo', 'Old School', 'Minimalista', 'Blackwork', 
    'Aquarela', 'Geométrico', 'Tribal', 'Lettering'
  ];

  const bodyParts = [
    'Braço', 'Antebraço', 'Ombro', 'Costas', 'Peito', 
    'Perna', 'Panturrilha', 'Pé', 'Mão', 'Pescoço'
  ];

  const handleSave = () => {
    // TODO: Integrate with user service to save preferences
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Preferências de Tatuagem</CardTitle>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Estilos Favoritos</Label>
          {!isEditing ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {preferences.favoriteStyles.map((style) => (
                <Badge key={style} variant="secondary">{style}</Badge>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {tattooStyles.map((style) => (
                <label key={style} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={preferences.favoriteStyles.includes(style)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPreferences(prev => ({
                          ...prev,
                          favoriteStyles: [...prev.favoriteStyles, style]
                        }));
                      } else {
                        setPreferences(prev => ({
                          ...prev,
                          favoriteStyles: prev.favoriteStyles.filter(s => s !== style)
                        }));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{style}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div>
          <Label>Partes do Corpo Preferidas</Label>
          {!isEditing ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {preferences.preferredBodyParts.map((part) => (
                <Badge key={part} variant="outline">{part}</Badge>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
              {bodyParts.map((part) => (
                <label key={part} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={preferences.preferredBodyParts.includes(part)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPreferences(prev => ({
                          ...prev,
                          preferredBodyParts: [...prev.preferredBodyParts, part]
                        }));
                      } else {
                        setPreferences(prev => ({
                          ...prev,
                          preferredBodyParts: prev.preferredBodyParts.filter(p => p !== part)
                        }));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{part}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Tamanho Preferido</Label>
            {!isEditing ? (
              <p className="mt-2 text-sm">{preferences.sizePreferences}</p>
            ) : (
              <Select value={preferences.sizePreferences} onValueChange={(value) => 
                setPreferences(prev => ({ ...prev, sizePreferences: value }))
              }>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pequeno">Pequeno (até 5cm)</SelectItem>
                  <SelectItem value="Médio">Médio (5-15cm)</SelectItem>
                  <SelectItem value="Grande">Grande (15-30cm)</SelectItem>
                  <SelectItem value="Extra Grande">Extra Grande (30cm+)</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <div>
            <Label>Preferência de Cor</Label>
            {!isEditing ? (
              <p className="mt-2 text-sm">{preferences.colorPreferences}</p>
            ) : (
              <Select value={preferences.colorPreferences} onValueChange={(value) => 
                setPreferences(prev => ({ ...prev, colorPreferences: value }))
              }>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Colorido">Colorido</SelectItem>
                  <SelectItem value="Preto e Cinza">Preto e Cinza</SelectItem>
                  <SelectItem value="Sem Preferência">Sem Preferência</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <div>
          <Label>Observações e Preferências Especiais</Label>
          {!isEditing ? (
            <p className="mt-2 text-sm text-gray-600">{preferences.notes}</p>
          ) : (
            <Textarea
              value={preferences.notes}
              onChange={(e) => setPreferences(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Descreva suas preferências, inspirações ou qualquer informação relevante..."
              className="mt-2"
              rows={3}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserPreferences;
