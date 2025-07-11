
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(2, { message: "Nome é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(8, { message: "Telefone inválido" }),
});

type ContactFormProps = {
  title?: string;
  description?: string;
  sourcePage?: string;
  className?: string;
  buttonText?: string;
};

const ContactForm = ({ 
  title = "Pronto para fazer sua tatuagem?", 
  description = "Preencha o formulário e um de nossos tatuadores entrará em contato para realizar seu orçamento.", 
  sourcePage = "general",
  className = "",
  buttonText = "Solicitar Orçamento"
}: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      console.log("Dados do formulário:", values, "Origem:", sourcePage);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      form.reset();
      
      toast({
        title: "Solicitação enviada com sucesso!",
        description: "Em breve entraremos em contato para fazer seu orçamento.",
      });
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao enviar sua solicitação. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card variant="tattoo" className={className}>
      <CardHeader variant="red">
        <CardTitle className="text-2xl font-bold text-gray-900">{title}</CardTitle>
        <p className="text-gray-700">{description}</p>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 font-semibold">Nome</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Seu nome" 
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
                  <FormLabel className="text-gray-900 font-semibold">Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="seu@email.com" 
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 font-semibold">Telefone</FormLabel>
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
            
            <Button 
              type="submit" 
              variant="tattoo"
              size="lg"
              className="w-full font-bold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : buttonText}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
