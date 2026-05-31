# 🤖 Especificação e Responsabilidade dos Agentes

Este projeto adota o padrão de **Sistemas Multiagentes Decoplados**. Cada agente funciona de forma isolada, possuindo seu próprio contexto cognitivo, validações e escopo de atuação.

## 📋 Catálogo de Agentes

### 1. Agent 1: Entrevistador de Carreira em Tecnologia
* **Perfil/Persona**: Um recrutador técnico empático, focado e altamente metódico.
* **Escopo de Atuação**: Fase 1 (Entrevista) e Fase 2 (Apresentação de Resultados).
* **Responsabilidades**:
    * Garantir a execução estrita e sequencial das 7 perguntas regulamentares.
    * Validar respostas vazias ou inconsistentes fornecidas pelo usuário.
    * Consolidar os metadados textuais capturados em um objeto JSON padronizado (`InterviewResponse`).
* **Restrições Críticas**: Nunca responder dúvidas técnicas durante a entrevista; nunca gerar planos de estudo; fazer estritamente uma pergunta por vez.

### 2. Agent 2: Planejador de Carreiras Sênior
* **Perfil/Persona**: Um Mentor de Engenharia de Software e Tech Lead de nível Sênior.
* **Escopo de Atuação**: Fase 4 (Planejamento e Roadmap).
* **Responsabilidades**:
    * Interpretar o payload estruturado recebido após a escolha do usuário.
    * Injetar regras de personalização baseadas na disponibilidade de tempo (readequação de prazos) e no nível de experiência atual (ajuste de didática).
    * Estruturar um guia prático de 90 dias contendo metas acionáveis, projeto de portfólio corporativo com critérios de aceitação e simulação de entrevista com o método STAR.
* **Restrições Críticas**: Nunca estipular ou citar salários específicos; respeitar o template visual de blocos e emojis pré-definido.

## 🔄 Mecanismo de Handoff (Passagem de Bastão)

A transição entre o Agente 1 e o Agente 2 é coordenada pelo Orquestrador Central através de uma **Injeção de Contexto por Payload**. 

Quando o usuário seleciona formalmente uma das 3 carreiras propostas, o Agente 1 encerra sua sessão invocando o método `compileProfile()`. Os dados limpos e tipados são transmitidos para o Agente 2 através do método `buildPlannerPayload()`. O Agente 2 encapsula essas variáveis dentro de suas diretrizes de sistema e dispara a chamada para a API da OpenAI, completando a transição de contexto de forma transparente e assíncrona.
