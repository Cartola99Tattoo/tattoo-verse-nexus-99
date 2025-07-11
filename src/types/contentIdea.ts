
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
  // Campos expandidos de rascunho detalhado
  draftTitles?: string[]; // Múltiplas ideias de título
  draftSummary?: string;
  draftContent?: string;
  seoKeywords?: string[]; // Palavras-chave para SEO
  provisionalSlug?: string; // URL provisória
  suggestedAuthor?: string; // Autor sugerido
  featuredImageUrl?: string; // Imagem destacada
  internalLinks?: string[]; // Links internos sugeridos
  suggestedCTA?: string; // Call to Action sugerido
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
  // Campos expandidos de rascunho detalhado
  draftTitles?: string[];
  draftSummary?: string;
  draftContent?: string;
  seoKeywords?: string[];
  provisionalSlug?: string;
  suggestedAuthor?: string;
  featuredImageUrl?: string;
  internalLinks?: string[];
  suggestedCTA?: string;
}
