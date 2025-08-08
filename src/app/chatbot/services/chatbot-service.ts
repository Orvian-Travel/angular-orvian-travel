// src/app/chatbot/services/chatbot.service.ts
import { Injectable } from '@angular/core';
import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import { ConfigService } from '../../services/config.service';
import { ChatbotDataService } from './chatbot-data.service';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private client: any;
  private isInitialized = false;

  constructor(
    private configService: ConfigService,
    private chatbotDataService: ChatbotDataService
  ) {
    this.initializeClient();
  }

  private async initializeClient() {
    try {
      console.log('Inicializando ChatbotService...');
      const config = await this.configService.loadConfig().toPromise();
      const apiKey = config?.azureAiApiKey || this.getAzureAiApiKey();
      
      console.log('API Key disponível:', !!apiKey && apiKey !== 'your-api-key-here');
      
      if (apiKey && apiKey !== 'your-api-key-here' && apiKey.trim() !== '') {
        this.client = ModelClient(
          "https://orvian-travel-resource.services.ai.azure.com/models",
          new AzureKeyCredential(apiKey)
        );
        this.isInitialized = true;
        console.log('ChatbotService inicializado com sucesso com Azure AI');
      } else {
        console.warn('API Key do Azure AI não encontrada - usando modo fallback');
        this.isInitialized = false;
      }
    } catch (error) {
      console.error('Erro ao inicializar ChatbotService:', error);
      this.isInitialized = false;
    }
  }

  private getAzureAiApiKey(): string {
    // Fallback para window.env (caso ainda exista)
    if (typeof window !== 'undefined') {
      const runtimeApiKey = (window as any)['env']?.['azureAiApiKey'];
      if (runtimeApiKey && runtimeApiKey !== 'your-api-key-here') {
        return runtimeApiKey;
      }
    }

    // Fallback para desenvolvimento local
    return 'your-api-key-here';
  }

  async sendMessage(message: string): Promise<string> {
    // Primeira: tentar processar a mensagem localmente com dados reais
    const localResponse = await this.processMessageWithData(message);
    if (localResponse) {
      return localResponse;
    }

    // Se não conseguiu processar localmente, usa Azure AI
    // Se o cliente não estiver inicializado, tenta inicializar novamente
    if (!this.isInitialized) {
      await this.initializeClient();
    }

    // Se ainda não estiver inicializado, retorna resposta de fallback
    if (!this.isInitialized || !this.client) {
      console.log('Usando modo fallback - Azure AI não disponível');
      return this.getFallbackResponse(message);
    }

    try {
      console.log('Enviando mensagem para Azure AI...');
      
      // Enriquecer o contexto com dados reais
      const enhancedMessage = await this.enhanceMessageWithData(message);
      
      const systemPrompt = this.getSystemPrompt();

      const response = await this.client.path("/chat/completions").post({
        body: {
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: enhancedMessage }
          ],
          max_tokens: 1000,
          temperature: 0.7,
          model: "Phi-4"
        }
      });

      if (response.status === "200" && 'choices' in response.body) {
        console.log('Resposta recebida do Azure AI');
        return response.body.choices[0]?.message?.content || "Desculpe, não consegui processar sua mensagem.";
      }
      
      throw new Error('Erro na resposta da API');
    } catch (error) {
      console.error('Erro no chatbot:', error);
      return this.getFallbackResponse(message);
    }
  }

  /**
   * Processa mensagem usando dados reais da aplicação
   */
  private async processMessageWithData(message: string): Promise<string | null> {
    const lowerMessage = message.toLowerCase();

    // Buscar pacotes por destino específico
    if (this.isDestinationQuery(lowerMessage)) {
      const destination = this.extractDestination(lowerMessage);
      if (destination) {
        const packages = await this.chatbotDataService.getPackagesByDestination(destination);
        return this.chatbotDataService.formatPackageInfo(packages);
      }
    }

    // Mostrar destinos populares
    if (lowerMessage.includes('destino') && (lowerMessage.includes('popular') || lowerMessage.includes('recomend'))) {
      const destinations = await this.chatbotDataService.getPopularDestinations();
      return `Nossos destinos mais populares são:\n\n${destinations.map((dest, i) => `${i + 1}. ${dest} ✈️`).join('\n')}\n\nEm qual desses você gostaria de mais informações? 🌎`;
    }

    // Recomendações gerais
    if (lowerMessage.includes('recomend') || lowerMessage.includes('sugest') || lowerMessage.includes('indic')) {
      const recommendations = await this.chatbotDataService.getPackageRecommendations(message);
      return this.chatbotDataService.formatPackageInfo(recommendations);
    }

    return null; // Deixa para o Azure AI processar
  }

  /**
   * Enriquece a mensagem com dados reais antes de enviar para Azure AI
   */
  private async enhanceMessageWithData(message: string): Promise<string> {
    try {
      const destinations = await this.chatbotDataService.getAllDestinations();
      const destinationsContext = destinations.length > 0 
        ? `\n\nDestinos disponíveis em nosso catálogo: ${destinations.slice(0, 10).join(', ')}`
        : '';
      
      return `${message}${destinationsContext}`;
    } catch (error) {
      return message; // Retorna mensagem original se der erro
    }
  }

  /**
   * Identifica se a mensagem é uma consulta sobre destino
   */
  private isDestinationQuery(message: string): boolean {
    const keywords = [
      'viagem para', 'viajar para', 'ir para', 'conhecer',
      'pacote para', 'destino', 'onde ir', 'roteiro para'
    ];
    return keywords.some(keyword => message.includes(keyword));
  }

  /**
   * Extrai o destino da mensagem do usuário
   */
  private extractDestination(message: string): string | null {
    // Palavras comuns de destinos brasileiros e internacionais
    const destinations = [
      'nordeste', 'fernando de noronha', 'recife', 'salvador', 'fortaleza',
      'rio de janeiro', 'são paulo', 'minas gerais', 'paraty', 'ouro preto',
      'caldas novas', 'bonito', 'pantanal', 'amazonia', 'manaus',
      'europa', 'frança', 'italia', 'espanha', 'portugal', 'alemanha',
      'eua', 'nova york', 'miami', 'orlando', 'california',
      'caribe', 'cancun', 'punta cana', 'jamaica', 'cuba',
      'asia', 'japao', 'china', 'tailandia', 'india'
    ];

    for (const dest of destinations) {
      if (message.includes(dest)) {
        return dest;
      }
    }

    // Tentar extrair destino após preposições
    const patterns = [
      /(?:para|pro)\s+([a-záçãoôéíúàè\s]+)/i,
      /(?:conhecer|ir)\s+(?:para|pro|em|na|no|a|o)?\s*([a-záçãoôéíúàè\s]+)/i
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return null;
  }

  /**
   * Retorna o prompt do sistema
   */
  private getSystemPrompt(): string {
    return `Você é o assistente virtual da Ôrvian Travel, uma agência de viagens especializada em experiências únicas.

INFORMAÇÕES DA EMPRESA:
- Nome: Orvian Travel
- Especialidade: Pacotes de viagem personalizados e experiências autênticas
- Diferenciais: Atendimento personalizado, destinos únicos, preços competitivos

COMO RESPONDER:
- Seja sempre amigável, prestativo e entusiasmado sobre viagens
- Use emojis relacionados a viagens (✈️, 🏖️, 🗺️, 🎒, 🌎)
- Promova os serviços da Ôrvian Travel naturalmente
- Se não souber informações específicas, oriente a falar com um consultor
- Sempre termine oferecendo ajuda adicional

SERVIÇOS DISPONÍVEIS:
- Pacotes nacionais e internacionais
- Viagens em grupo e individuais
- Roteiros personalizados

PROCESSO DE RESERVA:
- Fale que é muito simples, apenas escolher um pacote em nosso catálogo, adicionar as datas, na tela de pagamento adicionar os viajantes e realizar o pagamento, comente sobre as formas de pagamento

DESTINOS POPULARES:
- Discorra sobre Fernando de Noronha, Recife, Paraty, Ouro Preto e Caldas Novas, sem rankear, pode fazer em tópicos

CASO NÃO ENTENDA A MENSAGEM:
- Responda simplesmente "Não consegui entender sua mensagem, poderia reformulá-la?"

ROTEIRO DE VIAGEM:
- Faça um roteiro de viagem, com pontos turísticos e locais legais para conhecer, com base no destino que o usuário te mandar

MÉTODOS DE PAGAMENTOS:
- Cartões de Crédito (quaisquer bandeira)
- Pix (5% de desconto no valor)
- Boleto Bancário (será enviado por email, com prazo de 3 dias úteis até o vencimento)

PREÇO PARA A VIAGEM PARA O NORDESTE:
- Diga que os valores variam e oriente a consultar nossos consultores para um orçamento personalizado
- Fale apenas sobre lugares que realmente ficam no nordeste

Se perguntarem sobre preços específicos, diga que os valores variam e oriente a consultar nossos consultores para um orçamento personalizado.`;
  }

  private getFallbackResponse(message: string): string {
    const responses = [
      "Olá! Sou o assistente virtual da Ôrvian Travel! 🌎 Como posso ajudá-lo com suas viagens hoje?",
      "A Ôrvian Travel oferece pacotes personalizados para diversos destinos incríveis! ✈️ Que tipo de viagem você tem em mente?",
      "Posso ajudá-lo com informações sobre destinos, documentação necessária, melhores épocas para viajar e muito mais! 🎒",
      "Temos especialistas em viagens nacionais e internacionais. Em que posso ajudá-lo especificamente? 🗺️",
      "Ficarei feliz em ajudá-lo a planejar sua próxima aventura! Conte-me mais sobre seus interesses. 🏖️"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    if (message.toLowerCase().includes('preço') || message.toLowerCase().includes('valor')) {
      return "Os valores dos nossos pacotes variam conforme destino, período e quantidade de pessoas. Para um orçamento personalizado, recomendo falar com nossos consultores! 💰 Posso ajudar com mais alguma informação sobre viagens? ✈️";
    }
    
    return randomResponse;
  }
}