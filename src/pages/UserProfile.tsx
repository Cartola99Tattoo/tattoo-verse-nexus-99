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

// Schema para o formulário de preferências
const preferencesSchema = z.object({
  preferred_styles: z.array(z.string()).min(1, { message: "Selecione pelo menos um estilo" }),
  preferred_body_parts: z.array(z.string()).min(1, { message: "Selecione pelo menos uma parte do corpo" }),
  has_tattoos: z.enum(["sim", "nao"]).optional(),
  tattoo_count: z.string().optional(),
  budget: z.enum(["baixo", "medio", "alto"]).optional(),
  frequency: z.enum(["primeira", "raramente", "ocasionalmente", "frequentemente"]).optional(),
  source: z.enum(["amigos", "redes_sociais", "busca", "indicacao", "outro"]).optional(),
  preferred_artist: z.string().optional(),
  scheduling_preferences: z.object({
    weekdays: z.boolean().optional(),
    weekends: z.boolean().optional(),
    mornings: z.boolean().optional(),
    afternoons: z.boolean().optional(),
    evenings: z.boolean().optional(),
  }).optional(),
  notes: z.string().optional(),
});

// Schema para o formulário da jornada
const journeySchema = z.object({
  music_styles: z.array(z.string()).optional(),
  music_style_other: z.string().optional(),
  favorite_artist: z.string().optional(),
  
  favorite_movie: z.string().optional(),
  favorite_character: z.string().optional(),
  
  self_description_word: z.string().optional(),
  self_representation_phrase: z.string().optional(),
  self_representation_other: z.string().optional(),
  
  tattoo_feeling: z.string().optional(),
  tattoo_feeling_other: z.string().optional(),
  tattoo_message: z.string().optional(),
  tattoo_preference: z.string().optional(),
  
  spiritual_symbol: z.string().optional(),
  archetype: z.string().optional(),
  archetype_other: z.string().optional(),
  
  dream_scene: z.string().optional(),
  illustration_type: z.string().optional(),
  illustration_type_other: z.string().optional(),
  
  life_phase: z.string().optional(),
  art_experience: z.string().optional(),
  tattoo_title: z.string().optional(),
  
  community_experiences: z.array(z.string()).optional(),
  community_other: z.string().optional(),
  want_suggestions: z.string().optional(),
  
  inspiration_sources: z.array(z.string()).optional(),
  inspiration_other: z.string().optional(),
  interaction_frequency: z.string().optional(),
});

