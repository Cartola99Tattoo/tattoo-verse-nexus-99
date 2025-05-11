
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
import { CalendarIcon, Camera, Instagram, Facebook, Twitter, Phone, Mail, MapPin, Palette, Info, AlertCircle } from "lucide-react";
import { Slider } from "@/components/ui/slider";

// Schema para o formulário de informações pessoais
const personalInfoSchema = z.object({
  first_name: z.string().min(2, { message: "Nome precisa ter pelo menos 2 caracteres" }),
  last_name: z.string().min(2, { message: "Sobrenome precisa ter pelo menos 2 caracteres" }),
  birthdate: z.date().optional(),
  gender: z.enum(["masculino", "feminino", "outro", "prefiro_nao_informar"]).optional(),
  phone: z.string().optional(),
  email: z.string().email({ message: "Email inválido" }).optional(),
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

// Schema para o formulário de preferências com campos adicionais
const preferencesSchema = z.object({
  preferred_styles: z.array(z.string()).min(1, { message: "Selecione pelo menos um estilo" }),
  preferred_body_parts: z.array(z.string()).min(1, { message: "Selecione pelo menos uma parte do corpo" }),
  has_tattoos: z.enum(["sim", "nao"]).optional(),
  tattoo_count: z.string().optional(),
  tattoo_size_preference: z.array(z.string()).optional(),
  color_preference: z.enum(["colorido", "preto_e_branco", "ambos"]).optional(),
  pain_tolerance: z.number().min(1).max(10).optional(),
  budget: z.enum(["baixo", "medio", "alto"]).optional(),
  frequency: z.enum(["primeira", "raramente", "ocasionalmente", "frequentemente"]).optional(),
  source: z.enum(["amigos", "redes_sociais", "busca", "indicacao", "evento", "outro"]).optional(),
  preferred_artist: z.string().optional(),
  skin_sensitivity: z.enum(["normal", "sensivel", "muito_sensivel", "nao_sei"]).optional(),
  health_conditions: z.array(z.string()).optional(),
  scheduling_preferences: z.object({
    weekdays: z.boolean().optional(),
    weekends: z.boolean().optional(),
    mornings: z.boolean().optional(),
    afternoons: z.boolean().optional(),
    evenings: z.boolean().optional(),
  }).optional(),
  design_inspiration: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

const Profile = () => {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [painLevel, setPainLevel] = useState(5);

  // Formulário de informações pessoais
  const personalInfoForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      birthdate: undefined,
      gender: undefined,
      phone: profile?.phone || "",
      email: profile?.email || "",
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
  const preferencesForm = useForm<z.infer<typeof preferencesSchema>>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      preferred_styles: [],
      preferred_body_parts: [],
      has_tattoos: undefined,
      tattoo_count: "",
      tattoo_size_preference: [],
      color_preference: undefined,
      pain_tolerance: 5,
      budget: undefined,
      frequency: undefined,
      source: undefined,
      preferred_artist: "",
      skin_sensitivity: undefined,
      health_conditions: [],
      scheduling_preferences: {
        weekdays: false,
        weekends: false,
        mornings: false,
        afternoons: false,
        evenings: false,
      },
      design_inspiration: [],
      notes: "",
    },
  });

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

  // Submissão do formulário de preferências
  const onSubmitPreferences = async (data: z.infer<typeof preferencesSchema>) => {
    setIsSubmitting(true);

    try {
      // Aqui você enviaria os dados para salvar no perfil do usuário
      console.log("Preferências enviadas:", data);
      
      toast({
        title: "Preferências atualizadas",
        description: "Suas preferências foram salvas com sucesso.",
      });

      // Mude para a outra aba após salvar com sucesso
      setActiveTab("personal");
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
    { value: "dotwork", label: "Dotwork" },
    { value: "lettering", label: "Lettering" },
    { value: "fineline", label: "Fine Line" },
    { value: "neotradicional", label: "Neotradicional" },
    { value: "chicano", label: "Chicano" },
    { value: "surreal", label: "Surrealismo" },
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
    { value: "canela", label: "Canela" },
    { value: "pe", label: "Pé" },
    { value: "mao", label: "Mão" },
    { value: "nuca", label: "Nuca" },
    { value: "quadril", label: "Quadril" },
    { value: "abdomen", label: "Abdômen" },
  ];

  const tattooSizes = [
    { value: "pequeno", label: "Pequeno (até 5cm)" },
    { value: "medio", label: "Médio (5-15cm)" },
    { value: "grande", label: "Grande (15-25cm)" },
    { value: "muito_grande", label: "Muito grande (acima de 25cm)" },
    { value: "bodysuit", label: "Bodysuit/Manga completa" },
  ];

  const healthConditions = [
    { value: "nenhuma", label: "Nenhuma condição específica" },
    { value: "diabetes", label: "Diabetes" },
    { value: "pressao_alta", label: "Pressão alta" },
    { value: "alergias", label: "Alergias" },
    { value: "problemas_pele", label: "Problemas de pele" },
    { value: "cicatrizacao_dificil", label: "Cicatrização difícil" },
    { value: "hemofilia", label: "Hemofilia/Problemas de coagulação" },
  ];

  const designInspirations = [
    { value: "natureza", label: "Natureza e elementos" },
    { value: "animais", label: "Animais" },
    { value: "pessoas", label: "Pessoas/Retratos" },
    { value: "simbolos", label: "Símbolos e significados" },
    { value: "geometria", label: "Formas geométricas" },
    { value: "abstrato", label: "Arte abstrata" },
    { value: "filmes", label: "Filmes e séries" },
    { value: "jogos", label: "Videogames" },
    { value: "musica", label: "Música" },
    { value: "astronomia", label: "Astronomia" },
    { value: "cultura_pop", label: "Cultura pop" },
    { value: "religiao", label: "Religioso/Espiritual" },
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
              <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.first_name} />
              <AvatarFallback className="bg-gradient-to-r from-red-600 to-red-400 text-white text-2xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-heading font-bold">Meu Perfil</h1>
              <p className="text-gray-600">Personalize sua experiência no 99Tattoo</p>
            </div>
          </div>
          <Button className="bg-red-gradient hover:opacity-90 hover-lift flex items-center gap-2">
            <Camera size={18} /> Alterar Foto
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
                                    className={`w-full pl-3 text-left font-normal flex justify-between items-center ${
                                      !field.value && "text-muted-foreground"
                                    }`}
                                  >
                                    {field.value ? (
                                      format(field.value, "dd/MM/yyyy", { locale: ptBR })
                                    ) : (
                                      <span>Selecione uma data</span>
                                    )}
                                    <CalendarIcon className="h-4 w-4 opacity-50" />
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={personalInfoForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Phone size={16} /> Telefone
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="(00) 00000-0000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={personalInfoForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Mail size={16} /> Email
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="seu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <Instagram size={20} className="text-pink-500" />
                        <Facebook size={20} className="text-blue-600" />
                        <Twitter size={20} className="text-blue-400" />
                        Redes Sociais
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={personalInfoForm.control}
                          name="social_media.instagram"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Instagram size={16} className="text-pink-500" /> Instagram
                              </FormLabel>
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
                              <FormLabel className="flex items-center gap-2">
                                <Facebook size={16} className="text-blue-600" /> Facebook
                              </FormLabel>
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
                              <FormLabel className="flex items-center gap-2">
                                <Twitter size={16} className="text-blue-400" /> Twitter
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="@seuperfil" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <MapPin size={20} /> Endereço
                      </h3>
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
                  <form onSubmit={preferencesForm.handleSubmit(onSubmitPreferences)} className="space-y-6">
                    <div className="border-b pb-6">
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <Palette size={20} className="text-primary" /> Estilos e Preferências Artísticas
                      </h3>
                      
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
                                <FormField
                                  key={style.value}
                                  control={preferencesForm.control}
                                  name="preferred_styles"
                                  render={({ field }) => (
                                    <FormItem
                                      key={style.value}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(style.value)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, style.value])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== style.value
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        {style.label}
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="border-b pb-6">
                      <FormField
                        control={preferencesForm.control}
                        name="design_inspiration"
                        render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel>Fontes de inspiração para desenhos</FormLabel>
                              <FormDescription>
                                O que você gostaria de ver em sua tatuagem?
                              </FormDescription>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {designInspirations.map((item) => (
                                <FormField
                                  key={item.value}
                                  control={preferencesForm.control}
                                  name="design_inspiration"
                                  render={({ field }) => (
                                    <FormItem
                                      key={item.value}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(item.value)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, item.value])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== item.value
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        {item.label}
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="border-b pb-6">
                      <h3 className="text-lg font-medium mb-3">Detalhes da Tatuagem</h3>

                      <FormField
                        control={preferencesForm.control}
                        name="preferred_body_parts"
                        render={() => (
                          <FormItem className="mb-6">
                            <div className="mb-4">
                              <FormLabel>Partes do corpo de interesse</FormLabel>
                              <FormDescription>
                                Onde você gostaria de fazer sua próxima tatuagem?
                              </FormDescription>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {bodyParts.map((part) => (
                                <FormField
                                  key={part.value}
                                  control={preferencesForm.control}
                                  name="preferred_body_parts"
                                  render={({ field }) => (
                                    <FormItem
                                      key={part.value}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(part.value)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, part.value])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== part.value
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        {part.label}
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={preferencesForm.control}
                        name="tattoo_size_preference"
                        render={() => (
                          <FormItem className="mb-6">
                            <div className="mb-4">
                              <FormLabel>Preferência de tamanho de tatuagem</FormLabel>
                              <FormDescription>
                                Qual tamanho de tatuagem você prefere?
                              </FormDescription>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {tattooSizes.map((size) => (
                                <FormField
                                  key={size.value}
                                  control={preferencesForm.control}
                                  name="tattoo_size_preference"
                                  render={({ field }) => (
                                    <FormItem
                                      key={size.value}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(size.value)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, size.value])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== size.value
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        {size.label}
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={preferencesForm.control}
                        name="color_preference"
                        render={({ field }) => (
                          <FormItem className="mb-6">
                            <FormLabel>Preferência de cores</FormLabel>
                            <FormDescription>
                              Você prefere tatuagens coloridas ou em preto e branco?
                            </FormDescription>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="colorido" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Colorido
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
                                    Ambos
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="border-b pb-6">
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <Info size={20} /> Experiência e Condições
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <FormField
                          control={preferencesForm.control}
                          name="has_tattoos"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel>Você já tem tatuagens?</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
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
                                  <Input type="number" min="1" {...field} />
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
                          <FormItem className="mb-6">
                            <FormLabel>Tolerância à dor (1-10)</FormLabel>
                            <FormDescription>
                              Em uma escala de 1 a 10, como você classificaria sua tolerância à dor?
                            </FormDescription>
                            <FormControl>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm">Baixa (1)</span>
                                  <span className="text-sm">Alta (10)</span>
                                </div>
                                <Slider
                                  value={[field.value || 5]}
                                  min={1}
                                  max={10}
                                  step={1}
                                  onValueChange={(value) => {
                                    field.onChange(value[0]);
                                    setPainLevel(value[0]);
                                  }}
                                  className="py-2"
                                />
                                <div className="text-center font-medium">
                                  Nível selecionado: {field.value || 5}
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={preferencesForm.control}
                        name="skin_sensitivity"
                        render={({ field }) => (
                          <FormItem className="mb-6">
                            <FormLabel>Sensibilidade da pele</FormLabel>
                            <FormDescription>
                              Como você descreve a sensibilidade da sua pele?
                            </FormDescription>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-1 md:grid-cols-2 gap-2"
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
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="nao_sei" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Não sei
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
                              <FormLabel className="flex items-center gap-2">
                                <AlertCircle size={16} className="text-amber-500" /> Condições de saúde relevantes
                              </FormLabel>
                              <FormDescription>
                                Selecione qualquer condição de saúde que possa influenciar o processo de tatuagem
                              </FormDescription>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {healthConditions.map((condition) => (
                                <FormField
                                  key={condition.value}
                                  control={preferencesForm.control}
                                  name="health_conditions"
                                  render={({ field }) => (
                                    <FormItem
                                      key={condition.value}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(condition.value)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, condition.value])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== condition.value
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        {condition.label}
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={preferencesForm.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Orçamento para tatuagem</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
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
                                onValueChange={field.onChange}
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
                    </div>

                    <FormField
                      control={preferencesForm.control}
                      name="source"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Como você conheceu o 99Tattoo?</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-1 md:grid-cols-2 gap-2"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="amigos" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Amigos/Família
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="redes_sociais" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Redes Sociais
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="busca" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Busca na Internet
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="indicacao" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Indicação
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="evento" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Evento/Convenção
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="outro" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Outro
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
                      name="preferred_artist"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Artista preferido (opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do artista, se tiver preferência" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium mb-4">Disponibilidade para agendamentos</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <FormField
                          control={preferencesForm.control}
                          name="scheduling_preferences.weekdays"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
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
                                  onCheckedChange={field.onChange}
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
                                  onCheckedChange={field.onChange}
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
                                  onCheckedChange={field.onChange}
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
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Noites</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={preferencesForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações adicionais</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Compartilhe mais detalhes sobre o que você procura em sua próxima tatuagem..."
                              className="resize-none"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-4 flex justify-end">
                      <Button 
                        type="submit" 
                        className="bg-red-gradient hover:opacity-90 hover-lift"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Salvando..." : "Salvar Preferências"}
                      </Button>
                    </div>
                  </form>
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
