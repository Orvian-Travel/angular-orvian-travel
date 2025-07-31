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

  onSubmit(): void {
    if (!this.email) {
      this.message = 'Por favor, digite seu email.';
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
