import { PLANNER_SYSTEM_PROMPT } from '../prompts/plannerPrompt';
import { InterviewResponse } from '../types/interview';

export class CareerPlanner {
  private systemPrompt: string;

  constructor() {
    this.systemPrompt = PLANNER_SYSTEM_PROMPT;
  }

  /**
   * Constrói o prompt de contexto (User Prompt) enriquecido e customizado
   * adaptando as regras de negócio baseadas no perfil do candidato.
   */
  public buildPlannerPayload(career: string, profile: InterviewResponse): string {
    const personalizationDirectives = this.getPersonalizationDirectives(profile);

    return `
=== DADOS RECEBIDOS DO AGENT 1 ===
CARREIRA_ESCOLHIDA: ${career}
HORAS_SEMANA: ${profile.studyHours}h/semana
EXPERIENCIA: ${profile.experience}
OBJETIVO: ${profile.objective}
PREFERENCIA: ${profile.preference}
INTERESSES: ${profile.technologies.join(', ')} (Foco em: ${profile.interests})
EXPERIÊNCIA_ANTERIOR_PROVENIENTE: ${profile.previousExperience}

=== DIRETRIZES DE ADAPTAÇÃO CUSTOMIZADA ===
${personalizationDirectives}

=== INSTRUÇÃO DE SAÍDA ===
Gere IMEDIATAMENTE a conversa inicial e o PLANO COMPLETO utilizando exatamente a estrutura de blocos e emojis abaixo. Não resuma as seções e popule com dados reais da área de ${career}:

"Olá! Recebi suas informações do entrevistador. 
Vejo que você escolheu ${career} e tem ${profile.studyHours} horas por semana para estudar. Perfeito!
Vou montar agora seu plano completo personalizado...

📦 GERAR PLANO COMPLETO

🧩 VISÃO DO DIA A DIA
Como é o trabalho de um(a) ${career}:
(atividade típica 1)
(atividade típica 2)
(atividade típica 3)
(atividade típica 4)
(atividade típica 5)

🧠 MAPA DE SKILLS
CORE SKILLS (essenciais):
(skill 1)
(skill 2)
(skill 3)
NICE-TO-HAVE (complementares):
(skill 1)
(skill 2)
FERRAMENTAS E TECNOLOGIAS:
(tecnologia 1)
(tecnologia 2)
(tecnologia 3)

📅 ROADMAP DE 90 DIAS
ADAPTADO PARA: ${profile.studyHours} horas/semana
MÊS 1 - FUNDAMENTOS
SEMANA 1-2:
(meta específica 1)
(meta específica 2)
SEMANA 3-4:
(meta específica 1)
(meta específica 2)

MÊS 2 - PRÁTICA
SEMANA 5-6:
(meta específica 1)
(meta específica 2)
SEMANA 7-8:
(meta específica 1)
(meta específica 2)

MÊS 3 - PORTFÓLIO E PREPARAÇÃO
SEMANA 9-10:
(meta específica 1)
(meta específica 2)
SEMANA 11-12:
(meta específica 1)
(meta específica 2)

🚀 PROJETO DE PORTFÓLIO
PROJETO: (nome do projeto prático mercadológico)
O QUE FAZER:
(descrição clara do escopo do projeto)
ENTREGÁVEIS:
(entregável 1)
(entregável 2)
(entregável 3)
CRITÉRIOS DE ACEITAÇÃO:
(critério 1)
(critério 2)
(critério 3)
DICA: (dica prática de arquitetura para executar o projeto)

💬 ROTEIRO DE ENTREVISTAS
PERGUNTA 1: (pergunta comportamental ou técnica comum nível júnior)
COMO RESPONDER:
(exemplo estruturado de resposta usando método STAR ou similar)
PERGUNTA 2: (pergunta comum júnior)
COMO RESPONDER:
(exemplo estruturado de resposta)
PERGUNTA 3: (pergunta comum júnior)
COMO RESPONDER:
(exemplo estruturado de resposta)
PERGUNTA 4: (pergunta comum júnior)
COMO RESPONDER:
(exemplo estruturado de resposta)
PERGUNTA 5: (pergunta comum júnior)
COMO RESPONDER:
(exemplo estruturado de resposta)

🎓 TRILHA DIO RECOMENDADA
TRILHA: (indique um Bootcamp ou Trilha ativa/real da DIO compatível)
POR QUE ESSA TRILHA:
(explicação de como ela acelera o domínio do roadmap proposto)
PRÓXIMOS PASSOS:
1. Acesse dio.me
2. Busque por "(nome da trilha)"
3. Inscreva-se gratuitamente
4. Siga o cronograma junto com este roadmap

✨ Seu plano está pronto!
Lembre-se: o mais importante é a constância, não a velocidade. Comece pela Semana 1 e vá no seu ritmo.
Tem alguma dúvida sobre o plano? Posso detalhar alguma parte específica?"
`;
  }

  /**
   * Computa dinamicamente as regras de customização exigidas pela regra de negócio do projeto.
   */
  private getPersonalizationDirectives(profile: InterviewResponse): string {
    let directives = '';

    // Regra: HORAS/SEMANA
    if (profile.studyHours < 5) {
      directives += `- Alerta de Carga Horária Baixa (<5h): Dilua e estenda o cronograma das semanas. Foque unicamente no núcleo essencial para não sobrecarregar.\n`;
    } else if (profile.studyHours > 15) {
      directives += `- Alerta de Carga Horária Alta (>15h): Adicione desafios extras em cada bloco quinzenal, sugerindo leituras avançadas e testes de código automatizados.\n`;
    } else {
      directives += `- Carga Horária Padrão (5-10h): Siga a distribuição equilibrada de teoria e laboratórios práticos.\n`;
    }

    // Regra: EXPERIÊNCIA
    if (profile.experience.toLowerCase().includes('zero')) {
      directives += `- Usuário Iniciante do Zero: Remova jargões complexos sem explicação. Foque intensamente na base conceitual (ex: lógica, git, conceitos fundamentais).\n`;
    } else {
      directives += `- Usuário com Vivência/Iniciante: Foque em cobrir gaps técnicos específicos do ecossistema de ${profile.technologies.join(', ')} e acelerar a criação do portfólio.\n`;
    }

    // Regra: OBJETIVO
    if (profile.objective === 'transição') {
      directives += `- Cenário de Transição de Carreira: Crie ganchos conectando o background prévio dele (${profile.previousExperience}) com a atuação de ${profile.preference}. Destaque as Soft Skills transferíveis.\n`;
    } else if (profile.objective === 'primeiro emprego') {
      directives += `- Foco em Empregabilidade (Primeiro Emprego): Aumente o rigor no Portfólio e capriche nas respostas simuladas de processos seletivos para o nível Júnior.\n`;
    } else {
      directives += `- Foco em Performance (Crescimento na Função): Direcione o conteúdo para padrões de arquitetura corporativa e boas práticas avançadas.\n`;
    }

    return directives;
  }
}
