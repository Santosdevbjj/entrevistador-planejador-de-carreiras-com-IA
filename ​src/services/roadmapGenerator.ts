import { CareerPlanner } from '../agents/careerPlanner';
import { OpenAIService } from './openaiService';
import { InterviewResponse } from '../types/interview';

export class RoadmapGeneratorService {
  private plannerAgent: CareerPlanner;
  private openaiService: OpenAIService;

  constructor() {
    this.plannerAgent = new CareerPlanner();
    this.openaiService = new OpenAIService();
  }

  /**
   * Orquestra a geração do plano de estudos final do usuário a partir dos dados do Agent 1.
   * @param selectedCareer Nome da carreira escolhida pelo usuário.
   * @param profile Perfil consolidado gerado a partir das respostas da entrevista.
   */
  public async generateCustomRoadmap(selectedCareer: string, profile: InterviewResponse): Promise<string> {
    try {
      // 1. Instancia o prompt do sistema customizado para o Planner (Agent 2)
      const systemPrompt = `Você é o Agent 2: O Planejador de Carreiras Sênior especialista em gerar roadmaps personalizados.
Você receberá um payload estruturado com a carreira escolhida pelo usuário e o perfil consolidado dele.

Sua missão é gerar um plano de estudos no formato exato requisitado pelo design do sistema.

Diretrizes de Personalização de acordo com as Regras de Negócio:
- HORAS/SEMANA < 5h: Estenda prazos no roadmap de 90 dias, focando exclusivamente no Core Vital.
- HORAS/SEMANA > 15h: Adicione deploys complexos e tópicos avançados.
- EXPERIÊNCIA Zero: Explicações didáticas e analogias do cotidiano.
- OBJETIVO Transição: Destaque explicitamente a transferência de Soft e Hard Skills das experiências anteriores informadas.

ATENÇÃO: NUNCA cite salários específicos. Mantenha as seções delimitadas pelos emojis padrão do layout.`;

      // 2. Constrói o payload estruturado (User Prompt) com as diretrizes aplicadas
      const userPayload = this.plannerAgent.buildPlannerPayload(selectedCareer, profile);

      // 3. Dispara a requisição assíncrona para a LLM processar e formatar o layout do Agent 2
      const structuredRoadmap = await this.openaiService.getChatCompletion(
        systemPrompt,
        userPayload
      );

      return structuredRoadmap;
    } catch (error: any) {
      console.error('Erro na camada do RoadmapGeneratorService:', error.message || error);
      
      // Fallback gracioso de texto estruturado caso a API falhe em tempo de execução
      return `### ⚠️ Erro de Conexão Temporário
Olá! Peço desculpas, mas encontrei uma instabilidade ao gerar o seu roteiro completo com a inteligência artificial.

**Aqui estão seus dados compilados de Handoff:**
* **Carreira Selecionada:** ${selectedCareer}
* **Carga Disponível:** ${profile.studyHours}h semanais.
* **Objetivo:** Focado em ${profile.objective}.

Por favor, tente novamente em alguns instantes para carregar o mapa detalhado de 90 dias e o portfólio.`;
    }
  }
}
