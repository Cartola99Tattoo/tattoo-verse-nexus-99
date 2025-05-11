
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Layout from "@/components/layout/Layout";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";

// Schema para o formulário de informações pessoais
const personalInfoSchema = z.object({
  first_name: z.string().min(2, { message: "Nome precisa ter pelo menos 2 caracteres" }),
  last_name: z.string().min(2, { message: "Sobrenome precisa ter pelo menos 2 caracteres" }),
  birthdate: z.date().optional(),
  gender: z.enum(["masculino", "feminino", "outro", "prefiro_nao_informar"]).optional(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipcode: z.string().optional(),
  }).optional(),
  social_media: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    twitter: z.string().optional(),
  }).optional(),
});

// Tipos para as seções de preferências
type PreferenceSection = 
  | "styles" 
  | "details" 
  | "experience" 
  | "budget" 
  | "scheduling";

// Schema para as preferências de tatuagem
const tattooPreferencesSchema = z.object({
  // Estilos e preferências artísticas
  preferred_styles: z.array(z.string()).optional(),
  preferred_artists: z.array(z.string()).optional(),
  design_inspirations: z.array(z.string()).optional(),
  
  // Detalhes da tatuagem
  preferred_body_parts: z.array(z.string()).optional(),
  tattoo_size: z.enum(["pequena", "media", "grande", "manga", "costas_completas"]).optional(),
  color_preference: z.enum(["colorida", "preto_e_branco", "ambos"]).optional(),
  
  // Experiência e condições
  has_tattoos: z.enum(["sim", "nao"]).optional(),
  tattoo_count: z.string().optional(),
  pain_tolerance: z.number().min(1).max(10).optional(),
  skin_sensitivity: z.enum(["normal", "sensivel", "muito_sensivel"]).optional(),
  health_conditions: z.array(z.string()).optional(),
  
  // Orçamento
  budget: z.enum(["baixo", "medio", "alto"]).optional(),
  frequency: z.enum(["primeira", "raramente", "ocasionalmente", "frequentemente"]).optional(),
  
  // Preferências de agendamento
  scheduling_preferences: z.object({
    weekdays: z.boolean().optional(),
    weekends: z.boolean().optional(),
    mornings: z.boolean().optional(),
    afternoons: z.boolean().optional(),
    evenings: z.boolean().optional(),
  }).optional(),
  preferred_months: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

// Combinar todos os schemas
const profileSchema = z.object({
  personal: personalInfoSchema,
  preferences: tattooPreferencesSchema
});

const Profile = () => {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePreferenceSection, setActivePreferenceSection] = useState<PreferenceSection>("styles");

  // Extrair preferências de tatuagem do perfil
  const tattooPreferences = profile?.tattoo_preferences ? 
    (typeof profile.tattoo_preferences === 'string' ? 
      JSON.parse(profile.tattoo_preferences) : 
      profile.tattoo_preferences) : 
    {};

  // Formulário de informações pessoais
  const personalInfoForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      birthdate: undefined,
      gender: undefined,
      phone: profile?.phone || "",
      address: {
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zipcode: "",
      },
      social_media: {
        instagram: "",
        facebook: "",
        twitter: "",
      },
    },
  });

  // Formulário de preferências
  const preferencesForm = useForm<z.infer<typeof tattooPreferencesSchema>>({
    resolver: zodResolver(tattooPreferencesSchema),
    defaultValues: {
      // Estilos e preferências artísticas
      preferred_styles: tattooPreferences.preferred_styles || [],
      preferred_artists: tattooPreferences.preferred_artists || [],
      design_inspirations: tattooPreferences.design_inspirations || [],
      
      // Detalhes da tatuagem
      preferred_body_parts: tattooPreferences.preferred_body_parts || [],
      tattoo_size: tattooPreferences.tattoo_size || undefined,
      color_preference: tattooPreferences.color_preference || undefined,
      
      // Experiência e condições
      has_tattoos: tattooPreferences.has_tattoos || undefined,
      tattoo_count: tattooPreferences.tattoo_count || "",
      pain_tolerance: tattooPreferences.pain_tolerance || 5,
      skin_sensitivity: tattooPreferences.skin_sensitivity || undefined,
      health_conditions: tattooPreferences.health_conditions || [],
      
      // Orçamento
      budget: tattooPreferences.budget || undefined,
      frequency: tattooPreferences.frequency || undefined,
      
      // Preferências de agendamento
      scheduling_preferences: tattooPreferences.scheduling_preferences || {
        weekdays: false,
        weekends: false,
        mornings: false,
        afternoons: false,
        evenings: false,
      },
      preferred_months: tattooPreferences.preferred_months || [],
      notes: tattooPreferences.notes || "",
    }
  });

  // Função para salvar uma seção específica das preferências
  const savePreferenceSection = async (section: PreferenceSection) => {
    setIsSubmitting(true);

    try {
      // Obter valores atuais do formulário
      const formValues = preferencesForm.getValues();
      
      // Salvar apenas a seção solicitada
      let sectionData = {};
      
      switch(section) {
        case "styles":
          sectionData = {
            preferred_styles: formValues.preferred_styles,
            preferred_artists: formValues.preferred_artists,
            design_inspirations: formValues.design_inspirations
          };
          break;
        case "details":
          sectionData = {
            preferred_body_parts: formValues.preferred_body_parts,
            tattoo_size: formValues.tattoo_size,
            color_preference: formValues.color_preference
          };
          break;
        case "experience":
          sectionData = {
            has_tattoos: formValues.has_tattoos,
            tattoo_count: formValues.tattoo_count,
            pain_tolerance: formValues.pain_tolerance,
            skin_sensitivity: formValues.skin_sensitivity,
            health_conditions: formValues.health_conditions
          };
          break;
        case "budget":
          sectionData = {
            budget: formValues.budget,
            frequency: formValues.frequency
          };
          break;
        case "scheduling":
          sectionData = {
            scheduling_preferences: formValues.scheduling_preferences,
            preferred_months: formValues.preferred_months,
            notes: formValues.notes
          };
          break;
      }
      
      // Mesclar com as preferências existentes
      const updatedPreferences = {
        ...tattooPreferences,
        ...sectionData
      };
      
      // Salvar no perfil
      await updateProfile({
        tattoo_preferences: updatedPreferences
      });
      
      toast({
        title: "Preferências atualizadas",
        description: "Suas preferências foram salvas com sucesso.",
      });
      
    } catch (error) {
      console.error("Erro ao salvar preferências:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar suas preferências. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submissão do formulário de informações pessoais
  const onSubmitPersonalInfo = async (data: z.infer<typeof personalInfoSchema>) => {
    setIsSubmitting(true);

    try {
      await updateProfile({
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone || null,
        // Aqui você também enviaria os outros dados para salvar no perfil do usuário
      });

      toast({
        title: "Perfil atualizado",
        description: "Suas informações pessoais foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar suas informações. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para atualizar automaticamente um checkbox
  const handleCheckboxChange = async (field: string, value: string, checked: boolean) => {
    // Obter o valor atual do campo
    const currentValues = preferencesForm.getValues(field as any) || [];
    
    // Atualizar o valor do campo
    let newValues;
    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter((v: string) => v !== value);
    }
    
    // Atualizar o formulário
    preferencesForm.setValue(field as any, newValues, { shouldValidate: true, shouldDirty: true });
    
    // Determinar qual seção está sendo atualizada
    let section: PreferenceSection = "styles";
    if (field === "preferred_styles" || field === "preferred_artists" || field === "design_inspirations") {
      section = "styles";
    } else if (field === "preferred_body_parts") {
      section = "details";
    } else if (field === "health_conditions") {
      section = "experience";
    } else if (field.includes("scheduling_preferences")) {
      section = "scheduling";
    } else if (field === "preferred_months") {
      section = "scheduling";
    }
    
    // Salvar a seção automaticamente
    await savePreferenceSection(section);
  };

  // Função para atualizar automaticamente ao selecionar um item do radio group
  const handleRadioChange = async (field: string, value: any) => {
    preferencesForm.setValue(field as any, value, { shouldValidate: true });
    
    // Determinar qual seção está sendo atualizada
    let section: PreferenceSection = "styles";
    if (field === "tattoo_size" || field === "color_preference") {
      section = "details";
    } else if (field === "has_tattoos" || field === "skin_sensitivity") {
      section = "experience";
    } else if (field === "budget" || field === "frequency") {
      section = "budget";
    }
    
    // Salvar a seção automaticamente
    await savePreferenceSection(section);
  };

  // Função para atualizar automaticamente ao alterar valor do slider
  const handleSliderChange = async (value: number[]) => {
    preferencesForm.setValue("pain_tolerance", value[0], { shouldValidate: true });
    
    // Salvar a seção automaticamente
    await savePreferenceSection("experience");
  };

  // Função para obter as iniciais para o Avatar fallback
  const getInitials = () => {
    if (!profile) return "U";
    
    const first = profile.first_name?.charAt(0) || "";
    const last = profile.last_name?.charAt(0) || "";
    
    return (first + last).toUpperCase();
  };

  const tattooStyles = [
    { value: "old_school", label: "Old School" },
    { value: "new_school", label: "New School" },
    { value: "realismo", label: "Realismo" },
    { value: "tribal", label: "Tribal" },
    { value: "blackwork", label: "Blackwork" },
    { value: "geometrico", label: "Geométrico" },
    { value: "aquarela", label: "Aquarela" },
    { value: "minimalista", label: "Minimalista" },
    { value: "japones", label: "Japonês/Oriental" },
  ];

  const bodyParts = [
    { value: "braco", label: "Braço" },
    { value: "antebraco", label: "Antebraço" },
    { value: "ombro", label: "Ombro" },
    { value: "peito", label: "Peito" },
    { value: "costas", label: "Costas" },
    { value: "perna", label: "Perna" },
    { value: "coxa", label: "Coxa" },
    { value: "tornozelo", label: "Tornozelo" },
    { value: "pulso", label: "Pulso" },
    { value: "pescoco", label: "Pescoço" },
    { value: "costela", label: "Costela" },
  ];

  const healthConditions = [
    { value: "diabetes", label: "Diabetes" },
    { value: "pressao_alta", label: "Pressão Alta" },
    { value: "alergia_tintas", label: "Alergia a Tintas" },
    { value: "problemas_pele", label: "Problemas de Pele" },
    { value: "cicatrizacao_lenta", label: "Cicatrização Lenta" },
    { value: "nenhum", label: "Nenhum dos Acima" },
  ];

  const designInspirations = [
    { value: "natureza", label: "Natureza" },
    { value: "animais", label: "Animais" },
    { value: "simbolos", label: "Símbolos" },
    { value: "tribais", label: "Tribais" },
    { value: "retratos", label: "Retratos" },
    { value: "lettering", label: "Lettering" },
    { value: "geometrica", label: "Geométrica" },
    { value: "minimalista", label: "Minimalista" },
  ];

  const months = [
    { value: "janeiro", label: "Janeiro" },
    { value: "fevereiro", label: "Fevereiro" },
    { value: "marco", label: "Março" },
    { value: "abril", label: "Abril" },
    { value: "maio", label: "Maio" },
    { value: "junho", label: "Junho" },
    { value: "julho", label: "Julho" },
    { value: "agosto", label: "Agosto" },
    { value: "setembro", label: "Setembro" },
    { value: "outubro", label: "Outubro" },
    { value: "novembro", label: "Novembro" },
    { value: "dezembro", label: "Dezembro" },
  ];

  return (
    <Layout>
      <Helmet>
        <title>Meu Perfil | 99Tattoo</title>
      </Helmet>
      <div className="container max-w-4xl py-10 animate-fade-in">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Avatar className="h-20 w-20 border-2 border-red-500">
              <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.first_name || ""} />
              <AvatarFallback className="bg-gradient-to-r from-red-600 to-red-400 text-white text-2xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-heading font-bold">Meu Perfil</h1>
              <p className="text-gray-600">Personalize sua experiência no 99Tattoo</p>
              {profile?.email && <p className="text-gray-500 text-sm">{profile.email}</p>}
            </div>
          </div>
          <Button className="bg-red-gradient hover:opacity-90 hover-lift">
            Alterar Foto
          </Button>
        </div>

        <Card className="shadow-lg border-t-4 border-t-primary-500">
          <CardHeader className="bg-gray-50">
            <CardTitle>Complete seu perfil</CardTitle>
            <CardDescription>
              Quanto mais informações você fornecer, melhor poderemos personalizar suas experiências e recomendações.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger 
                  value="personal" 
                  className="data-[state=active]:bg-red-gradient data-[state=active]:text-white"
                >
                  Informações Pessoais
                </TabsTrigger>
                <TabsTrigger 
                  value="preferences"
                  className="data-[state=active]:bg-red-gradient data-[state=active]:text-white"
                >
                  Preferências de Tatuagem
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="animate-slide-in">
                <Form {...personalInfoForm}>
                  <form onSubmit={personalInfoForm.handleSubmit(onSubmitPersonalInfo)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={personalInfoForm.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu nome" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={personalInfoForm.control}
                        name="last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sobrenome</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu sobrenome" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={personalInfoForm.control}
                        name="birthdate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Data de Nascimento</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={`w-full pl-3 text-left font-normal ${
                                      !field.value && "text-muted-foreground"
                                    }`}
                                  >
                                    {field.value ? (
                                      format(field.value, "dd/MM/yyyy", { locale: ptBR })
                                    ) : (
                                      <span>Selecione uma data</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={personalInfoForm.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gênero</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="masculino">Masculino</SelectItem>
                                <SelectItem value="feminino">Feminino</SelectItem>
                                <SelectItem value="outro">Outro</SelectItem>
                                <SelectItem value="prefiro_nao_informar">Prefiro não informar</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={personalInfoForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium mb-4">Redes Sociais</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={personalInfoForm.control}
                          name="social_media.instagram"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Instagram</FormLabel>
                              <FormControl>
                                <Input placeholder="@seuperfil" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={personalInfoForm.control}
                          name="social_media.facebook"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Facebook</FormLabel>
                              <FormControl>
                                <Input placeholder="facebook.com/seuperfil" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={personalInfoForm.control}
                          name="social_media.twitter"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Twitter</FormLabel>
                              <FormControl>
                                <Input placeholder="@seuperfil" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium mb-4">Endereço</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={personalInfoForm.control}
                          name="address.street"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Rua</FormLabel>
                              <FormControl>
                                <Input placeholder="Nome da rua" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={personalInfoForm.control}
                          name="address.number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número</FormLabel>
                              <FormControl>
                                <Input placeholder="123" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <FormField
                          control={personalInfoForm.control}
                          name="address.complement"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Complemento</FormLabel>
                              <FormControl>
                                <Input placeholder="Apto, Bloco, etc" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={personalInfoForm.control}
                          name="address.neighborhood"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bairro</FormLabel>
                              <FormControl>
                                <Input placeholder="Seu bairro" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <FormField
                          control={personalInfoForm.control}
                          name="address.city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cidade</FormLabel>
                              <FormControl>
                                <Input placeholder="Sua cidade" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={personalInfoForm.control}
                          name="address.state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estado</FormLabel>
                              <FormControl>
                                <Input placeholder="Seu estado" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={personalInfoForm.control}
                          name="address.zipcode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CEP</FormLabel>
                              <FormControl>
                                <Input placeholder="00000-000" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <Button 
                        type="submit" 
                        className="bg-red-gradient hover:opacity-90 hover-lift"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Salvando..." : "Salvar Informações"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="preferences" className="animate-slide-in">
                <Form {...preferencesForm}>
                  <Accordion type="single" collapsible defaultValue="styles" onValueChange={(value) => setActivePreferenceSection(value as PreferenceSection)}>
                    {/* Módulo 1: Estilos e Preferências Artísticas */}
                    <AccordionItem value="styles" className="border px-4 py-2 rounded-md mb-4 bg-gray-50">
                      <AccordionTrigger className="py-2 hover:no-underline">
                        <div className="flex items-center text-lg font-medium">
                          <span className="bg-red-gradient text-white p-2 rounded-full mr-3 flex items-center justify-center w-8 h-8">1</span>
                          Estilos e Preferências Artísticas
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="py-4 px-2">
                        <div className="space-y-6">
                          <FormField
                            control={preferencesForm.control}
                            name="preferred_styles"
                            render={() => (
                              <FormItem>
                                <div className="mb-4">
                                  <FormLabel>Estilos de tatuagem preferidos</FormLabel>
                                  <FormDescription>
                                    Selecione todos os estilos que você tem interesse
                                  </FormDescription>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                  {tattooStyles.map((style) => (
                                    <FormItem
                                      key={style.value}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={preferencesForm.watch("preferred_styles")?.includes(style.value)}
                                          onCheckedChange={(checked) => 
                                            handleCheckboxChange("preferred_styles", style.value, !!checked)
                                          }
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        {style.label}
                                      </FormLabel>
                                    </FormItem>
                                  ))}
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={preferencesForm.control}
                            name="design_inspirations"
                            render={() => (
                              <FormItem>
                                <div className="mb-4">
                                  <FormLabel>Inspirações para designs</FormLabel>
                                  <FormDescription>
                                    Que elementos você gostaria na sua tatuagem?
                                  </FormDescription>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  {designInspirations.map((item) => (
                                    <FormItem
                                      key={item.value}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={preferencesForm.watch("design_inspirations")?.includes(item.value)}
                                          onCheckedChange={(checked) => 
                                            handleCheckboxChange("design_inspirations", item.value, !!checked)
                                          }
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        {item.label}
                                      </FormLabel>
                                    </FormItem>
                                  ))}
                                </div>
                              </FormItem>
                            )}
                          />

                          <div className="pt-4 flex justify-end">
                            <Button
                              type="button"
                              onClick={() => savePreferenceSection("styles")}
                              className="bg-red-gradient hover:opacity-90 hover-lift"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Salvando..." : "Salvar e Avançar"}
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    {/* Módulo 2: Detalhes da Tatuagem */}
                    <AccordionItem value="details" className="border px-4 py-2 rounded-md mb-4 bg-gray-50">
                      <AccordionTrigger className="py-2 hover:no-underline">
                        <div className="flex items-center text-lg font-medium">
                          <span className="bg-red-gradient text-white p-2 rounded-full mr-3 flex items-center justify-center w-8 h-8">2</span>
                          Detalhes da Tatuagem
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="py-4 px-2">
                        <div className="space-y-6">
                          <FormField
                            control={preferencesForm.control}
                            name="preferred_body_parts"
                            render={() => (
                              <FormItem>
                                <div className="mb-4">
                                  <FormLabel>Partes do corpo de interesse</FormLabel>
                                  <FormDescription>
                                    Onde você gostaria de fazer sua próxima tatuagem?
                                  </FormDescription>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                  {bodyParts.map((part) => (
                                    <FormItem
                                      key={part.value}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={preferencesForm.watch("preferred_body_parts")?.includes(part.value)}
                                          onCheckedChange={(checked) => 
                                            handleCheckboxChange("preferred_body_parts", part.value, !!checked)
                                          }
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        {part.label}
                                      </FormLabel>
                                    </FormItem>
                                  ))}
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={preferencesForm.control}
                            name="tattoo_size"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel>Tamanho preferido de tatuagem</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={(value) => handleRadioChange("tattoo_size", value)}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                  >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="pequena" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Pequena (até 7cm)
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="media" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Média (7cm a 15cm)
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="grande" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Grande (acima de 15cm)
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="manga" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Manga completa
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="costas_completas" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Costas completas
                                      </FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={preferencesForm.control}
                            name="color_preference"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel>Preferência de cores</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={(value) => handleRadioChange("color_preference", value)}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                  >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="colorida" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Colorida
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="preto_e_branco" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Preto e branco
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="ambos" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Ambos / Sem preferência
                                      </FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="pt-4 flex justify-end">
                            <Button
                              type="button"
                              onClick={() => savePreferenceSection("details")}
                              className="bg-red-gradient hover:opacity-90 hover-lift"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Salvando..." : "Salvar e Avançar"}
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    {/* Módulo 3: Experiência e Condições */}
                    <AccordionItem value="experience" className="border px-4 py-2 rounded-md mb-4 bg-gray-50">
                      <AccordionTrigger className="py-2 hover:no-underline">
                        <div className="flex items-center text-lg font-medium">
                          <span className="bg-red-gradient text-white p-2 rounded-full mr-3 flex items-center justify-center w-8 h-8">3</span>
                          Experiência e Condições
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="py-4 px-2">
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={preferencesForm.control}
                              name="has_tattoos"
                              render={({ field }) => (
                                <FormItem className="space-y-3">
                                  <FormLabel>Você já tem tatuagens?</FormLabel>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={(value) => handleRadioChange("has_tattoos", value)}
                                      defaultValue={field.value}
                                      className="flex flex-col space-y-1"
                                    >
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="sim" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          Sim
                                        </FormLabel>
                                      </FormItem>
                                      <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                          <RadioGroupItem value="nao" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                          Não
                                        </FormLabel>
                                      </FormItem>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {preferencesForm.watch("has_tattoos") === "sim" && (
                              <FormField
                                control={preferencesForm.control}
                                name="tattoo_count"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Quantas tatuagens você tem?</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="number" 
                                        min="1" 
                                        {...field} 
                                        onChange={(e) => {
                                          field.onChange(e);
                                          savePreferenceSection("experience");
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                          </div>

                          <FormField
                            control={preferencesForm.control}
                            name="pain_tolerance"
                            render={({ field }) => (
                              <FormItem className="space-y-4">
                                <div>
                                  <FormLabel>Tolerância à dor</FormLabel>
                                  <FormDescription>
                                    Você considera sua tolerância à dor como: {field.value === 1 
                                      ? "Muito baixa" 
                                      : field.value < 4 
                                        ? "Baixa" 
                                        : field.value < 7 
                                          ? "Média" 
                                          : field.value < 9 
                                            ? "Alta" 
                                            : "Muito alta"}
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Slider
                                    defaultValue={[field.value || 5]}
                                    max={10}
                                    min={1}
                                    step={1}
                                    onValueChange={handleSliderChange}
                                    className="py-4"
                                  />
                                </FormControl>
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>1 (Muito baixa)</span>
                                  <span>5 (Média)</span>
                                  <span>10 (Muito alta)</span>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={preferencesForm.control}
                            name="skin_sensitivity"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel>Sensibilidade da pele</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={(value) => handleRadioChange("skin_sensitivity", value)}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                  >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="normal" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Normal
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="sensivel" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Sensível
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="muito_sensivel" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Muito sensível
                                      </FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={preferencesForm.control}
                            name="health_conditions"
                            render={() => (
                              <FormItem>
                                <div className="mb-4">
                                  <FormLabel>Condições de saúde relevantes</FormLabel>
                                  <FormDescription>
                                    Selecione qualquer condição que possa afetar sua tatuagem
                                  </FormDescription>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {healthConditions.map((condition) => (
                                    <FormItem
                                      key={condition.value}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={preferencesForm.watch("health_conditions")?.includes(condition.value)}
                                          onCheckedChange={(checked) => 
                                            handleCheckboxChange("health_conditions", condition.value, !!checked)
                                          }
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        {condition.label}
                                      </FormLabel>
                                    </FormItem>
                                  ))}
                                </div>
                              </FormItem>
                            )}
                          />

                          <div className="pt-4 flex justify-end">
                            <Button
                              type="button"
                              onClick={() => savePreferenceSection("experience")}
                              className="bg-red-gradient hover:opacity-90 hover-lift"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Salvando..." : "Salvar e Avançar"}
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    {/* Módulo 4: Orçamento */}
                    <AccordionItem value="budget" className="border px-4 py-2 rounded-md mb-4 bg-gray-50">
                      <AccordionTrigger className="py-2 hover:no-underline">
                        <div className="flex items-center text-lg font-medium">
                          <span className="bg-red-gradient text-white p-2 rounded-full mr-3 flex items-center justify-center w-8 h-8">4</span>
                          Orçamento para tatuagem
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="py-4 px-2">
                        <div className="space-y-6">
                          <FormField
                            control={preferencesForm.control}
                            name="budget"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel>Orçamento para tatuagem</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={(value) => handleRadioChange("budget", value)}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                  >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="baixo" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Econômico (até R$ 300)
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="medio" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Intermediário (R$ 300 a R$ 800)
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="alto" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Premium (acima de R$ 800)
                                      </FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={preferencesForm.control}
                            name="frequency"
                            render={({ field }) => (
                              <FormItem className="space-y-3">
                                <FormLabel>Com que frequência você faz tatuagens?</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={(value) => handleRadioChange("frequency", value)}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                  >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="primeira" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Será minha primeira
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="raramente" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Raramente (1 a cada poucos anos)
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="ocasionalmente" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Ocasionalmente (1-2 por ano)
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem value="frequentemente" />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        Frequentemente (3+ por ano)
                                      </FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="pt-4 flex justify-end">
                            <Button
                              type="button"
                              onClick={() => savePreferenceSection("budget")}
                              className="bg-red-gradient hover:opacity-90 hover-lift"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Salvando..." : "Salvar e Avançar"}
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    {/* Módulo 5: Disponibilidade para agendamentos */}
                    <AccordionItem value="scheduling" className="border px-4 py-2 rounded-md mb-4 bg-gray-50">
                      <AccordionTrigger className="py-2 hover:no-underline">
                        <div className="flex items-center text-lg font-medium">
                          <span className="bg-red-gradient text-white p-2 rounded-full mr-3 flex items-center justify-center w-8 h-8">5</span>
                          Disponibilidade para agendamentos
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="py-4 px-2">
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <FormField
                              control={preferencesForm.control}
                              name="scheduling_preferences.weekdays"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={(checked) => {
                                        preferencesForm.setValue("scheduling_preferences.weekdays", !!checked, { shouldValidate: true });
                                        savePreferenceSection("scheduling");
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Dias úteis</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={preferencesForm.control}
                              name="scheduling_preferences.weekends"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={(checked) => {
                                        preferencesForm.setValue("scheduling_preferences.weekends", !!checked, { shouldValidate: true });
                                        savePreferenceSection("scheduling");
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Finais de semana</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={preferencesForm.control}
                              name="scheduling_preferences.mornings"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={(checked) => {
                                        preferencesForm.setValue("scheduling_preferences.mornings", !!checked, { shouldValidate: true });
                                        savePreferenceSection("scheduling");
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Manhãs</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={preferencesForm.control}
                              name="scheduling_preferences.afternoons"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={(checked) => {
                                        preferencesForm.setValue("scheduling_preferences.afternoons", !!checked, { shouldValidate: true });
                                        savePreferenceSection("scheduling");
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Tardes</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={preferencesForm.control}
                              name="scheduling_preferences.evenings"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={(checked) => {
                                        preferencesForm.setValue("scheduling_preferences.evenings", !!checked, { shouldValidate: true });
                                        savePreferenceSection("scheduling");
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>Noites</FormLabel>
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={preferencesForm.control}
                            name="preferred_months"
                            render={() => (
                              <FormItem>
                                <div className="mb-4">
                                  <FormLabel>Meses preferidos para fazer tatuagem</FormLabel>
                                  <FormDescription>
                                    Em que meses você prefere fazer sua tatuagem?
                                  </FormDescription>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  {months.map((month) => (
                                    <FormItem
                                      key={month.value}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={preferencesForm.watch("preferred_months")?.includes(month.value)}
                                          onCheckedChange={(checked) => 
                                            handleCheckboxChange("preferred_months", month.value, !!checked)
                                          }
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        {month.label}
                                      </FormLabel>
                                    </FormItem>
                                  ))}
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={preferencesForm.control}
                            name="notes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Observações adicionais</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Compartilhe mais detalhes sobre o que você procura..."
                                    className="resize-none"
                                    rows={4}
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      if (e.target.value.length > 10) {
                                        setTimeout(() => {
                                          savePreferenceSection("scheduling");
                                        }, 1000);
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="pt-4 flex justify-end">
                            <Button
                              type="button"
                              onClick={() => savePreferenceSection("scheduling")}
                              className="bg-red-gradient hover:opacity-90 hover-lift"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Salvando..." : "Concluir"}
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="bg-gray-50 flex justify-center border-t">
            <p className="text-sm text-gray-500">
              Seus dados são protegidos e usados apenas para melhorar sua experiência.
            </p>
          </CardFooter>
        </Card>

        <div className="mt-12 bg-primary-50 border border-primary-100 p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-heading font-bold mb-4">Próximos passos</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-red-gradient text-white p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium mb-1">Explore nosso catálogo</h3>
                <p className="text-gray-600">Encontre a tatuagem perfeita para o seu estilo.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-red-gradient text-white p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium mb-1">Adicione ao carrinho</h3>
                <p className="text-gray-600">Escolha sua tatuagem e adicione ao carrinho para continuar.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-red-gradient text-white p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium mb-1">Agende sua sessão</h3>
                <p className="text-gray-600">Escolha a data e horário ideais para sua tatuagem.</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <Button className="bg-red-gradient hover:opacity-90 hover-lift">
              Ver Catálogo de Tatuagens
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
