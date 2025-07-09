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
import SmartGoalForm from "@/components/tattoo-artists/SmartGoalForm";
import SmartGoalDisplay from "@/components/tattoo-artists/SmartGoalDisplay";
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

// Mock data para meta SMART única (plano gratuito)
const mockSmartGoal = {
  id: "goal_1",
  title: "Aumento de Clientes de Realismo",
  specific: "Aumentar o número de clientes que buscam tatuagens de realismo através de campanhas direcionadas e melhoria da qualidade do portfólio",
  measurable: "Novos clientes de realismo por mês",
  measurableValue: 15,
  achievable: "Sim, através de campanhas focadas no Instagram, parcerias com estúdios de fotografia e aprimoramento contínuo das técnicas de realismo",
  relevant: "Essencial para consolidar minha reputação como especialista em realismo e expandir a base de clientes de alto valor, aumentando significativamente o faturamento mensal",
  timebound: "2025-09-30",
  status: "Em Andamento" as const,
  isPublic: true,
  createdAt: "2024-11-15"
};

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
  const [smartGoal, setSmartGoal] = useState(mockSmartGoal); // Meta única
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  const [spinResponses, setSpinResponses] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contentFilter, setContentFilter] = useState('all');

  // Usar o hook de progresso
  const { progress, sectionProgress, completedMilestones, unlockedContent } = useProfileProgress(profile);

  // Atualizar conteúdo exclusivo baseado no progresso
  const updatedExclusiveContent = [
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
    { id: 'goals', label: 'Meta SMART do Estúdio', icon: Target },
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

  // Funções para gerenciar meta SMART
  const handleSaveGoal = (goalData: typeof mockSmartGoal) => {
    if (smartGoal) {
      // Editando meta existente
      setSmartGoal({ ...goalData, id: smartGoal.id, createdAt: smartGoal.createdAt });
      toast({
        title: "Meta atualizada com sucesso!",
        description: "Sua meta SMART foi atualizada e salva.",
      });
    } else {
      // Criando nova meta
      setSmartGoal({ ...goalData, id: `goal_${Date.now()}`, createdAt: new Date().toISOString() });
      toast({
        title: "Meta criada com sucesso!",
        description: "Sua meta SMART foi criada e salva.",
      });
    }
    setIsGoalFormOpen(false);
  };

  const handleDeleteGoal = () => {
    // Mostrar confirmação via modal (não alert)
    const confirmDelete = window.confirm("Tem certeza que deseja excluir sua meta? Esta ação não pode ser desfeita.");
    if (confirmDelete) {
      setSmartGoal(null);
      toast({
        title: "Meta excluída",
        description: "Sua meta foi removida com sucesso.",
      });
    }
  };

  const handleGoalStatusChange = (newStatus: typeof mockSmartGoal.status) => {
    if (smartGoal) {
      setSmartGoal(prev => prev ? { ...prev, status: newStatus } : null);
      toast({
        title: "Status atualizado!",
        description: `Meta marcada como ${newStatus}`,
      });
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
    <div className="space-y-6">
      {/* Header da Seção */}
      <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-red-700 mb-2">Meta SMART do Estúdio</h2>
              <p className="text-red-600">
                Crie uma meta estruturada seguindo a metodologia SMART para o crescimento do seu estúdio
              </p>
            </div>
            <div className="text-right">
              <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                Plano Gratuito: 1 Meta
              </Badge>
            </div>
          </div>

          {/* Explicação SMART */}
          <div className="bg-white p-4 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Metodologia SMART
            </h3>
            <div className="grid md:grid-cols-5 gap-2 text-sm">
              <div className="text-center">
                <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mx-auto mb-1">S</div>
                <strong className="text-red-700">Específica</strong>
                <p className="text-gray-600">Clara e bem definida</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mx-auto mb-1">M</div>
                <strong className="text-blue-700">Mensurável</strong>
                <p className="text-gray-600">Com métricas claras</p>
              </div>
              <div className="text-center">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mx-auto mb-1">A</div>
                <strong className="text-green-700">Atingível</strong>
                <p className="text-gray-600">Realista e possível</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mx-auto mb-1">R</div>
                <strong className="text-orange-700">Relevante</strong>
                <p className="text-gray-600">Importante e alinhada</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mx-auto mb-1">T</div>
                <strong className="text-purple-700">Temporal</strong>
                <p className="text-gray-600">Com prazo definido</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controle de Meta Única */}
      {!smartGoal && !isGoalFormOpen && (
        <Card className="border-red-100">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <Target className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Crie sua primeira meta SMART
              </h3>
              <p className="text-gray-600 mb-6">
                Defina um objetivo claro e estruturado para o crescimento do seu estúdio usando a metodologia SMART
              </p>
            </div>
            <Button
              onClick={() => setIsGoalFormOpen(true)}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Criar Meta SMART
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Formulário de Meta */}
      {isGoalFormOpen && (
        <SmartGoalForm
          goal={smartGoal}
          onSave={handleSaveGoal}
          onCancel={() => setIsGoalFormOpen(false)}
        />
      )}

      {/* Exibição da Meta */}
      {smartGoal && !isGoalFormOpen && (
        <SmartGoalDisplay
          goal={smartGoal}
          onEdit={() => setIsGoalFormOpen(true)}
          onDelete={handleDeleteGoal}
          onStatusChange={handleGoalStatusChange}
        />
      )}

      {/* Informações do Plano Gratuito */}
      {smartGoal && (
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Award className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-orange-800 mb-1">Plano Gratuito</h4>
                <p className="text-orange-700 text-sm mb-2">
                  Você está usando o plano gratuito e pode ter apenas 1 meta ativa. 
                  Para criar mais metas e desbloquear recursos avançados, considere fazer upgrade.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  Conhecer Planos Premium
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
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
            {updatedExclusiveContent.filter(c => c.unlocked).length}/{updatedExclusiveContent.length} Desbloqueados
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ferramentas Especiais */}
        <div className="space-y-4">
          {updatedExclusiveContent.filter(c => c.isSpecial).map(content => (
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
          {updatedExclusiveContent
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
