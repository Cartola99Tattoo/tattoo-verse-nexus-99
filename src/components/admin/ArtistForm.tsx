
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Plus, User, Palette, Image, Calendar, Settings, Instagram, Facebook, Phone, Mail, DollarSign, FileText, MapPin } from "lucide-react";
import { Artist, ArtistPricing, WeeklySchedule, UnavailablePeriod } from "@/services/interfaces/IArtistsService";
import { toast } from "@/hooks/use-toast";
import ArtistPortfolioManager from "./ArtistPortfolioManager";
import ArtistPricingManager from "./ArtistPricingManager";
import ArtistScheduleManager from "./ArtistScheduleManager";
import ImageUploadField from "./ImageUploadField";
import ArtistDocumentsManager from "./ArtistDocumentsManager";
import LocationManager from "./LocationManager";

const artistSchema = z.object({
  first_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  last_name: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  bio: z.string().min(50, "Biografia deve ter pelo menos 50 caracteres"),
  avatar_url: z.string().url("URL da foto inválida").optional().or(z.literal("")),
  style: z.string().min(1, "Estilo é obrigatório"),
  specialties: z.array(z.string()).min(1, "Pelo menos uma especialidade é obrigatória"),
  locations: z.array(z.string()).optional(),
  contact: z.object({
    phone: z.string().optional(),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    tiktok: z.string().optional(),
  }),
  commission_percentage: z.number().min(0).max(100),
  availability_description: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  internal_notes: z.string().optional(),
});

type ArtistFormData = z.infer<typeof artistSchema>;

