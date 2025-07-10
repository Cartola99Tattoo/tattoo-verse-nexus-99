
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Edit, 
  Trash2,
  Eye,
  EyeOff,
  Clock,
  CheckCircle,
  Calendar,
  BarChart3,
  Trophy,
  Zap
} from 'lucide-react';

interface SmartGoal {
  id?: string;
  title: string;
  specific: string;
  measurable: string;
  measurableValue: number;
  achievable: string;
  relevant: string;
  timebound: string;
  status: 'Em Andamento' | 'Concluída' | 'Pausada' | 'Cancelada';
  isPublic: boolean;
  createdAt?: string;
}

interface SmartGoalDisplayProps {
  goal: SmartGoal;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (newStatus: SmartGoal['status']) => void;
}

const SmartGoalDisplay: React.FC<SmartGoalDisplayProps> = ({ 
  goal, 
  onEdit, 
  onDelete, 
  onStatusChange 
}) => {
  const getStatusIcon = (status: SmartGoal['status']) => {
    switch (status) {
      case 'Concluída':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Em Andamento':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'Pausada':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Cancelada':
        return <Clock className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: SmartGoal['status']) => {
    switch (status) {
      case 'Concluída':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Em Andamento':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pausada':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cancelada':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getDaysUntilDeadline = () => {
    const deadline = new Date(goal.timebound);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysUntilDeadline();

  return (
    <Card className="border-red-100 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-red-600 mb-2">
              <Target className="h-5 w-5" />
              {goal.title}
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={getStatusColor(goal.status)}>
                {getStatusIcon(goal.status)}
                <span className="ml-1">{goal.status}</span>
              </Badge>
              <Badge variant="outline" className="border-red-200">
                {goal.isPublic ? (
                  <>
                    <Eye className="h-3 w-3 mr-1" />
                    Pública
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" />
                    Privada
                  </>
                )}
              </Badge>
              {daysLeft > 0 && (
                <Badge variant="outline" className="border-purple-200 text-purple-700">
                  <Calendar className="h-3 w-3 mr-1" />
                  {daysLeft} dias restantes
                </Badge>
              )}
              {daysLeft <= 0 && goal.status !== 'Concluída' && (
                <Badge className="bg-red-100 text-red-800 border-red-200">
                  <Calendar className="h-3 w-3 mr-1" />
                  Prazo vencido
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onEdit}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onDelete}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Seções SMART */}
        <div className="grid gap-4">
          {/* Específica */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                S
              </div>
              <h4 className="font-semibold text-red-700">Específica</h4>
            </div>
            <p className="text-gray-700 text-sm">{goal.specific}</p>
          </div>

          {/* Mensurável */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                M
              </div>
              <h4 className="font-semibold text-blue-700">Mensurável</h4>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <span className="text-gray-700 text-sm">
                {goal.measurable}: <strong className="text-blue-700">{goal.measurableValue}</strong>
              </span>
            </div>
          </div>

          {/* Atingível e Relevante */}
          <div className="grid md:grid-cols-2 gap-4">
            {goal.achievable && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    A
                  </div>
                  <h4 className="font-semibold text-green-700">Atingível</h4>
                </div>
                <p className="text-gray-700 text-sm">{goal.achievable}</p>
              </div>
            )}

            {goal.relevant && (
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    R
                  </div>
                  <h4 className="font-semibold text-orange-700">Relevante</h4>
                </div>
                <p className="text-gray-700 text-sm">{goal.relevant}</p>
              </div>
            )}
          </div>

          {/* Temporal */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                T
              </div>
              <h4 className="font-semibold text-purple-700">Temporal</h4>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span className="text-gray-700 text-sm">
                Prazo: <strong className="text-purple-700">{formatDate(goal.timebound)}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Ações de Status */}
        {goal.status === 'Em Andamento' && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={() => onStatusChange('Concluída')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Trophy className="h-4 w-4 mr-1" />
              Marcar como Concluída
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStatusChange('Pausada')}
              className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
            >
              Pausar Meta
            </Button>
          </div>
        )}

        {goal.status === 'Pausada' && (
          <Button
            size="sm"
            onClick={() => onStatusChange('Em Andamento')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Zap className="h-4 w-4 mr-1" />
            Retomar Meta
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartGoalDisplay;
