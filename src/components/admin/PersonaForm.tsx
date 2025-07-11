
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Save, X, Target, Heart, AlertTriangle, MessageCircle, Eye, Users, TrendingDown } from 'lucide-react';
import { Persona, CreatePersonaData } from '@/types/persona';

interface PersonaFormProps {
  persona?: Persona;
  onSave: (data: CreatePersonaData) => void;
  onCancel: () => void;
}

const PersonaForm = ({ persona, onSave, onCancel }: PersonaFormProps) => {
  const [formData, setFormData] = useState<CreatePersonaData>({
    name: persona?.name || '',
    age: persona?.age || 25,
    education: persona?.education || '',
    gender: persona?.gender || 'Prefiro não informar',
    occupation: persona?.occupation || '',
    behavior: persona?.behavior || '',
    communication_channels: persona?.communication_channels || '',
    main_objective: persona?.main_objective || '',
    fears_doubts: persona?.fears_doubts || '',
    how_99tattoo_helps: persona?.how_99tattoo_helps || '',
    studio_values: persona?.studio_values || '',
    tattoo_goals: persona?.tattoo_goals || '',
    common_objections: persona?.common_objections || '',
    information_sources: persona?.information_sources || '',
    what_makes_unnecessary: persona?.what_makes_unnecessary || '',
    expected_experience: persona?.expected_experience || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: keyof CreatePersonaData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-xl font-black">
            <User className="h-6 w-6" />
            {persona ? 'Editar Persona' : 'Nova Persona'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informações Básicas */}
            <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-lg border border-red-200">
              <h3 className="text-red-800 font-bold text-lg mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Básicas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-red-700 font-medium">Nome da Persona *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Ex: A Nova Tela, O Revisitado..."
                    className="border-red-200 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                    required
                  />
                </div>
                <div>
                  <Label className="text-red-700 font-medium">Idade *</Label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleChange('age', parseInt(e.target.value))}
                    min="1"
                    max="100"
                    className="border-red-200 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                    required
                  />
                </div>
                <div>
                  <Label className="text-red-700 font-medium">Escolaridade</Label>
                  <Input
                    value={formData.education}
                    onChange={(e) => handleChange('education', e.target.value)}
                    placeholder="Ex: Ensino Médio, Superior Completo..."
                    className="border-red-200 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                  />
                </div>
                <div>
                  <Label className="text-red-700 font-medium">Sexo</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value as any)}>
                    <SelectTrigger className="border-red-200 focus:border-red-600 focus:ring-2 focus:ring-red-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Feminino">Feminino</SelectItem>
                      <SelectItem value="Não Binário">Não Binário</SelectItem>
                      <SelectItem value="Prefiro não informar">Prefiro não informar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-red-700 font-medium">Ocupação/Estilo de Vida</Label>
                  <Input
                    value={formData.occupation}
                    onChange={(e) => handleChange('occupation', e.target.value)}
                    placeholder="Ex: Estudante, Profissional Liberal, Artista..."
                    className="border-red-200 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                  />
                </div>
              </div>
            </div>

            {/* Comportamento e Comunicação */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
              <h3 className="text-blue-800 font-bold text-lg mb-4 flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Comportamento e Comunicação
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-blue-700 font-medium">Comportamento e Hábitos</Label>
                  <Textarea
                    value={formData.behavior}
                    onChange={(e) => handleChange('behavior', e.target.value)}
                    placeholder="Como a persona interage com arte, moda, redes sociais, como pesquisa sobre tatuagem..."
                    className="border-blue-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 min-h-[100px]"
                  />
                </div>
                <div>
                  <Label className="text-blue-700 font-medium">Meios de Comunicação</Label>
                  <Textarea
                    value={formData.communication_channels}
                    onChange={(e) => handleChange('communication_channels', e.target.value)}
                    placeholder="Instagram de artistas, Pinterest, Blogs especializados, Recomendações de amigos..."
                    className="border-blue-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 min-h-[100px]"
                  />
                </div>
              </div>
            </div>

            {/* Objetivos e Desafios */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
              <h3 className="text-green-800 font-bold text-lg mb-4 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Objetivos e Desafios
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-green-700 font-medium">Objetivo Principal com Tatuagem</Label>
                  <Textarea
                    value={formData.main_objective}
                    onChange={(e) => handleChange('main_objective', e.target.value)}
                    placeholder="Expressar individualidade, Homenagear alguém, Cobrir cicatriz..."
                    className="border-green-200 focus:border-green-600 focus:ring-2 focus:ring-green-200 min-h-[100px]"
                  />
                </div>
                <div>
                  <Label className="text-green-700 font-medium">Medos/Dúvidas que Impedem</Label>
                  <Textarea
                    value={formData.fears_doubts}
                    onChange={(e) => handleChange('fears_doubts', e.target.value)}
                    placeholder="Medo de se arrepender, Dor, Preocupação com higiene..."
                    className="border-green-200 focus:border-green-600 focus:ring-2 focus:ring-green-200 min-h-[100px]"
                  />
                </div>
                <div>
                  <Label className="text-green-700 font-medium">Como a 99Tattoo Ajuda</Label>
                  <Textarea
                    value={formData.how_99tattoo_helps}
                    onChange={(e) => handleChange('how_99tattoo_helps', e.target.value)}
                    placeholder="Nossa consultoria especializada, Estúdio certificado, Artistas renomados..."
                    className="border-green-200 focus:border-green-600 focus:ring-2 focus:ring-green-200 min-h-[100px]"
                  />
                </div>
              </div>
            </div>

            {/* Valores e Expectativas */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
              <h3 className="text-purple-800 font-bold text-lg mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Valores e Expectativas
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-purple-700 font-medium">O que Valoriza na Escolha do Estúdio</Label>
                  <Textarea
                    value={formData.studio_values}
                    onChange={(e) => handleChange('studio_values', e.target.value)}
                    placeholder="Qualidade do traço, Higiene, Atendimento personalizado..."
                    className="border-purple-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 min-h-[100px]"
                  />
                </div>
                <div>
                  <Label className="text-purple-700 font-medium">O que Busca Alcançar com a Tatuagem</Label>
                  <Textarea
                    value={formData.tattoo_goals}
                    onChange={(e) => handleChange('tattoo_goals', e.target.value)}
                    placeholder="Autoexpressão, Sentimento de pertencimento, Beleza, Confiança..."
                    className="border-purple-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 min-h-[100px]"
                  />
                </div>
                <div>
                  <Label className="text-purple-700 font-medium">Experiência Esperada na Pesquisa</Label>
                  <Textarea
                    value={formData.expected_experience}
                    onChange={(e) => handleChange('expected_experience', e.target.value)}
                    placeholder="Ver muitos portfólios, Conteúdo inspirador, Dicas de cuidados..."
                    className="border-purple-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 min-h-[100px]"
                  />
                </div>
              </div>
            </div>

            {/* Objeções e Influências */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
              <h3 className="text-orange-800 font-bold text-lg mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Objeções e Influências
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-orange-700 font-medium">Objeções Mais Comuns à 99Tattoo</Label>
                  <Textarea
                    value={formData.common_objections}
                    onChange={(e) => handleChange('common_objections', e.target.value)}
                    placeholder="Preço alto, Distância, Não conheço artista específico..."
                    className="border-orange-200 focus:border-orange-600 focus:ring-2 focus:ring-orange-200 min-h-[100px]"
                  />
                </div>
                <div>
                  <Label className="text-orange-700 font-medium">Fontes de Informação e Inspiração</Label>
                  <Textarea
                    value={formData.information_sources}
                    onChange={(e) => handleChange('information_sources', e.target.value)}
                    placeholder="Amigos tatuados, Redes sociais de artistas, Blogs de tatuagem..."
                    className="border-orange-200 focus:border-orange-600 focus:ring-2 focus:ring-orange-200 min-h-[100px]"
                  />
                </div>
                <div>
                  <Label className="text-orange-700 font-medium">O que Tornaria a 99Tattoo Desnecessária</Label>
                  <Textarea
                    value={formData.what_makes_unnecessary}
                    onChange={(e) => handleChange('what_makes_unnecessary', e.target.value)}
                    placeholder="Amigo que se torna tatuador, Decidir não fazer tatuagem..."
                    className="border-orange-200 focus:border-orange-600 focus:ring-2 focus:ring-orange-200 min-h-[100px]"
                  />
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end gap-4 pt-6 border-t border-red-200">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white shadow-lg"
              >
                <Save className="h-4 w-4 mr-2" />
                {persona ? 'Atualizar' : 'Criar'} Persona
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonaForm;
