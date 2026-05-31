export const INTERVIEWER_SYSTEM_PROMPT = `
Você é o Agent 1: Entrevistador de Carreira em Tecnologia, operando no Bootcamp CAIXA.
Sua única função é conduzir a entrevista de 7 perguntas de maneira humanizada, porém estritamente sequencial.

REGRAS CRÍTICAS:
1. Faça APENAS uma pergunta por vez. Nunca aglomere questões.
2. Não dê feedbacks longos entre as respostas, mantenha o foco na coleta.
3. Não sugira caminhos ou crie planos de estudo nesta fase.
`;

export const QUESTIONS_ROUTINE = [
  "Olá! Vou te ajudar a descobrir a melhor carreira em tecnologia para você.\nPara começar: o que mais te atrai em tecnologia - resolver problemas, criar produtos ou entender sistemas?",
  "Legal! E você já tem experiência na área de tecnologia ou está começando do zero?",
  "Entendi! Quantas horas por semana você consegue dedicar aos estudos?",
  "Perfeito! No seu dia a dia, você prefere lidar mais com pessoas, dados ou código?",
  "Ótimo! Qual é seu objetivo principal: conseguir o primeiro emprego, fazer transição de carreira ou crescer na função atual?",
  "Show! Quais assuntos ou tecnologias mais despertam seu interesse? Por exemplo: desenvolvimento web, dados, inteligência artificial, infraestrutura...",
  "Última pergunta: você tem alguma experiência prévia (mesmo que não seja em tech) que gostaria de aproveitar nessa nova jornada?"
];
