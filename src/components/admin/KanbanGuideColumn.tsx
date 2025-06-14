
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Star } from 'lucide-react';

const guideItems = [
  "Título", "Otimizado para SEO", "URL", "Tags", "Autor", "Imagem Destacada", "Guideline do Blog"
];

const checklistItems = [
  "#01 Defina personas e objetivos",
  "#02 Liste keywords",
  "#03 Separe as keywords que se encaixem na jornada de compra",
  "#04 Defina a pauta do conteúdo",
  "#05 Escolha o call to action e alguns links internos",
  "#06 Selecione imagens e elementos gráficos",
  "#07 Escreva",
  "#08 Edite",
  "#09 Publique",
  "#10 Distribua",
];

const KanbanGuideColumn = () => {
  return (
    <div className="w-full md:w-[320px] flex-shrink-0">
      <Card className="h-full bg-gradient-to-b from-black via-gray-900 to-black border-red-800 shadow-2xl shadow-red-500/10">
        <CardHeader className="border-b border-red-800/50">
          <CardTitle className="flex items-center gap-2 text-red-500 font-black text-lg">
            <Star className="h-5 w-5" />
            Tenha em Mente
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-6">
          <div>
            <h4 className="text-white font-bold mb-3">Modelo do Artigo:</h4>
            <ul className="space-y-2">
              {guideItems.map((item, index) => (
                <li key={index} className="text-sm text-gray-300 bg-gray-800/50 p-2 rounded-md border border-gray-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3">Checklist de Produção:</h4>
            <ul className="space-y-2">
              {checklistItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                  <CheckSquare className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KanbanGuideColumn;
