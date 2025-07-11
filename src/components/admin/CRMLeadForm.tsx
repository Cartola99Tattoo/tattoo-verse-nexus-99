
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { getClientService } from "@/services/serviceFactory";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: "Nome é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().optional(),
  status: z.string(),
  temperature: z.string().optional(),
  preferred_style: z.string().optional(),
  notes: z.string().optional(),
  tags: z.string().optional(),
  origin: z.string().optional(),
  lead_score: z.number().min(0).max(100).optional(),
  qualified_interests: z.string().optional(),
});

interface CRMLeadFormProps {
  onSuccess: () => void;
}

const CRMLeadForm: React.FC<CRMLeadFormProps> = ({ onSuccess }) => {
  const clientService = getClientService();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      status: "new",
      temperature: "warm",
      preferred_style: "",
      notes: "",
      tags: "",
      origin: "manual",
      lead_score: 50,
      qualified_interests: "",
    },
  });

  const createLeadMutation = useMutation({
    mutationFn: (leadData: any) => {
      const processedData = {
        ...leadData,
        tags: leadData.tags ? leadData.tags.split(',').map((tag: string) => tag.trim()) : [],
        qualified_interests: leadData.qualified_interests ? 
          leadData.qualified_interests.split(',').map((interest: string) => interest.trim()) : [],
        total_spent: 0,
        total_orders: 0,
        last_activity: new Date().toISOString(),
      };
      return clientService.createClient(processedData);
    },
    onSuccess: () => {
      toast({
        title: "Lead criado com sucesso!",
        description: "O novo lead foi adicionado ao sistema.",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Erro ao criar lead",
        description: "Não foi possível criar o lead. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createLeadMutation.mutate(values);
  };

  const watchedLeadScore = form.watch("lead_score") || 50;

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "🔥 Muito Quente";
    if (score >= 60) return "🔶 Quente";
    if (score >= 40) return "🟡 Morno";
    if (score >= 20) return "❄️ Frio";
    return "🧊 Muito Frio";
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nome do cliente/lead" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="email@exemplo.com" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="(00) 00000-0000" 
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
                <FormLabel>Status Inicial</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="new">Novo Lead</SelectItem>
                    <SelectItem value="interested">Interessado</SelectItem>
                    <SelectItem value="pending">Proposta Enviada</SelectItem>
                    <SelectItem value="active">Em Negociação</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="temperature"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Temperatura do Lead</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a temperatura" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="hot">🔥 Quente - Alta prioridade</SelectItem>
                    <SelectItem value="warm">🔶 Morno - Média prioridade</SelectItem>
                    <SelectItem value="cold">❄️ Frio - Baixa prioridade</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="origin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Origem do Lead</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a origem" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="landing_events">Landing Page - Eventos</SelectItem>
                    <SelectItem value="contact_form">Formulário de Contato</SelectItem>
                    <SelectItem value="consultation">Consultoria</SelectItem>
                    <SelectItem value="shop">Loja</SelectItem>
                    <SelectItem value="referral">Indicação</SelectItem>
                    <SelectItem value="social_media">Redes Sociais</SelectItem>
                    <SelectItem value="manual">Cadastro Manual</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Pontuação do Lead */}
        <FormField
          control={form.control}
          name="lead_score"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pontuação Inicial do Lead (0-100)</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Slider
                    value={[field.value || 50]}
                    onValueChange={(value) => field.onChange(value[0])}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{watchedLeadScore}/100</span>
                    <span className="text-sm text-gray-600">{getScoreLabel(watchedLeadScore)}</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferred_style"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interesse/Estilo Preferido</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Eventos corporativos, Realismo, etc." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="qualified_interests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interesses Qualificados (separados por vírgula)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Tatuagem Floral, Eventos Corporativos, Realismo"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (separadas por vírgula)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: evento corporativo, urgente, referência"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações Iniciais</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva o contexto do lead, necessidades específicas, etc."
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button 
            type="submit" 
            disabled={createLeadMutation.isPending}
          >
            {createLeadMutation.isPending ? "Criando..." : "Criar Lead"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CRMLeadForm;
