
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Star, Lightbulb } from 'lucide-react';

const guideItems = [
  "Título Atrativo e SEO-Friendly",
  "URL Otimizada",
  "Meta Description",
  "Tags Relevantes",
  "Autor Credenciado",
  "Imagem Destacada HD",
  "Guideline do Blog 99Tattoo"
];

const checklistItems = [
  "#01 Defina personas e objetivos",
  "#02 Liste keywords principais",
  "#03 Separe keywords por jornada de compra",
  "#04 Defina a pauta e estrutura",
  "#05 Escolha call to action e links internos",
  "#06 Selecione imagens e elementos gráficos",
  "#07 Escreva o conteúdo completo",
  "#08 Edite e revise o texto",
  "#09 Publique e otimize",
  "#10 Distribua nas redes sociais",
];

const KanbanGuideColumn = () => {
  return (
    <div className="w-full md:w-[340px] flex-shrink-0">
      <Card className="h-full bg-gradient-to-b from-red-900 via-red-800 to-black border-t-4 border-red-500 shadow-2xl shadow-red-500/20">
        <CardHeader className="border-b border-red-600/50 bg-gradient-to-r from-red-600 to-red-700">
          <CardTitle className="flex items-center gap-3 text-white font-black text-lg">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-2 rounded-full shadow-lg">
              <Star className="h-5 w-5 text-black" />
            </div>
            <span className="drop-shadow-lg">Tenha em Mente</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-6 bg-gradient-to-b from-black/90 to-red-900/20 h-[calc(100vh-280px)] overflow-y-auto">
          <div className="bg-gradient-to-br from-red-800/30 to-red-900/50 p-4 rounded-xl border border-red-600/30 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              <h4 className="text-white font-bold text-lg">Template do Artigo:</h4>
            </div>
            <ul className="space-y-3">
              {guideItems.map((item, index) => (
                <li key={index} className="text-sm text-gray-200 bg-black/40 p-3 rounded-lg border border-red-700/50 shadow-md hover:bg-red-900/20 transition-all duration-300">
                  <span className="text-red-400 font-bold mr-2">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-red-800/30 to-red-900/50 p-4 rounded-xl border border-red-600/30 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <CheckSquare className="h-5 w-5 text-green-400" />
              <h4 className="text-white font-bold text-lg">Checklist de Produção:</h4>
            </div>
            <ul className="space-y-3">
              {checklistItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-gray-200 bg-black/40 p-3 rounded-lg border border-red-700/50 shadow-md hover:bg-red-900/20 transition-all duration-300">
                  <CheckSquare className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
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
