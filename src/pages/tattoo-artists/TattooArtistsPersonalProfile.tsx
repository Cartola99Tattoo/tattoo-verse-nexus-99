import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Package
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import TattooArtistLayout from "@/components/layouts/TattooArtistLayout";
import StockManagementTool from "@/components/tattoo-artists/StockManagementTool";

// Mock data for tattoo artist profile
const mockProfile = {
  name: "Carlos Silva",
  artistName: "Carlos Ink",
  email: "carlos.ink@99tattoo.com.br",
  phone: "(11) 99999-9999",
  location: "São Paulo, SP",
  specialties: ["Realismo", "Old School", "Pontilhismo"],
  portfolio: "https://instagram.com/carlos.ink",
  avatar: "https://placehold.co/150x150/dc2626/ffffff?text=CI"
};

// Mock data for goals
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

// Mock data for SPIN diagnosis
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

// Mock data for exclusive content
const exclusiveContent = [
  {
    id: 1,
    title: "Guia Completo de Precificação",
    description: "Aprenda a precificar seus trabalhos de forma justa e competitiva",
    type: "PDF",
    category: "Gestão",
    icon: FileText,
    downloadUrl: "#"
  },
  {
    id: 2,
    title: "Marketing Digital para Tatuadores",
    description: "Estratégias eficazes de marketing para atrair mais clientes",
    type: "PDF",
    category: "Marketing",
    icon: FileText,
    downloadUrl: "#"
  },
  {
    id: 3,
    title: "Técnicas Avançadas de Realismo",
    description: "Masterclass com técnicas profissionais de tatuagem realista",
    type: "Vídeo",
    category: "Técnicas",
    icon: Play,
    videoUrl: "#"
  },
  {
    id: 4,
    title: "Gestão Financeira para Estúdios",
    description: "Como organizar e otimizar as finanças do seu estúdio",
    type: "Vídeo",
    category: "Gestão",
    icon: Play,
    videoUrl: "#"
  },
  {
    id: 5,
    title: "Portfólio Profissional",
    description: "Dicas para criar um portfólio que converte clientes",
    type: "PDF",
    category: "Marketing",
    icon: FileText,
    downloadUrl: "#"
  },
  {
    id: 6,
    title: "Sombreamento e Luz",
    description: "Técnicas avançadas de sombreamento para tatuagens",
    type: "Vídeo",
    category: "Técnicas",
    icon: Play,
    videoUrl: "#"
  }
];

