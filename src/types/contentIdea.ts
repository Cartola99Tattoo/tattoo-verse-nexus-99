
export interface ContentIdea {
  id: string;
  theme: string;
  format: 'Blog Post' | 'eBook' | 'Webinar/Live' | 'Vídeo Curto' | 'Post de Redes Sociais' | 'Infográfico' | 'Estudo de Caso' | 'Outro';
  purchaseStage: 'Aprendizado e Descoberta' | 'Reconhecimento do Problema' | 'Consideração da Solução' | 'Decisão de Compra';
  focusPersonas: string[]; // Array of persona IDs
  personaRelevance: string;
  focusKeyword: string;
  status: 'Ideia' | 'Planejado' | 'Em Produção' | 'Em Revisão' | 'Fazendo Imagens/Gráficos' | 'Conteúdo Agendado' | 'Publicado' | 'Promover/Distribuir' | 'Arquivado';
  notes: string;
  ideaCreator: string;
  // Novos campos de rascunho
  draftTitle?: string;
  draftSummary?: string;
  draftContent?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateContentIdeaData {
  theme: string;
  format: 'Blog Post' | 'eBook' | 'Webinar/Live' | 'Vídeo Curto' | 'Post de Redes Sociais' | 'Infográfico' | 'Estudo de Caso' | 'Outro';
  purchaseStage: 'Aprendizado e Descoberta' | 'Reconhecimento do Problema' | 'Consideração da Solução' | 'Decisão de Compra';
  focusPersonas: string[];
  personaRelevance: string;
  focusKeyword: string;
  status: 'Ideia' | 'Planejado' | 'Em Produção' | 'Em Revisão' | 'Fazendo Imagens/Gráficos' | 'Conteúdo Agendado' | 'Publicado' | 'Promover/Distribuir' | 'Arquivado';
  notes: string;
  ideaCreator: string;
  // Novos campos de rascunho
  draftTitle?: string;
  draftSummary?: string;
  draftContent?: string;
}
