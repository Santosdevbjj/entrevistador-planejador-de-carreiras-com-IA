# 🤖 IA Mentor de Carreira — Sistema Multiagente de Orientação Profissional

<div align="left">
  <img width="130" height="120" alt="CAIXA DIO Logo" src="https://github.com/user-attachments/assets/039ca932-81e1-4a32-853c-1b41b2b46359" />
</div>

> **Bootcamp CAIXA – Inteligência Artificial na Prática (DIO)**  
> `Santosdevbjj/entrevistador-planejador-de-carreiras-com-IA`

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=flat-square&logo=openai&logoColor=white)](https://openai.com)
[![Portfólio](https://img.shields.io/badge/Portfólio-Sérgio_Santos-111827?style=flat-square&logo=githubpages&logoColor=00eaff)](https://portfoliosantossergio.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Sérgio_Santos-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/santossergioluiz)

---

## 1. Problema de Negócio

Instituições de ensino e bootcamps enfrentam altas taxas de abandono de alunos. A causa raiz é recorrente: candidatos ingressam em trilhas técnicas incompatíveis com seu perfil real, gerando frustração, desmotivação e churn precoce.

Do lado do estudante, o problema tem nome: **paralisia por análise**. A abundância de subáreas (Mobile, Web, Dados, Cloud, Gestão de Produto) paralisa a tomada de decisão. Sem orientação personalizada, a escolha vira tentativa e erro — um desperdício de meses de estudo.

**O desafio do negócio:** como guiar cada candidato até a trilha certa, de forma personalizada e escalável, sem depender de formulários estáticos, consultores humanos caros ou sistemas de regras frágeis baseados em *if/else*?

---

## 2. Contexto e Baseline

### O Cenário Antes Desta Solução

A orientação profissional automatizada convencional opera por **questionários estáticos de múltipla escolha**, mapeados em árvores de decisão rígidas. Esses sistemas falham em capturar nuances determinantes para a recomendação: experiências profissionais anteriores transferíveis, restrições reais de disponibilidade de tempo, ou a diferença entre quem quer o primeiro emprego e quem está em transição de carreira.

O resultado é uma recomendação genérica que poderia ter sido gerada sem nenhuma pergunta.

### A Abordagem Deste Projeto

Em vez de sobrecarregar um único prompt genérico de LLM — o que produz respostas imprevisíveis e "alucinações" de planejamento — a solução divide o problema em responsabilidades bem definidas:

- Uma **Máquina de Estados Finitos (FSM)** orquestra o ciclo de vida da sessão, garantindo que nenhuma etapa seja pulada ou corrompida por input inesperado do usuário.
- Um **motor de ranqueamento determinístico em TypeScript** calcula afinidades de carreira de forma algorítmica, eliminando qualquer subjetividade da LLM na fase de recomendação.
- A **IA Generativa (GPT-4o-mini)** é acionada cirurgicamente apenas no estágio final, onde sua capacidade de síntese em linguagem natural é de fato necessária: a construção do roadmap personalizado de 90 dias.

---

## 3. Premissas

Para o correto funcionamento da lógica de ranqueamento e personalização, as seguintes premissas foram adotadas:

- O perfil do candidato é coletado exclusivamente pelas 7 perguntas sequenciais do Agent 1; não há inferência de dados externos.
- A disponibilidade de tempo semanal declarada pelo usuário é tratada como dado confiável para o dimensionamento do roadmap.
- O arquivo `careers.json` representa o catálogo de carreiras suportadas; adições futuras não exigem alterações em prompts ou lógica de agentes.
- O sistema não cita faixas salariais específicas em nenhum output, por política de conformidade com expectativas realistas do mercado.
- A chamada à API da OpenAI ocorre uma única vez por sessão (no Agent 2), mantendo o custo de tokens controlado e previsível.

---

## 4. Estratégia da Solução

A arquitetura do sistema segue o padrão de **Sistemas Multiagentes Desacoplados**, onde cada agente possui contexto cognitivo, responsabilidades e restrições de comportamento próprias. O orquestrador central coordena as transições de estado sem expor os agentes uns aos outros.

```
[ Usuário ]
    │
    ▼
[ Agent 1: Entrevistador ]  ──  7 perguntas sequenciais via FSM
    │
    ▼
[ CareerRankingService ]  ──  Matriz de decisão determinística (TypeScript)
                               Score ∈ [0, 20] por carreira no careers.json
    │
    ▼
[ Apresentação do Top 3 ]  ──  Medalhas, pontos fortes, desafios, panorama
    │
    ▼
[ Agent 2: Planejador Sênior ]  ──  Handoff por payload JSON tipado
                                    GPT-4o-mini gera roadmap 90 dias + portfólio + DIO
```

O fluxo de estados é governado pelo enum `AgentState`:

```
INTERVIEW  →  ANALYSIS  →  CAREER_SELECTION  →  PLANNING
```

Cada transição é disparada pelo orquestrador (`orchestrator.ts`) com base em condições de negócio verificadas em TypeScript — não pela LLM.

### Estrutura do Projeto

```
entrevistador-planejador-de-carreiras-com-IA/
├── docs/
│   ├── AGENTS.md          # Especificação comportamental dos agentes
│   ├── ARCHITECTURE.md    # Design de sistema e decisões arquiteturais
│   ├── PROMPTS.md         # Engenharia de prompts e técnicas aplicadas
│   └── USER_FLOW.md       # Ciclo de vida da sessão e mapa de estados
├── src/
│   ├── agents/
│   │   ├── careerInterviewer.ts   # Agent 1: coleta e validação
│   │   ├── careerPlanner.ts       # Agent 2: construção do payload e roadmap
│   │   └── orchestrator.ts        # FSM central e handoff de contexto
│   ├── data/
│   │   └── careers.json           # Catálogo de carreiras e tags de afinidade
│   ├── prompts/
│   │   ├── interviewerPrompt.ts   # System prompt e roteiro de 7 perguntas
│   │   └── plannerPrompt.ts       # System prompt do planejador
│   ├── services/
│   │   ├── careerRanking.ts       # Motor de score determinístico
│   │   ├── openaiService.ts       # Integração com a API da OpenAI
│   │   └── roadmapGenerator.ts    # Orquestra Agent 2 + LLM
│   ├── types/
│   │   ├── career.ts              # Contrato de dados do catálogo
│   │   └── interview.ts           # Enums, interfaces e tipagem do estado
│   └── app.ts                     # Ponto de entrada e runtime da CLI
```

---

## 5. Decisões Técnicas e Trade-offs

### Node.js + TypeScript em vez de Python
A escolha por TypeScript foi deliberada: a tipagem estática protege a integridade dos dados trafegados entre agentes (especialmente o payload do handoff `InterviewResponse`). Em Python, um campo ausente ou mal tipado nesse contrato poderia silenciosamente produzir um roadmap incorreto. Com TypeScript, o compilador impede isso em tempo de build.

**Trade-off aceito:** ecossistema de ML/IA nativamente mais rico em Python. Para este projeto, o ganho em segurança de tipos superou essa limitação, dado que nenhuma computação matricial ou treino de modelos é realizado localmente.

### GPT-4o-mini em vez de GPT-4o
A escolha pelo modelo mais leve foi intencional e economicamente justificada. O Agent 2 recebe um payload estruturado com todas as variáveis de personalização já computadas em TypeScript — o modelo não precisa raciocinar sobre o perfil, apenas sobre como verbalizar o plano. Para síntese de linguagem natural com template estruturado, o GPT-4o-mini entrega qualidade equivalente a uma fração do custo.

**Trade-off aceito:** em cenários de usuários com perfis muito atípicos (combinações incomuns de variáveis), o modelo menor pode produzir planos ligeiramente menos contextualizados. Aceitável para o escopo do projeto.

### Motor de Ranqueamento Determinístico (TypeScript) em vez de LLM
Esta foi a decisão arquitetural mais crítica. Delegar a recomendação de carreira diretamente à LLM introduziria variabilidade nas sugestões — o mesmo perfil poderia receber recomendações distintas em execuções diferentes. O `CareerRankingService` garante que a mesma entrada sempre produza o mesmo Top 3, tornando o sistema auditável e confiável.

**Trade-off aceito:** o modelo de scoring linear não captura correlações complexas entre variáveis. Uma evolução futura com modelo preditivo treinado em dados históricos de empregabilidade produziria recomendações mais sofisticadas.

### Engenharia de Prompts com Restrições Negativas
Os prompts dos dois agentes aplicam *Negative Constraints* explícitas ("NUNCA cite salários específicos", "faça APENAS uma pergunta por vez") em vez de apenas descrever o comportamento desejado. Isso reduz significativamente a taxa de desvio comportamental da LLM, especialmente em sessões longas onde o contexto acumulado pode induzir quebras de persona.

### Zero Overhead de Tokens na Fase de Entrevista
Durante as 7 perguntas do Agent 1, nenhuma chamada à API da OpenAI é realizada. O orquestrador gerencia toda a lógica de estado localmente. O consumo de tokens ocorre exclusivamente no Agent 2, ao final da sessão — o que torna o custo por usuário previsível e baixo.

---

## 6. Resultados

O sistema entrega ao usuário, ao final de cada sessão, um plano de desenvolvimento completo e personalizado estruturado em seis blocos:

**🧩 Visão do Dia a Dia** — atividades típicas da função escolhida, ancorando expectativas reais sobre o trabalho diário.

**🧠 Mapa de Skills** — divisão entre Core Skills (essenciais para contratação), Nice-to-Have (diferenciais competitivos) e Ferramentas e Tecnologias do ecossistema.

**📅 Roadmap de 90 Dias** — cronograma quinzenal adaptado à carga horária declarada pelo usuário. Para menos de 5h/semana, os prazos são dilatados e o escopo é reduzido ao núcleo essencial. Para mais de 15h/semana, desafios avançados de arquitetura são adicionados.

**🚀 Projeto de Portfólio** — escopo de um projeto prático com entregáveis e critérios de aceitação específicos, diretamente alinhado à carreira escolhida e ao nível de experiência do candidato.

**💬 Roteiro de Entrevistas** — 5 perguntas simuladas de nível júnior com respostas estruturadas no método STAR, preparando o candidato para processos seletivos reais.

**🎓 Trilha DIO Recomendada** — conexão direta com Bootcamps e Trilhas ativas na plataforma `dio.me`, integrando o roadmap gerado aos recursos de aprendizado disponíveis.

O plano leva em conta o histórico profissional anterior do usuário (Pergunta 7) para criar paralelos de soft skills transferíveis nos cenários de transição de carreira.

---

## 7. Como Executar o Projeto

### Pré-requisitos

- Node.js v18 ou superior
- Chave de API da OpenAI (obtenha em [platform.openai.com](https://platform.openai.com))

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/Santosdevbjj/entrevistador-planejador-de-carreiras-com-IA.git
cd entrevistador-planejador-de-carreiras-com-IA

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Abra o arquivo .env e insira sua OPENAI_API_KEY
```

### Executando

```bash
# Modo desenvolvimento (recomendado)
npm run dev

# Ou diretamente via ts-node
npx ts-node src/app.ts
```

Após iniciar, o Agent 1 conduzirá a entrevista de 7 perguntas no terminal. Ao final, o sistema apresentará o Top 3 de carreiras recomendadas. Após sua escolha, o Agent 2 gerará o plano personalizado de 90 dias.

### Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `OPENAI_API_KEY` | Sim | Chave de API da OpenAI |
| `OPENAI_MODEL` | Não | Modelo a usar (padrão: `gpt-4o-mini`) |
| `NODE_ENV` | Não | Ambiente de execução (`development`, `production`) |

---

## 8. Próximos Passos

**Camada Web (Next.js + Tailwind CSS):** substituir a interface CLI por uma aplicação web responsiva, tornando o sistema acessível sem instalação local e habilitando integração com autenticação de usuários para persistência de histórico de sessões.

**Validação de Schema com Zod Structured Outputs:** implementar validação estrita da resposta do Agent 2 antes da renderização, garantindo integridade absoluta do JSON de handoff e eliminando o risco de erros silenciosos em produção.

**Observabilidade com Langfuse ou Phoenix:** instrumentar as chamadas à API da OpenAI para monitoramento contínuo de custos por sessão, latência de resposta e detecção de desvios comportamentais nos prompts, viabilizando otimizações baseadas em dados reais de uso.

**Expansão do Catálogo de Carreiras:** o arquivo `careers.json` foi projetado para ser o único ponto de extensão do sistema — novas carreiras (ex: MLOps Engineer, DevRel, UX Researcher) podem ser adicionadas sem nenhuma alteração em código, apenas com a definição das tags de afinidade e parâmetros de mercado.

**Modelo Preditivo de Ranqueamento:** evoluir o `CareerRankingService` de um scoring linear para um modelo supervisionado treinado em dados reais de empregabilidade e satisfação profissional, aumentando a precisão das recomendações para perfis atípicos.

---

## Autor

**Sergio Santos**  
Senior Data Engineer & Cloud Architect | DIO Campus Expert

[![Portfólio](https://img.shields.io/badge/Portfólio-Sérgio_Santos-111827?style=for-the-badge&logo=githubpages&logoColor=00eaff)](https://portfoliosantossergio.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Sérgio_Santos-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/santossergioluiz)
