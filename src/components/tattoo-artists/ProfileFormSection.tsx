
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ProfileFormSectionProps {
  title: string;
  icon: React.ComponentType<any>;
  progress: number;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  description?: string;
}

const ProfileFormSection: React.FC<ProfileFormSectionProps> = ({
  title,
  icon: Icon,
  progress,
  isExpanded,
  onToggle,
  children,
  description
}) => {
  return (
    <Card className="border-red-100 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <Icon className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-red-600 text-lg">{title}</CardTitle>
              {description && (
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-red-600 hover:bg-red-50"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        
        {/* Section Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progresso da seção</span>
            <span className="text-red-600 font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          {children}
        </CardContent>
      )}
    </Card>
  );
};

export default ProfileFormSection;
