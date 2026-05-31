import { AgentState, InterviewResponse, CareerSuggestion, OrchestrationState } from '../types/interview';
import { QUESTIONS_ROUTINE } from '../prompts/interviewerPrompt';
import { CareerRankingService } from '../services/careerRanking';

export class CareerOrchestrator {
  private state: OrchestrationState;
  private rankingService: CareerRankingService;

  constructor() {
    this.rankingService = new CareerRankingService();
    this.state = {
      currentState: AgentState.INTERVIEW,
      currentQuestionIndex: 0,
      responses: {},
      suggestions: []
    };
  }

  public getStatus() {
    return this.state;
  }

  public handleUserInput(input: string): string {
    switch (this.state.currentState) {
      case AgentState.INTERVIEW:
        return this.processInterviewStep(input);
      case AgentState.CAREER_SELECTION:
        return this.processCareerSelection(input);
      default:
        return "Desculpe, o fluxo de processamento está em uma etapa inválida.";
    }
  }

  private processInterviewStep(input: string): string {
    const idx = this.state.currentQuestionIndex;
    
    // Mapeia e sanitiza as respostas dinamicamente para o State
    this.mapInputToProfile(idx, input);

    if (idx < QUESTIONS_ROUTINE.length - 1) {
      this.state.currentQuestionIndex++;
      return QUESTIONS_ROUTINE[this.state.currentQuestionIndex];
    } else {
      // Avança para Análise Automatizada
      this.state.currentState = AgentState.ANALYSIS;
      return this.executeAnalysisPhase();
    }
  }

  private mapInputToProfile(index: number, input: string): void {
    // Parser inteligente simples (Em produção, validado via Zod/LLM)
    const data = this.state.responses;
    if (index === 0) data.interests = input;
    if (index === 1) data.experience = input;
    if (index === 2) data.studyHours = parseInt(input.replace(/\D/g, '')) || 10;
    if (index === 3) data.preference = input.toLowerCase().includes('dado') ? 'dados' : input.toLowerCase().includes('pess') ? 'pessoas' : 'código';
    if (index === 4) data.objective = input.toLowerCase().includes('trans') ? 'transição' : input.toLowerCase().includes('cresc') ? 'crescimento' : 'primeiro emprego';
    if (index === 5) data.technologies = input.split(',').map(s => s.trim());
    if (index === 6) data.previousExperience = input;
  }

  private executeAnalysisPhase(): string {
    const profile = this.state.responses as InterviewResponse;
    const rankings = this.rankingService.calculateRankings(profile);
    this.state.suggestions = rankings;
    this.state.currentState = AgentState.CAREER_SELECTION;

    // Renderiza a interface exatamente no padrão pedido
    let output = `Perfeito! Tenho tudo que preciso. Deixa eu analisar o melhor caminho para você...\n\n`;
    output += `Com base no seu perfil, identifiquei 3 carreiras muito promissoras:\n`;

    const medals = ['🥇 1º LUGAR', '🥈 2º LUGAR', '🥉 3º LUGAR'];
    rankings.forEach((car, index) => {
      output += `\n════════════════════════════════════════════════════════════\n`;
      output += `${medals[index]}: ${car.name.toUpperCase()} - ${car.score}/20\n`;
      output += `════════════════════════════════════════════════════════════\n`;
      output += `💡 POR QUE COMBINA COM VOCÊ:\n${car.strengths.join('\n')}\n\n`;
      output += `⚖️ O QUE ESPERAR:\nVANTAGENS:\n - Transição alinhada\nDESAFIOS:\n - ${car.challenges.join('\n - ')}\n\n`;
      output += `📈 MERCADO:\n${car.marketOverview}\n`;
    });

    output += `\n════════════════════════════════════════════════════════════\n`;
    output += `Qual dessas carreiras te chamou mais atenção?`;
    
    return output;
  }

  private processCareerSelection(input: string): string {
    const chosen = this.state.suggestions.find(c => c.name.toLowerCase().includes(input.toLowerCase()));
    
    if (!chosen) {
      return "Não consegui identificar qual das 3 opções você escolheu. Por favor, digite o nome de uma das carreiras citadas acima.";
    }

    this.state.selectedCareer = chosen.name;
    this.state.currentState = AgentState.PLANNING;

    // Handoff de dados limpo para o Agent 2 consumir via LLM
    return `Excellent choice! Vou te passar para meu colega especialista em ${chosen.name}. Ele vai montar todo o plano de estudos personalizado para você!`;
  }
}
