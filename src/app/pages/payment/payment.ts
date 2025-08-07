import { AuthStateService } from './../../services/auth/auth-state-service';
import { Component, Inject, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SERVICES_TOKEN } from '../../services/services-token';
import { PackageService } from '../../services/api/package/package-service';
import { PackageDetail } from '../../services/entities/package.model';
import { IPackageService } from '../../services/api/package/package-service.interface';
import { ReservationService } from '../../services/api/reservation/reservation-service';
import { PaymentService } from '../../services/api/payment/payment-service';
import { IReservationService } from '../../services/api/reservation/reservation-service.interface';
import { IPaymentService } from '../../services/api/payment/payment-service.interface';
import { PaymentMethod } from '../../services/entities/payment.model';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment',
  imports: [Header, DatePipe, CurrencyPipe, FormsModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css',
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: SERVICES_TOKEN.HTTP.PACKAGE, useClass: PackageService },
    { provide: SERVICES_TOKEN.HTTP.RESERVATION, useClass: ReservationService },
    { provide: SERVICES_TOKEN.HTTP.PAYMENT, useClass: PaymentService },
  ],
})
export class Payment implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  packageDetail: PackageDetail | null = null;

  constructor(
    private authStateService: AuthStateService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(SERVICES_TOKEN.HTTP.PACKAGE)
    private readonly packageService: IPackageService,
    @Inject(SERVICES_TOKEN.HTTP.RESERVATION)
    private readonly reservationService: IReservationService,
    @Inject(SERVICES_TOKEN.HTTP.PAYMENT)
    private readonly paymentService: IPaymentService
  ) { }

  packageId: string | null = null;
  packageDestination: string | null = null;
  packageCheckin: string | null = null;

  ngOnInit(): void {
    // Adicionar classe ao body e app-root para forçar fundo branco
    document.body.classList.add('payment-active');
    const appRoot = document.querySelector('app-root');
    if (appRoot) {
      appRoot.classList.add('payment-active');
    }

    this.route.queryParams.subscribe((params) => {
      this.packageId = params['packageId'];
      this.packageDestination = params['packageDestination'];
      this.packageCheckin = params['checkin'];
      if (this.packageId) {
        this.fetchPackageDetail(this.packageId);
      }
    });

    setTimeout(() => {
      this.initializeEventListeners();
    }, 100);
    this.authStateService.isAuthenticated$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  ngOnDestroy(): void {
    // Remover classe do body e app-root quando sair da página
    document.body.classList.remove('payment-active');
    const appRoot = document.querySelector('app-root');
    if (appRoot) {
      appRoot.classList.remove('payment-active');
    }
  }

  getTotalPrice(): number {
    return this.packageDetail?.price! * this.travelerCount;
  }

  getFinalPrice(): number {
    const basePrice = this.getTotalPrice();

    if (this.selectedPaymentMethod === 'PIX') {
      return basePrice * (1 - this.PIX_DISCOUNT / 100);
    }
    return basePrice;
  }

  getFinalPriceWithTax(): number {
    const finalPrice = this.getFinalPrice();
    return finalPrice * (1 + this.TAX_RATE / 100);
  }

  fetchPackageDetail(id: string): void {
    this.packageService.getPackageById(id).subscribe({
      next: (data: PackageDetail) => {
        this.packageDetail = data;
      },
      error: (err) => {
        console.error('Erro ao buscar pacote:', err);
      },
    });
  }

  travelerCount: number = 1;
  addTraveler(): void {
    const container = document.getElementById('travelers-container');
    if (container) {
      this.travelerCount = container.children.length + 1;

      const travelerCard = document.createElement('div');
      travelerCard.className = 'traveler-card border rounded p-3 mb-3';
      travelerCard.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="fw-semibold">Viajante ${this.travelerCount}</span>
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
                              <div class="col-md-6">
                      <label class="form-label small fw-semibold text-muted"
                        >EMAIL</label
                      >
                      <input
                        type="email"
                        class="form-control"
                        placeholder=""
                        required
                      />
                    </div>
        </div>
      `;

      // Adicionar event listener para o botão de remover
      const removeButton = travelerCard.querySelector('.remove-traveler');
      if (removeButton) {
        removeButton.addEventListener('click', (event) =>
          this.removeTraveler(event)
        );

        // Forçar aplicação do estilo vermelho no ícone
        const icon = removeButton.querySelector('img');
        if (icon) {
          (icon as HTMLElement).style.filter =
            'brightness(0) saturate(100%) invert(27%) sepia(92%) saturate(3576%) hue-rotate(336deg) brightness(91%) contrast(97%)';
          (icon as HTMLElement).style.width = '20px';
          (icon as HTMLElement).style.height = '20px';
        }
      }

      // Adicionar event listener para o select de tipo de documento
      const documentTypeSelect = travelerCard.querySelector(
        '.document-type-select'
      );
      if (documentTypeSelect) {
        documentTypeSelect.addEventListener('change', (event) =>
          this.onDocumentTypeChange(event)
        );
      }

      const inputs = travelerCard.querySelectorAll('input, select');
      inputs.forEach(input => {
        input.addEventListener('input', () => {
          setTimeout(() => {}, 0);
        });
        input.addEventListener('change', () => {
          setTimeout(() => {}, 0);
        });
      });

      container.appendChild(travelerCard);
      this.updateRemoveButtons();
    }
  }

  removeTraveler(event: Event): void {
    const button = event.target as HTMLElement;
    const travelerCard = button.closest('.traveler-card');
    if (travelerCard) {
      travelerCard.remove();
      this.updateTravelerNumbers();
      this.updateRemoveButtons();
      const container = document.getElementById('travelers-container');
      this.travelerCount = container ? container.children.length : 1;
    }
  }

  private updateTravelerNumbers(): void {
    const travelers = document.querySelectorAll('.traveler-card');
    travelers.forEach((card, index) => {
      const span = card.querySelector('.fw-semibold');
      if (span) {
        span.textContent = `Viajante ${index + 1}`;
      }
    });
  }

  private updateRemoveButtons(): void {
    const removeButtons = document.querySelectorAll('.remove-traveler');
    removeButtons.forEach((button, index) => {
      if (index === 0) {
        (button as HTMLElement).style.display =
          removeButtons.length > 1 ? 'block' : 'none';
      } else {
        (button as HTMLElement).style.display = 'block';
      }

      // Garantir que o ícone tenha o estilo vermelho
      const icon = button.querySelector('img');
      if (icon) {
        (icon as HTMLElement).style.filter =
          'brightness(0) saturate(100%) invert(27%) sepia(92%) saturate(3576%) hue-rotate(336deg) brightness(91%) contrast(97%)';
        (icon as HTMLElement).style.width = '20px';
        (icon as HTMLElement).style.height = '20px';
      }
    });
  }

  selectedPaymentMethod: string = '';
  currentReservationId: string = '';

  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod = method;

    document.querySelectorAll('.payment-option').forEach((option) => {
      option.classList.remove('active');
    });

    const selectedOption = document.querySelector(`[data-method="${method}"]`);
    if (selectedOption) {
      selectedOption.classList.add('active');
    }

    document.querySelectorAll('.payment-form').forEach((form) => {
      form.classList.remove('active');
    });

    let formId = '';
    switch (method) {
      case 'CREDITO':
        formId = 'cartao-form';
        break;
      case 'PIX':
        formId = 'pix-form';
        break;
      case 'BOLETO':
        formId = 'boleto-form';
        break;
    }

    const selectedForm = document.getElementById(formId);
    if (selectedForm) {
      selectedForm.classList.add('active');
    }
  }

  private collectTravelersData(): any[] {
    const travelers: any[] = [];
    const travelerCards = document.querySelectorAll('.traveler-card');

    travelerCards.forEach((card) => {
      const nameInput = card.querySelector('input[type="text"]') as HTMLInputElement;
      const birthDateInput = card.querySelector('input[type="date"]') as HTMLInputElement;
      const documentNumberInput = card.querySelector('.document-number-input') as HTMLInputElement;
      const emailInput = card.querySelector('input[type="email"]') as HTMLInputElement;

      if (nameInput && birthDateInput && documentNumberInput && emailInput) {
        travelers.push({
          name: nameInput.value,
          email: emailInput.value,
          cpf: documentNumberInput.value,
          birthDate: birthDateInput.value
        });
      }
    });
    return travelers;
  }

  private readonly TAX_RATE = 10.00;
  private readonly PIX_DISCOUNT = 5.00;

  buildReservationData(): any {
    const travelers = this.collectTravelersData();
    const user = this.getUser();
    const baseValue = this.getTotalPrice();

    let finalValue = baseValue;

    if (this.selectedPaymentMethod === 'PIX') {
      finalValue = baseValue * (1 - this.PIX_DISCOUNT / 100);
    }

    const installmentAmount = finalValue * (1 + this.TAX_RATE / 100);
    const roundedAmount = parseFloat(installmentAmount.toFixed(2));

    return {
      situation: 'PENDENTE',
      reservationDate: new Date().toISOString().split('T')[0],
      userId: user?.id,
      travelers: travelers,
      payment: {
        valuePaid: roundedAmount,
        paymentMethod: this.selectedPaymentMethod,
        status: 'PENDENTE',
        tax: 10.00,
        installment: 1,
        installmentAmount: roundedAmount
      },
      packageDateId: this.getSelectedPackageDateId()
    };
  }

  private getSelectedPackageDateId(): string {
    if (!this.packageDetail?.packageDates || !this.packageCheckin) {
      return '';
    }

    const selectedDate = new Date(this.packageCheckin);
    const selectedDateString = selectedDate.toISOString().split('T')[0];

    const packageDate = this.packageDetail.packageDates.find(pd => {
      const pdStartDate = new Date(pd.startDate);
      const pdStartDateString = pdStartDate.toISOString().split('T')[0];
      return pdStartDateString === selectedDateString;
    });
    return packageDate?.id || '';
  }

  processPayment(): void {
    const token = localStorage.getItem('orvian_token');

    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Erro de autenticação',
        text: 'Você precisa estar logado para realizar o pagamento. Por favor, faça login.',
        confirmButtonText: 'Fazer Login',
      });
      this.router.navigate(['/login']);
      return;
    }

    const user = this.getUser();
    if (!user?.id) {
      Swal.fire({
        icon: 'error',
        title: 'Usuário não encontrado',
        text: 'Erro: Não foi possível identificar o usuário. Tente fazer login novamente.',
        confirmButtonText: 'Fazer Login',
      });
      this.router.navigate(['/login']);
      return;
    }

    if (!this.selectedPaymentMethod) {
      Swal.fire({
        icon: 'warning',
        title: 'Método de pagamento não selecionado',
        text: 'Por favor, selecione um método de pagamento.',
        confirmButtonText: 'OK',
      });
      return;
    }

    const validationResult = this.validateTravelersData();
    if (!validationResult.isValid) {
      Swal.fire({
        icon: 'warning',
        title: 'Dados incompletos',
        text: validationResult.message,
        confirmButtonText: 'OK',
      });
      return;
    }

    if (!user?.id) {
      Swal.fire({
        icon: 'error',
        title: 'Usuário não encontrado',
        text: 'Erro: Não foi possível identificar o usuário. Tente fazer login novamente.',
        confirmButtonText: 'Fazer Login',
      });
      this.router.navigate(['/login']);
      return;
    }

    this.paymentService.authorizePayment(this.selectedPaymentMethod).subscribe({
      next: (response) => {
        if (response.authorize === true) {
          this.createConfirmedReservation();
        } else {
          this.createPendingReservation();
        }
      },
      error: (error) => {
        console.error('Erro ao processar pagamento:', error);
        this.createPendingReservation();
      }
    })
  }

  private validateTravelersData(): { isValid: boolean; message: string } {
    const travelerCards = document.querySelectorAll('.traveler-card');
    
    if (travelerCards.length === 0) {
      return {
        isValid: false,
        message: 'É necessário adicionar pelo menos um viajante.'
      };
    }

    let travelerNumber = 1;
    
    for (const card of travelerCards) {
      const nameInput = card.querySelector('input[type="text"]') as HTMLInputElement;
      if (!nameInput?.value?.trim()) {
        this.highlightInvalidField(travelerNumber, 'name');
        return {
          isValid: false,
          message: `Viajante ${travelerNumber}: O nome é obrigatório.`
        };
      }

      const birthDateInput = card.querySelector('input[type="date"]') as HTMLInputElement;
      if (!birthDateInput?.value) {
        this.highlightInvalidField(travelerNumber, 'birthDate');
        return {
          isValid: false,
          message: `Viajante ${travelerNumber}: A data de nascimento é obrigatória.`
        };
      }

      const birthDate = new Date(birthDateInput.value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (travelerNumber === 1 && age < 18) {
        this.highlightInvalidField(travelerNumber, 'birthDate');
        return {
          isValid: false,
          message: `Viajante ${travelerNumber}: O primeiro viajante deve ser maior de idade (18 anos).`
        };
      }

      const documentTypeSelect = card.querySelector('.document-type-select') as HTMLSelectElement;
      if (!documentTypeSelect?.value) {
        this.highlightInvalidField(travelerNumber, 'documentType');
        return {
          isValid: false,
          message: `Viajante ${travelerNumber}: Selecione o tipo de documento.`
        };
      }

      const documentNumberInput = card.querySelector('.document-number-input') as HTMLInputElement;
      if (!documentNumberInput?.value?.trim()) {
        this.highlightInvalidField(travelerNumber, 'documentNumber');
        return {
          isValid: false,
          message: `Viajante ${travelerNumber}: O número do documento é obrigatório.`
        };
      }

      if (documentTypeSelect.value === 'cpf') {
        const cpfValue = documentNumberInput.value.replace(/\D/g, '');
        if (cpfValue.length !== 11) {
          this.highlightInvalidField(travelerNumber, 'documentNumber');
          return {
            isValid: false,
            message: `Viajante ${travelerNumber}: CPF deve ter 11 dígitos.`
          };
        }
      }

      if (documentTypeSelect.value === 'passaporte') {
        const passportValue = documentNumberInput.value;
        if (passportValue.length !== 8) {
          this.highlightInvalidField(travelerNumber, 'documentNumber');
          return {
            isValid: false,
            message: `Viajante ${travelerNumber}: Passaporte deve ter 8 caracteres (2 letras + 6 números).`
          };
        }
      }

      const emailInput = card.querySelector('input[type="email"]') as HTMLInputElement;
      if (!emailInput?.value?.trim()) {
        this.highlightInvalidField(travelerNumber, 'email');
        return {
          isValid: false,
          message: `Viajante ${travelerNumber}: O email é obrigatório.`
        };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value)) {
        this.highlightInvalidField(travelerNumber, 'email');
        return {
          isValid: false,
          message: `Viajante ${travelerNumber}: Email inválido.`
        };
      }

      travelerNumber++;
    }

    return { isValid: true, message: '' };
  }

  private createConfirmedReservation(): void {
    const reservationData = this.buildReservationData();
    reservationData.payment.status = 'APROVADO';
    reservationData.situation = 'CONFIRMADA';

    this.reservationService.createReservation(reservationData).subscribe({
      next: (reservation) => {
        if (reservation?.id) {
          this.currentReservationId = reservation.id;
        }

        const checkinDate = this.packageCheckin || '';

        this.router.navigate(['/payment/approved'], {
          queryParams: {
            purshaseDate: new Date().toISOString().split('T')[0],
            totalValue: this.getFinalPriceWithTax().toFixed(2),
            packageName: this.packageDetail?.title,
            packageDuration: this.packageDetail?.duration,
            checkinDate: checkinDate.split('T')[0]
          }
        });
      },
      error: (err) => {
        console.error('Erro ao criar reserva confirmada:', err);
        this.handleReservationError(err, 'confirmada');
      }
    });
  }

  private createPendingReservation(): void {
    const reservationData = this.buildReservationData();

    this.reservationService.createReservation(reservationData).subscribe({
      next: (reservation) => {
        if (reservation?.id) {
          this.currentReservationId = reservation.id;
        }

        const checkinDate = this.packageCheckin || '';

        this.router.navigate(['/payment/pending'], {
          queryParams: {
            totalValue: this.getFinalPriceWithTax().toFixed(2),
            packageName: this.packageDetail?.title,
            packageDuration: this.packageDetail?.duration,
            checkinDate: checkinDate.split('T')[0]
          }
        });
      },
      error: (err) => {
        console.error('Erro ao criar reserva pendente:', err);
        this.handleReservationError(err, 'pendente');
      }
    });
  }

   private handleReservationError(error: any, reservationType: 'confirmada' | 'pendente'): void {
    console.error(`Erro detalhado da reserva ${reservationType}:`, error);

    let title = 'Erro na reserva';
    let message = 'Não foi possível criar a reserva. Tente novamente.';

    if (error.status === 400) {
      if (error.error?.message?.includes('traveler') || error.error?.message?.includes('viajante')) {
        title = 'Dados dos viajantes inválidos';
        message = 'Verifique os dados dos viajantes e tente novamente.';
      } else if (error.error?.message?.includes('package') || error.error?.message?.includes('pacote')) {
        title = 'Problema com o pacote';
        message = 'Erro na seleção do pacote. Tente selecionar novamente.';
      } else if (error.error?.message?.includes('date') || error.error?.message?.includes('data')) {
        title = 'Problema com a data';
        message = 'A data selecionada não está disponível.';
      } else {
        title = 'Dados inválidos';
        message = error.error?.message || 'Verifique todos os dados informados.';
      }
    } else if (error.status === 409) {
      title = 'Reserva já existente';
      message = 'Você já possui uma reserva para esta data. Verifique suas reservas.';
    } else if (error.status === 422) {
      title = 'Dados incompletos';
      message = 'Alguns dados obrigatórios estão faltando ou são inválidos.';
    } else if (error.status === 500) {
      title = 'Erro interno';
      message = 'Erro interno do servidor. Tente novamente em alguns minutos.';
    }

    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonText: 'OK',
    });
  }

  private highlightInvalidField(travelerNumber: number, fieldType: string): void {
    const travelerCards = document.querySelectorAll('.traveler-card');
    const targetCard = travelerCards[travelerNumber - 1];
    
    if (!targetCard) return;

    let targetInput: HTMLElement | null = null;

    switch (fieldType) {
      case 'name':
        targetInput = targetCard.querySelector('input[type="text"]');
        break;
      case 'birthDate':
        targetInput = targetCard.querySelector('input[type="date"]');
        break;
      case 'documentType':
        targetInput = targetCard.querySelector('.document-type-select');
        break;
      case 'documentNumber':
        targetInput = targetCard.querySelector('.document-number-input');
        break;
      case 'email':
        targetInput = targetCard.querySelector('input[type="email"]');
        break;
    }

    if (targetInput) {
      targetInput.classList.add('is-invalid');
      targetInput.focus();
      
      setTimeout(() => {
        targetInput?.classList.remove('is-invalid');
      }, 3000);
    }
  }

  onDocumentTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const travelerCard = select.closest('.traveler-card');
    const documentInput = travelerCard?.querySelector(
      '.document-number-input'
    ) as HTMLInputElement;

    if (documentInput) {
      const newInput = documentInput.cloneNode(true) as HTMLInputElement;
      documentInput.parentNode?.replaceChild(newInput, documentInput);

      if (select.value) {
        newInput.disabled = false;

        if (select.value === 'cpf') {
          newInput.placeholder = '000.000.000-00';
          newInput.maxLength = 14;
          newInput.className = 'form-control document-number-input cpf-input';
          newInput.addEventListener('input', (e) => this.formatCPF(e));
        } else if (select.value === 'passaporte') {
          newInput.placeholder = 'AA123456';
          newInput.maxLength = 8;
          newInput.className =
            'form-control document-number-input passport-input';
          newInput.addEventListener('input', (e) => this.formatPassport(e));
        }

        newInput.value = '';
      } else {
        newInput.disabled = true;
        newInput.placeholder = 'Selecione o tipo de documento';
        newInput.value = '';
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
      } else if (numberCount < 6) {
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

  private initializeEventListeners(): void {
    document.querySelectorAll('.payment-option').forEach((option) => {
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
      cardNumberInput.addEventListener('input', (e) =>
        this.formatCardNumber(e)
      );
    }

    const cardExpiryInput = document.getElementById('card-expiry');
    if (cardExpiryInput) {
      cardExpiryInput.addEventListener('input', (e) =>
        this.formatCardExpiry(e)
      );
    }

    // Event listeners para os selects de tipo de documento
    document.querySelectorAll('.document-type-select').forEach((select) => {
      select.addEventListener('change', (e) => this.onDocumentTypeChange(e));
    });

    // Garantir que todos os ícones de remover tenham estilo vermelho
    document.querySelectorAll('.remove-traveler img').forEach((icon) => {
      (icon as HTMLElement).style.filter =
        'brightness(0) saturate(100%) invert(27%) sepia(92%) saturate(3576%) hue-rotate(336deg) brightness(91%) contrast(97%)';
      (icon as HTMLElement).style.width = '20px';
      (icon as HTMLElement).style.height = '20px';
    });
  }

  loginRedirect(): void {
    this.router.navigate(['/login']);
  }

  registerRedirect(): void {
    this.router.navigate(['/register']);
  }

  logout(): void {
    this.authStateService.logout();
    this.router.navigate(['/']);
  }

  getUser(): any {
    const userStr = localStorage.getItem('orvian_user');
    const tokenStr = localStorage.getItem('orvian_token');
    const user = userStr ? JSON.parse(userStr) : null;

    if (user && !user.id && tokenStr) {
      try {
        const payload = JSON.parse(atob(tokenStr.split('.')[1]));
        user.id = payload.sub;
      } catch (error) {
        console.error('Erro ao decodificar JWT:', error);
      }
      return user;
    }
  }

  get isFormValid(): boolean {
    const travelerCards = document.querySelectorAll('.traveler-card');
    if (travelerCards.length === 0) return false;

    if (!this.selectedPaymentMethod) return false;

    for (const card of travelerCards) {
      const nameInput = card.querySelector('input[type="text"]') as HTMLInputElement;
      if (!nameInput?.value?.trim()) return false;

      const birthDateInput = card.querySelector('input[type="date"]') as HTMLInputElement;
      if (!birthDateInput?.value) return false;

      const documentTypeSelect = card.querySelector('.document-type-select') as HTMLSelectElement;
      if (!documentTypeSelect?.value) return false;

      const documentNumberInput = card.querySelector('.document-number-input') as HTMLInputElement;
      if (!documentNumberInput?.value?.trim()) return false;

      const emailInput = card.querySelector('input[type="email"]') as HTMLInputElement;
      if (!emailInput?.value?.trim()) return false;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value)) return false;
    }

    if (this.selectedPaymentMethod === 'CREDITO') {
      const cardNumberInput = document.getElementById('card-number') as HTMLInputElement;
      const cardExpiryInput = document.getElementById('card-expiry') as HTMLInputElement;
      const cardNameInput = document.querySelector('#cartao-form input[placeholder="Nome do Titular"]') as HTMLInputElement;
      const cvvInput = document.querySelector('#cartao-form input[placeholder="***"]') as HTMLInputElement;

      if (!cardNumberInput?.value?.replace(/\s/g, '').length || cardNumberInput.value.replace(/\s/g, '').length < 16) return false;
      if (!cardExpiryInput?.value || cardExpiryInput.value.length < 5) return false;
      if (!cardNameInput?.value?.trim()) return false;
      if (!cvvInput?.value || cvvInput.value.length < 3) return false;
    }

    return true;
  }
}