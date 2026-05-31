# 🤖 Sistema Multiagente de Orientação de Carreira com IA

<div align="left">
  <img width="130" height="120" alt="CAIXA DIO Logo" src="https://github.com/user-attachments/assets/039ca932-81e1-4a32-853c-1b41b2b46359" />
</div>

> **Projeto desenvolvido para o Bootcamp CAIXA – Inteligência Artificial na Prática (DIO)**
> *Repositório Oficial:* `Santosdevbjj/entrevistador-planejador-de-carreiras-com-IA`

---

## 🎯 1. Problema de Negócio (O que motivou o projeto)

Muitas pessoas desejam ingressar ou se reposicionar no mercado de tecnologia, mas enfrentam o fenômeno da **paralisia por análise**: a abundância de subáreas (Mobile, Web, Dados, Cloud, Gestão) gera frustração, escolhas equivocadas e abandono precoce dos estudos. 

Para as instituições de ensino e bootcamps, isso se converte em baixas taxas de conclusão (*churn* de alunos). Para o estudante, resulta em desperdício de tempo e energia. 

**O desafio do negócio:** Como guiar um candidato de forma personalizada, identificando suas aptidões reais sem depender de formulários estáticos ou de consultorias de carreira humanas (que são caras e difíceis de escalar)?

---

## 🌐 2. Contexto e Baseline

### O Cenário Atual (Baseline)
Tradicionalmente, a orientação profissional automatizada utiliza **testes de múltipla escolha estáticos** baseados em regras rígidas de *if/else*. Esses sistemas sofrem com baixa aderência porque não capturam nuances como o histórico profissional anterior do usuário (soft skills transferíveis) ou restrições reais de tempo de estudo.

### A Solução Proposta
Este projeto implementa uma plataforma inteligente orientada a **Sistemas Multiagentes Decoplados**. Em vez de usar apenas um prompt genérico e aberto que gera respostas imprevisíveis ("alucinações"), dividimos o problema em uma engenharia de software previsível: uma **Máquina de Estados Finitos (FSM)** orquestra a conversa, um algoritmo em TypeScript computa as afinidades e uma IA Generativa de última geração molda o plano estratégico final.

---

## 🛠️ 3. Decisões Técnicas e Arquitetura

Para construir um portfólio legível e robusto, a solução foi estruturada seguindo os padrões modernos de **Clean Architecture**:


```
entrevistador-planejador-de-carreiras-com-IA/
├── docs/               # Documentação detalhada dos Agentes e Fluxos
├── src/
│   ├── agents/         # Escopo comportamental do Agent 1 e Agent 2
│   ├── prompts/        # Engenharia de prompts isolada do código
│   ├── services/       # Motores de ranqueamento e integração com OpenAI
│   ├── types/          # Tipagem estrita e contratos de dados
│   └── app.ts          # Ponto de entrada e runtime da CLI
```

### Por que essa Stack?
* **Node.js + TypeScript**: Garante tipagem estática e segurança em tempo de compilação para o tráfego de dados entre os agentes.
* **OpenAI API (GPT-4o-Mini)**: Escolhido pelo excelente custo-benefício, baixa latência e alta aderência à formatação de restrições estruturais por *System Prompts*.

---

## 🤖 4. Engenharia de Agentes e Estratégia da Solução

O sistema atua com **Handoff Automático de Estado** dividido em fases claras:


```
[ Usuário ] ──> [ Agent 1: Entrevistador ] ──> ( 7 Perguntas Sequenciais )
│
▼
[ Agent 2: Planejador ] <── [ Handoff JSON ] <── [ Matriz de Decisão TS ]
│
▼
( Roadmap 90 Dias + Projeto Portfólio + Trilha DIO )
```

### 👥 Mapeamento dos Agentes
1. **Agent 1 (Entrevistador)**: Conduz uma entrevista humanizada de 7 perguntas específicas (interesses, experiência, horas disponíveis, preferências). Ele valida e compila as entradas em um objeto tipado (`InterviewResponse`).
2. **Motor de Ranqueamento Estrito**: Executa o cruzamento algorítmico de afinidades baseado no arquivo `careers.json`, atribuindo uma nota determinística de $0$ a $20$ para o Top 3 carreiras.
3. **Agent 2 (Planejador Sênior)**: É ativado apenas após o usuário escolher sua carreira de preferência. Recebe o payload limpo e atua na expansão generativa do cronograma prático.

---

## 📊 5. Insights e Regras de Personalização (The Core Business)

A inteligência do **Agent 2** não é genérica. O modelo aplica filtros dinâmicos de contexto antes de gerar a saída:

