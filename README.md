# 🤖 Sistema Multiagente de Orientação de Carreira com IA

<img width="130" height="120" alt="1000126386" src="https://github.com/user-attachments/assets/039ca932-81e1-4a32-853c-1b41b2b46359" />




Este projeto vai muito além de um simples wrapper de chatbot. Desenvolvido para o **Bootcamp CAIXA – Inteligência Artificial na Prática (DIO)**, a plataforma implementa um padrão de arquitetura de software moderno utilizando **Agentes Especializados com Handoff Automático de Estado**.

### 🌟 Diferenciais de Engenharia de Software Aplicada
* **Decoupled Architecture**: Divisão clara de responsabilidades onde o **Agent 1** lida com triagem e coleta determinística e o **Agent 2** atua como planejador sob demanda.
* **Deterministic Scoring Matrix**: As recomendações de carreira não dependem de alucinações de LLM. Criamos um motor de regras tipado em TypeScript que pondera afinidades de forma exata ($Score \in [0, 20]$).
* **State Machine Orquestrada**: Implementação nativa de máquina de estados finitos garantindo que o usuário nunca quebre o fluxo de 7 perguntas regulamentares.
* **Zero Overhead de Tokens**: O consumo de IA generativa é ativado cirurgicamente apenas na compilação do Roadmap customizado de 90 dias do Agent 2.



---


Muitas pessoas desejam entrar na área de tecnologia, mas não sabem qual carreira combina com seu perfil. Escolher uma trilha errada gera frustração, abandono dos estudos e desperdício de tempo. Este projeto utiliza Inteligência Artificial para entrevistar candidatos, identificar afinidades profissionais e gerar um plano personalizado de desenvolvimento de carreira. 