const UserProfile = () => {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const preferencesForm = useForm<z.infer<typeof preferencesSchema>>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      preferred_styles: [],
      preferred_body_parts: [],
      has_tattoos: undefined,
      tattoo_count: "",
      budget: undefined,
      frequency: undefined,
      source: undefined,
      preferred_artist: "",
      scheduling_preferences: {
        weekdays: false,
        weekends: false,
        mornings: false,
        afternoons: false,
        evenings: false,
      },
      notes: "",
    },
  });

  // Formulário da jornada
  const journeyForm = useForm<z.infer<typeof journeySchema>>({
    resolver: zodResolver(journeySchema),
    defaultValues: {
      music_styles: [],
      music_style_other: "",
      favorite_artist: "",
      
      favorite_movie: "",
      favorite_character: "",
      
      self_description_word: "",
      self_representation_phrase: "",
      self_representation_other: "",
      
      tattoo_feeling: "",
      tattoo_feeling_other: "",
      tattoo_message: "",
      tattoo_preference: "",
      
      spiritual_symbol: "",
      archetype: "",
      archetype_other: "",
      
      dream_scene: "",
      illustration_type: "",
      illustration_type_other: "",
      
      life_phase: "",
      art_experience: "",
      tattoo_title: "",
      
      community_experiences: [],
      community_other: "",
      want_suggestions: "",
      
      inspiration_sources: [],
      inspiration_other: "",
      interaction_frequency: "",
    }
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

  // Submissão do formulário da jornada
  const onSubmitJourney = async (data: z.infer<typeof journeySchema>) => {
    setIsSubmitting(true);

    try {
      // Aqui você enviaria os dados para salvar no perfil do usuário
      console.log("Jornada enviada:", data);
      
      toast({
        title: "Jornada salva",
        description: "Suas respostas foram salvas com sucesso. Obrigado por compartilhar sua história!",
      });

      // Mude para a outra aba após salvar com sucesso
      setActiveTab("personal");
    } catch (error) {
      console.error("Erro ao salvar jornada:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar suas respostas. Tente novamente.",
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

  const musicStyles = [
    { value: "rock", label: "Rock que te dá força" },
    { value: "pop", label: "Pop que te deixa leve" },
    { value: "hiphop", label: "Hip-hop/Rap que fala o que sente" },
    { value: "eletronica", label: "Eletrônica que te faz flutuar" },
    { value: "mpb", label: "MPB que acalma a alma" },
    { value: "sertanejo", label: "Sertanejo que te conecta com raízes" },
    { value: "reggae", label: "Reggae que espalha boas vibrações" },
    { value: "jazz", label: "Jazz ou Blues para os momentos profundos" },
  ];

  const representationPhrases = [
    { value: "reconstruindo", label: "Estou me reconstruindo." },
    { value: "liberdade", label: "Estou celebrando minha liberdade." },
    { value: "essencia", label: "Estou buscando minha essência." },
    { value: "historia", label: "Estou honrando minha história." },
    { value: "criando", label: "Estou criando algo novo." },
  ];

  const tattooFeelings = [
    { value: "liberdade", label: "Liberdade" },
    { value: "coragem", label: "Coragem" },
    { value: "amor", label: "Amor" },
    { value: "superacao", label: "Superação" },
    { value: "protecao", label: "Proteção" },
    { value: "gratidao", label: "Gratidão" },
    { value: "fe", label: "Fé" },
  ];

  const archetypes = [
    { value: "guerreiro", label: "O Guerreiro(a) que enfrenta tudo" },
    { value: "curador", label: "O Curador(a) que transforma a dor" },
    { value: "rebelde", label: "O Rebelde que não se encaixa" },
    { value: "artista", label: "O Artista que cria mundos" },
    { value: "explorador", label: "O Explorador que não para" },
    { value: "mistico", label: "O Místico que vê além" },
    { value: "sabio", label: "O Sábio que observa" },
  ];

  const illustrationTypes = [
    { value: "animal", label: "Um animal com simbolismo" },
    { value: "personagem", label: "Um personagem que diz muito" },
    { value: "paisagem", label: "Uma paisagem com alma" },
    { value: "abstrato", label: "Algo abstrato e misterioso" },
    { value: "mistura", label: "Uma mistura simbólica única" },
  ];

  const communityExperiences = [
    { value: "flash_day", label: "Flash day de tattoos" },
    { value: "oficinas", label: "Oficinas criativas e encontros artísticos" },
    { value: "meditacao", label: "Meditação e tatuagem consciente" },
    { value: "eventos", label: "Eventos com música, drinks e arte" },
  ];

  const inspirationSources = [
    { value: "instagram", label: "Instagram" },
    { value: "pinterest", label: "Pinterest" },
    { value: "tiktok", label: "TikTok" },
    { value: "google", label: "Google" },
    { value: "celular", label: "Celular" },
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
              <TabsList className="grid grid-cols-3 mb-8">
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
                <TabsTrigger 
                  value="journey"
                  className="data-[state=active]:bg-red-gradient data-[state=active]:text-white"
                >
                  Jornada 99Tattoo
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
                  <form onSubmit={preferencesForm.handleSubmit(onSubmitPreferences)} className="space-y-6">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              
              <TabsContent value="journey" className="animate-slide-in">
                <Form {...journeyForm}>
                  <form onSubmit={journeyForm.handleSubmit(onSubmitJourney)} className="space-y-8">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-primary">✨ Jornada 99Tattoo – Descubra o que você carrega dentro e pode levar para a pele</h2>
                      <p className="text-gray-600 mt-2">Este não é apenas um formulário. É um mapa da sua essência para criarmos juntos uma arte que realmente represente quem você é.</p>
                    </div>
                    
                    {/* Seção 1: Trilha Sonora da Sua Vida */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                      <h3 className="text-xl font-semibold mb-4">🧠 1. Trilha Sonora da Sua Vida</h3>
                      <p className="text-gray-600 mb-4">A música diz muito sobre o que sentimos, vivemos e queremos expressar. Quais estilos musicais embalam seus dias? (Escolha até 3)</p>
                      
                      <FormField
                        control={journeyForm.control}
                        name="music_styles"
                        render={() => (
                          <FormItem>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {musicStyles.map((style) => (
                                <FormField
                                  key={style.value}
                                  control={journeyForm.control}
                                  name="music_styles"
                                  render={({ field }) => (
                                    <FormItem
                                      key={style.value}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(style.value)}
                                          onCheckedChange={(checked) => {
                                            const currentValues = field.value || [];
                                            if (currentValues.length >= 3 && checked && !currentValues.includes(style.value)) {
                                              return;
                                            }
                                            return checked
                                              ? field.onChange([...currentValues, style.value])
                                              : field.onChange(currentValues?.filter(
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
                              
                              <div className="md:col-span-2">
                                <FormField
                                  control={journeyForm.control}
                                  name="music_style_other"
                                  render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                      <FormLabel className="min-w-[80px]">Outros:</FormLabel>
                                      <FormControl>
                                        <Input {...field} placeholder="Especifique outro estilo musical" />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={journeyForm.control}
                        name="favorite_artist"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Qual artista ou banda representa seu momento atual?</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Seu artista ou banda favorito" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Seção 2: Imagens que Marcam */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                      <h3 className="text-xl font-semibold mb-4">🎬 2. Imagens que Marcam</h3>
                      <FormField
                        control={journeyForm.control}
                        name="favorite_movie"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Filmes, séries e personagens que tocam sua essência revelam seus símbolos internos. Que filme ou série te deixou pensando dias depois?</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Nome do filme ou série" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={journeyForm.control}
                        name="favorite_character"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Existe algum personagem com quem você se identifica? Pode ser de livro, filme, animação ou vida real.</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Nome do personagem" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Seção 3: Quem é você além do que mostram? */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                      <h3 className="text-xl font-semibold mb-4">🧬 3. Quem é você além do que mostram?</h3>
                      <FormField
                        control={journeyForm.control}
                        name="self_description_word"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Vamos além da superfície... Se pudesse se descrever em uma única palavra, qual seria?</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Uma palavra que te define" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={journeyForm.control}
                        name="self_representation_phrase"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Qual dessas frases mais te representa hoje?</FormLabel>
                            <FormControl>
                              <RadioGroup 
                                onValueChange={field.onChange} 
                                value={field.value} 
                                className="flex flex-col space-y-1"
                              >
                                {representationPhrases.map((phrase) => (
                                  <FormItem key={phrase.value} className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value={phrase.value} />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {phrase.label}
                                    </FormLabel>
                                  </FormItem>
                                ))}
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="outro" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Outra
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      {journeyForm.watch("self_representation_phrase") === "outro" && (
                        <FormField
                          control={journeyForm.control}
                          name="self_representation_other"
                          render={({ field }) => (
                            <FormItem className="mt-2">
                              <FormControl>
                                <Input {...field} placeholder="Escreva outra frase que te representa" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                    
                    {/* Seção 4: A Tattoo como Espelho da Alma */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                      <h3 className="text-xl font-semibold mb-4">💫 4. A Tattoo como Espelho da Alma</h3>
                      <FormField
                        control={journeyForm.control}
                        name="tattoo_feeling"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Tatuar é transformar o invisível em arte. Se sua próxima tatuagem fosse um sentimento, qual seria?</FormLabel>
                            <FormControl>
                              <RadioGroup 
                                onValueChange={field.onChange} 
                                value={field.value} 
                                className="grid grid-cols-2 gap-2"
                              >
                                {tattooFeelings.map((feeling) => (
                                  <FormItem key={feeling.value} className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value={feeling.value} />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {feeling.label}
                                    </FormLabel>
                                  </FormItem>
                                ))}
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="outro" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Outros
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      {journeyForm.watch("tattoo_feeling") === "outro" && (
                        <FormField
                          control={journeyForm.control}
                          name="tattoo_feeling_other"
                          render={({ field }) => (
                            <FormItem className="mb-4">
                              <FormControl>
                                <Input {...field} placeholder="Descreva outro sentimento" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}
                      
                      <FormField
                        control={journeyForm.control}
                        name="tattoo_message"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Qual mensagem você gostaria de eternizar na pele?</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Descreva a mensagem que você gostaria que sua tatuagem transmitisse" 
                                className="resize-none" 
                                rows={3}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={journeyForm.control}
                        name="tattoo_preference"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Você prefere uma tatuagem com...</FormLabel>
                            <FormControl>
                              <RadioGroup 
                                onValueChange={field.onChange} 
                                value={field.value} 
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="estetica" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Estética única
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="significado" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Um significado profundo
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="ambos" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Um pouco dos dois
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Seção 5: Autoconhecimento e Simbolismo */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                      <h3 className="text-xl font-semibold mb-4">🌀 5. Autoconhecimento e Simbolismo</h3>
                      <FormField
                        control={journeyForm.control}
                        name="spiritual_symbol"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Todo símbolo é uma chave para abrir algo em você. Você se conecta com algum símbolo espiritual, cultural ou místico?</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Exemplo: mandala, cruz, árvore da vida, etc." />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={journeyForm.control}
                        name="archetype"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Qual desses arquétipos mais te representa?</FormLabel>
                            <FormControl>
                              <RadioGroup 
                                onValueChange={field.onChange} 
                                value={field.value} 
                                className="flex flex-col space-y-1"
                              >
                                {archetypes.map((archetype) => (
                                  <FormItem key={archetype.value} className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value={archetype.value} />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {archetype.label}
                                    </FormLabel>
                                  </FormItem>
                                ))}
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
                          </FormItem>
                        )}
                      />
                      
                      {journeyForm.watch("archetype") === "outro" && (
                        <FormField
                          control={journeyForm.control}
                          name="archetype_other"
                          render={({ field }) => (
                            <FormItem className="mt-2">
                              <FormControl>
                                <Input {...field} placeholder="Descreva outro arquétipo" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                    
                    {/* Seção 6: Criatividade na Pele */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                      <h3 className="text-xl font-semibold mb-4">🎨 6. Criatividade na Pele</h3>
                      <FormField
                        control={journeyForm.control}
                        name="dream_scene"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Vamos imaginar juntos. Se você pudesse tatuar uma cena de um sonho, qual seria?</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Descreva essa cena do seu sonho" 
                                className="resize-none" 
                                rows={3}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={journeyForm.control}
                        name="illustration_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Qual tipo de ilustração mais te representa?</FormLabel>
                            <FormControl>
                              <RadioGroup 
                                onValueChange={field.onChange} 
                                value={field.value} 
                                className="flex flex-col space-y-1"
                              >
                                {illustrationTypes.map((type) => (
                                  <FormItem key={type.value} className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value={type.value} />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {type.label}
                                    </FormLabel>
                                  </FormItem>
                                ))}
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
                          </FormItem>
                        )}
                      />
                      
                      {journeyForm.watch("illustration_type") === "outro" && (
                        <FormField
                          control={journeyForm.control}
                          name="illustration_type_other"
                          render={({ field }) => (
                            <FormItem className="mt-2">
                              <FormControl>
                                <Input {...field} placeholder="Descreva outro tipo de ilustração" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                    
                    {/* Seção 7: Sua Jornada */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                      <h3 className="text-xl font-semibold mb-4">🗺️ 7. Sua Jornada</h3>
                      <FormField
                        control={journeyForm.control}
                        name="life_phase"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Queremos saber em que parte da sua caminhada você está. Qual fase da sua vida você gostaria de eternizar?</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Exemplo: formatura, casamento, superação..." />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={journeyForm.control}
                        name="art_experience"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Você já usou arte para lidar com sentimentos? Como foi essa experiência?</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Conte-nos sobre sua experiência com arte" 
                                className="resize-none" 
                                rows={3}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={journeyForm.control}
                        name="tattoo_title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Se sua próxima tatuagem tivesse um título, qual seria?</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Título da sua próxima tatuagem" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Seção 8: Conexão com a Comunidade 99Tattoo */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                      <h3 className="text-xl font-semibold mb-4">🤝 8. Conexão com a Comunidade 99Tattoo</h3>
                      <FormField
                        control={journeyForm.control}
                        name="community_experiences"
                        render={() => (
                          <FormItem className="mb-4">
                            <FormLabel>Você gostaria de participar de experiências como:</FormLabel>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                              {communityExperiences.map((experience) => (
                                <FormField
                                  key={experience.value}
                                  control={journeyForm.control}
                                  name="community_experiences"
                                  render={({ field }) => (
                                    <FormItem
                                      key={experience.value}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(experience.value)}
                                          onCheckedChange={(checked) => {
                                            const currentValues = field.value || [];
                                            return checked
                                              ? field.onChange([...currentValues, experience.value])
                                              : field.onChange(currentValues?.filter(
                                                  (value) => value !== experience.value
                                                )
                                              );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        {experience.label}
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />
                              ))}
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={journeyForm.control}
                        name="community_other"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Outra ideia:</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Sugira outras experiências" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={journeyForm.control}
                        name="want_suggestions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quer receber sugestões de tatuagens baseadas no que você compartilhou aqui?</FormLabel>
                            <FormControl>
                              <RadioGroup 
                                onValueChange={field.onChange} 
                                value={field.value} 
                                className="flex space-x-4"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="sim" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Sim, quero algo só meu
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="nao" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Não por agora
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Seção 9: De onde vem suas inspirações? */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                      <h3 className="text-xl font-semibold mb-4">📲 9. De onde vem suas inspirações?</h3>
                      <FormField
                        control={journeyForm.control}
                        name="inspiration_sources"
                        render={() => (
                          <FormItem className="mb-4">
                            <FormLabel>Onde você costuma salvar referências de tatuagem?</FormLabel>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                              {inspirationSources.map((source) => (
                                <FormField
                                  key={source.value}
                                  control={journeyForm.control}
                                  name="inspiration_sources"
                                  render={({ field }) => (
                                    <FormItem
                                      key={source.value}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(source.value)}
                                          onCheckedChange={(checked) => {
                                            const currentValues = field.value || [];
                                            return checked
                                              ? field.onChange([...currentValues, source.value])
                                              : field.onChange(currentValues?.filter(
                                                  (value) => value !== source.value
                                                )
                                              );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        {source.label}
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />
                              ))}
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={journeyForm.control}
                        name="inspiration_other"
                        render={({ field }) => (
                          <FormItem className="mb-4">
                            <FormLabel>Outro:</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Outra fonte de inspiração" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={journeyForm.control}
                        name="interaction_frequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Com que frequência você interage com conteúdos sobre tatuagem?</FormLabel>
                            <FormControl>
                              <RadioGroup 
                                onValueChange={field.onChange} 
                                value={field.value} 
                                className="flex flex-col md:flex-row md:space-x-4 space-y-1 md:space-y-0"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="diariamente" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Todos os dias
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="semanalmente" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Algumas vezes por semana
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="raramente" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Raramente
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="nunca" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Nunca
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Finalização */}
                    <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-lg font-medium text-primary">
                        ✨ Obrigado por compartilhar seu mundo interior com a gente. Agora que você chegou até aqui, estamos ainda mais perto de criar algo realmente seu.
                      </p>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Button 
                        type="submit" 
                        className="bg-red-gradient hover:opacity-90 hover-lift"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Salvando..." : "Salvar Jornada"}
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

export default UserProfile;
