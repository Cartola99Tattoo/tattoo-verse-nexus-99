
export interface JourneyStage {
  id: string;
  title: string;
  definition?: string;
  mainProblem?: string;
  mainSolution?: string;
  productService?: string;
  contentIdeas: string[];
}

export interface CustomerJourney {
  id: string;
  personaId?: string;
  personaName?: string;
  stages: {
    discovery: JourneyStage;
    problemRecognition: JourneyStage;
    solutionConsideration: JourneyStage;
    purchaseDecision: JourneyStage;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateJourneyData {
  personaId?: string;
  personaName?: string;
  stages: {
    discovery: Omit<JourneyStage, 'id'>;
    problemRecognition: Omit<JourneyStage, 'id'>;
    solutionConsideration: Omit<JourneyStage, 'id'>;
    purchaseDecision: Omit<JourneyStage, 'id'>;
  };
}
