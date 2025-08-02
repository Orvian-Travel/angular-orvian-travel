import { UserService } from './../../services/api/user/user-service';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SaveUserRequest } from '../../services/entities/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  @ViewChild('birthdateInput') birthdateInput!: ElementRef<HTMLInputElement>;

  constructor(private router: Router, private userService: UserService) { }

  user: SaveUserRequest = {} as SaveUserRequest;
  confirmPassword: string = '';
  passwordsMatch: boolean = false;
  showConflictPopup: boolean = false;
  showPassword: boolean = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.initializeEventListeners();
    }, 100);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private initializeEventListeners(): void {
    const documentTypeSelect = document.querySelector('.document-type-select');
    if (documentTypeSelect) {
      documentTypeSelect.addEventListener('change', (e) => this.onDocumentTypeChange(e));
    }

    const emailInput = document.querySelector('#email');
    if (emailInput) {
      emailInput.addEventListener('blur', (e) => this.validateEmail(e));
      emailInput.addEventListener('input', (e) => this.validateEmail(e));
    }

    const passwordInput = document.querySelector('#password');
    if (passwordInput) {
      passwordInput.addEventListener('input', (e) => this.validatePassword(e));
      passwordInput.addEventListener('focus', (e) => this.showPasswordRequirements(e));
      passwordInput.addEventListener('blur', (e) => this.hidePasswordRequirements(e));
    }
  }

  onDocumentTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const documentInput = document.querySelector('.document-number-input') as HTMLInputElement;

    if (documentInput) {
      // Limpa o valor do modelo
      this.user.document = '';

      if (select.value) {
        documentInput.disabled = false;

        if (select.value === 'cpf') {
          documentInput.placeholder = '000.000.000-00';
          documentInput.maxLength = 14;
          documentInput.className = 'form-control form-control-custom document-number-input cpf-input';
          // Remove listeners anteriores
          documentInput.removeEventListener('input', this.formatPassport.bind(this));
          documentInput.addEventListener('input', (e) => {
            this.formatCPF(e);
            this.user.document = (e.target as HTMLInputElement).value;
          });
        } else if (select.value === 'passport') {
          documentInput.placeholder = 'AB123456';
          documentInput.maxLength = 8;
          documentInput.className = 'form-control form-control-custom document-number-input passport-input';
          // Remove listeners anteriores
          documentInput.removeEventListener('input', this.formatCPF.bind(this));
          documentInput.addEventListener('input', (e) => {
            this.formatPassport(e);
            this.user.document = (e.target as HTMLInputElement).value;
          });
        }

        documentInput.value = '';
      } else {
        documentInput.disabled = true;
        documentInput.placeholder = 'Selecione o tipo de documento';
        documentInput.value = '';
      }
    }
  }

  formatPhone(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    value = value.substring(0, 11);

    if (value.length <= 11) {
      value = value.replace(/(\d{2})(\d)/, '($1) $2');
      value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }

    input.value = value;
    this.user.phone = value;
  }

  formatPassport(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^a-zA-Z0-9]/g, '');

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
    this.user.document = formattedValue;
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
    this.user.document = value;
  }

  returnPage(): void {
    this.router.navigate(['/']);
  }

  openDatePicker(): void {
    if (this.birthdateInput) {
      const input = this.birthdateInput.nativeElement;
      if ('showPicker' in input && typeof (input as any).showPicker === 'function') {
        (input as any).showPicker();
      } else {
        input.focus();
        input.click();
      }
    }
  }

  validateEmail(event: Event): void {
    const input = event.target as HTMLInputElement;
    const email = input.value;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Remove classes de validação anteriores
    input.classList.remove('is-valid', 'is-invalid');

    // Remove mensagem de erro anterior
    const existingError = input.parentElement?.querySelector('.invalid-feedback');
    if (existingError) {
      existingError.remove();
    }

    if (email && !emailRegex.test(email)) {
      input.classList.add('is-invalid');

      // Adiciona mensagem de erro
      const errorMessage = document.createElement('div');
      errorMessage.className = 'invalid-feedback';
      errorMessage.textContent = 'Por favor, insira um email válido';
      input.parentElement?.appendChild(errorMessage);
    } else if (email) {
      input.classList.add('is-valid');
    }
  }

  validatePassword(event: Event): void {
    const input = event.target as HTMLInputElement;
    const password = input.value;

    // Remove classes de validação anteriores
    input.classList.remove('is-valid', 'is-invalid');

    // Verifica cada requisito
    const requirements = {
      length: password.length >= 8 && password.length <= 20,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[@#$%^&+=!]/.test(password),
      noSpaces: !/\s/.test(password)
    };

    // Atualiza a lista de requisitos com ícones dinâmicos
    this.updatePasswordRequirements(requirements);

    // Verifica se todos os requisitos foram atendidos
    const allRequirementsMet = Object.values(requirements).every(req => req);

    if (password.length > 0) {
      if (allRequirementsMet) {
        input.classList.add('is-valid');
      } else {
        input.classList.add('is-invalid');
      }
    }

    // Revalida a confirmação de senha se ela já foi preenchida
    if (this.confirmPassword) {
      this.validatePasswordMatch();
    }
  }

  validatePasswordMatch(event?: Event): void {
    if (event) {
      const input = event.target as HTMLInputElement;
      // Remove classes de validação anteriores
      input.classList.remove('is-valid', 'is-invalid');
    }

    this.passwordsMatch = !!(this.user.password &&
      this.confirmPassword &&
      this.user.password === this.confirmPassword);

    // Aplica classes de validação visual no campo de confirmação
    if (event) {
      const input = event.target as HTMLInputElement;
      if (this.confirmPassword) {
        if (this.passwordsMatch) {
          input.classList.add('is-valid');
        } else {
          input.classList.add('is-invalid');
        }
      }
    }
  }

  // Nova função para verificar se o formulário é válido
  isFormValid(): boolean {
    return !!(
      this.user.name &&
      this.user.document &&
      this.user.birthDate &&
      this.user.phone &&
      this.user.email &&
      this.user.password &&
      this.confirmPassword &&
      this.passwordsMatch &&
      this.isPasswordValid()
    );
  }

  private isPasswordValid(): boolean {
    const password = this.user.password;
    if (!password) return false;

    const requirements = {
      length: password.length >= 8 && password.length <= 20,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[@#$%^&+=!]/.test(password),
      noSpaces: !/\s/.test(password)
    };

    return Object.values(requirements).every(req => req);
  }

  showPasswordRequirements(event: Event): void {
    const requirementsDiv = document.getElementById('password-requirements');
    if (requirementsDiv) {
      requirementsDiv.style.display = 'block';
    }
  }

  hidePasswordRequirements(event: Event): void {
    const requirementsDiv = document.getElementById('password-requirements');
    if (requirementsDiv) {
      requirementsDiv.style.display = 'none';
    }
  }

  updatePasswordRequirements(requirements: any): void {
    // Atualiza cada requisito individualmente
    Object.keys(requirements).forEach(requirement => {
      const element = document.querySelector(`[data-requirement="${requirement}"]`);
      const icon = element?.querySelector('.req-icon');

      if (element && icon) {
        if (requirements[requirement]) {
          // Requisito atendido
          element.classList.remove('requirement-unmet');
          element.classList.add('requirement-met');
          icon.textContent = '✓';
        } else {
          // Requisito não atendido
          element.classList.remove('requirement-met');
          element.classList.add('requirement-unmet');
          icon.textContent = '✗';
        }
      }
    });
  }

  register(user: SaveUserRequest): void {
    if (!this.isFormValid()) {
      // Correção do SweetAlert:
      Swal.fire({
        icon: 'warning',
        title: 'Formulário incompleto',
        text: 'Por favor, preencha todos os campos corretamente antes de continuar.',
        confirmButtonText: 'Entendi',
        confirmButtonColor: '#1486b4',
        background: '#ffffff',
        customClass: {
          popup: 'custom-swal-popup',
          title: 'custom-swal-title',
          htmlContainer: 'custom-swal-content', // ← Mudança: 'content' para 'htmlContainer'
          confirmButton: 'custom-swal-button'
        }
      });
      return;
    }

    this.userService.createUser(user).subscribe({
      next: (response) => {
        console.log('User created successfully:', response);

        Swal.fire({
          icon: 'success',
          title: 'Conta criada com sucesso!',
          text: 'Você será redirecionado para a página de login.',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          confirmButtonColor: '#1486b4'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (error) => {
        console.error('Error creating user:', error);

        if (error.status === 409) {
          Swal.fire({
            icon: 'error',
            title: 'Email já cadastrado',
            text: 'Este email já está sendo usado por outra conta. Tente fazer login ou use outro email.',
            confirmButtonText: 'Tentar novamente',
            confirmButtonColor: '#1486b4',
            showCancelButton: true,
            cancelButtonText: 'Ir para Login',
            cancelButtonColor: '#6c757d'
          }).then((result) => {
            if (result.dismiss === Swal.DismissReason.cancel) {
              this.router.navigate(['/login']);
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erro no cadastro',
            text: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
            confirmButtonText: 'Tentar novamente',
            confirmButtonColor: '#1486b4'
          });
        }
      }
    });
  }


  closeConflictPopup(): void {
    this.showConflictPopup = false;
  }

  loginRedirect(): void {
    this.router.navigate(['/login']);
  }
}
