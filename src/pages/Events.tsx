
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, { message: "Nome é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(8, { message: "Telefone inválido" }),
  eventDate: z.string().min(1, { message: "Data do evento é obrigatória" }),
  eventType: z.string().min(1, { message: "Tipo de evento é obrigatório" }),
  guestCount: z.string().min(1, { message: "Número de convidados é obrigatório" }),
  message: z.string().optional(),
});

const upcomingEvents = [
  {
    id: 1,
    title: "99Tattoo Flash Day",
    date: "27 de Maio, 2025",
    location: "Estúdio 99Tattoo - São Paulo",
    image: "https://images.unsplash.com/photo-1552627019-947c3789ffb5?q=80&w=2069&auto=format&fit=crop",
    description: "Um dia inteiro dedicado a flash tattoos exclusivas criadas pelos nossos artistas. Preços especiais e designs únicos disponíveis apenas neste dia."
  },
  {
    id: 2,
    title: "Convenção de Tatuagem",
    date: "12-14 de Junho, 2025",
    location: "Centro de Convenções - Rio de Janeiro",
    image: "https://images.unsplash.com/photo-1543059080-f9b1272213d5?q=80&w=2069&auto=format&fit=crop",
    description: "Participaremos da maior convenção de tatuagem da América Latina. Venha nos visitar e conhecer nossos artistas premiados."
  },
  {
    id: 3,
    title: "Workshop de Aquarela Tattoo",
    date: "5 de Julho, 2025",
    location: "Estúdio 99Tattoo - São Paulo",
    image: "https://images.unsplash.com/photo-1521375712389-33c1ce3b8732?q=80&w=2070&auto=format&fit=crop",
    description: "Workshop exclusivo com a artista Juliana Mendes, especializada em técnicas de aquarela. Vagas limitadas."
  },
];

const services = [
  {
    title: "Eventos Corporativos",
    description: "Tatuagens temporárias personalizadas com o logotipo da sua empresa, perfeitas para lançamentos de produtos, conferências ou festas de fim de ano.",
    image: "https://images.unsplash.com/photo-1638237197004-7d359ff5239e?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Casamentos",
    description: "Surpreenda seus convidados com flash tattoos românticas e personalizadas como lembrança única do seu dia especial.",
    image: "https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Festivais e Shows",
    description: "Estúdio móvel para festivais de música, feiras artísticas e eventos culturais, trazendo uma experiência interativa para o seu público.",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Festas Privadas",
    description: "Transforme sua festa particular em um evento inesquecível com um serviço de tatuagem exclusivo para seus convidados.",
    image: "https://images.unsplash.com/photo-1535243438770-7d895aa316e2?q=80&w=2070&auto=format&fit=crop",
  },
];

const Events = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      eventDate: "",
      eventType: "",
      guestCount: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Aqui enviaria os dados para o backend
      console.log("Dados do formulário:", values);
      
      // Simular um atraso no envio
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Resetar o formulário
      form.reset();
      
      // Mostrar uma mensagem de sucesso
      toast({
        title: "Solicitação enviada com sucesso!",
        description: "Entraremos em contato em breve para discutir os detalhes do seu evento.",
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
    <Layout>
      <Helmet>
        <title>Eventos - 99Tattoo</title>
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative bg-black text-white">
        <div 
          className="absolute inset-0 z-0 opacity-50"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1552627019-947c3789ffb5?q=80&w=2069&auto=format&fit=crop)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10" />
        
        <div className="container mx-auto px-4 py-32 relative z-20">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Tatuagem para <span className="text-red-500">Qualquer Evento</span>
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Transforme seu evento em uma experiência inesquecível com nosso serviço de tatuagens exclusivo. 
              Perfeito para festas corporativas, casamentos, aniversários e muito mais.
            </p>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg"
              onClick={() => {
                document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Reserve Agora
            </Button>
          </div>
        </div>
      </section>
      
      {/* Serviços Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">Serviços para <span className="text-red-500">Todos os Tipos</span> de Eventos</h2>
            <p className="text-gray-600 text-lg">
              Oferecemos serviços personalizados de tatuagem para eventos de qualquer tamanho ou ocasião.
              Nossa equipe experiente transforma seu evento em uma experiência única para seus convidados.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Próximos Eventos Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">Próximos <span className="text-red-500">Eventos</span></h2>
            <p className="text-gray-600 text-lg">
              Confira onde você pode encontrar a equipe da 99Tattoo nos próximos meses.
              Venha nos visitar e conheça nosso trabalho de perto!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="h-56 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="bg-red-500 p-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-gray-600 text-sm ml-2">{event.date}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <div className="flex items-center mb-3">
                    <div className="bg-gray-200 p-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="text-gray-600 text-sm ml-2">{event.location}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <Button className="w-full bg-black hover:bg-gray-800 text-white">
                    Mais Informações
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Formulário de Contato */}
      <section id="contact-form" className="py-20 bg-gradient-to-r from-black to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Reserve a <span className="text-red-500">99Tattoo</span> para seu Evento
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Interessado em contratar nossos serviços de tatuagem para seu evento? 
                Preencha o formulário ao lado e nossa equipe entrará em contato para discutir os detalhes e criar uma experiência personalizada para você.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-red-500 p-2 rounded-full mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p className="opacity-80">eventos@99tattoo.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-red-500 p-2 rounded-full mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Telefone</h4>
                    <p className="opacity-80">(11) 99999-9999</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-red-500 p-2 rounded-full mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Endereço do Estúdio</h4>
                    <p className="opacity-80">Av. Paulista, 1000 - São Paulo, SP</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white text-black rounded-lg p-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-6">Solicite um orçamento</h3>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="name"
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
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="seu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
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
                    
                    <FormField
                      control={form.control}
                      name="eventDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data do Evento</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="eventType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Evento</FormLabel>
                          <FormControl>
                            <Input placeholder="Corporativo, Casamento, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="guestCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de Convidados</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="100" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensagem (opcional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Conte-nos mais sobre seu evento e o que você está buscando..."
                            rows={4}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Events;
