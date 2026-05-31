import { QUESTIONS_ROUTINE, INTERVIEWER_SYSTEM_PROMPT } from '../prompts/interviewerPrompt';
import { InterviewResponse } from '../types/interview';

export class CareerInterviewer {
  private systemPrompt: string;
  private questions: string[];

  constructor() {
    this.systemPrompt = INTERVIEWER_SYSTEM_PROMPT;
    this.questions = QUESTIONS_ROUTINE;
  }

  /**
   * Obtém o prompt do sistema para contextualização do agente.
   */
  public getSystemPrompt(): string {
    return this.systemPrompt;
  }

  /**
   * Recupera a pergunta atual com base no índice do estado.
   */
  public getQuestion(index: number): string {
    if (index >= 0 && index < this.questions.length) {
      return this.questions[index];
    }
    throw new Error(`Índice de pergunta inválido: ${index}`);
  }

  /**
   * Valida se a resposta do usuário é aceitável (evita respostas vazias ou strings de espaços).
   */
  public validateResponse(response: string): boolean {
    if (!response || response.trim().length < 2) {
      return false;
    }
    return true;
  }

  /**
   * Consolida e limpa as respostas brutas coletadas, transformando-as no payload
   * tipado esperado pelo sistema e pelo Agent 2.
   */
  public compileProfile(rawResponses: Partial<InterviewResponse>): InterviewResponse {
    // Garante que os dados obrigatórios possuem fallback caso o parser do orquestrador falhe
    const compiledProfile: InterviewResponse = {
      interests: rawResponses.interests || 'Tecnologia Geral',
      experience: rawResponses.experience || 'zero',
      studyHours: rawResponses.studyHours || 10,
      preference: rawResponses.preference || 'código',
      objective: rawResponses.objective || 'primeiro emprego',
      technologies: rawResponses.technologies && rawResponses.technologies.length > 0 
        ? rawResponses.technologies 
        : ['Lógica de Programação'],
      previousExperience: rawResponses.previousExperience || 'Nenhuma informada'
    };

    return compiledProfile;
  }

  /**
   * Retorna a saudação inicial combinada com a primeira pergunta do fluxo.
   */
  public getWelcomeMessage(): string {
    return `Olá! 👋\nSou seu entrevistador de carreira em tecnologia. Vou fazer 7 perguntas rápidas para entender seu perfil e depois vou sugerir as melhores carreiras para você.\nPreparado? Então vamos lá!\n\n${this.questions[0]}`;
  }
}
