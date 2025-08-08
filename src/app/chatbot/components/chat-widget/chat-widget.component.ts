import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatInterfaceComponent, ChatMessage } from '../chat-interface/chat-interface.component';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, ChatInterfaceComponent],
  template: `
    <!-- Chat minimizado (botão flutuante) -->
    <div 
      *ngIf="!isOpen" 
      class="chat-bubble"
      (click)="toggleChat()"
      [class.pulse]="hasNewMessage">
      <div class="chat-bubble-content">
        <span class="chat-icon">💬</span>
        <span *ngIf="hasNewMessage" class="notification-badge">{{ unreadCount }}</span>
      </div>
      <div class="chat-bubble-tooltip">
        Precisa de ajuda? Clique para conversar! ✈️
      </div>
    </div>

    <!-- Chat expandido -->
    <div 
      *ngIf="isOpen" 
      class="chat-widget-container">
      
      <!-- Header personalizado com botão de fechar -->
      <div class="widget-header">
        <div class="widget-title">
          <span class="widget-icon">🌎</span>
          <h4>Assistente Orvian Travel</h4>
        </div>
        <div class="widget-actions">
          <button 
            class="btn-clear-chat" 
            (click)="clearChatMessages()"
            title="Limpar conversa">
            🔄
          </button>
          <button 
            class="btn-minimize" 
            (click)="toggleChat()"
            title="Minimizar chat">
            ➖
          </button>
        </div>
      </div>

      <!-- Componente de chat -->
      <div class="widget-chat">
        <app-chat-interface
          [title]="''"
          placeholder="Digite sua mensagem..."
          [showTypingIndicator]="true"
          [allowFileUpload]="false"
          maxHeight="400px"
          (messageReceived)="onMessageReceived($event)"
          (messageSent)="onMessageSent($event)">
        </app-chat-interface>
      </div>
    </div>

    <!-- Overlay para mobile -->
    <div 
      *ngIf="isOpen && isMobile" 
      class="chat-overlay"
      (click)="closeChat()">
    </div>
  `,
  styleUrls: ['./chat-widget.component.css']
})
export class ChatWidgetComponent implements OnInit {
  @Input() position: 'bottom-right' | 'bottom-left' = 'bottom-right';
  @Input() autoOpen: boolean = false;
  @Input() welcomeMessage: string = '';
  @ViewChild(ChatInterfaceComponent) chatInterface!: ChatInterfaceComponent;

  isOpen = false;
  hasNewMessage = false;
  unreadCount = 0;
  isMobile = false;
  
  // Armazenar mensagens persistentes para preservar histórico
  persistentMessages: ChatMessage[] = [];

  ngOnInit() {
    this.checkMobile();
    this.setupWelcomeMessage();
    
    // Auto-abrir se especificado
    if (this.autoOpen) {
      setTimeout(() => {
        this.openChat();
      }, 2000);
    }
  }

  private checkMobile() {
    this.isMobile = window.innerWidth <= 768;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
    });
  }

  private setupWelcomeMessage() {
    if (this.welcomeMessage) {
      // Lógica para mensagem de boas-vindas personalizada
    }
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.hasNewMessage = false;
      this.unreadCount = 0;
      
      // Restaurar mensagens quando abrir o chat
      setTimeout(() => {
        if (this.chatInterface && this.persistentMessages.length > 0) {
          this.chatInterface.restoreMessages(this.persistentMessages);
        }
      }, 100);
    } else {
      // Salvar mensagens quando fechar o chat
      if (this.chatInterface) {
        this.persistentMessages = [...this.chatInterface.getMessages()];
      }
    }
  }

  openChat() {
    this.isOpen = true;
    this.hasNewMessage = false;
    this.unreadCount = 0;
    
    // Restaurar mensagens quando abrir o chat
    setTimeout(() => {
      if (this.chatInterface && this.persistentMessages.length > 0) {
        this.chatInterface.restoreMessages(this.persistentMessages);
      }
    }, 100);
  }

  closeChat() {
    // Salvar mensagens antes de fechar
    if (this.chatInterface) {
      this.persistentMessages = [...this.chatInterface.getMessages()];
    }
    this.isOpen = false;
  }

  clearChatMessages() {
    // Limpar mensagens persistentes e do chat interface
    this.persistentMessages = [];
    if (this.chatInterface) {
      this.chatInterface.clearChat();
    }
  }

  onMessageSent(message: ChatMessage) {
    // Lógica quando usuário envia mensagem
    console.log('Mensagem enviada:', message);
  }

  onMessageReceived(message: ChatMessage) {
    // Se o chat estiver minimizado, mostrar notificação
    if (!this.isOpen) {
      this.hasNewMessage = true;
      this.unreadCount++;
    }
    console.log('Mensagem recebida:', message);
  }

  // Método para mostrar notificação quando chat está minimizado
  showNotification(message: string) {
    if (!this.isOpen) {
      this.hasNewMessage = true;
      this.unreadCount++;
      
      // Auto-abrir após alguns segundos (opcional)
      setTimeout(() => {
        if (!this.isOpen) {
          this.hasNewMessage = true;
        }
      }, 3000);
    }
  }
}
