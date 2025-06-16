
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { 
  Star, 
  CheckCircle, 
  Users, 
  Clock, 
  Target, 
  Zap, 
  Award, 
  Phone, 
  Mail,
  Shield,
  Calendar,
  Camera,
  MessageSquare,
  Laptop,
  TrendingUp,
  Heart,
  Globe
} from 'lucide-react';

const TattooConsultancy = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados do formulário:', formData);
    toast({
      title: "Solicitação enviada!",
      description: "Em breve entraremos em contato para agendar sua consultoria.",
    });
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black/80 to-red-800/20"></div>
        
        {/* Hero content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-500 via-red-400 to-red-600 bg-clip-text text-transparent leading-tight">
              Digitalize Seu Estúdio de Tatuagem para a Nova Era
            </h1>
            
            <h2 className="text-xl md:text-2xl mb-8 text-gray-300 font-light leading-relaxed">
              Pare de depender das redes sociais. Atraia clientes qualificados que realmente buscam 
              tatuadores talentosos no Google e dedique-se a criar suas obras-primas na pele!
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="xl"
                className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold px-8 py-4 text-lg shadow-2xl hover:shadow-red-glow transform hover:scale-105 transition-all duration-300"
                onClick={() => scrollToSection('contact')}
              >
                <Zap className="mr-2 h-5 w-5" />
                Quero Digitalizar Meu Estúdio Agora!
              </Button>
              
              <Button 
                variant="outline"
                size="xl"
                className="border-red-500 text-red-400 hover:bg-red-500/10 px-8 py-4 text-lg"
                onClick={() => scrollToSection('benefits')}
              >
                Conhecer a Consultoria
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-red-500" />
                <span>+50 Estúdios Digitalizados</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-red-500" />
                <span>4.9/5 Avaliação</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-red-500" />
                <span>30 Dias de Garantia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-red-500 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-red-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Transformation Section */}
      <section id="transformation" className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gradient-red">
              O que a Digitalização Mudará na Sua Vida?
            </h2>
            
            <div className="text-lg text-gray-300 space-y-6 text-left">
              <p className="text-center text-xl text-red-400 font-semibold">
                "Onde você geralmente pesquisa quando quer comprar algo ou fazer um procedimento especializado?"
              </p>
              
              <p>
                A resposta é óbvia: <strong className="text-red-500">Google</strong>. A venda de tatuagens funciona 
                exatamente da mesma forma. Seus clientes ideais estão pesquisando por "estúdios de tatuagem perto de mim" 
                ou "estúdios de tattoo na minha cidade" agora mesmo.
              </p>
              
              <p>
                Enquanto seus concorrentes <strong className="text-red-500">ainda estão perdendo tempo nas redes sociais 
                querendo viralizar</strong>, você estará aparecendo nas primeiras posições do Google, atraindo clientes 
                qualificados que realmente valorizam arte de qualidade.
              </p>
              
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 my-8">
                <blockquote className="text-center italic text-gray-200">
                  <p className="mb-4">
                    "Se você conhece o inimigo e conhece a si mesmo, não precisa temer o resultado de cem batalhas. 
                    Se você se conhece mas não conhece o inimigo, para cada vitória ganha sofrerá também uma derrota. 
                    Se você não conhece nem o inimigo nem a si mesmo, perderá todas as batalhas."
                  </p>
                  <footer className="text-red-400 font-semibold">— Sun Tzu</footer>
                </blockquote>
                <p className="text-sm text-gray-400 mt-4 text-center">
                  Nossa metodologia te ensina a conhecer seu mercado e se posicionar estrategicamente.
                </p>
              </div>
              
              <p>
                Com um estúdio digitalizado, você terá <strong className="text-red-500">mais tempo para se dedicar 
                a criar suas tatuagens de forma mais tranquila</strong> e ter mais qualidade de vida. Nosso sistema 
                filtra automaticamente as solicitações de orçamento, trazendo apenas clientes alinhados com seu trabalho.
              </p>
              
              <p>
                Construa sua carreira em <strong className="text-red-500">terreno próprio</strong> e tenha 
                <strong className="text-red-500"> controle total de como as pessoas veem seu estúdio</strong> 
                como sendo a autoridade que é!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient-red">
              Benefícios de Ter um Estúdio Digitalizado
            </h2>
            <p className="text-xl text-gray-300">
              Tudo que você precisa para se destacar da concorrência
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <Laptop className="h-8 w-8" />,
                title: "Estúdio Virtual Personalizado",
                description: "Criado sob medida, seguindo suas ideias e personalidade única"
              },
              {
                icon: <Target className="h-8 w-8" />,
                title: "Orçamentos Qualificados",
                description: "Solicitações mais alinhadas com o público que você quer atender"
              },
              {
                icon: <Heart className="h-8 w-8" />,
                title: "Missão e Propósito",
                description: "Auxílio na criação da comunicação que expressa seu propósito artístico"
              },
              {
                icon: <Clock className="h-8 w-8" />,
                title: "Funcionamento 24h",
                description: "Controle total sobre a tecnologia que trabalha para você dia e noite"
              },
              {
                icon: <TrendingUp className="h-8 w-8" />,
                title: "Rastreamento Inteligente",
                description: "Tecnologia para rastrear origem dos contatos e melhorar campanhas"
              },
              {
                icon: <Camera className="h-8 w-8" />,
                title: "Galeria Profissional",
                description: "Exposição de 9 fotos de portfólio de forma estratégica"
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Depoimentos Poderosos",
                description: "6 imagens de depoimentos para gerar conexão e autoridade"
              },
              {
                icon: <MessageSquare className="h-8 w-8" />,
                title: "Contato Direto",
                description: "Botões que direcionam visitantes para suas redes de atendimento"
              },
              {
                icon: <Mail className="h-8 w-8" />,
                title: "E-mail Profissional",
                description: "Ex: artista@99tattoo.art.br para se diferenciar da concorrência"
              },
              {
                icon: <Zap className="h-8 w-8" />,
                title: "Captura Automática",
                description: "Entrega de indicações de pessoas querendo tatuar via e-mail"
              },
              {
                icon: <Award className="h-8 w-8" />,
                title: "Orçamentos Personalizados",
                description: "Informações completas do lead para envio de propostas precisas"
              },
              {
                icon: <Globe className="h-8 w-8" />,
                title: "Presença Digital Completa",
                description: "Domine sua presença online e seja encontrado facilmente"
              }
            ].map((benefit, index) => (
              <Card key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center text-red-500">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-white">{benefit.title}</h3>
                  <p className="text-gray-300 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Agitation Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-red-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-red-400">
              Ainda Não Digitalizou Seu Estúdio? Entenda o Problema!
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6 text-red-300">Questões que Todo Tatuador Deveria se Fazer:</h3>
              <div className="space-y-4 text-lg text-gray-300">
                <p className="italic">
                  "Será que o universo da tatuagem está saturado, ou isso é efeito de tantos tatuadores 
                  divulgando nas mesmas redes sociais?"
                </p>
                <p className="italic">
                  "Lotar a agenda é a solução mais viável e saudável para nossa saúde mental?"
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-red-900/20 border-red-500/30">
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-4 text-red-400 flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Consequências Pessoais e Profissionais
                  </h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Crises de ansiedade constantes</li>
                    <li>• Rebaixamento de valores do seu trabalho</li>
                    <li>• Bloqueio criativo por pressão</li>
                    <li>• Perda de qualidade e reputação</li>
                    <li>• Perda de momentos importantes na vida</li>
                    <li>• Esgotamento físico e mental</li>
                    <li>• Atração de clientes que pagam pouco</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-red-900/20 border-red-500/30">
                <CardContent className="p-6">
                  <h4 className="text-xl font-bold mb-4 text-red-400 flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Ineficiência das Redes Sociais
                  </h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Roubo constante de atenção</li>
                    <li>• Ambiente despreparado para contato real</li>
                    <li>• Dificuldade de entender algoritmos</li>
                    <li>• Atração de pessoas de outras regiões</li>
                    <li>• Direct com mensagens que geram ansiedade</li>
                    <li>• Perda de tempo sem retorno garantido</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center bg-gradient-to-r from-red-600/20 to-red-800/20 rounded-lg p-8 border border-red-500/30">
              <h3 className="text-2xl font-bold mb-4 text-red-300">A Mudança que Você Precisa</h3>
              <p className="text-lg text-gray-200">
                <strong>Isso tudo só acontece porque você não está comunicando o seu propósito de forma clara e objetiva</strong>, 
                e só irá mudar quando você tiver o seu estúdio de tatuagem digitalizado para a nova era através de nossa consultoria!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey Section */}
      <section className="py-20 bg-gradient-to-b from-red-900/20 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-gradient-red">
              Nossa Jornada e Sua Inspiração
            </h2>

            <div className="space-y-8 text-lg text-gray-300">
              <div className="bg-gray-800/30 rounded-lg p-8 border border-gray-700">
                <h3 className="text-2xl font-bold mb-4 text-red-400">A História que Começou com Arte</h3>
                <p className="mb-4">
                  Tudo começou com desenho. Vendendo arte na rua, descobri o poder da internet muito antes das redes sociais 
                  dominarem o mercado. Desenvolvi sites e blogs, incluindo um projeto de caricaturas para noivos que me 
                  ensinou o valor de ter presença digital própria.
                </p>
                <p>
                  Quando entrei no universo da tatuagem, percebi que era extremamente competitivo e atrasado na divulgação. 
                  Enquanto outros tatuadores brigavam por atenção nas redes sociais, eu sabia que havia uma forma melhor.
                </p>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-8 border border-gray-700">
                <h3 className="text-2xl font-bold mb-4 text-red-400">O Encontro que Mudou Tudo</h3>
                <p className="mb-4">
                  Foi quando conheci <strong className="text-red-500">Dhuann Rosembach</strong>. Uma troca perfeita: 
                  ele me ensinou novas técnicas de tatuagem, eu digitalizei seu estúdio em Barueri. O resultado? 
                  Dhuann se diferenciou completamente da concorrência.
                </p>
                <p>
                  Hoje, além de vender artes através do meu estúdio virtual da 99Tattoo e ter digitalizado o estúdio Rosembach, 
                  também desenvolvo sites do comércio local. <strong className="text-red-500">Agora quero expandir o poder da 
                  digitalização para ajudar ainda mais tatuadores</strong>, deixando nossa marca na epiderme da história da arte 
                  e do mundo juntos!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-gradient-red">
              Quem Já Transformou Seu Estúdio
            </h2>

            <p className="text-xl text-gray-300 mb-12">
              Vou compartilhar o site do Dhuann com vocês para ilustrar o que estou falando... 
              e vou deixar também o depoimento do Dhu falando sobre nossa consultoria de digitalização.
            </p>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-8 border border-gray-700">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl">
                    DR
                  </div>
                  <h3 className="text-xl font-bold text-white">Dhuann Rosembach</h3>
                  <p className="text-red-400">Tatuador - Barueri/SP</p>
                </div>
                
                <blockquote className="text-gray-300 italic mb-6">
                  "A digitalização do meu estúdio foi um divisor de águas. Antes eu dependia só das redes sociais 
                  e competia com todo mundo pelo mesmo espaço. Agora tenho meu próprio território digital, 
                  clientes me encontram facilmente no Google e posso focar no que realmente amo: criar arte na pele."
                </blockquote>
                
                <div className="flex items-center justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>

              <div className="text-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold px-8 py-4 mb-4"
                >
                  <Globe className="mr-2 h-5 w-5" />
                  Visite o Estúdio Digitalizado do Dhuann
                </Button>
                <p className="text-sm text-gray-400">
                  Veja na prática como funciona um estúdio digitalizado
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Description Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-gradient-red">
              Descrição Detalhada da Consultoria
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: <Globe className="h-8 w-8" />,
                  title: "1 Página de Recepção 24h",
                  description: "Seu estúdio virtual funcionando round-the-clock"
                },
                {
                  icon: <Camera className="h-8 w-8" />,
                  title: "Exposição de 9 Fotos de Portfólio",
                  description: "Galeria profissional estrategicamente organizada"
                },
                {
                  icon: <Users className="h-8 w-8" />,
                  title: "6 Imagens de Depoimentos",
                  description: "Prova social para gerar conexão e autoridade"
                },
                {
                  icon: <Phone className="h-8 w-8" />,
                  title: "Botões de Contato Direto",
                  description: "Ligação direta com suas redes de atendimento"
                },
                {
                  icon: <Mail className="h-8 w-8" />,
                  title: "E-mail Profissional",
                  description: "artista@99tattoo.art.br para se diferenciar"
                },
                {
                  icon: <Target className="h-8 w-8" />,
                  title: "Captura de Contato e Leads",
                  description: "Indicações automáticas de pessoas querendo tatuar"
                },
                {
                  icon: <MessageSquare className="h-8 w-8" />,
                  title: "Informações Completas do Lead",
                  description: "Dados para orçamento personalizado e assertivo"
                },
                {
                  icon: <TrendingUp className="h-8 w-8" />,
                  title: "Sistema de Analytics",
                  description: "Acompanhe resultados e otimize sua estratégia"
                }
              ].map((item, index) => (
                <Card key={index} className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700 hover:border-red-500/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="text-red-500 mt-1">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-gray-300 text-sm">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-gradient-red">
              Suas Dúvidas, Nossas Respostas
            </h2>

            <div className="space-y-6">
              {[
                {
                  question: "Mas e se meu estúdio ficar parecido com o do meu concorrente?",
                  answer: "Jamais! Cada estúdio é criado 100% personalizado, seguindo sua identidade visual, personalidade e propósito artístico. Você terá controle total sobre cores, layout e comunicação."
                },
                {
                  question: "Preciso mesmo de um estúdio de tatuagem digital?",
                  answer: "Se você quer construir sua carreira em terreno próprio, ter controle sobre como as pessoas veem seu trabalho e atrair clientes qualificados que valorizam arte, então sim. Redes sociais são território alugado."
                },
                {
                  question: "Não tenho tempo para implementar toda essa tecnologia no meu estúdio.",
                  answer: "Relaxe! Nós integramos TUDO para você. Você só precisa fornecer as informações e fotos. Cuidamos de toda parte técnica, configuração e integração."
                },
                {
                  question: "Por que nunca ouvi falar sobre essa digitalização de estúdios de tatuagem?",
                  answer: "Porque somos pioneiros! Enquanto outros focam em redes sociais, desenvolvemos essa metodologia exclusiva. Você está entre os primeiros a ter acesso a essa inovação."
                },
                {
                  question: "Qual vai ser o retorno sobre o investimento feito para digitalizar meu estúdio?",
                  answer: "Economia de tempo no pré-atendimento, reconhecimento como autoridade, valorização do seu trabalho, clientes mais qualificados e, principalmente, mais qualidade de vida. O ROI se paga rapidamente."
                }
              ].map((faq, index) => (
                <Card key={index} className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-red-400 mb-3">{faq.question}</h3>
                    <p className="text-gray-300">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-red-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-gradient-red">
              Invista em Sua Arte: Preço e Condições
            </h2>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-red-500/30 shadow-2xl">
              <div className="mb-8">
                <p className="text-xl text-gray-300 mb-4">
                  E o preço dessa consultoria... <strong className="text-red-400">custaria menos do que muitos celulares...</strong>
                </p>
                <p className="text-lg text-gray-400 mb-6">
                  Essa digitalização poderia ser facilmente vendida por mais de <span className="line-through">R$ 7.000</span>...
                </p>
                
                <div className="bg-red-600/20 rounded-lg p-6 mb-6 border border-red-500/30">
                  <p className="text-lg text-red-300 mb-2">
                    <strong>Oferta Especial:</strong> Os 3 primeiros tatuadores recebem desconto de R$ 2.000!
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-6xl font-bold text-red-500 mb-2">R$ 5.000</div>
                  <p className="text-xl text-gray-300 mb-6">Valor total da consultoria completa</p>
                  
                  <div className="bg-green-600/20 rounded-lg p-4 border border-green-500/30 inline-block">
                    <p className="text-green-300 font-semibold">
                      💳 Pagamento via cartão de crédito em até 12x
                    </p>
                    <p className="text-green-200 text-sm">Início imediato após a aprovação</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bonuses Section */}
      <section className="py-20 bg-gradient-to-b from-red-900/20 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-gradient-red">
              Bônus Exclusivos para Você!
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Calendar className="h-8 w-8" />,
                  title: "Acompanhamento Premium",
                  description: "2 consultas mensais durante 3 meses para alinhamento de propósito artístico",
                  value: "R$ 1.200"
                },
                {
                  icon: <Award className="h-8 w-8" />,
                  title: "Identidade Visual",
                  description: "Ajuda na definição da paleta de cores e identidade visual completa",
                  value: "R$ 800"
                },
                {
                  icon: <TrendingUp className="h-8 w-8" />,
                  title: "Consultoria de Vendas",
                  description: "Reuniões de 1h semanais para alinhamento estratégico e crescimento",
                  value: "R$ 1.500"
                },
                {
                  icon: <Users className="h-8 w-8" />,
                  title: "Curso 'Venda Mais Tattoo'",
                  description: "Acesso completo ao nosso curso de vendas especializado para tatuadores",
                  value: "R$ 697"
                },
                {
                  icon: <Target className="h-8 w-8" />,
                  title: "Campanhas Pagas",
                  description: "3 meses de gerenciamento no Google, Instagram, Facebook e YouTube",
                  value: "R$ 2.100"
                },
                {
                  icon: <Globe className="h-8 w-8" />,
                  title: "Redes Sociais Integradas",
                  description: "Desenvolvimento de páginas integradas no Facebook, Instagram e WhatsApp",
                  value: "R$ 600"
                },
                {
                  icon: <MessageSquare className="h-8 w-8" />,
                  title: "Comunidade Secreta",
                  description: "Acesso à comunidade exclusiva no WhatsApp com outros tatuadores digitalizados",
                  value: "R$ 300"
                },
                {
                  icon: <Phone className="h-8 w-8" />,
                  title: "Otimização WhatsApp",
                  description: "Artigo completo sobre configuração do WhatsApp para agilizar agendamentos",
                  value: "R$ 150"
                }
              ].map((bonus, index) => (
                <Card key={index} className="bg-gradient-to-br from-green-800/20 to-green-900/20 border-green-500/30 hover:border-green-400/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="text-green-400 mb-4 flex justify-center">
                      {bonus.icon}
                    </div>
                    <Badge className="bg-green-600 text-white mb-3">{bonus.value}</Badge>
                    <h3 className="text-lg font-bold text-white mb-3">{bonus.title}</h3>
                    <p className="text-gray-300 text-sm">{bonus.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <div className="bg-green-600/20 rounded-lg p-6 border border-green-500/30 inline-block">
                <p className="text-2xl font-bold text-green-300 mb-2">
                  Valor Total dos Bônus: <span className="text-3xl">R$ 7.347</span>
                </p>
                <p className="text-green-200">
                  Você recebe TUDO isso sem custo adicional!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-gradient-red">
              Sua Garantia Zero Riscos
            </h2>

            <div className="bg-gradient-to-br from-blue-800/30 to-blue-900/30 rounded-2xl p-8 border border-blue-500/30">
              <div className="mb-8">
                <Shield className="h-20 w-20 text-blue-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-blue-300 mb-4">Garantia Insana de 30 Dias</h3>
              </div>

              <div className="text-lg text-gray-300 space-y-4">
                <p>
                  <strong className="text-blue-400">Acreditamos tanto na qualidade</strong> e no quanto essa digitalização 
                  irá te dar de resultado já nos primeiros dias...
                </p>
                
                <p>
                  Que oferecemos uma <strong className="text-blue-400">garantia insana</strong> onde você irá passar os 
                  próximos 30 dias trabalhando junto com a gente... e se nesses 30 dias por algum motivo você achar que 
                  essa consultoria não seja para você, <strong className="text-blue-400">devolveremos 100% do seu investimento</strong> 
                  de uma forma rápida e descomplicada.
                </p>
                
                <p className="text-xl font-bold text-blue-300">
                  Simples assim!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="contact" className="py-20 bg-gradient-to-b from-gray-900 to-red-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">
              Sua Oportunidade Começa Agora!
            </h2>
            
            <p className="text-xl text-gray-200 mb-8">
              Clique no botão abaixo, preencha seus dados e escolha a melhor forma de pagamento 
              para já colher seus primeiros resultados antes mesmo dos seus concorrentes.
            </p>

            <div className="bg-gradient-to-br from-black/50 to-gray-900/50 rounded-2xl p-8 border border-red-500/30 mb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Input
                    type="text"
                    name="name"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
                  />
                  <Input
                    type="email"
                    name="email"
                    placeholder="Seu melhor e-mail"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
                  />
                </div>
                
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Seu WhatsApp (com DDD)"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
                />
                
                <Textarea
                  name="message"
                  placeholder="Conte um pouco sobre seu estúdio e seus objetivos..."
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 resize-none"
                />
                
                <Button 
                  type="submit"
                  size="xl"
                  className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-6 text-xl shadow-2xl hover:shadow-red-glow transform hover:scale-105 transition-all duration-300"
                >
                  <Zap className="mr-3 h-6 w-6" />
                  Entre para a Consultoria Agora e Digitalize Seu Estúdio!
                </Button>
              </form>
            </div>

            <div className="bg-yellow-600/20 rounded-lg p-6 border border-yellow-500/30">
              <p className="text-yellow-300 font-bold text-lg mb-2">
                ⚡ ATENÇÃO: Oferta Limitada!
              </p>
              <p className="text-yellow-200">
                Você já deve ter percebido que essa consultoria é diferente... se você chegou até aqui e quer 
                fazer parte desses primeiros 20 tatuadores, <strong>entre agora mesmo</strong> em nossa consultoria 
                e comece a digitalizar seu estúdio de tatuagem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 99Tattoo - Consultoria de Digitalização de Estúdios de Tatuagem
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Transformando tatuadores em autoridades digitais
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TattooConsultancy;
