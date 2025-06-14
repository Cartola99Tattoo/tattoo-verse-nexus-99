
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FileText, Edit, Save, X, ArrowRight } from 'lucide-react';
import { ContentIdea, CreateContentIdeaData } from '@/types/contentIdea';
import { Persona } from '@/types/persona';

interface ContentIdeaDetailModalProps {
  idea: ContentIdea;
  personas: Persona[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (idea: ContentIdea, data: CreateContentIdeaData) => void;
  onTransformToArticle: (idea: ContentIdea) => void;
}

const ContentIdeaDetailModal = ({ 
  idea, 
  personas, 
  isOpen, 
  onClose, 
  onUpdate, 
  onTransformToArticle 
}: ContentIdeaDetailModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    theme: idea.theme,
    format: idea.format,
    purchaseStage: idea.purchaseStage,
    focusPersonas: idea.focusPersonas,
    personaRelevance: idea.personaRelevance,
    focusKeyword: idea.focusKeyword,
    status: idea.status,
    notes: idea.notes,
    ideaCreator: idea.ideaCreator,
    draftTitle: idea.draftTitle || '',
    draftSummary: idea.draftSummary || '',
    draftContent: idea.draftContent || ''
  });

  const handleSave = () => {
    onUpdate(idea, formData);
    setIsEditing(false);
  };

  const canTransformToArticle = ['Escrevendo', 'Editando', 'Em Revisão'].includes(idea.status);

  const getPersonaNames = (personaIds: string[]) => {
    return personaIds.map(id => {
      const persona = personas.find(p => p.id === id);
      return persona ? persona.name : id;
    }).join(', ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-red-50 border-2 border-red-200">
        <DialogHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white p-4 -m-6 mb-6 rounded-t-lg">
          <DialogTitle className="flex items-center justify-between text-xl font-black">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6" />
              {isEditing ? 'Editando Card de Conteúdo' : 'Detalhes do Card de Conteúdo'}
            </div>
            <div className="flex gap-2">
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              )}
              <Button
                onClick={onClose}
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-red-700 font-bold">Tema Principal</Label>
                {isEditing ? (
                  <Input
                    value={formData.theme}
                    onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                    className="border-red-200 focus:border-red-500"
                  />
                ) : (
                  <p className="font-medium text-gray-800">{idea.theme}</p>
                )}
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <Label className="text-red-700 font-bold">Formato</Label>
                  <Badge className="mt-1 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
                    {idea.format}
                  </Badge>
                </div>
                <div className="flex-1">
                  <Label className="text-red-700 font-bold">Status</Label>
                  <Badge className="mt-1 bg-gradient-to-r from-red-600 to-red-800 text-white">
                    {idea.status}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-red-700 font-bold">Etapa da Jornada</Label>
                <Badge className="mt-1 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                  {idea.purchaseStage}
                </Badge>
              </div>

              <div>
                <Label className="text-red-700 font-bold">Personas Foco</Label>
                <p className="text-gray-700">{getPersonaNames(idea.focusPersonas)}</p>
              </div>

              <div>
                <Label className="text-red-700 font-bold">Palavra-chave Foco</Label>
                <p className="text-gray-700">{idea.focusKeyword}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-red-700 font-bold">Relevância para Personas</Label>
                {isEditing ? (
                  <Textarea
                    value={formData.personaRelevance}
                    onChange={(e) => setFormData(prev => ({ ...prev, personaRelevance: e.target.value }))}
                    className="border-red-200 focus:border-red-500"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-700">{idea.personaRelevance}</p>
                )}
              </div>

              <div>
                <Label className="text-red-700 font-bold">Notas</Label>
                {isEditing ? (
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="border-red-200 focus:border-red-500"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-700">{idea.notes}</p>
                )}
              </div>
            </div>
          </div>

          {/* Seção de Rascunho */}
          <div className="border-t-2 border-red-200 pt-6">
            <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Rascunho do Artigo
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-red-700 font-bold">Título do Rascunho</Label>
                {isEditing ? (
                  <Input
                    value={formData.draftTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, draftTitle: e.target.value }))}
                    placeholder="Digite o título provisório do artigo..."
                    className="border-red-200 focus:border-red-500"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">{idea.draftTitle || 'Não definido'}</p>
                )}
              </div>

              <div>
                <Label className="text-red-700 font-bold">Resumo do Artigo</Label>
                {isEditing ? (
                  <Textarea
                    value={formData.draftSummary}
                    onChange={(e) => setFormData(prev => ({ ...prev, draftSummary: e.target.value }))}
                    placeholder="Escreva uma breve sinopse do conteúdo..."
                    className="border-red-200 focus:border-red-500"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-700">{idea.draftSummary || 'Não definido'}</p>
                )}
              </div>

              <div>
                <Label className="text-red-700 font-bold">Conteúdo do Rascunho</Label>
                {isEditing ? (
                  <Textarea
                    value={formData.draftContent}
                    onChange={(e) => setFormData(prev => ({ ...prev, draftContent: e.target.value }))}
                    placeholder="Escreva o rascunho completo do artigo ou partes dele..."
                    className="border-red-200 focus:border-red-500"
                    rows={8}
                  />
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {idea.draftContent || 'Nenhum conteúdo rascunho ainda'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-between items-center pt-6 border-t-2 border-red-200">
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  {canTransformToArticle && (
                    <Button
                      onClick={() => onTransformToArticle(idea)}
                      className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg font-bold"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Transformar em Artigo
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentIdeaDetailModal;
