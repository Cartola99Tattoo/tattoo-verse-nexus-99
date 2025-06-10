
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
    },
  });

  const createLeadMutation = useMutation({
    mutationFn: (leadData: any) => {
      const processedData = {
        ...leadData,
        tags: leadData.tags ? leadData.tags.split(',').map((tag: string) => tag.trim()) : [],
        total_spent: 0,
        total_orders: 0,
      };
      return clientService.createClient(processedData);
    },
    onSuccess: () => {
      toast({
        title: "Lead criado com sucesso!",
        description: "O novo lead foi adicionado ao CRM.",
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
                    variant="tattoo"
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
                    variant="tattoo"
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
                    variant="tattoo"
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
                    <SelectTrigger variant="tattoo">
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
                    <SelectTrigger variant="tattoo">
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
            name="preferred_style"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interesse/Estilo Preferido</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: Eventos corporativos, Realismo, etc." 
                    variant="tattoo"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (separadas por vírgula)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: evento corporativo, urgente, referência"
                  variant="tattoo"
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
                  variant="tattoo"
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
            variant="tattoo"
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
