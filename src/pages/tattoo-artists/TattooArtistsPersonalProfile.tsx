import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Target, 
  BarChart3, 
  BookOpen, 
  Settings, 
  Camera, 
  Plus, 
  Edit, 
  Trash2,
  FileText,
  Play,
  Download,
  CheckCircle,
  Clock,
  Star,
  Award,
  Package,
  Lock,
  Trophy,
  Sparkles
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";
import StockManagementTool from "@/components/tattoo-artists/StockManagementTool";
import ProfileProgressBar from "@/components/tattoo-artists/ProfileProgressBar";
import ExpandedProfileForm from "@/components/tattoo-artists/ExpandedProfileForm";
import { useProfileProgress } from "@/hooks/useProfileProgress";

// Mock data expandido para o perfil
const mockProfileExpanded = {
  // Campos básicos
  name: "Carlos Silva",
  artistName: "Carlos Ink",
  email: "carlos.ink@99tattoo.com.br",
  phone: "(11) 99999-9999",
  location: "São Paulo, SP",
  specialties: ["Realismo", "Old School", "Pontilhismo"],
  portfolio: "https://instagram.com/carlos.ink",
  avatar: "https://placehold.co/150x150/dc2626/ffffff?text=CI",
  
  // Campos profissionais (parcialmente preenchidos para demonstrar progressão)
  experience: 8,
  studioType: "Estúdio Próprio",
  mainEquipment: "", // Vazio para mostrar progresso
  detailedStyles: ["Realismo Preto e Cinza", "Old School"], // Parcialmente preenchido
  
  // Campos de engajamento (vazios para demonstrar progressão)
  certifications: ["Biossegurança"], // Apenas um para demonstrar
  collaborationAvailable: undefined, // Vazio
  communityInterests: [], // Vazio
  artistBio: "" // Vazio
};

// Mock data para metas
const mockGoals = [
  {
    id: 1,
    title: "Aumentar faturamento mensal",
    specific: "Aumentar faturamento mensal em 30%",
    measurable: "30%",
    achievable: "Sim, através de otimização de preços e marketing",
    relevant: "Essencial para crescimento sustentável do negócio",
    timebound: "2024-12-31",
    status: "Em Andamento"
  },
  {
    id: 2,
    title: "Concluir curso de realismo",
    specific: "Finalizar curso avançado de tatuagem realista",
    measurable: "100% do conteúdo",
    achievable: "Sim, com dedicação de 2h por semana",
    relevant: "Ampliar expertise e atrair novos clientes",
    timebound: "2024-10-15",
    status: "Concluída"
  },
  {
    id: 3,
    title: "Implementar sistema de agendamento",
    specific: "Implementar software de agendamento online",
    measurable: "Sistema completo funcionando",
    achievable: "Sim, com investimento planejado",
    relevant: "Melhorar experiência do cliente e organização",
    timebound: "2024-11-30",
    status: "Em Andamento"
  }
];

// Mock data para diagnóstico SPIN
const spinQuestions = {
  situation: [
    "Qual o volume médio de clientes que você atende por mês?",
    "Quais ferramentas você utiliza atualmente para gerenciar seus agendamentos?",
    "Como você atualmente divulga seu trabalho?"
  ],
  problem: [
    "Quais são os maiores desafios que você enfrenta para atrair novos clientes?",
    "Você tem dificuldades em precificar seu trabalho de forma justa?",
    "Qual é a sua maior dificuldade no dia a dia do estúdio?"
  ],
  implication: [
    "Como esses desafios impactam seu faturamento ou sua capacidade de crescer?",
    "O que acontece se você não conseguir resolver esses problemas?",
    "Qual o impacto da falta de organização no seu trabalho?"
  ],
  need: [
    "Como seria o cenário ideal para o seu estúdio?",
    "Quais recursos ou ferramentas poderiam te ajudar a superar esses desafios?",
    "O que você mais precisa para atingir seus objetivos profissionais?"
  ]
};

