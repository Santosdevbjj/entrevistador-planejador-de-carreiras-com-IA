import { OpenAI } from 'openai';

export class OpenAIService {
  private openai: OpenAI;
  private model: string;

  constructor() {
    // Inicializa a API utilizando a variável de ambiente configurada no .env
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error(
        'A variável de ambiente OPENAI_API_KEY não foi encontrada. Certifique-se de configurar o seu arquivo .env.'
      );
    }

    this.openai = new OpenAI({ apiKey });
    // Configura o modelo padrão para execução rápida e assertiva dos agentes
    this.model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  }

  /**
   * Envia uma requisição de completude de chat isolada para a API da OpenAI.
   * @param systemPrompt Diretrizes de comportamento do Agente.
   * @param userPrompt Payload contendo os dados dinâmicos do usuário.
   */
  public async getChatCompletion(systemPrompt: string, userPrompt: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3, // Mantém a resposta altamente determinística e fiel ao template
        max_tokens: 2500  // Garante espaço suficiente para o output massivo do plano de 90 dias
      });

      const reply = response.choices[0]?.message?.content;
      
      if (!reply) {
        throw new Error('A API da OpenAI retornou uma resposta vazia.');
      }

      return reply;
    } catch (error: any) {
      console.error('Erro na comunicação com a API da OpenAI:', error.message || error);
      throw new Error(`Falha no processamento do Agente de IA: ${error.message}`);
    }
  }
}
