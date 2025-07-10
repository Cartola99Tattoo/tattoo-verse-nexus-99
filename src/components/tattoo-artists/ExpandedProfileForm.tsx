import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { User, Briefcase, Heart, Plus, X } from 'lucide-react';
import ProfileFormSection from './ProfileFormSection';

interface ExpandedProfileFormProps {
  profile: any;
  onUpdateProfile: (field: string, value: any) => void;
  sectionProgress: {
    basic: number;
    professional: number;
    engagement: number;
  };
}

const ExpandedProfileForm: React.FC<ExpandedProfileFormProps> = ({
  profile,
  onUpdateProfile,
  sectionProgress
}) => {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    professional: false,
    engagement: false
  });

  const [newCertification, setNewCertification] = useState('');
  const [newInterest, setNewInterest] = useState('');

  const studioTypes = [
    "Estúdio Próprio",
    "Estúdio Compartilhado", 
    "Atende em Casa",
    "Estúdio Terceirizado",
    "Outro"
  ];

  const detailedStyleOptions = [
    "Realismo Preto e Cinza",
    "Realismo Colorido",
    "Neo Tradicional",
    "Oriental",
    "Geométrico",
    "Fineline",
    "Pontilhismo",
    "Aquarela",
    "Old School",
    "New School",
    "Lettering",
    "Tribal",
    "Blackwork",
    "Minimalista",
    "Outro"
  ];

  const communityInterestOptions = [
    "Troca de Experiências",
    "Parcerias",
    "Mentoria",
    "Eventos",
    "Novas Técnicas",
    "Networking",
    "Workshops",
    "Colaborações Artísticas"
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleStyleChange = (style: string, checked: boolean) => {
    const currentStyles = profile.detailedStyles || [];
    const updatedStyles = checked 
      ? [...currentStyles, style]
      : currentStyles.filter((s: string) => s !== style);
    onUpdateProfile('detailedStyles', updatedStyles);
  };

  const handleInterestChange = (interest: string, checked: boolean) => {
    const currentInterests = profile.communityInterests || [];
    const updatedInterests = checked 
      ? [...currentInterests, interest]
      : currentInterests.filter((i: string) => i !== interest);
    onUpdateProfile('communityInterests', updatedInterests);
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      const currentCerts = profile.certifications || [];
      onUpdateProfile('certifications', [...currentCerts, newCertification.trim()]);
      setNewCertification('');
    }
  };

  const removeCertification = (cert: string) => {
    const currentCerts = profile.certifications || [];
    onUpdateProfile('certifications', currentCerts.filter((c: string) => c !== cert));
  };

  return (
    <div className="space-y-6">
      {/* Seção Básica */}
      <ProfileFormSection
        title="Informações Básicas"
        icon={User}
        progress={sectionProgress.basic}
        isExpanded={expandedSections.basic}
        onToggle={() => toggleSection('basic')}
        description="Informações essenciais do seu perfil"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => onUpdateProfile('name', e.target.value)}
              className="rounded-lg"
            />
          </div>
          <div>
            <Label htmlFor="artistName">Nome Artístico</Label>
            <Input
              id="artistName"
              value={profile.artistName}
              onChange={(e) => onUpdateProfile('artistName', e.target.value)}
              className="rounded-lg"
            />
          </div>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              value={profile.email}
              disabled
              className="rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) => onUpdateProfile('phone', e.target.value)}
              className="rounded-lg"
            />
          </div>
          <div>
            <Label htmlFor="location">Cidade/Estado</Label>
            <Input
              id="location"
              value={profile.location}
              onChange={(e) => onUpdateProfile('location', e.target.value)}
              className="rounded-lg"
            />
          </div>
          <div>
            <Label htmlFor="portfolio">Link do Portfólio</Label>
            <Input
              id="portfolio"
              value={profile.portfolio}
              onChange={(e) => onUpdateProfile('portfolio', e.target.value)}
              className="rounded-lg"
            />
          </div>
        </div>
      </ProfileFormSection>

      {/* Seção Profissional */}
      <ProfileFormSection
        title="Experiência Profissional"
        icon={Briefcase}
        progress={sectionProgress.professional}
        isExpanded={expandedSections.professional}
        onToggle={() => toggleSection('professional')}
        description="Detalhes sobre sua carreira e especialização"
      >
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="experience">Anos de Experiência</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                max="50"
                value={profile.experience || ''}
                onChange={(e) => onUpdateProfile('experience', parseInt(e.target.value) || 0)}
                className="rounded-lg"
                placeholder="Ex: 5"
              />
            </div>
            <div>
              <Label htmlFor="studioType">Tipo de Estúdio</Label>
              <Select 
                value={profile.studioType || ''} 
                onValueChange={(value) => onUpdateProfile('studioType', value)}
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {studioTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="mainEquipment">Equipamento Principal</Label>
            <Input
              id="mainEquipment"
              value={profile.mainEquipment || ''}
              onChange={(e) => onUpdateProfile('mainEquipment', e.target.value)}
              className="rounded-lg"
              placeholder="Ex: Máquina rotativa, Máquina de bobina"
            />
          </div>

          {/* Estilos Detalhados */}
          <div>
            <Label>Estilos Especializados</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {detailedStyleOptions.map(style => (
                <div key={style} className="flex items-center space-x-2">
                  <Checkbox 
                    id={style}
                    checked={profile.detailedStyles?.includes(style) || false}
                    onCheckedChange={(checked) => handleStyleChange(style, !!checked)}
                  />
                  <Label htmlFor={style} className="text-sm">{style}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Certificações */}
          <div>
            <Label>Licenças e Certificações</Label>
            <div className="space-y-3 mt-2">
              <div className="flex gap-2">
                <Input
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  placeholder="Ex: Biossegurança, Primeiros Socorros"
                  className="rounded-lg"
                />
                <Button
                  type="button"
                  onClick={addCertification}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(profile.certifications || []).map((cert: string, index: number) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="bg-red-100 text-red-800 pr-1"
                  >
                    {cert}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 ml-1 hover:bg-red-200"
                      onClick={() => removeCertification(cert)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ProfileFormSection>

      {/* Seção de Engajamento */}
      <ProfileFormSection
        title="Engajamento na Comunidade"
        icon={Heart}
        progress={sectionProgress.engagement}
        isExpanded={expandedSections.engagement}
        onToggle={() => toggleSection('engagement')}
        description="Suas preferências de interação na comunidade 99Tattoo"
      >
        <div className="space-y-6">
          {/* Biografia */}
          <div>
            <Label htmlFor="artistBio">Biografia / Declaração do Artista</Label>
            <Textarea
              id="artistBio"
              value={profile.artistBio || ''}
              onChange={(e) => onUpdateProfile('artistBio', e.target.value)}
              placeholder="Conte sua história, inspirações e filosofia como tatuador..."
              className="rounded-lg"
              rows={4}
              maxLength={500}
            />
            <p className="text-sm text-gray-500 mt-1">
              {(profile.artistBio || '').length}/500 caracteres
            </p>
          </div>

          {/* Disponibilidade para Colaborações */}
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="collaboration"
                  checked={profile.collaborationAvailable || false}
                  onCheckedChange={(checked) => onUpdateProfile('collaborationAvailable', !!checked)}
                />
                <div>
                  <Label htmlFor="collaboration" className="text-red-700 font-medium">
                    Disponível para Colaborações
                  </Label>
                  <p className="text-sm text-red-600">
                    Marque se você está interessado em parcerias e projetos colaborativos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interesses na Comunidade */}
          <div>
            <Label>Interesses na Comunidade</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {communityInterestOptions.map(interest => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox 
                    id={interest}
                    checked={profile.communityInterests?.includes(interest) || false}
                    onCheckedChange={(checked) => handleInterestChange(interest, !!checked)}
                  />
                  <Label htmlFor={interest} className="text-sm">{interest}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ProfileFormSection>
    </div>
  );
};

export default ExpandedProfileForm;
