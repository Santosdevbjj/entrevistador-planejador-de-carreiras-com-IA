import * as readline from 'readline';
import * as dotenv from 'dotenv';
import { CareerOrchestrator } from './agents/orchestrator';
import { AgentState, InterviewResponse } from './types/interview';
import { QUESTIONS_ROUTINE } from './prompts/interviewerPrompt';
import { RoadmapGeneratorService } from './services/roadmapGenerator';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

class Application {
  private orchestrator: CareerOrchestrator;
  private roadmapService: RoadmapGeneratorService;
  private rl: readline.Interface;

  constructor() {
    this.orchestrator = new CareerOrchestrator();
    this.roadmapService = new RoadmapGeneratorService();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  /**
   * Inicializa o loop principal do sistema multiagente
   */
  public async start(): Promise<void> {
    console.clear();
    console.log("================================================================");
    console.log("🤖 IA Mentor de Carreira - Bootcamp CAIXA (DIO)");
    console.log("================================================================\n");

    // Exibe a mensagem de boas-vindas inicial e a primeira pergunta (Agent 1)
    console.log("Olá! 👋");
    console.log("Sou seu entrevistador de carreira em tecnologia. Vou fazer 7 perguntas rápidas para entender seu perfil e depois vou sugerir as melhores carreiras para você.");
    console.log("Preparado? Então vamos lá!\n");
    console.log(`[Pergunta 1] ${QUESTIONS_ROUTINE[0]}`);

    this.promptUser();
  }

  /**
   * Captura recursivamente a entrada do usuário e gerencia os estados do Orquestrador
   */
  private promptUser(): void {
    this.rl.question('\nVocê: ', async (input) => {
      // Validação simples de input vazio
      if (!input || input.trim().length < 1) {
        console.log('\n⚠️ Por favor, digite uma resposta válida para prosseguir.');
        this.promptUser();
        return;
      }

      // Envia o input para processamento do Orquestrador de Agentes
      const currentStatus = this.orchestrator.getStatus();
      const outputMessage = this.orchestrator.handleUserInput(input);

      console.log(`\n🤖 Mentor IA: ${outputMessage}`);

      // Verifica para qual estado o sistema transitou após o último input
      const nextStatus = this.orchestrator.getStatus();

      if (nextStatus.currentState === AgentState.CAREER_SELECTION && currentStatus.currentState === AgentState.INTERVIEW) {
        // Acabamos de entrar na fase de escolha de carreira (Análise impressa na tela)
        this.promptUser();
      } 
      else if (nextStatus.currentState === AgentState.PLANNING) {
        // Usuário escolheu a carreira! O Handoff automático para o Agent 2 foi disparado.
        await this.executeCareerPlanningPhase(nextStatus.selectedCareer!, nextStatus.responses);
      } 
      else if (nextStatus.currentState === AgentState.INTERVIEW) {
        // Exibe a próxima pergunta enumerada do fluxo
        console.log(`\n[Pergunta ${nextStatus.currentQuestionIndex + 1}] ${QUESTIONS_ROUTINE[nextStatus.currentQuestionIndex]}`);
        this.promptUser();
      } 
      else {
        this.promptUser();
      }
    });
  }

  /**
   * Aciona o Agent 2 de forma assíncrona para gerar o Roadmap de 90 dias via OpenAI
   */
  private async executeCareerPlanningPhase(selectedCareer: string, responses: Partial<InterviewResponse>): Promise<void> {
    console.log('\n⏳ Conectando ao Agent 2: Planejador de Carreiras...');
    console.log('⏳ Compilando matriz de decisão e gerando seu Roadmap customizado na nuvem (isso pode levar alguns segundos)... \n');

    try {
      // Consolida o perfil com fallbacks de segurança
      const compiledProfile: InterviewResponse = {
        interests: responses.interests || 'Geral',
        experience: responses.experience || 'zero',
        studyHours: responses.studyHours || 10,
        preference: responses.preference || 'código',
        objective: responses.objective || 'primeiro emprego',
        technologies: responses.technologies || ['Lógica'],
        previousExperience: responses.previousExperience || 'Nenhuma'
      };

      // Dispara o serviço que consome o Agent 2 + LLM
      const finalRoadmap = await this.roadmapService.generateCustomRoadmap(selectedCareer, compiledProfile);
      
      console.log('\n================================================================');
      console.log('🚀 SEU PLANO DE DESENVOLVIMENTO DE CARREIRA PROFISSONAL');
      console.log('================================================================\n');
      console.log(finalRoadmap);

    } catch (error) {
      console.error('\n❌ Ocorreu um erro crítico ao gerar o plano:', error);
    } finally {
      this.rl.close();
      console.log('\n================================================================');
      console.log('✨ Obrigado por utilizar o IA Mentor de Carreira! Bons estudos.');
      console.log('================================================================');
    }
  }
}

// Inicializa a aplicação
const app = new Application();
app.start();