const TattooArtistsPersonalProfile = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [profile, setProfile] = useState(mockProfile);
  const [goals, setGoals] = useState(mockGoals);
  const [spinResponses, setSpinResponses] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [contentFilter, setContentFilter] = useState('all');

  const specialtyOptions = [
    "Realismo", "Old School", "New School", "Pontilhismo", 
    "Tribal", "Aquarela", "Minimalista", "Blackwork", "Geométrico"
  ];

  const menuItems = [
    { id: 'profile', label: 'Perfil do Tatuador', icon: User },
    { id: 'goals', label: 'Metas para o Estúdio', icon: Target },
    { id: 'diagnosis', label: 'Diagnóstico Estratégico', icon: BarChart3 },
    { id: 'content', label: 'Conteúdos Exclusivos', icon: BookOpen }
  ];

  const handleSaveProfile = () => {
    // Simulate API call
    toast({
      title: "Perfil salvo com sucesso!",
      description: "Suas informações foram atualizadas.",
    });
  };

  const handleSpecialtyChange = (specialty, checked) => {
    setProfile(prev => ({
      ...prev,
      specialties: checked 
        ? [...prev.specialties, specialty]
        : prev.specialties.filter(s => s !== specialty)
    }));
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
    }
  };

  const renderProfileSection = () => (
    <Card className="border-red-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <User className="h-5 w-5" />
          Perfil do Tatuador
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={profile.avatar} 
              alt="Foto do perfil"
              className="w-24 h-24 rounded-full border-4 border-red-100"
            />
            <Button 
              size="icon" 
              variant="ghost"
              className="absolute -bottom-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full h-8 w-8"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <h3 className="font-semibold text-lg">{profile.name}</h3>
            <p className="text-gray-600">{profile.artistName}</p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              className="rounded-lg"
            />
          </div>
          <div>
            <Label htmlFor="artistName">Nome Artístico</Label>
            <Input
              id="artistName"
              value={profile.artistName}
              onChange={(e) => setProfile(prev => ({ ...prev, artistName: e.target.value }))}
              className="rounded-lg"
            />
          </div>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              value={profile.email}
              disabled
              className="rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
              className="rounded-lg"
            />
          </div>
          <div>
            <Label htmlFor="location">Cidade/Estado</Label>
            <Input
              id="location"
              value={profile.location}
              onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
              className="rounded-lg"
            />
          </div>
          <div>
            <Label htmlFor="portfolio">Link do Portfólio</Label>
            <Input
              id="portfolio"
              value={profile.portfolio}
              onChange={(e) => setProfile(prev => ({ ...prev, portfolio: e.target.value }))}
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Specialties */}
        <div>
          <Label>Especialidades</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {specialtyOptions.map(specialty => (
              <div key={specialty} className="flex items-center space-x-2">
                <Checkbox 
                  id={specialty}
                  checked={profile.specialties.includes(specialty)}
                  onCheckedChange={(checked) => handleSpecialtyChange(specialty, checked)}
                />
                <Label htmlFor={specialty} className="text-sm">{specialty}</Label>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleSaveProfile}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg"
        >
          Salvar Alterações
        </Button>
      </CardContent>
    </Card>
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
        {/* Introduction */}
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-semibold text-red-800 mb-2">Metodologia SMART</h3>
          <p className="text-red-700 text-sm">
            Defina metas <strong>Específicas</strong>, <strong>Mensuráveis</strong>, 
            <strong>Atingíveis</strong>, <strong>Relevantes</strong> e <strong>Temporais</strong> 
            para o sucesso do seu estúdio.
          </p>
        </div>

        {/* Goals List */}
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
        {/* Introduction */}
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-semibold text-red-800 mb-2">SPIN Selling</h3>
          <p className="text-red-700 text-sm">
            Responda às perguntas abaixo para identificar oportunidades de crescimento 
            e desenvolver estratégias personalizadas para seu estúdio.
          </p>
        </div>

        {/* SPIN Questions */}
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
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stock Management Tool - Ferramenta Exclusiva */}
        <Card className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-red-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Package className="h-5 w-5" />
              Gestão de Estoque Pessoal
              <Badge className="bg-red-600 text-white">Exclusivo</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-4">
              Ferramenta exclusiva para gerenciar o estoque do seu estúdio, receber alertas de reposição 
              e gerar listas de compras inteligentes conectadas à nossa loja.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                  <Package className="h-4 w-4 mr-2" />
                  Acessar Ferramenta
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-red-600">Gestão de Estoque Pessoal</DialogTitle>
                </DialogHeader>
                <StockManagementTool />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Separator />

        {/* Filter */}
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
            variant={contentFilter === 'Marketing' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setContentFilter('Marketing')}
            className="rounded-lg"
          >
            Marketing
          </Button>
          <Button 
            variant={contentFilter === 'Técnicas' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setContentFilter('Técnicas')}
            className="rounded-lg"
          >
            Técnicas
          </Button>
          <Button 
            variant={contentFilter === 'Gestão' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setContentFilter('Gestão')}
            className="rounded-lg"
          >
            Gestão
          </Button>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exclusiveContent
            .filter(content => contentFilter === 'all' || content.category === contentFilter)
            .map(content => (
              <div key={content.id} className="bg-white border border-red-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <content.icon className="h-5 w-5 text-red-600" />
                  </div>
                  <Badge variant="outline" className="text-xs">{content.category}</Badge>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{content.title}</h4>
                <p className="text-sm text-gray-600 mb-4">{content.description}</p>
                <Button 
                  onClick={() => handleContentAction(content)}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg"
                  size="sm"
                >
                  {content.type === 'PDF' ? (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Assistir
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
            <p className="text-gray-600">
              Gerencie suas informações, defina metas e acesse conteúdos exclusivos
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
