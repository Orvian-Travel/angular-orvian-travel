import { UserService } from './../../services/api/user/user-service';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SaveUserRequest } from '../../services/entities/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  @ViewChild('birthdateInput') birthdateInput!: ElementRef<HTMLInputElement>;

  constructor(private router : Router, private userService: UserService){}

  user: SaveUserRequest = {} as SaveUserRequest;
  showConflictPopup: boolean = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.initializeEventListeners();
    }, 100);
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

  formatPhone(event: Event): void{
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

    // Atualiza a lista de requisitos
    this.updatePasswordRequirements(requirements);

    // Verifica se todos os requisitos foram atendidos
    const allValid = Object.values(requirements).every(req => req);
    
    if (password && allValid) {
      input.classList.add('is-valid');
    } else if (password) {
      input.classList.add('is-invalid');
    }
  }

  showPasswordRequirements(event: Event): void {
    const input = event.target as HTMLInputElement;
    let requirementsDiv = input.parentElement?.querySelector('.password-requirements') as HTMLElement;
    
    if (!requirementsDiv) {
      requirementsDiv = document.createElement('div') as HTMLElement;
      requirementsDiv.className = 'password-requirements';
      requirementsDiv.innerHTML = `
        <div class="requirement" data-req="length">
          <span class="req-icon">•</span> Entre 8 e 20 caracteres
        </div>
        <div class="requirement" data-req="lowercase">
          <span class="req-icon">•</span> Pelo menos uma letra minúscula
        </div>
        <div class="requirement" data-req="uppercase">
          <span class="req-icon">•</span> Pelo menos uma letra maiúscula
        </div>
        <div class="requirement" data-req="number">
          <span class="req-icon">•</span> Pelo menos um número
        </div>
        <div class="requirement" data-req="special">
          <span class="req-icon">•</span> Pelo menos um caractere especial (@#$%^&+=!)
        </div>
        <div class="requirement" data-req="noSpaces">
          <span class="req-icon">•</span> Sem espaços em branco
        </div>
      `;
      input.parentElement?.appendChild(requirementsDiv);
    }
    
    requirementsDiv.style.display = 'block';
  }

  hidePasswordRequirements(event: Event): void {
    const input = event.target as HTMLInputElement;
    const requirementsDiv = input.parentElement?.querySelector('.password-requirements') as HTMLElement;
    
    if (requirementsDiv) {
      setTimeout(() => {
        requirementsDiv.style.display = 'none';
      }, 200);
    }
  }

  updatePasswordRequirements(requirements: {[key: string]: boolean}): void {
    const requirementsDiv = document.querySelector('.password-requirements');
    
    if (requirementsDiv) {
      Object.keys(requirements).forEach(req => {
        const reqElement = requirementsDiv.querySelector(`[data-req="${req}"]`);
        if (reqElement) {
          if (requirements[req]) {
            reqElement.classList.add('requirement-met');
            reqElement.classList.remove('requirement-unmet');
          } else {
            reqElement.classList.add('requirement-unmet');
            reqElement.classList.remove('requirement-met');
          }
        }
      });
    }
  }

  register(user: SaveUserRequest): void {
    this.userService.createUser(user).subscribe({
      next: (response) => {
        console.log('User created successfully:', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error creating user:', error);
        
        if (error.status === 409) {
          this.showConflictPopup = true;
          setTimeout(() => {
            this.showConflictPopup = false;
          }, 3000);
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
