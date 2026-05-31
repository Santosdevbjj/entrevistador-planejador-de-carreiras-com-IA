export enum AgentState {
  INTERVIEW = 'INTERVIEW',
  ANALYSIS = 'ANALYSIS',
  CAREER_SELECTION = 'CAREER_SELECTION',
  PLANNING = 'PLANNING'
}

export interface InterviewResponse {
  interests: string;
  experience: string;
  studyHours: number;
  preference: 'pessoas' | 'dados' | 'código';
  objective: 'primeiro emprego' | 'transição' | 'crescimento';
  technologies: string[];
  previousExperience: string;
}

export interface CareerSuggestion {
  name: string;
  score: number;
  strengths: string[];
  challenges: string[];
  marketOverview: string;
}

export interface OrchestrationState {
  currentState: AgentState;
  currentQuestionIndex: number;
  responses: Partial<InterviewResponse>;
  suggestions: CareerSuggestion[];
  selectedCareer?: string;
}