// Mock data para conteúdo exclusivo
const exclusiveContent = [
  {
    id: 1,
    title: "Guia Completo de Biossegurança",
    description: "Manual essencial sobre higiene e segurança no estúdio",
    type: "PDF",
    category: "Gestão",
    icon: FileText,
    downloadUrl: "#",
    requiredLevel: 25,
    unlocked: false
  },
  {
    id: 2,
    title: "Técnicas Avançadas de Traço Fino",
    description: "Masterclass em vídeo com técnicas profissionais de fineline",
    type: "Vídeo",
    category: "Técnicas",
    icon: Play,
    videoUrl: "#",
    requiredLevel: 50,
    unlocked: false
  },
  {
    id: 3,
    title: "Template de Contrato Profissional",
    description: "Modelo de contrato completo para proteger seu trabalho",
    type: "PDF",
    category: "Gestão",
    icon: FileText,
    downloadUrl: "#",
    requiredLevel: 75,
    unlocked: false
  },
  {
    id: 4,
    title: "Sistema de Gestão de Estoque",
    description: "Ferramenta exclusiva para controlar materiais do estúdio",
    type: "Ferramenta",
    category: "Gestão",
    icon: Package,
    requiredLevel: 75,
    unlocked: false,
    isSpecial: true
  },
  {
    id: 5,
    title: "Sessão de Mentoria Exclusiva",
    description: "Mentoria personalizada com especialistas da 99Tattoo",
    type: "Serviço",
    category: "Mentoria",
    icon: Award,
    requiredLevel: 100,
    unlocked: false,
    isSpecial: true
  },
  {
    id: 6,
    title: "Marketing Digital para Tatuadores",
    description: "Estratégias eficazes de marketing para atrair mais clientes",
    type: "PDF",
    category: "Marketing",
    icon: FileText,
    downloadUrl: "#",
    requiredLevel: 25,
    unlocked: false
  }
];

