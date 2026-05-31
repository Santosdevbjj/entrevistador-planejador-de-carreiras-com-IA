Técnicas Aplicadas
​Negative Constraints: Avisos explícitos como "NUNCA cite salários específicos" evitam problemas de conformidade e expectativas irreais do candidato.
​Format Enforcement: O uso de templates textuais rígidos com tags estruturadas (ex: 🧩 VISÃO DO DIA A DIA) obriga a LLM a atuar como um gerador de conteúdo determinístico, facilitando a renderização visual em qualquer front-end markdown.


---


---

### 4. `docs/USER_FLOW.md`

```markdown
# 🧭 Fluxo do Usuário (User Flow) e Ciclo de Vida da Sessão
```

Este documento ilustra a jornada completa que um usuário percorre ao interagir com o **IA Mentor de Carreira**, mapeando a transição de estados gerida pelo sistema.

## 🗺️ Mapa de Estados Conversacionais

O fluxo de conversação é governado pelo enum `AgentState` através de quatro marcos lógicos:

---

[ INTERVIEW ] ──( 7 Respostas )──> [ ANALYSIS ] ──( Matriz de Decisão )──> [ CAREER_SELECTION ] ──( Escolha )──> [ PLANNING ]





---

## 🏃‍♂️ Passo a Passo Detalhado do Fluxo

### 🌌 1. Estado Inicial: `AgentState.INTERVIEW`
* **Ação do Sistema**: O Orquestrador é instanciado. O Agente 1 assume o controle e emite a saudação inicial e a **Pergunta 1**.
* **Ação do Usuário**: Fornece sua resposta no terminal.
* **Loop**: O sistema valida a entrada, salva o dado no estado centralizado e avança para a próxima pergunta. Esse ciclo se repete exatamente 7 vezes.

### 📊 2. Estado de Transição: `AgentState.ANALYSIS`
* **Ação do Sistema**: Ocorre de forma invisível e síncrona imediatamente após a resposta da **Pergunta 7**. 
* O `CareerRankingService` é acionado, calcula as notas de aderência cruzando as respostas estruturadas com a base de dados do mercado (`careers.json`) e classifica as top 3 carreiras mais aderentes.

### 🥇 3. Estado de Decisão: `AgentState.CAREER_SELECTION`
* **Ação do Sistema**: Imprime na tela o relatório formatado das top 3 carreiras encontradas com seus respectivos pontos ($X/20$), pontos fortes, desafios de ramp-up e panorama do mercado. O sistema finaliza perguntando: *"Qual dessas carreiras te chamou mais atenção?"*.
* **Ação do Usuário**: Digita o nome da carreira de sua preferência.

### 🚀 4. Estado Final: `AgentState.PLANNING`
* **Ação do Sistema**: O Orquestrador detecta a escolha válida e realiza o **Handoff automático** para o Agente 2.
* A IA (OpenAI GPT) processa o pacote de dados sob medida e cospe o roadmap de 90 dias personalizado, os critérios de aceitação do projeto prático de portfólio, os simulados de entrevista técnica e o direcionamento para os Bootcamps e Trilhas oficiais da **DIO (dio.me)**.
* A sessão é encerrada com sucesso.
