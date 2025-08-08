import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../services/chatbot-service';

export interface ChatMessage {
  id?: string;
  sender: string;
  content: string;
  type: 'user' | 'bot' | 'system' | 'error';
  timestamp?: Date;
}

@Component({
  selector: 'app-chat-interface',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-interface.component.html',
  styleUrls: ['./chat-interface.component.css']
})
export class ChatInterfaceComponent implements OnInit {
  @Input() title: string = '🤖 Assistente Orvian Travel';
  @Input() placeholder: string = 'Digite sua mensagem...';
  @Input() showTypingIndicator: boolean = true;
  @Input() maxHeight: string = '500px';
  @Input() allowFileUpload: boolean = false;
  
  @Output() messageReceived = new EventEmitter<ChatMessage>();
  @Output() messageSent = new EventEmitter<ChatMessage>();

  userMessage = '';
  loading = false;
  typing = false;
  messages: ChatMessage[] = [];

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit() {
    // Mensagem de boas-vindas
    this.addMessage({
      sender: 'Orb',
      content: 'Olá! 👋 Bem-vindo à Orvian Travel! Eu sou o Orb. Como posso ajudá-lo a planejar sua próxima viagem? ✈️',
      type: 'bot',
      timestamp: new Date()
    });
  }

  async sendMessage() {
    if (!this.userMessage.trim() || this.loading) return;

    const userMsg: ChatMessage = {
      id: this.generateId(),
      sender: 'Você',
      content: this.userMessage,
      type: 'user',
      timestamp: new Date()
    };

    // Adicionar mensagem do usuário
    this.addMessage(userMsg);
    this.messageSent.emit(userMsg);

    const messageContent = this.userMessage;
    this.userMessage = '';
    this.loading = true;
    this.typing = true;

    try {
      // Simular delay de digitação
      await this.delay(1000);

      // Enviar para o chatbot
      const response = await this.chatbotService.sendMessage(messageContent);
      
      const botMsg: ChatMessage = {
        id: this.generateId(),
        sender: 'Orb',
        content: response,
        type: 'bot',
        timestamp: new Date()
      };

      this.addMessage(botMsg);
      this.messageReceived.emit(botMsg);

    } catch (error) {
      const errorMsg: ChatMessage = {
        id: this.generateId(),
        sender: 'Sistema',
        content: 'Desculpe, ocorreu um erro. Nossa equipe foi notificada. Tente novamente em alguns instantes. 🔧',
        type: 'error',
        timestamp: new Date()
      };

      this.addMessage(errorMsg);
    } finally {
      this.loading = false;
      this.typing = false;
    }
  }

  private addMessage(message: ChatMessage) {
    this.messages.push(message);
    // Scroll para o final
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  private scrollToBottom() {
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat() {
    this.messages = [];
    this.ngOnInit(); // Recarregar mensagem de boas-vindas
  }

  // Método para obter as mensagens atuais
  getMessages(): ChatMessage[] {
    return [...this.messages];
  }

  // Método para restaurar mensagens salvas
  restoreMessages(messages: ChatMessage[]) {
    this.messages = [...messages];
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  exportChat() {
    const chatData = {
      timestamp: new Date().toISOString(),
      messages: this.messages
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-orvian-${Date.now()}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  getFormattedTime(timestamp?: Date): string {
    if (!timestamp) return '';
    return timestamp.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  formatMessageContent(content: string): string {
    // Converter quebras de linha para <br>
    let formatted = content.replace(/\n/g, '<br>');
    
    // Converter **texto** para <strong>texto</strong>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Converter *texto* para <em>texto</em>
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Converter URLs em links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    formatted = formatted.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    
    return formatted;
  }

  trackByMessageId(index: number, message: ChatMessage): string {
    return message.id || index.toString();
  }

  sendQuickMessage(message: string) {
    this.userMessage = message;
    this.sendMessage();
  }
}
