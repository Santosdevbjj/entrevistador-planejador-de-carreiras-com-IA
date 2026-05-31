export interface Career {
  id: string;
  name: string;
  interestTags: string[];
  preferenceMatch: 'pessoas' | 'dados' | 'código';
  baseMarketDemand: number; // 0 a 5
  baseRampUpDifficulty: number; // 0 a 5 (onde 5 é mais fácil de entrar)
}
