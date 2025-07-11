
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Artist } from "@/services/interfaces/IArtistsService";
import ArtistPermissionsManager from './ArtistPermissionsManager';
import ImageUploadField from './ImageUploadField';

const formSchema = z.object({
  first_name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  last_name: z.string().min(2, {
    message: "Sobrenome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  phone: z.string().optional(),
  bio: z.string().optional(),
  avatar_url: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  style: z.string().optional(),
  commission_percentage: z.number().min(0).max(100).default(0),
  status: z.enum(['active', 'inactive']).default('active'),
  contact: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    tiktok: z.string().optional(),
  }).optional(),
  locations: z.array(z.string()).optional(),
  permissions: z.any().optional(),
});

interface Props {
  artist?: Artist;
  onSave: (data: any) => void;
  onCancel: () => void;
}

type FormData = z.infer<typeof formSchema>;

const ArtistForm = ({ artist, onSave, onCancel }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(
    artist ? {
      first_name: artist.first_name,
      last_name: artist.last_name,
      email: artist.email,
      phone: artist.phone || '',
      bio: artist.bio || '',
      avatar_url: artist.avatar_url || '',
      specialties: artist.specialties || [],
      style: artist.style || '',
      commission_percentage: artist.commission_percentage,
      status: artist.status,
      contact: artist.contact || { instagram: '', facebook: '', tiktok: '' },
      locations: artist.locations || [],
      permissions: artist.permissions || {},
    } : {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      bio: '',
      avatar_url: '',
      specialties: [],
      style: '',
      commission_percentage: 0,
      status: 'active',
      contact: { instagram: '', facebook: '', tiktok: '' },
      locations: [],
      permissions: {},
    }
  );

  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
    mode: "onChange"
  });

  useEffect(() => {
    if (artist) {
      Object.keys(artist).forEach(key => {
        setValue(key as keyof FormData, artist[key as keyof Artist]);
      });
    }
  }, [artist, setValue]);

  const avatarUrl = watch("avatar_url");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await onSave(data);
      toast({
        title: "Sucesso",
        description: "Dados do tatuador salvos com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar dados do tatuador. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleSpecialtiesChange = (value: string[]) => {
    setValue("specialties", value);
  };

  const handleLocationsChange = (value: string[]) => {
    setValue("locations", value);
  };

  const handlePermissionsUpdate = (permissions: any) => {
    setFormData(prev => ({
      ...prev,
      permissions: permissions
    }));
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-gradient-to-r from-red-100 to-red-200 p-1 rounded-lg shadow-lg">
          <TabsTrigger 
            value="basic" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
          >
            <User className="h-4 w-4 mr-2" />
            Básico
          </TabsTrigger>
          <TabsTrigger 
            value="contact" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
          >
            Contato
          </TabsTrigger>
          <TabsTrigger 
            value="details" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
          >
            Detalhes
          </TabsTrigger>
          <TabsTrigger 
            value="specialties" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
          >
            Especialidades
          </TabsTrigger>
          <TabsTrigger 
            value="locations" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
          >
            Localizações
          </TabsTrigger>
          <TabsTrigger 
            value="permissions" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
          >
            <Shield className="h-4 w-4 mr-2" />
            Permissões
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <TabsContent value="basic" className="space-y-4">
            <Card className="shadow-lg bg-gradient-to-br from-white to-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Informações Básicas</CardTitle>
                <CardDescription>Dados pessoais e foto do tatuador</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                {/* Upload de Foto */}
                <Controller
                  control={control}
                  name="avatar_url"
                  render={({ field }) => (
                    <ImageUploadField
                      value={field.value}
                      onChange={field.onChange}
                      label="Foto de Perfil"
                    />
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">Nome</Label>
                    <Controller
                      control={control}
                      name="first_name"
                      render={({ field }) => (
                        <Input id="first_name" placeholder="Nome" {...field} />
                      )}
                    />
                    {errors.first_name && (
                      <p className="text-red-500 text-sm">{errors.first_name.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="last_name">Sobrenome</Label>
                    <Controller
                      control={control}
                      name="last_name"
                      render={({ field }) => (
                        <Input id="last_name" placeholder="Sobrenome" {...field} />
                      )}
                    />
                    {errors.last_name && (
                      <p className="text-red-500 text-sm">{errors.last_name.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <Input id="email" placeholder="Email" type="email" {...field} />
                    )}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <Card className="shadow-lg bg-gradient-to-br from-white to-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Informações de Contato</CardTitle>
                <CardDescription>Detalhes de contato do tatuador</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field }) => (
                      <Input id="phone" placeholder="Telefone" {...field} />
                    )}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="contact.instagram">Instagram</Label>
                    <Controller
                      control={control}
                      name="contact.instagram"
                      render={({ field }) => (
                        <Input id="contact.instagram" placeholder="Instagram" {...field} />
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact.facebook">Facebook</Label>
                    <Controller
                      control={control}
                      name="contact.facebook"
                      render={({ field }) => (
                        <Input id="contact.facebook" placeholder="Facebook" {...field} />
                      )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact.tiktok">TikTok</Label>
                    <Controller
                      control={control}
                      name="contact.tiktok"
                      render={({ field }) => (
                        <Input id="contact.tiktok" placeholder="TikTok" {...field} />
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <Card className="shadow-lg bg-gradient-to-br from-white to-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Detalhes Adicionais</CardTitle>
                <CardDescription>Informações adicionais sobre o tatuador</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Controller
                    control={control}
                    name="bio"
                    render={({ field }) => (
                      <Textarea id="bio" placeholder="Bio" {...field} />
                    )}
                  />
                  {errors.bio && (
                    <p className="text-red-500 text-sm">{errors.bio.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="style">Estilo</Label>
                  <Controller
                    control={control}
                    name="style"
                    render={({ field }) => (
                      <Input id="style" placeholder="Estilo" {...field} />
                    )}
                  />
                  {errors.style && (
                    <p className="text-red-500 text-sm">{errors.style.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="commission_percentage">Comissão (%)</Label>
                    <Controller
                      control={control}
                      name="commission_percentage"
                      render={({ field }) => (
                        <Input
                          id="commission_percentage"
                          type="number"
                          placeholder="Comissão (%)"
                          {...field}
                          onChange={(e) => {
                            const value = Math.max(0, Math.min(100, Number(e.target.value)));
                            field.onChange(value);
                          }}
                        />
                      )}
                    />
                    {errors.commission_percentage && (
                      <p className="text-red-500 text-sm">{errors.commission_percentage.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Controller
                      control={control}
                      name="status"
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="border-red-200 focus:border-red-500">
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-red-200">
                            <SelectItem value="active">Ativo</SelectItem>
                            <SelectItem value="inactive">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.status && (
                      <p className="text-red-500 text-sm">{errors.status.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specialties" className="space-y-4">
            <Card className="shadow-lg bg-gradient-to-br from-white to-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Especialidades</CardTitle>
                <CardDescription>Defina as especialidades do tatuador</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div>
                  <Label>Especialidades</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => handleSpecialtiesChange([...(watch("specialties") || []), "Realismo"])}>
                      Realismo
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => handleSpecialtiesChange([...(watch("specialties") || []), "Old School"])}>
                      Old School
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => handleSpecialtiesChange([...(watch("specialties") || []), "New School"])}>
                      New School
                    </Button>
                  </div>
                  <div className="mt-2">
                    <Label>Especialidades Selecionadas:</Label>
                    <div className="flex flex-wrap gap-2">
                      {(watch("specialties") || []).map((specialty, index) => (
                        <Badge key={index} variant="secondary">{specialty}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations" className="space-y-4">
            <Card className="shadow-lg bg-gradient-to-br from-white to-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Localizações</CardTitle>
                <CardDescription>Defina as localizações de atendimento do tatuador</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div>
                  <Label>Localizações</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => handleLocationsChange([...(watch("locations") || []), "São Paulo"])}>
                      São Paulo
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => handleLocationsChange([...(watch("locations") || []), "Rio de Janeiro"])}>
                      Rio de Janeiro
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => handleLocationsChange([...(watch("locations") || []), "Belo Horizonte"])}>
                      Belo Horizonte
                    </Button>
                  </div>
                  <div className="mt-2">
                    <Label>Localizações Selecionadas:</Label>
                    <div className="flex flex-wrap gap-2">
                      {(watch("locations") || []).map((location, index) => (
                        <Badge key={index} variant="secondary">{location}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6">
            {artist ? (
              <ArtistPermissionsManager
                artist={artist}
                onPermissionsUpdate={handlePermissionsUpdate}
              />
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Salve o artista primeiro para configurar permissões</p>
              </div>
            )}
          </TabsContent>

          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={handleCancel}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
};

export default ArtistForm;
