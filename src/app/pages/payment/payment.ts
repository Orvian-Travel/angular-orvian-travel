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
          <button class="btn btn-outline-danger btn-sm remove-traveler">
            <i class="fas fa-trash"></i>
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
            <select class="form-select" required>
              <option value="">Tipo de Documento</option>
              <option value="cpf">CPF</option>
              <option value="rg">RG</option>
              <option value="passaporte">Passaporte</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label small fw-semibold text-muted">NÚMERO</label>
            <input type="text" class="form-control" placeholder="000.000.000-00" required>
          </div>
        </div>
      `;
      
      // Adicionar event listener para o botão de remover
      const removeButton = travelerCard.querySelector('.remove-traveler');
      if (removeButton) {
        removeButton.addEventListener('click', (event) => this.removeTraveler(event));
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
  }
}