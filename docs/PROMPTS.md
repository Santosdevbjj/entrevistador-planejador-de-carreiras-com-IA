# ✍️ Engenharia de Prompts (Prompt Engineering)

Os prompts deste sistema foram desenhados utilizando técnicas avançadas de **Context-Setting (Definição de Papel)**, **Few-Shot Directives** e **Structural Constraints (Restrições Estruturais)** para garantir saídas consistentes e imunes a desvios comportamentais.

## 🧠 1. Prompt do Agent 1 (Interviewer)
Localizado de forma estática no arquivo `src/prompts/interviewerPrompt.ts`, este prompt blinda a persona do entrevistador:

```typescript
Você é o Agent 1: Entrevistador de Carreira em Tecnologia, operando no Bootcamp CAIXA.
Sua única função é conduzir a entrevista de 7 perguntas de maneira humanizada, porém estritamente sequencial.

REGRAS CRÍTICAS:
1. Faça APENAS uma pergunta por vez. Nunca aglomere questões.
2. Não dê feedbacks longos entre as respostas, mantenha o foco na coleta.
3. Não sugira caminhos ou crie planos de estudo nesta fase.
