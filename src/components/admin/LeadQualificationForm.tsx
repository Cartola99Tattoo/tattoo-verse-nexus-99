
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Plus, X, Target, Brain, TrendingUp } from "lucide-react";
import { Client } from "@/services/interfaces/IClientService";

interface LeadQualificationFormProps {
  client: Client;
  onUpdateLeadScore: (score: number) => void;
  onUpdateInterests: (interests: string[]) => void;
  isEditing?: boolean;
}

const LeadQualificationForm: React.FC<LeadQualificationFormProps> = ({
  client,
  onUpdateLeadScore,
  onUpdateInterests,
  isEditing = false
}) => {
  const [leadScore, setLeadScore] = useState(client.lead_score || 0);
  const [interests, setInterests] = useState<string[]>(client.qualified_interests || []);
  const [newInterest, setNewInterest] = useState("");

  const handleScoreChange = (value: number[]) => {
    const score = value[0];
    setLeadScore(score);
    if (isEditing) {
      onUpdateLeadScore(score);
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      const updatedInterests = [...interests, newInterest.trim()];
      setInterests(updatedInterests);
      setNewInterest("");
      if (isEditing) {
        onUpdateInterests(updatedInterests);
      }
    }
  };

  const removeInterest = (interestToRemove: string) => {
    const updatedInterests = interests.filter(interest => interest !== interestToRemove);
    setInterests(updatedInterests);
    if (isEditing) {
      onUpdateInterests(updatedInterests);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "🔥 Muito Quente";
    if (score >= 60) return "🔶 Quente";
    if (score >= 40) return "🟡 Morno";
    if (score >= 20) return "❄️ Frio";
    return "🧊 Muito Frio";
  };

  return (
    <div className="space-y-4">
      {/* Pontuação do Lead */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4" />
            Pontuação do Lead
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Score Atual</Label>
              <span className={`font-bold ${getScoreColor(leadScore)}`}>
                {leadScore}/100
              </span>
            </div>
            
            <Slider
              value={[leadScore]}
              onValueChange={handleScoreChange}
              max={100}
              step={5}
              className="w-full"
              disabled={!isEditing}
            />
            
            <div className="text-center">
              <Badge variant="secondary" className={getScoreColor(leadScore)}>
                {getScoreLabel(leadScore)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interesses Qualificados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Brain className="h-4 w-4" />
            Interesses Qualificados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing && (
            <div className="flex gap-2">
              <Input
                placeholder="Ex: Tatuagem Floral, Eventos Corporativos..."
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addInterest()}
              />
              <Button size="sm" onClick={addInterest}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            {interests.length === 0 ? (
              <span className="text-gray-500 text-sm">Nenhum interesse identificado</span>
            ) : (
              interests.map((interest, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {interest}
                  {isEditing && (
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-600" 
                      onClick={() => removeInterest(interest)}
                    />
                  )}
                </Badge>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sugestões de Interesses Comuns */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4" />
              Sugestões de Interesses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                "Tatuagem Floral",
                "Realismo",
                "Eventos Corporativos",
                "Tatuagem Tradicional",
                "Blackwork",
                "Aquarela",
                "Consultoria",
                "Primeira Tatuagem",
                "Cover-up",
                "Tatuagem Colorida"
              ].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (!interests.includes(suggestion)) {
                      const updatedInterests = [...interests, suggestion];
                      setInterests(updatedInterests);
                      onUpdateInterests(updatedInterests);
                    }
                  }}
                  className="text-xs"
                  disabled={interests.includes(suggestion)}
                >
                  + {suggestion}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeadQualificationForm;
