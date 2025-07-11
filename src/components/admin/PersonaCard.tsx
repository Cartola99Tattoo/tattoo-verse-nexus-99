
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, User, Target, Heart, AlertTriangle } from 'lucide-react';
import { Persona } from '@/types/persona';

interface PersonaCardProps {
  persona: Persona;
  onEdit: (persona: Persona) => void;
}

const PersonaCard = ({ persona, onEdit }: PersonaCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl hover:shadow-red-glow transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1">
      <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 rounded-t-lg border-b border-red-200">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-red-600 to-red-800 p-2 rounded-full">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-red-600 font-bold text-xl">{persona.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-red-100 text-red-700 border-red-300">
                  {persona.age} anos
                </Badge>
                <Badge variant="outline" className="border-red-200 text-red-600">
                  {persona.gender}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(persona)}
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-red-500" />
            <span className="font-semibold text-red-700">Ocupação</span>
          </div>
          <p className="text-gray-700 text-sm">{persona.occupation}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-red-500" />
            <span className="font-semibold text-red-700">Objetivo Principal</span>
          </div>
          <p className="text-gray-700 text-sm line-clamp-2">{persona.main_objective}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="font-semibold text-red-700">Principais Medos/Dúvidas</span>
          </div>
          <p className="text-gray-700 text-sm line-clamp-2">{persona.fears_doubts}</p>
        </div>

        <div className="pt-2 border-t border-red-100">
          <p className="text-xs text-gray-500">
            Criado em: {new Date(persona.created_at).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonaCard;