const TattooArtistsPersonalProfile = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [profile, setProfile] = useState(mockProfileExpanded);
  const [goals, setGoals] = useState(mockGoals);
  const [spinResponses, setSpinResponses] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [contentFilter, setContentFilter] = useState('all');

  // Usar o hook de progresso
  const { progress, sectionProgress, completedMilestones, unlockedContent } = useProfileProgress(profile);

  // Atualizar conteúdo exclusivo baseado no progresso
  const exclusiveContent = [
    {
      id: 1,
      title: "Guia Completo de Biossegurança",
      description: "Manual essencial sobre higiene e segurança no estúdio",
      type: "PDF",
      category: "Gestão",
      icon: FileText,
      downloadUrl: "#",
      requiredLevel: 25,
      unlocked: unlockedContent.biosafetyGuide
    },
    {
      id: 2,
      title: "Técnicas Avançadas de Traço Fino",
      description: "Masterclass em vídeo com técnicas profissionais de fineline",
      type: "Vídeo",
      category: "Técnicas",
      icon: Play,
      videoUrl: "#",
      requiredLevel: 50,
      unlocked: unlockedContent.advancedTechniques
    },
    {
      id: 3,
      title: "Template de Contrato Profissional",
      description: "Modelo de contrato completo para proteger seu trabalho",
      type: "PDF",
      category: "Gestão",
      icon: FileText,
      downloadUrl: "#",
      requiredLevel: 75,
      unlocked: unlockedContent.contractTemplate
    },
    {
      id: 4,
      title: "Sistema de Gestão de Estoque",
      description: "Ferramenta exclusiva para controlar materiais do estúdio",
      type: "Ferramenta",
      category: "Gestão",
      icon: Package,
      requiredLevel: 75,
      unlocked: unlockedContent.stockManagement,
      isSpecial: true
    },
    {
      id: 5,
      title: "Sessão de Mentoria Exclusiva",
      description: "Mentoria personalizada com especialistas da 99Tattoo",
      type: "Serviço",
      category: "Mentoria",
      icon: Award,
      requiredLevel: 100,
      unlocked: unlockedContent.mentorship,
      isSpecial: true
    },
    {
      id: 6,
      title: "Marketing Digital para Tatuadores",
      description: "Estratégias eficazes de marketing para atrair mais clientes",
      type: "PDF",
      category: "Marketing",
      icon: FileText,
      downloadUrl: "#",
      requiredLevel: 25,
      unlocked: unlockedContent.biosafetyGuide
    }
  ];

  const menuItems = [
    { id: 'profile', label: 'Perfil do Tatuador', icon: User },
    { id: 'goals', label: 'Metas para o Estúdio', icon: Target },
    { id: 'diagnosis', label: 'Diagnóstico Estratégico', icon: BarChart3 },
    { id: 'content', label: 'Conteúdos Exclusivos', icon: BookOpen }
  ];

  // Função para atualizar campos do perfil
  const handleUpdateProfile = (field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    // Simular salvamento
    toast({
      title: "Perfil salvo com sucesso!",
      description: "Suas informações foram atualizadas.",
    });

    // Verificar se desbloqueou novo conteúdo
    const newProgress = useProfileProgress(profile).progress;
    const newMilestones = [];
    if (newProgress >= 25 && !completedMilestones.includes(25)) newMilestones.push(25);
    if (newProgress >= 50 && !completedMilestones.includes(50)) newMilestones.push(50);
    if (newProgress >= 75 && !completedMilestones.includes(75)) newMilestones.push(75);
    if (newProgress >= 100 && !completedMilestones.includes(100)) newMilestones.push(100);

    // Mostrar notificação de desbloqueio
    newMilestones.forEach(milestone => {
      setTimeout(() => {
        toast({
          title: "🎉 Parabéns! Novo conteúdo desbloqueado!",
          description: `Você alcançou ${milestone}% de progresso e desbloqueou conteúdos exclusivos!`,
        });
      }, 1000);
    });
  };

  const handleGoalStatusChange = (goalId, newStatus) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, status: newStatus } : goal
    ));
    toast({
      title: "Status atualizado!",
      description: `Meta marcada como ${newStatus}`,
    });
  };

  const handleSpinResponse = (category, questionIndex, response) => {
    setSpinResponses(prev => ({
      ...prev,
      [`${category}_${questionIndex}`]: response
    }));
  };

  const generateDiagnosisReport = () => {
    toast({
      title: "Relatório gerado!",
      description: "Seu diagnóstico estratégico foi processado com sucesso.",
    });
  };

  const handleContentAction = (content) => {
    if (!content.unlocked) {
      toast({
        title: "Conteúdo bloqueado",
        description: `Complete ${content.requiredLevel}% do seu perfil para desbloquear este conteúdo.`,
      });
      return;
    }

    if (content.type === 'PDF') {
      toast({
        title: "Download iniciado!",
        description: `Baixando: ${content.title}`,
      });
    } else if (content.type === 'Vídeo') {
      toast({
        title: "Reproduzindo vídeo",
        description: `Assistindo: ${content.title}`,
      });
    } else if (content.type === 'Ferramenta') {
      // Abrir ferramenta específica
      setIsModalOpen(true);
    }
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      {/* Barra de Progresso */}
      <ProfileProgressBar 
        progress={progress} 
        completedMilestones={completedMilestones}
      />

      {/* Selo de Perfil Verificado */}
      {unlockedContent.verifiedBadge && (
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-6 w-6" />
              <Badge className="bg-white text-green-600 font-bold">
                PERFIL MASTER
              </Badge>
            </div>
            <p className="font-medium">
              🎉 Parabéns! Seu perfil está 100% completo e você desbloqueou todos os benefícios exclusivos!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Formulário Expandido */}
      <ExpandedProfileForm
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        sectionProgress={sectionProgress}
      />

      <Button 
        onClick={handleSaveProfile}
        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg"
        size="lg"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Salvar Perfil e Verificar Progresso
      </Button>
    </div>
  );

  const renderGoalsSection = () => (
    <Card className="border-red-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <Target className="h-5 w-5" />
          Metas para o Estúdio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-semibold text-red-800 mb-2">Metodologia SMART</h3>
          <p className="text-red-700 text-sm">
            Defina metas <strong>Específicas</strong>, <strong>Mensuráveis</strong>, 
            <strong>Atingíveis</strong>, <strong>Relevantes</strong> e <strong>Temporais</strong> 
            para o sucesso do seu estúdio.
          </p>
        </div>

        <div className="space-y-4">
          {goals.map(goal => (
            <div key={goal.id} className="bg-white border border-red-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={goal.status === 'Concluída' ? 'default' : 'secondary'}
                    className={goal.status === 'Concluída' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                  >
                    {goal.status === 'Concluída' ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                    {goal.status}
                  </Badge>
                  <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{goal.specific}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="font-medium">Mensurável:</span> {goal.measurable}
                </div>
                <div>
                  <span className="font-medium">Prazo:</span> {new Date(goal.timebound).toLocaleDateString()}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Relevância:</span> {goal.relevant}
                </div>
              </div>
              {goal.status === 'Em Andamento' && (
                <div className="mt-3">
                  <Button 
                    size="sm" 
                    onClick={() => handleGoalStatusChange(goal.id, 'Concluída')}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Marcar como Concluída
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Nova Meta
        </Button>
      </CardContent>
    </Card>
  );

  const renderDiagnosisSection = () => (
    <Card className="border-red-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <BarChart3 className="h-5 w-5" />
          Diagnóstico Estratégico
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-semibold text-red-800 mb-2">SPIN Selling</h3>
          <p className="text-red-700 text-sm">
            Responda às perguntas abaixo para identificar oportunidades de crescimento 
            e desenvolver estratégias personalizadas para seu estúdio.
          </p>
        </div>

        {Object.entries(spinQuestions).map(([category, questions]) => (
          <div key={category} className="space-y-4">
            <h3 className="font-semibold text-gray-900 capitalize border-b border-red-100 pb-2">
              {category === 'situation' && '📊 Situação'}
              {category === 'problem' && '❗ Problema'}
              {category === 'implication' && '⚠️ Implicação'}
              {category === 'need' && '💡 Necessidade'}
            </h3>
            {questions.map((question, index) => (
              <div key={index} className="space-y-2">
                <Label className="text-sm font-medium">{question}</Label>
                <Textarea
                  placeholder="Sua resposta..."
                  value={spinResponses[`${category}_${index}`] || ''}
                  onChange={(e) => handleSpinResponse(category, index, e.target.value)}
                  className="rounded-lg"
                  rows={3}
                />
              </div>
            ))}
          </div>
        ))}

        <Button 
          onClick={generateDiagnosisReport}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg"
        >
          <Award className="h-4 w-4 mr-2" />
          Gerar Relatório de Diagnóstico
        </Button>
      </CardContent>
    </Card>
  );

  const renderContentSection = () => (
    <Card className="border-red-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <BookOpen className="h-5 w-5" />
          Conteúdos Exclusivos
          <Badge className="bg-red-600 text-white">
            {exclusiveContent.filter(c => c.unlocked).length}/{exclusiveContent.length} Desbloqueados
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ferramentas Especiais */}
        <div className="space-y-4">
          {exclusiveContent.filter(c => c.isSpecial).map(content => (
            <Card 
              key={content.id} 
              className={`border-2 ${
                content.unlocked 
                  ? 'border-red-200 bg-gradient-to-r from-red-50 to-red-100' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${
                  content.unlocked ? 'text-red-700' : 'text-gray-500'
                }`}>
                  {content.unlocked ? (
                    <content.icon className="h-5 w-5" />
                  ) : (
                    <Lock className="h-5 w-5" />
                  )}
                  {content.title}
                  {content.unlocked ? (
                    <Badge className="bg-red-600 text-white">Desbloqueado</Badge>
                  ) : (
                    <Badge variant="outline">Requer {content.requiredLevel}%</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`mb-4 ${content.unlocked ? 'text-red-700' : 'text-gray-500'}`}>
                  {content.description}
                </p>
                {content.id === 4 && content.unlocked && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                        <Package className="h-4 w-4 mr-2" />
                        Acessar Sistema de Estoque
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-red-600">Sistema de Gestão de Estoque</DialogTitle>
                      </DialogHeader>
                      <StockManagementTool />
                    </DialogContent>
                  </Dialog>
                )}
                {content.id === 5 && (
                  <Button 
                    onClick={() => handleContentAction(content)}
                    disabled={!content.unlocked}
                    className={content.unlocked 
                      ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                      : "bg-gray-400 text-gray-600 cursor-not-allowed"
                    }
                  >
                    {content.unlocked ? (
                      <>
                        <Award className="h-4 w-4 mr-2" />
                        Agendar Mentoria
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Bloqueado
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator />

        {/* Filtros */}
        <div className="flex gap-2">
          <Button 
            variant={contentFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setContentFilter('all')}
            className="rounded-lg"
          >
            Todos
          </Button>
          <Button 
            variant={contentFilter === 'unlocked' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setContentFilter('unlocked')}
            className="rounded-lg"
          >
            Desbloqueados
          </Button>
          <Button 
            variant={contentFilter === 'locked' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setContentFilter('locked')}
            className="rounded-lg"
          >
            Bloqueados
          </Button>
        </div>

        {/* Grid de Conteúdos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exclusiveContent
            .filter(content => !content.isSpecial)
            .filter(content => {
              if (contentFilter === 'unlocked') return content.unlocked;
              if (contentFilter === 'locked') return !content.unlocked;
              return true;
            })
            .map(content => (
              <div 
                key={content.id} 
                className={`border rounded-lg p-4 transition-all duration-300 ${
                  content.unlocked 
                    ? 'bg-white border-red-100 hover:shadow-lg' 
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${
                    content.unlocked ? 'bg-red-100' : 'bg-gray-200'
                  }`}>
                    {content.unlocked ? (
                      <content.icon className="h-5 w-5 text-red-600" />
                    ) : (
                      <Lock className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      content.unlocked ? 'border-red-200 text-red-600' : 'border-gray-300 text-gray-500'
                    }`}
                  >
                    {content.category}
                  </Badge>
                </div>
                
                <h4 className={`font-semibold mb-2 ${
                  content.unlocked ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {content.title}
                </h4>
                
                <p className={`text-sm mb-4 ${
                  content.unlocked ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {content.description}
                </p>
                
                <Button 
                  onClick={() => handleContentAction(content)}
                  className={`w-full ${
                    content.unlocked 
                      ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  size="sm"
                  disabled={!content.unlocked}
                >
                  {content.unlocked ? (
                    content.type === 'PDF' ? (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Assistir
                      </>
                    )
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Requer {content.requiredLevel}%
                    </>
                  )}
                </Button>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <TattooArtistLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Meu Perfil 
              {unlockedContent.verifiedBadge && (
                <Badge className="ml-2 bg-green-600 text-white">
                  <Trophy className="h-3 w-3 mr-1" />
                  Verificado
                </Badge>
              )}
            </h1>
            <p className="text-gray-600">
              Complete seu perfil para desbloquear conteúdos exclusivos e ferramentas profissionais
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar Menu */}
            <div className="lg:col-span-1">
              <Card className="border-red-100 sticky top-6">
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    {menuItems.map(item => (
                      <Button
                        key={item.id}
                        variant={activeSection === item.id ? 'default' : 'ghost'}
                        className={`w-full justify-start rounded-lg ${
                          activeSection === item.id 
                            ? 'bg-gradient-to-r from-red-600 to-red-700 text-white' 
                            : 'text-gray-700 hover:bg-red-50'
                        }`}
                        onClick={() => setActiveSection(item.id)}
                      >
                        <item.icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </Button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeSection === 'profile' && renderProfileSection()}
              {activeSection === 'goals' && renderGoalsSection()}
              {activeSection === 'diagnosis' && renderDiagnosisSection()}
              {activeSection === 'content' && renderContentSection()}
            </div>
          </div>
        </div>
      </div>
    </TattooArtistLayout>
  );
};

export default TattooArtistsPersonalProfile;
