
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Star, Lightbulb, FileText, Target } from 'lucide-react';

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
    <div className="w-full md:w-[360px] flex-shrink-0">
      <Card className="h-full bg-gradient-to-b from-red-950 via-red-900 to-black border-t-4 border-red-500 shadow-2xl shadow-red-500/30 rounded-xl backdrop-blur-sm">
        <CardHeader className="border-b border-red-600/50 bg-gradient-to-r from-red-700 via-red-600 to-red-800 rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-white font-black text-lg">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-2.5 rounded-full shadow-xl">
              <Star className="h-5 w-5 text-black" />
            </div>
            <span className="drop-shadow-lg filter brightness-110">Tenha em Mente</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-6 bg-gradient-to-b from-black/95 via-red-950/30 to-black/95 h-[calc(100vh-280px)] overflow-y-auto scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-black/50">
          
          {/* Template do Artigo */}
          <div className="bg-gradient-to-br from-red-900/50 via-red-800/40 to-black/70 p-4 rounded-xl border border-red-600/40 shadow-xl backdrop-blur-sm hover:shadow-red-500/30 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-red-500 to-red-700 p-2 rounded-full shadow-lg">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <h4 className="text-white font-bold text-lg">Template do Artigo:</h4>
            </div>
            <ul className="space-y-3">
              {guideItems.map((item, index) => (
                <li key={index} className="text-sm text-red-100 bg-black/60 p-3 rounded-lg border border-red-700/50 shadow-md hover:bg-red-900/30 hover:border-red-500/60 transition-all duration-300 group">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-red-400 to-red-600 rounded-full shadow-lg group-hover:scale-125 transition-transform duration-300"></div>
                    <span className="font-medium">{item}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Checklist de Produção */}
          <div className="bg-gradient-to-br from-red-900/50 via-red-800/40 to-black/70 p-4 rounded-xl border border-red-600/40 shadow-xl backdrop-blur-sm hover:shadow-red-500/30 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-green-500 to-green-700 p-2 rounded-full shadow-lg">
                <CheckSquare className="h-4 w-4 text-white" />
              </div>
              <h4 className="text-white font-bold text-lg">Checklist de Produção:</h4>
            </div>
            <ul className="space-y-3">
              {checklistItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-red-100 bg-black/60 p-3 rounded-lg border border-red-700/50 shadow-md hover:bg-red-900/30 hover:border-red-500/60 transition-all duration-300 group">
                  <div className="bg-gradient-to-br from-green-500 to-green-700 p-1 rounded-full shadow-lg mt-0.5 group-hover:scale-110 transition-transform duration-300">
                    <CheckSquare className="h-3 w-3 text-white" />
                  </div>
                  <span className="font-medium flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-br from-red-900/50 via-red-800/40 to-black/70 p-4 rounded-xl border border-red-600/40 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 p-1.5 rounded-full shadow-lg">
                <Lightbulb className="h-4 w-4 text-white" />
              </div>
              <h5 className="text-white font-bold">Dicas Rápidas:</h5>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-red-200 bg-black/40 p-2 rounded border border-red-700/30">
                ✨ <strong>SEO:</strong> Inclua a keyword no título, URL e primeiro parágrafo
              </p>
              <p className="text-xs text-red-200 bg-black/40 p-2 rounded border border-red-700/30">
                🎯 <strong>Personas:</strong> Adapte a linguagem para o público-alvo
              </p>
              <p className="text-xs text-red-200 bg-black/40 p-2 rounded border border-red-700/30">
                📈 <strong>CTA:</strong> Sempre inclua uma chamada para ação clara
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KanbanGuideColumn;
