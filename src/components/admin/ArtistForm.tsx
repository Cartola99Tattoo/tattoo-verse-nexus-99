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
import { X, Plus } from "lucide-react";
import { Artist, ArtistPricing, WeeklySchedule, UnavailablePeriod } from "@/services/interfaces/IArtistsService";
import { toast } from "@/hooks/use-toast";
import ArtistPortfolioManager from "./ArtistPortfolioManager";
import ArtistPricingManager from "./ArtistPricingManager";
import ArtistScheduleManager from "./ArtistScheduleManager";

const artistSchema = z.object({
  first_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  last_name: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  bio: z.string().min(50, "Biografia deve ter pelo menos 50 caracteres"),
  avatar_url: z.string().url("URL da foto inválida").optional().or(z.literal("")),
  style: z.string().min(1, "Estilo é obrigatório"),
  specialties: z.array(z.string()).min(1, "Pelo menos uma especialidade é obrigatória"),
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
  "Minimalista", "Blackwork", "Dotwork", "Ornamental", "Oriental"
];

const commonSpecialties = [
  "Retratos", "Animais", "Flores", "Tribais", "Lettering", 
  "Mandalas", "Geométricas", "Religiosas", "Personagens", "Abstratas"
];

const ArtistForm = ({ artist, onSubmit, onCancel, isLoading = false }: ArtistFormProps) => {
  const [newSpecialty, setNewSpecialty] = useState("");
  const [portfolioItems, setPortfolioItems] = useState(artist?.portfolio || []);
  const [pricing, setPricing] = useState<ArtistPricing | undefined>(artist?.pricing);
  const [schedule, setSchedule] = useState<WeeklySchedule | undefined>(artist?.work_schedule);
  const [unavailablePeriods, setUnavailablePeriods] = useState<UnavailablePeriod[]>(artist?.unavailable_periods || []);

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
            <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
            <TabsTrigger value="pricing">Preços</TabsTrigger>
            <TabsTrigger value="schedule">Horários</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dados Pessoais */}
              <Card>
                <CardHeader>
                  <CardTitle>Dados Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                          <FormLabel>Sobrenome</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
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
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="avatar_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL da Foto de Perfil</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormDescription>
                          Cole o link da imagem de perfil do tatuador
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Biografia</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Conte um pouco sobre o tatuador..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Informações Profissionais */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações Profissionais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="style"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estilo Principal</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um estilo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
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
                        <FormLabel>Especialidades</FormLabel>
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {field.value.map((specialty) => (
                              <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
                                {specialty}
                                <X 
                                  className="h-3 w-3 cursor-pointer" 
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
                            />
                            <Button type="button" onClick={addNewSpecialty}>
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
                        <FormLabel>Comissão (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="100" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
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
                        <FormLabel>Disponibilidade</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Ex: Atende de Terça a Sábado..."
                            {...field} 
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
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
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

            {/* Redes Sociais */}
            <Card>
              <CardHeader>
                <CardTitle>Redes Sociais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="contact.instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <Input placeholder="@username" {...field} />
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
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <Input placeholder="facebook.com/username" {...field} />
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
                        <FormLabel>TikTok</FormLabel>
                        <FormControl>
                          <Input placeholder="@username" {...field} />
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
              maxItems={9}
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

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Avançadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="internal_notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas Internas</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Observações internas sobre o tatuador (visível apenas para administradores)"
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
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
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : artist ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ArtistForm;
