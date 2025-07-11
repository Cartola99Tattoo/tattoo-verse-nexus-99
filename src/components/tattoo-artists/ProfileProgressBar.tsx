
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Star, Award, CheckCircle } from 'lucide-react';

interface ProfileProgressBarProps {
  progress: number;
  completedMilestones: number[];
}

const ProfileProgressBar: React.FC<ProfileProgressBarProps> = ({ progress, completedMilestones }) => {
  const milestones = [
    { level: 25, title: "Perfil Básico", icon: Star, reward: "Guia de Biossegurança" },
    { level: 50, title: "Profissional", icon: Award, reward: "Vídeoaula Traço Fino" },
    { level: 75, title: "Especialista", icon: Trophy, reward: "Template + Estoque" },
    { level: 100, title: "Master", icon: CheckCircle, reward: "Mentoria + Selo Verificado" }
  ];

  const getCurrentLevel = () => {
    if (progress >= 100) return "Master";
    if (progress >= 75) return "Especialista";
    if (progress >= 50) return "Profissional";
    if (progress >= 25) return "Perfil Básico";
    return "Iniciante";
  };

  const getNextMilestone = () => {
    return milestones.find(m => progress < m.level);
  };

  const nextMilestone = getNextMilestone();

  return (
    <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200 shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-red-700">Progresso do Perfil</h3>
              <p className="text-red-600">Nível: {getCurrentLevel()}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-red-600">{Math.round(progress)}%</div>
              <p className="text-sm text-red-500">Completo</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress 
              value={progress} 
              className="h-4 bg-red-200" 
            />
            <div className="flex justify-between text-sm text-red-600">
              {milestones.map((milestone) => (
                <div 
                  key={milestone.level}
                  className={`flex flex-col items-center ${
                    progress >= milestone.level ? 'text-red-700 font-semibold' : 'text-red-400'
                  }`}
                >
                  <milestone.icon 
                    className={`h-4 w-4 mb-1 ${
                      progress >= milestone.level ? 'text-red-600' : 'text-red-300'
                    }`} 
                  />
                  <span>{milestone.level}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Milestone */}
          {nextMilestone && (
            <div className="bg-white rounded-lg p-4 border border-red-200">
              <div className="flex items-center gap-3">
                <nextMilestone.icon className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium text-gray-900">
                    Próximo nível: {nextMilestone.title} ({nextMilestone.level}%)
                  </p>
                  <p className="text-sm text-gray-600">
                    Desbloqueie: {nextMilestone.reward}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Completed Milestones */}
          <div className="flex flex-wrap gap-2">
            {completedMilestones.map((level) => {
              const milestone = milestones.find(m => m.level === level);
              if (!milestone) return null;
              
              return (
                <Badge 
                  key={level}
                  className="bg-green-100 text-green-800 border-green-200"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {milestone.title}
                </Badge>
              );
            })}
          </div>

          {/* Motivational Message */}
          {progress < 100 && (
            <div className="bg-red-600 text-white p-3 rounded-lg text-center">
              <p className="text-sm">
                💪 <strong>Continue preenchendo seu perfil</strong> para desbloquear conteúdos exclusivos!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileProgressBar;
