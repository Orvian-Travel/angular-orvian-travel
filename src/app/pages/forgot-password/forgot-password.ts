import { Component } from '@angular/core';
import { PasswordResetService } from '../../services/api/password-reset/password-reset-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
  email: string = '';
  isLoading: boolean = false;
  message: string = '';
  isSuccess: boolean = false;

  constructor(
    private passwordResetService: PasswordResetService,
    private router: Router
  ) {}

  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  get isEmailValid(): boolean {
    return this.email.length > 0 && this.isValidEmail(this.email);
  }

  get canSubmit(): boolean {
    return this.isEmailValid && !this.isLoading;
  }

  onSubmit(): void {
    if (!this.email) {
      this.message = 'Por favor, digite seu email.';
      this.isSuccess = false;
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.message = 'Por favor, digite um email válido.';
      this.isSuccess = false;
      return;
    }

    this.isLoading = true;
    this.message = '';

    this.passwordResetService.requestPasswordReset(this.email).subscribe({
      next: () => {
        this.isSuccess = true;
        this.message = 'Email de recuperação enviado! Verifique sua caixa de entrada.';
        this.isLoading = false;
      },
      error: (error) => {
        this.isSuccess = false;
        this.isLoading = false;
        
        if (error.status === 404) {
          this.message = 'Email não encontrado.';
        } else {
          this.message = 'Erro ao enviar email. Tente novamente.';
        }
      }
    });
  }

  backToLogin(): void {
    this.router.navigate(['/login']);
  }
}
