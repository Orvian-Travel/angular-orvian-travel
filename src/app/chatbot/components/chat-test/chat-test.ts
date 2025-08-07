// src/app/chatbot/components/chat-test/chat-test.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatInterfaceComponent, ChatMessage } from '../chat-interface/chat-interface.component';

@Component({
  selector: 'app-chat-test',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatInterfaceComponent],
  template: `
    <div class="chat-test-page">
      <div class="page-header">
        <h2>� Teste do Chatbot Orvian Travel</h2>
        <p>Interface de desenvolvimento para testar o assistente virtual</p>
      </div>
      
      <div class="chat-wrapper">
        <app-chat-interface
          title="🌎 Assistente Orvian Travel - Modo Teste"
          placeholder="Digite sua mensagem para testar..."
          [showTypingIndicator]="true"
          [allowFileUpload]="false"
          maxHeight="600px"
          (messageReceived)="onMessageReceived($event)"
          (messageSent)="onMessageSent($event)">
        </app-chat-interface>
      </div>
      
      <div class="test-info">
        <h3>📊 Informações do Teste</h3>
        <div class="stats">
          <div class="stat-item">
            <strong>Mensagens Enviadas:</strong> {{ messagesSent }}
          </div>
          <div class="stat-item">
            <strong>Respostas Recebidas:</strong> {{ messagesReceived }}
          </div>
          <div class="stat-item">
            <strong>Última Atividade:</strong> {{ lastActivity || 'Nenhuma' }}
          </div>
        </div>
        
        <div class="test-actions">
          <button class="btn-test" (click)="runTestSequence()">
            🚀 Executar Teste Automático
          </button>
          <button class="btn-test" (click)="clearStats()">
            🔄 Limpar Estatísticas
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-test-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f6fa;
      min-height: 100vh;
    }
    
    .page-header {
      text-align: center;
      margin-bottom: 30px;
      color: #2c3e50;
    }
    
    .page-header h2 {
      margin: 0 0 10px 0;
      font-size: 2rem;
    }
    
    .page-header p {
      margin: 0;
      color: #7f8c8d;
      font-size: 1.1rem;
    }
    
    .chat-wrapper {
      max-width: 800px;
      margin: 0 auto 30px auto;
      height: 700px;
    }
    
    .test-info {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      max-width: 800px;
      margin: 0 auto;
    }
    
    .test-info h3 {
      margin: 0 0 15px 0;
      color: #2c3e50;
    }
    
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .stat-item {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }
    
    .test-actions {
      display: flex;
      gap: 10px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .btn-test {
      background: #667eea;
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease;
    }
    
    .btn-test:hover {
      background: #5a6fd8;
      transform: translateY(-1px);
    }
    
    @media (max-width: 768px) {
      .chat-test-page {
        padding: 10px;
      }
      
      .chat-wrapper {
        height: 500px;
      }
      
      .stats {
        grid-template-columns: 1fr;
      }
      
      .test-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ChatTestComponent {
  messagesSent = 0;
  messagesReceived = 0;
  lastActivity = '';

  onMessageSent(message: ChatMessage) {
    this.messagesSent++;
    this.lastActivity = new Date().toLocaleTimeString('pt-BR');
    console.log('Mensagem enviada:', message);
  }

  onMessageReceived(message: ChatMessage) {
    this.messagesReceived++;
    this.lastActivity = new Date().toLocaleTimeString('pt-BR');
    console.log('Resposta recebida:', message);
  }

  async runTestSequence() {
    const testMessages = [
      'Olá!',
      'Quais destinos vocês oferecem?',
      'Quanto custa uma viagem para o Nordeste?',
      'Como funciona o processo de reserva?'
    ];

    // Simular envio de mensagens de teste
    // Nota: Isso seria implementado com acesso direto ao ChatInterface
    console.log('Executando sequência de teste com:', testMessages);
    alert('Sequência de teste iniciada! Verifique o console para detalhes.');
  }

  clearStats() {
    this.messagesSent = 0;
    this.messagesReceived = 0;
    this.lastActivity = '';
  }
}