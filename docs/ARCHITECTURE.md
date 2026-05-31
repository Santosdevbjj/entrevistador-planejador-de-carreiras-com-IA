# 🏛️ Arquitetura do Sistema - IA Mentor de Carreira

Este documento detalha o design de software e a arquitetura técnica adotada no ecossistema multiagente assíncrono desenvolvido para o **Bootcamp CAIXA – Inteligência Artificial na Prática (DIO)**.

## 1. Visão Geral do Sistema

O sistema foi desenhado seguindo os princípios de **Clean Architecture** e **Separação de Responsabilidades (SoC)**, dividindo a lógica do domínio (Agentes e Orquestração), os serviços de infraestrutura (LLMs e Algoritmos) e a interface com o usuário.

Em vez de sobrecarregar a inteligência artificial com um fluxo conversacional instável, o projeto adota uma **Máquina de Estados Finitos (FSM)** determinística que dita o ciclo de vida da sessão do usuário.

## 2. Visão em Camadas

A estrutura de diretórios do projeto reflete diretamente suas fronteiras arquiteturais:

* **Camada de Tipagem (`/src/types`)**: Contém os contratos e enums que blindam a integridade dos dados trafegados entre os agentes.
* **Camada de Agentes (`/src/agents`)**: Centraliza as definições de comportamento do **Agent 1** (Coleta e Triagem) e **Agent 2** (Geração de Roadmap).
* **Camada de Serviços (`/src/services`)**: Infraestrutura pura. Gerencia integrações de rede com a API da OpenAI (`OpenAIService`) e executa o algoritmo matemático de ranqueamento de perfil (`CareerRankingService`).
* **Camada de Orquestração (`/src/agents/orchestrator.ts`)**: O cérebro condutor, responsável por receber estímulos do mundo externo (CLI/Web), alterar estados internos e acionar os agentes certos.

## 3. Matriz de Decisão Híbrida (Algorítmica + GenAI)

Para mitigar o risco de **alucinações** (onde a IA inventaria pontuações sem critério lógico), o sistema implementa uma abordagem híbrida:

1.  **Ranqueamento Determinístico (TypeScript)**: O `CareerRankingService` varre o arquivo `careers.json`, cruzando as preferências e horas de estudo do candidato através de uma fórmula linear estrita, gerando um score real de $0$ a $20$.
2.  **Expansão Generativa (GPT)**: O **Agent 2** consome o resultado exato dessa matriz e usa seu poder de síntese de linguagem natural apenas para construir o plano de 90 dias personalizado, as perguntas de entrevista e sugerir a Trilha DIO correta.

## 4. Benefícios Desta Abordagem
* **Previsibilidade**: O fluxo de 7 perguntas nunca é quebrado por inputs inesperados do usuário.
* **Eficiência de Custos**: Chamadas de LLM (tokens de entrada/saída) só ocorrem no estágio final, economizando processamento computacional durante a entrevista.
* **Manutenibilidade**: Se uma nova carreira for criada no mercado, basta adicioná-la no arquivo `careers.json` com suas respectivas tags, sem necessidade de reescrever prompts de IA.