interface ArtistFormProps {
  artist?: Artist;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const commonStyles = [
  "Realismo", "Old School", "New School", "Aquarela", "Geométrico", 
  "Minimalista", "Blackwork", "Dotwork", "Ornamental", "Oriental", "Fineline"
];

const commonSpecialties = [
  "Retratos", "Animais", "Flores", "Tribais", "Lettering", 
  "Mandalas", "Geométricas", "Religiosas", "Personagens", "Abstratas", "Covers"
];

const ArtistForm = ({ artist, onSubmit, onCancel, isLoading = false }: ArtistFormProps) => {
  const [newSpecialty, setNewSpecialty] = useState("");
  const [portfolioItems, setPortfolioItems] = useState(artist?.portfolio || []);
  const [pricing, setPricing] = useState<ArtistPricing | undefined>(artist?.pricing);
  const [schedule, setSchedule] = useState<WeeklySchedule | undefined>(artist?.work_schedule);
  const [unavailablePeriods, setUnavailablePeriods] = useState<UnavailablePeriod[]>(artist?.unavailable_periods || []);
  const [documents, setDocuments] = useState<any[]>((artist as any)?.documents || []);

  const form = useForm<ArtistFormData>({
    resolver: zodResolver(artistSchema),
    defaultValues: {
      first_name: artist?.first_name || "",
      last_name: artist?.last_name || "",
      email: artist?.email || "",
      phone: artist?.phone || "",
      bio: artist?.bio || "",
      avatar_url: artist?.avatar_url || "",
      style: artist?.style || "",
      specialties: artist?.specialties || [],
      locations: (artist as any)?.locations || [],
      contact: {
        phone: artist?.contact?.phone || "",
        email: artist?.contact?.email || "",
        instagram: artist?.contact?.instagram || "",
        facebook: artist?.contact?.facebook || "",
        tiktok: artist?.contact?.tiktok || "",
      },
      commission_percentage: artist?.commission_percentage || 50,
      availability_description: artist?.availability_description || "",
      status: artist?.status || "active",
      internal_notes: artist?.internal_notes || "",
    },
  });

  const handleSubmit = async (data: ArtistFormData) => {
    try {
      const completeData = {
        ...data,
        portfolio: portfolioItems,
        pricing,
        work_schedule: schedule,
        unavailable_periods: unavailablePeriods,
        documents,
      };
      
      await onSubmit(completeData);
      toast({
        title: "Sucesso",
        description: artist ? "Tatuador atualizado com sucesso!" : "Tatuador criado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar tatuador. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const addSpecialty = (specialty: string) => {
    const currentSpecialties = form.getValues("specialties");
    if (!currentSpecialties.includes(specialty)) {
      form.setValue("specialties", [...currentSpecialties, specialty]);
    }
  };

  const removeSpecialty = (specialty: string) => {
    const currentSpecialties = form.getValues("specialties");
    form.setValue("specialties", currentSpecialties.filter(s => s !== specialty));
  };

  const addNewSpecialty = () => {
    if (newSpecialty.trim()) {
      addSpecialty(newSpecialty.trim());
      setNewSpecialty("");
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-red-50 rounded-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-gradient-to-r from-red-100 to-red-200 rounded-xl p-1">
              <TabsTrigger value="basic" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-red-700 data-[state=active]:shadow-lg data-[state=active]:font-bold transition-all duration-300">
                <User className="h-4 w-4" />
                Dados Básicos
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-red-700 data-[state=active]:shadow-lg data-[state=active]:font-bold transition-all duration-300">
                <Image className="h-4 w-4" />
                Portfólio
              </TabsTrigger>
              <TabsTrigger value="pricing" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-red-700 data-[state=active]:shadow-lg data-[state=active]:font-bold transition-all duration-300">
                <DollarSign className="h-4 w-4" />
                Preços
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-red-700 data-[state=active]:shadow-lg data-[state=active]:font-bold transition-all duration-300">
                <Calendar className="h-4 w-4" />
                Horários
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-red-700 data-[state=active]:shadow-lg data-[state=active]:font-bold transition-all duration-300">
                <FileText className="h-4 w-4" />
                Documentos
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-red-700 data-[state=active]:shadow-lg data-[state=active]:font-bold transition-all duration-300">
                <Settings className="h-4 w-4" />
                Configurações
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-8 mt-8">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Dados Pessoais */}
                <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-xl font-black">
                      <User className="h-5 w-5" />
                      Dados Pessoais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-800 font-bold">Nome</FormLabel>
                            <FormControl>
                              <Input {...field} className="border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-800 font-bold">Sobrenome</FormLabel>
                            <FormControl>
                              <Input {...field} className="border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-800 font-bold flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input type="email" {...field} className="border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-800 font-bold flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Telefone
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <ImageUploadField
                      control={form.control}
                      name="avatar_url"
                      label="Foto de Perfil"
                      description="Cole o link da imagem ou escolha um arquivo do seu computador"
                      currentImage={artist?.avatar_url}
                    />

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-800 font-bold">Biografia Detalhada</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Conte a história do tatuador, sua trajetória artística, inspirações, técnicas preferidas..."
                              className="min-h-[120px] border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription className="text-blue-600">
                            Uma biografia rica ajuda os clientes a conhecer melhor o artista
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Informações Profissionais */}
                <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2 text-xl font-black">
                      <Palette className="h-5 w-5" />
                      Informações Profissionais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <FormField
                      control={form.control}
                      name="style"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-red-800 font-bold">Estilo Principal</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200">
                                <SelectValue placeholder="Selecione um estilo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border-red-200 shadow-xl">
                              {commonStyles.map((style) => (
                                <SelectItem key={style} value={style}>
                                  {style}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="specialties"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-red-800 font-bold">Especialidades</FormLabel>
                          <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                              {field.value.map((specialty) => (
                                <Badge key={specialty} className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-lg flex items-center gap-1">
                                  {specialty}
                                  <X 
                                    className="h-3 w-3 cursor-pointer hover:bg-red-700 rounded-full" 
                                    onClick={() => removeSpecialty(specialty)}
                                  />
                                </Badge>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {commonSpecialties
                                .filter(spec => !field.value.includes(spec))
                                .map((specialty) => (
                                  <Button
                                    key={specialty}
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addSpecialty(specialty)}
                                    className="border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 transition-all duration-200"
                                  >
                                    + {specialty}
                                  </Button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Nova especialidade..."
                                value={newSpecialty}
                                onChange={(e) => setNewSpecialty(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addNewSpecialty())}
                                className="border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                              />
                              <Button type="button" onClick={addNewSpecialty} className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="commission_percentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-red-800 font-bold">Comissão (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              max="100" 
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className="border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                            />
                          </FormControl>
                          <FormDescription className="text-red-600">
                            Percentual de comissão sobre o valor das tatuagens
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="availability_description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-red-800 font-bold">Disponibilidade</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Ex: Atende de Terça a Sábado, das 9h às 18h. Especialista em sessões longas..."
                              {...field} 
                              className="border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-red-800 font-bold">Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border-red-200 shadow-xl">
                              <SelectItem value="active">Ativo</SelectItem>
                              <SelectItem value="inactive">Inativo</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Localização */}
              <LocationManager
                control={form.control}
                name="locations"
                currentLocations={form.getValues("locations")}
              />

              {/* Redes Sociais */}
              <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-xl font-black">
                    <Instagram className="h-5 w-5" />
                    Redes Sociais e Contato
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="contact.instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-800 font-bold flex items-center gap-2">
                            <Instagram className="h-4 w-4" />
                            Instagram
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="@username" {...field} className="border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contact.facebook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-800 font-bold flex items-center gap-2">
                            <Facebook className="h-4 w-4" />
                            Facebook
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="facebook.com/username" {...field} className="border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contact.tiktok"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-800 font-bold">TikTok</FormLabel>
                          <FormControl>
                            <Input placeholder="@username" {...field} className="border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio">
              <ArtistPortfolioManager
                portfolioItems={portfolioItems}
                onItemsChange={setPortfolioItems}
                maxItems={12}
              />
            </TabsContent>

            <TabsContent value="pricing">
              <ArtistPricingManager
                pricing={pricing}
                onPricingChange={setPricing}
              />
            </TabsContent>

            <TabsContent value="schedule">
              <ArtistScheduleManager
                schedule={schedule}
                unavailablePeriods={unavailablePeriods}
                onScheduleChange={setSchedule}
                onUnavailablePeriodsChange={setUnavailablePeriods}
              />
            </TabsContent>

            <TabsContent value="documents">
              <ArtistDocumentsManager
                documents={documents}
                onDocumentsChange={setDocuments}
              />
            </TabsContent>

            <TabsContent value="settings">
              <Card className="bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-xl font-black">
                    <Settings className="h-5 w-5" />
                    Configurações Avançadas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <FormField
                    control={form.control}
                    name="internal_notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-800 font-bold">Notas Internas</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Observações internas sobre o tatuador: performance, feedback de clientes, histórico, pontos de atenção..."
                            className="min-h-[150px] border-gray-200 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-gray-600">
                          Essas notas são visíveis apenas para administradores e podem conter informações sobre performance, histórico, feedbacks internos, etc.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-red-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 font-medium"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? "Salvando..." : artist ? "Atualizar Tatuador" : "Criar Tatuador"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ArtistForm;
