
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Gift, Crown, Target, ChevronRight } from "lucide-react";
import { LoyaltyStatus } from "@/services/mock/mockUserProfileService";

interface LoyaltyStatusCardProps {
  loyaltyStatus: LoyaltyStatus;
  className?: string;
}

const LoyaltyStatusCard: React.FC<LoyaltyStatusCardProps> = ({ loyaltyStatus, className = "" }) => {
  const getLevelIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'bronze':
        return <Star className="h-6 w-6 text-orange-600" />;
      case 'prata':
      case 'silver':
        return <Gift className="h-6 w-6 text-gray-600" />;
      case 'ouro':
      case 'gold':
        return <Crown className="h-6 w-6 text-yellow-600" />;
      default:
        return <Target className="h-6 w-6 text-red-600" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'bronze':
        return 'from-orange-100 to-orange-200';
      case 'prata':
      case 'silver':
        return 'from-gray-100 to-gray-200';
      case 'ouro':
      case 'gold':
        return 'from-yellow-100 to-yellow-200';
      default:
        return 'from-red-100 to-red-200';
    }
  };

  const progressPercentage = (loyaltyStatus.points / (loyaltyStatus.points + loyaltyStatus.points_to_next)) * 100;

  return (
    <Card className={`bg-gradient-to-br from-white to-red-50 border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-red-600 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Status de Fidelidade
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Ver Detalhes <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Atual */}
        <div className="text-center">
          <div className={`bg-gradient-to-r ${getLevelColor(loyaltyStatus.level)} rounded-full p-6 mb-3 inline-flex items-center justify-center`}>
            {getLevelIcon(loyaltyStatus.level)}
            <div className="ml-3">
              <h3 className="text-2xl font-bold text-gray-800">{loyaltyStatus.level}</h3>
              <p className="text-gray-600">{loyaltyStatus.points} pontos</p>
            </div>
          </div>
        </div>
        
        {/* Progresso para o próximo nível */}
        <div className="bg-white rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Próximo nível: {loyaltyStatus.next_level}</p>
            <p className="text-sm font-medium text-red-600">
              {loyaltyStatus.points_to_next} pontos restantes
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-red-500 to-red-700 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 text-center">
            {Math.round(progressPercentage)}% para o próximo nível
          </p>
        </div>
        
        {/* Benefícios Ativos */}
        <div>
          <h4 className="text-red-600 font-medium mb-3 flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Benefícios Ativos
          </h4>
          <div className="space-y-2">
            {loyaltyStatus.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                  {benefit}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border border-red-200">
          <p className="text-sm text-red-700 text-center font-medium">
            🎯 Complete seu perfil para ganhar +50 pontos!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoyaltyStatusCard;
