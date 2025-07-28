import { Component, OnInit } from '@angular/core';
import { HeaderLogged } from "../../shared/components/header-logged/header-logged";

@Component({
  selector: 'app-payment',
  imports: [HeaderLogged],
  templateUrl: './payment.html',
  styleUrl: './payment.css'
})
export class Payment implements OnInit {

  constructor() {}

  // Função para adicionar viajante
  addTraveler(): void {
    const container = document.getElementById('travelers-container');
    if (container) {
      const travelerCount = container.children.length + 1;
      
      const travelerCard = document.createElement('div');
      travelerCard.className = 'traveler-card border rounded p-3 mb-3';
      travelerCard.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="fw-semibold">Viajante ${travelerCount}</span>
          <button class="btn remove-traveler">
            <img src="assets/icons/delete.svg" alt="Remover viajante">
          </button>
        </div>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label small fw-semibold text-muted">NOME COMPLETO</label>
            <input type="text" class="form-control" placeholder="" required>
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-semibold text-muted">DATA DE NASCIMENTO</label>
            <input type="date" class="form-control" required>
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-semibold text-muted">TIPO DE DOCUMENTO</label>
            <select class="form-select document-type-select" required>
              <option value="">Tipo de Documento</option>
              <option value="cpf">CPF</option>
              <option value="passaporte">Passaporte</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-semibold text-muted">NÚMERO</label>
            <input type="text" class="form-control document-number-input" placeholder="Selecione o tipo de documento" maxlength="8" disabled required>
          </div>
        </div>
      `;
      
      // Adicionar event listener para o botão de remover
      const removeButton = travelerCard.querySelector('.remove-traveler');
      if (removeButton) {
        removeButton.addEventListener('click', (event) => this.removeTraveler(event));
        
        // Forçar aplicação do estilo vermelho no ícone
        const icon = removeButton.querySelector('img');
        if (icon) {
          (icon as HTMLElement).style.filter = 'brightness(0) saturate(100%) invert(27%) sepia(92%) saturate(3576%) hue-rotate(336deg) brightness(91%) contrast(97%)';
          (icon as HTMLElement).style.width = '20px';
          (icon as HTMLElement).style.height = '20px';
        }
      }

      // Adicionar event listener para o select de tipo de documento
      const documentTypeSelect = travelerCard.querySelector('.document-type-select');
      if (documentTypeSelect) {
        documentTypeSelect.addEventListener('change', (event) => this.onDocumentTypeChange(event));
      }
      
      container.appendChild(travelerCard);
      this.updateRemoveButtons();
    }
  }

  // Função para remover viajante
  removeTraveler(event: Event): void {
    const button = event.target as HTMLElement;
    const travelerCard = button.closest('.traveler-card');
    if (travelerCard) {
      travelerCard.remove();
      this.updateTravelerNumbers();
      this.updateRemoveButtons();
    }
  }

  // Atualizar numeração dos viajantes
  private updateTravelerNumbers(): void {
    const travelers = document.querySelectorAll('.traveler-card');
    travelers.forEach((card, index) => {
      const span = card.querySelector('.fw-semibold');
      if (span) {
        span.textContent = `Viajante ${index + 1}`;
      }
    });
  }

  // Atualizar botões de remoção
  private updateRemoveButtons(): void {
    const removeButtons = document.querySelectorAll('.remove-traveler');
    removeButtons.forEach((button, index) => {
      if (index === 0) {
        (button as HTMLElement).style.display = removeButtons.length > 1 ? 'block' : 'none';
      } else {
        (button as HTMLElement).style.display = 'block';
      }
      
      // Garantir que o ícone tenha o estilo vermelho
      const icon = button.querySelector('img');
      if (icon) {
        (icon as HTMLElement).style.filter = 'brightness(0) saturate(100%) invert(27%) sepia(92%) saturate(3576%) hue-rotate(336deg) brightness(91%) contrast(97%)';
        (icon as HTMLElement).style.width = '20px';
        (icon as HTMLElement).style.height = '20px';
      }
    });
  }

  // Selecionar método de pagamento
  selectPaymentMethod(method: string): void {
    // Remove active class from all payment options
    document.querySelectorAll('.payment-option').forEach(option => {
      option.classList.remove('active');
    });

    // Add active class to selected option
    const selectedOption = document.querySelector(`[data-method="${method}"]`);
    if (selectedOption) {
      selectedOption.classList.add('active');
    }

    // Hide all payment forms
    document.querySelectorAll('.payment-form').forEach(form => {
      form.classList.remove('active');
    });

    // Show selected payment form
    const selectedForm = document.getElementById(`${method}-form`);
    if (selectedForm) {
      selectedForm.classList.add('active');
    }
  }

  onDocumentTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const travelerCard = select.closest('.traveler-card');
    const documentInput = travelerCard?.querySelector('.document-number-input') as HTMLInputElement;
    
    if (documentInput) {
      if (select.value) {
        documentInput.disabled = false;
        
        if (select.value === 'cpf') {
          documentInput.placeholder = '000.000.000-00';
          documentInput.maxLength = 14;
          documentInput.className = 'form-control document-number-input cpf-input';
          documentInput.removeEventListener('input', this.formatPassport);
          documentInput.addEventListener('input', (e) => this.formatCPF(e));
        } else if (select.value === 'passaporte') {
          documentInput.placeholder = 'AA123456';
          documentInput.maxLength = 8;
          documentInput.className = 'form-control document-number-input passport-input';
          documentInput.removeEventListener('input', this.formatCPF);
          documentInput.addEventListener('input', (e) => this.formatPassport(e));
        }
        
        documentInput.value = '';
      } else {
        documentInput.disabled = true;
        documentInput.placeholder = 'Selecione o tipo de documento';
        documentInput.value = '';
      }
    }
  }

  formatPassport(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^a-zA-Z0-9]/g, ''); // Remove caracteres especiais
    
    let formattedValue = '';
    let letterCount = 0;
    let numberCount = 0;
    
    for (let i = 0; i < value.length && formattedValue.length < 8; i++) {
      const char = value[i];
      
      if (letterCount < 2) {
        if (/[a-zA-Z]/.test(char)) {
          formattedValue += char.toUpperCase();
          letterCount++;
        }
      } 
      else if (numberCount < 6) {
        if (/[0-9]/.test(char)) {
          formattedValue += char;
          numberCount++;
        }
      }
    }
    
    input.value = formattedValue;
  }

  formatCPF(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    
    value = value.substring(0, 11);
    
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    input.value = value;
  }

  // Formatação de cartão de crédito
  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\s/g, '');
    value = value.replace(/(.{4})/g, '$1 ');
    input.value = value.trim();
  }

  // Formatação de data de vencimento
  formatCardExpiry(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    input.value = value;
  }

  ngOnInit(): void {
    // Inicializar eventos após o componente carregar
    setTimeout(() => {
      this.initializeEventListeners();
    }, 100);
  }

  private initializeEventListeners(): void {
    // Event listeners para métodos de pagamento
    document.querySelectorAll('.payment-option').forEach(option => {
      option.addEventListener('click', () => {
        const method = option.getAttribute('data-method');
        if (method) {
          this.selectPaymentMethod(method);
        }
      });
    });

    // Event listeners para formatação de cartão
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
      cardNumberInput.addEventListener('input', (e) => this.formatCardNumber(e));
    }

    const cardExpiryInput = document.getElementById('card-expiry');
    if (cardExpiryInput) {
      cardExpiryInput.addEventListener('input', (e) => this.formatCardExpiry(e));
    }

    // Event listeners para os selects de tipo de documento
    document.querySelectorAll('.document-type-select').forEach(select => {
      select.addEventListener('change', (e) => this.onDocumentTypeChange(e));
    });

    // Garantir que todos os ícones de remover tenham estilo vermelho
    document.querySelectorAll('.remove-traveler img').forEach(icon => {
      (icon as HTMLElement).style.filter = 'brightness(0) saturate(100%) invert(27%) sepia(92%) saturate(3576%) hue-rotate(336deg) brightness(91%) contrast(97%)';
      (icon as HTMLElement).style.width = '20px';
      (icon as HTMLElement).style.height = '20px';
    });
  }
}