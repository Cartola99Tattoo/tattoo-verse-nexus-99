
export interface Persona {
  id: string;
  name: string;
  age: number;
  education: string;
  gender: 'Masculino' | 'Feminino' | 'Não Binário' | 'Prefiro não informar';
  occupation: string;
  behavior: string;
  communication_channels: string;
  main_objective: string;
  fears_doubts: string;
  how_99tattoo_helps: string;
  studio_values: string;
  tattoo_goals: string;
  common_objections: string;
  information_sources: string;
  what_makes_unnecessary: string;
  expected_experience: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePersonaData {
  name: string;
  age: number;
  education: string;
  gender: 'Masculino' | 'Feminino' | 'Não Binário' | 'Prefiro não informar';
  occupation: string;
  behavior: string;
  communication_channels: string;
  main_objective: string;
  fears_doubts: string;
  how_99tattoo_helps: string;
  studio_values: string;
  tattoo_goals: string;
  common_objections: string;
  information_sources: string;
  what_makes_unnecessary: string;
  expected_experience: string;
}
