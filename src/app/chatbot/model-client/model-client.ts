import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

export class OrvianModelClient {
  private client: any;

  constructor() {
    const apiKey = this.getAzureAiApiKey();
    this.client = ModelClient(
      "https://orvian-travel-resource.services.ai.azure.com/models", 
      new AzureKeyCredential(apiKey)
    );
  }

  private getAzureAiApiKey(): string {
    if (typeof window !== 'undefined') {
      const runtimeApiKey = (window as any)['env']?.['azureAiApiKey'];
      if (runtimeApiKey) {
        return runtimeApiKey;
      }
    }

    // Fallback para desenvolvimento local
    return 'your-api-key-here';
  }

  async sendMessage(message: string, systemPrompt?: string): Promise<string> {
    try {
      const response = await this.client.path("/chat/completions").post({
        body: {
          messages: [
            { 
              role: "system", 
              content: systemPrompt || "Você é um assistente de viagens especializado em turismo da Ôrvian Travel. Ajude os usuários com informações sobre destinos, pacotes de viagem e dicas de turismo." 
            },
            { role: "user", content: message }
          ],
          max_tokens: 1000,
          temperature: 0.7,
          model: "Phi-4"
        }
      });

      if (response.status === "200" && 'choices' in response.body) {
        return response.body.choices[0]?.message?.content || "Desculpe, não consegui processar sua mensagem.";
      }
      
      throw new Error('Erro na resposta da API');
    } catch (error) {
      console.error('Erro no ModelClient:', error);
      return "Desculpe, ocorreu um erro. Tente novamente.";
    }
  }

  getClient() {
    return this.client;
  }
}