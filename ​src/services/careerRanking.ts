import { InterviewResponse, CareerSuggestion } from '../types/interview';
import { Career } from '../types/career';
import careersData from '../data/careers.json';

export class CareerRankingService {
  private careers: Career[] = careersData as Career[];

  public calculateRankings(profile: InterviewResponse): CareerSuggestion[] {
    const suggestions: CareerSuggestion[] = this.careers.map((career) => {
      const score = this.calculateCareerScore(profile, career);
      
      // Geração de metadados estruturados para apoio visual do Agent 1
      return {
        name: career.name,
        score: score,
        strengths: [
          `Alta sinergia com sua preferência por ${profile.preference}.`,
          `Aproveita seu interesse em ${profile.technologies.slice(0, 2).join(', ')}.`
        ],
        challenges: [
          career.baseRampUpDifficulty <= 2 ? "Curva de aprendizado inicial íngreme." : "Necessidade de forte portfólio prático.",
          `Adaptação ao modelo focado em de objetivos de ${profile.objective}.`
        ],
        marketOverview: "A demanda de mercado para esta posição é resiliente, variando conforme a senioridade e a região geográfica."
      };
    });

    // Ordena por maior pontuação e retorna os top 3
    return suggestions.sort((a, b) => b.score - a.score).slice(0, 3);
  }

  private calculateCareerScore(profile: InterviewResponse, career: Career): number {
    let score = 0;

    // 1. Afinidade por Preferência Central (Max 5)
    if (profile.preference === career.preferenceMatch) score += 5;

    // 2. Afinidade por Tags de Interesse (Max 5)
    const matchedTags = career.interestTags.filter(tag => 
      profile.interests.toLowerCase().includes(tag) || 
      profile.technologies.some(tech => tech.toLowerCase().includes(tag))
    );
    score += Math.min(matchedTags.length * 1.5, 5);

    // 3. Demanda de Mercado Nativa (Max 5)
    score += career.baseMarketDemand;

    // 4. Ramp-up baseado nas Horas de Estudo Semanais (Max 5)
    if (profile.studyHours >= 15) {
      score += 5; // Consegue tankar carreiras difíceis rapidamente
    } else if (profile.studyHours >= 5) {
      score += career.baseRampUpDifficulty; 
    } else {
      score += Math.min(career.baseRampUpDifficulty + 1, 5); // Prefere tracks com ramp-up mais suave se tiver pouco tempo
    }

    return Math.min(Math.round(score), 20);
  }
}