* **Filtro de Carga Horária**: Se o usuário tem `< 5h/semana`, o roadmap dilata os prazos automaticamente e foca no *Core Vital*. Se tem `> 15h/semana`, injeta desafios avançados de arquitetura.
* **Filtro de Objetivo (Transição de Carreira)**: O plano é instruído a rastrear o histórico profissional não-tech informado na Pergunta 7 e criar paralelos práticos de *soft skills* para a nova função.
* **Restrição Crítica de Negócio**: O modelo é proibido de alucinar faixas salariais específicas, focando o valor percebido na empregabilidade e habilidades técnicas.

---

## 🚀 6. Resultados e Formato de Entrega

O resultado final entregue pelo sistema adota uma estrutura em blocos Markdown perfeitamente escaneável por qualquer interface:

* **🧩 Visão do Dia a Dia**: Atividades típicas da função escolhida.
* **🧠 Mapa de Skills**: Divisão cirúrgica entre *Core Skills*, *Nice-to-Have* e Ferramentas.
* **📅 Roadmap de 90 Dias**: Cronograma quinzenal adaptado à realidade de tempo do usuário.
* **🚀 Projeto de Portfólio**: Escopo de um projeto real com critérios de aceitação específicos.
* **💬 Roteiro de Entrevistas**: 5 perguntas simuladas de nível júnior respondidas usando a estrutura comportamental de mercado.
* **🎓 Trilha DIO Recomendada**: Conexão direta com os Bootcamps ativos da plataforma `dio.me` para execução dos estudos.

---

## 💻 7. Como Executar o Projeto

### Pré-requisitos
* Node.js instalado (v18 ou superior)
* Uma chave de API da OpenAI

### Instalação
1. Clone o repositório:
```bash
   git clone [https://github.com/Santosdevbjj/entrevistador-planejador-de-carreiras-com-IA.git](https://github.com/Santosdevbjj/entrevistador-planejador-de-carreiras-com-IA.git)
   cd entrevistador-planejador-de-carreiras-com-IA

```
 2. Instale as dependências:
```bash
   npm install

```
 3. Configure as variáveis de ambiente:
```bash
   cp .env.example .env

```
Abra o arquivo .env e insira a sua OPENAI_API_KEY.
### Executando em Desenvolvimento
Para iniciar a entrevista interativa diretamente pelo terminal:
```bash
npm run dev
# Ou via execução direta: npx ts-node src/app.ts

```
## 📈 8. Próximos Passos e Evolução
 * **Camada Web**: Desenvolvimento de uma interface visual responsiva utilizando Next.js e Tailwind CSS para substituir a CLI.
 * **Observabilidade**: Integração com *Langfuse* ou *Phoenix* para monitoramento de custos, latência e possíveis desvios das respostas da API da OpenAI.
 * **Validação de Esquema**: Implementar *Zod Structured Outputs* na chamada do Agent 2 para garantir integridade absoluta da resposta antes da renderização.
> 💡 **Nota de Posicionamento Profissional:**
> *O mercado de tecnologia não contrata ferramentas, contrata resolvedores de problemas. Este projeto demonstra a aplicação prática de Engenharia de Prompts, Arquitetura de Software e Design de Sistemas Multiagentes para sanar uma dor real de engajamento e direcionamento profissional.*
> 


---












---
---
---

Este projeto vai muito além de um simples wrapper de chatbot. Desenvolvido para o **Bootcamp CAIXA – Inteligência Artificial na Prática (DIO)**, a plataforma implementa um padrão de arquitetura de software moderno utilizando **Agentes Especializados com Handoff Automático de Estado**.

### 🌟 Diferenciais de Engenharia de Software Aplicada
* **Decoupled Architecture**: Divisão clara de responsabilidades onde o **Agent 1** lida com triagem e coleta determinística e o **Agent 2** atua como planejador sob demanda.
* **Deterministic Scoring Matrix**: As recomendações de carreira não dependem de alucinações de LLM. Criamos um motor de regras tipado em TypeScript que pondera afinidades de forma exata ($Score \in [0, 20]$).
* **State Machine Orquestrada**: Implementação nativa de máquina de estados finitos garantindo que o usuário nunca quebre o fluxo de 7 perguntas regulamentares.
* **Zero Overhead de Tokens**: O consumo de IA generativa é ativado cirurgicamente apenas na compilação do Roadmap customizado de 90 dias do Agent 2.



---


Muitas pessoas desejam entrar na área de tecnologia, mas não sabem qual carreira combina com seu perfil. Escolher uma trilha errada gera frustração, abandono dos estudos e desperdício de tempo. Este projeto utiliza Inteligência Artificial para entrevistar candidatos, identificar afinidades profissionais e gerar um plano personalizado de desenvolvimento de carreira. 





