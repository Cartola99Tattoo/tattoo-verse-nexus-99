import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Minus, Save, X, Camera, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ArtistPortfolioManager from "./ArtistPortfolioManager";
import ArtistPricingManager from "./ArtistPricingManager";
import ArtistScheduleManager from "./ArtistScheduleManager";
import ArtistDocumentsManager from "./ArtistDocumentsManager";
import ArtistPermissionsManager from "./ArtistPermissionsManager";
import LocationManager from "./LocationManager";
import ImageUploadField from "./ImageUploadField";
import { 
  Artist, 
  PortfolioItem, 
  ArtistPricing, 
  WeeklySchedule, 
  UnavailablePeriod 
} from "@/services/interfaces/IArtistsService";

interface ArtistFormProps {
  artist?: Artist;
  onSave: (artistData: Partial<Artist>) => Promise<void>;
  onCancel: () => void;
}

const ArtistForm = ({ artist, onSave, onCancel }: ArtistFormProps) => {
  const [formData, setFormData] = useState<Partial<Artist>>({
    first_name: artist?.first_name || "",
    last_name: artist?.last_name || "",
    email: artist?.email || "",
    phone: artist?.phone || "",
    bio: artist?.bio || "",
    avatar_url: artist?.avatar_url || "",
    specialties: artist?.specialties || [],
    style: artist?.style || "",
    contact: artist?.contact || {
      phone: "",
      email: "",
      instagram: "",
      facebook: "",
      tiktok: "",
    },
    status: artist?.status || "active",
    commission_percentage: artist?.commission_percentage || 0,
    availability_description: artist?.availability_description || "",
    internal_notes: artist?.internal_notes || "",
    pricing: artist?.pricing || {
      base_price_per_hour: 0,
      minimum_session_price: 0,
      hourly_rate: 0,
      pricing_items: [],
      additional_costs: {
        consultation: 0,
        design: 0,
        touch_up: 0,
      },
      payment_methods: [],
      pricing_notes: "",
      services: [],
    },
    work_schedule: artist?.work_schedule || {},
    unavailable_periods: artist?.unavailable_periods || [],
    documents: artist?.documents || [],
    permissions: artist?.permissions || {},
  });

  const [locations, setLocations] = useState<string[]>(artist?.locations || []);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(artist?.portfolio || []);
  const [activeTab, setActiveTab] = useState("basic");
  const [newSpecialty, setNewSpecialty] = useState("");

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }));
  };

  const addSpecialty = () => {
    if (newSpecialty.trim()) {
      handleInputChange("specialties", [...(formData.specialties || []), newSpecialty.trim()]);
      setNewSpecialty("");
    }
  };

  const removeSpecialty = (index: number) => {
    const updatedSpecialties = formData.specialties?.filter((_, i) => i !== index) || [];
    handleInputChange("specialties", updatedSpecialties);
  };

  const handleSubmit = async () => {
    try {
      const artistData = {
        ...formData,
        portfolio,
        locations,
      };
      await onSave(artistData);
      toast({
        title: "Sucesso",
        description: artist ? "Tatuador atualizado com sucesso!" : "Tatuador criado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar tatuador",
        variant: "destructive"
      });
    }
  };

  const handlePortfolioUpdate = (items: PortfolioItem[]) => {
    setPortfolio(items);
  };

  const handlePricingUpdate = (pricing: ArtistPricing) => {
    handleInputChange("pricing", pricing);
  };

  const handleScheduleUpdate = (schedule: WeeklySchedule) => {
    handleInputChange("work_schedule", schedule);
  };

  const handleUnavailablePeriodsUpdate = (periods: UnavailablePeriod[]) => {
    handleInputChange("unavailable_periods", periods);
  };

  const handleDocumentsUpdate = (documents: any[]) => {
    handleInputChange("documents", documents);
  };

  const handlePermissionsUpdate = (permissions: any) => {
    handleInputChange("permissions", permissions);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tattoo-title-gradient">
          {artist ? "Editar Tatuador" : "Novo Tatuador"}
        </h1>
        <div className="flex gap-2">
          <Button onClick={onCancel} variant="outline" className="tattoo-button-secondary">
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="tattoo" className="tattoo-button-primary">
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
          <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
          <TabsTrigger value="pricing">Preços</TabsTrigger>
          <TabsTrigger value="schedule">Horários</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card variant="tattooRed" className="tattoo-card-enhanced">
            <CardHeader variant="red">
              <CardTitle className="tattoo-title-red">Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload de Foto */}
              <div className="space-y-2">
                <Label>Foto de Perfil</Label>
                <ImageUploadField
                  currentImage={formData.avatar_url}
                  onImageSelect={(url) => handleInputChange("avatar_url", url)}
                  variant="avatar"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Nome *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange("first_name", e.target.value)}
                    className="tattoo-input-enhanced"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Sobrenome *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange("last_name", e.target.value)}
                    className="tattoo-input-enhanced"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="tattoo-input-enhanced"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="tattoo-input-enhanced"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="tattoo-input-enhanced"
                  rows={4}
                  placeholder="Conte um pouco sobre o tatuador..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Especialidades e Estilo */}
          <Card variant="tattooRed" className="tattoo-card-enhanced">
            <CardHeader variant="red">
              <CardTitle className="tattoo-title-red">Especialidades e Estilo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="style">Estilo Principal</Label>
                <Input
                  id="style"
                  value={formData.style}
                  onChange={(e) => handleInputChange("style", e.target.value)}
                  className="tattoo-input-enhanced"
                  placeholder="Ex: Realismo, Blackwork, Aquarela..."
                />
              </div>

              <div className="space-y-2">
                <Label>Especialidades</Label>
                <div className="flex gap-2">
                  <Input
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    className="tattoo-input-enhanced"
                    placeholder="Nova especialidade"
                    onKeyPress={(e) => e.key === 'Enter' && addSpecialty()}
                  />
                  <Button 
                    onClick={addSpecialty} 
                    variant="tattoo"
                    className="tattoo-button-primary"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.specialties?.map((specialty, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-gradient-to-r from-red-100 to-red-200 text-red-800 hover:from-red-200 hover:to-red-300"
                    >
                      {specialty}
                      <button
                        onClick={() => removeSpecialty(index)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Local de Atendimento */}
          <Card variant="tattooRed" className="tattoo-card-enhanced">
            <CardHeader variant="red">
              <CardTitle className="tattoo-title-red flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Local de Atendimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LocationManager
                currentLocations={locations}
                onUpdate={setLocations}
              />
            </CardContent>
          </Card>

          {/* Informações de Contato */}
          <Card variant="tattooRed" className="tattoo-card-enhanced">
            <CardHeader variant="red">
              <CardTitle className="tattoo-title-red">Redes Sociais e Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Telefone de Contato</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact?.phone || ""}
                    onChange={(e) => handleContactChange("phone", e.target.value)}
                    className="tattoo-input-enhanced"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Email de Contato</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact?.email || ""}
                    onChange={(e) => handleContactChange("email", e.target.value)}
                    className="tattoo-input-enhanced"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.contact?.instagram || ""}
                    onChange={(e) => handleContactChange("instagram", e.target.value)}
                    className="tattoo-input-enhanced"
                    placeholder="@username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={formData.contact?.facebook || ""}
                    onChange={(e) => handleContactChange("facebook", e.target.value)}
                    className="tattoo-input-enhanced"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiktok">TikTok</Label>
                  <Input
                    id="tiktok"
                    value={formData.contact?.tiktok || ""}
                    onChange={(e) => handleContactChange("tiktok", e.target.value)}
                    className="tattoo-input-enhanced"
                    placeholder="@username"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações Administrativas */}
          <Card variant="tattooRed" className="tattoo-card-enhanced">
            <CardHeader variant="red">
              <CardTitle className="tattoo-title-red">Informações Administrativas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    className="w-full p-2 border border-red-200 rounded-md tattoo-input-enhanced"
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commission">Percentual de Comissão (%)</Label>
                  <Input
                    id="commission"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.commission_percentage}
                    onChange={(e) => handleInputChange("commission_percentage", parseFloat(e.target.value) || 0)}
                    className="tattoo-input-enhanced"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability">Descrição de Disponibilidade</Label>
                <Textarea
                  id="availability"
                  value={formData.availability_description}
                  onChange={(e) => handleInputChange("availability_description", e.target.value)}
                  className="tattoo-input-enhanced"
                  rows={3}
                  placeholder="Ex: Disponível de segunda a sexta, das 9h às 18h..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas Internas</Label>
                <Textarea
                  id="notes"
                  value={formData.internal_notes}
                  onChange={(e) => handleInputChange("internal_notes", e.target.value)}
                  className="tattoo-input-enhanced"
                  rows={3}
                  placeholder="Notas internas sobre o tatuador..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio">
          <ArtistPortfolioManager
            portfolioItems={portfolio}
            onItemsChange={handlePortfolioUpdate}
          />
        </TabsContent>

        <TabsContent value="pricing">
          <ArtistPricingManager
            pricing={formData.pricing}
            onPricingChange={handlePricingUpdate}
          />
        </TabsContent>

        <TabsContent value="schedule">
          <ArtistScheduleManager
            schedule={formData.work_schedule}
            unavailablePeriods={formData.unavailable_periods || []}
            onScheduleChange={handleScheduleUpdate}
            onUnavailablePeriodsChange={handleUnavailablePeriodsUpdate}
          />
        </TabsContent>

        <TabsContent value="documents">
          <ArtistDocumentsManager
            documents={formData.documents || []}
            onDocumentsChange={handleDocumentsUpdate}
          />
        </TabsContent>

        <TabsContent value="advanced">
          <div className="space-y-6">
            <ArtistPermissionsManager
              permissions={formData.permissions}
              onPermissionsChange={handlePermissionsUpdate}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArtistForm;
