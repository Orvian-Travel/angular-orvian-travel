import { Component } from '@angular/core';
import { PasswordResetService } from '../../services/api/password-reset/password-reset-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  isLoading: boolean = false;
  message: string = '';
  isSuccess: boolean = false;

  constructor(
    private passwordResetService: PasswordResetService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';

    if (!this.token) {
      this.message = 'Token de redefinição inválido.';
      this.isSuccess = false;
    }
  }

  onSubmit(): void {
    if (!this.newPassword || !this.confirmPassword) {
      this.message = 'Por favor, preencha todos os campos.';
      this.isSuccess = false;
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.message = 'As senhas não coincidem.';
      this.isSuccess = false;
      return;
    }

    if (this.newPassword.length < 8) {
      this.message = 'A senha deve ter pelo menos 8 caracteres.';
      this.isSuccess = false;
      return;
    }

    this.isLoading = true;
    this.message = '';

    this.passwordResetService
      .resetPassword(this.token, this.newPassword)
      .subscribe({
        next: () => {
          this.isSuccess = true;
          this.message = 'Senha redefinida com sucesso!';
          this.isLoading = false;

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.isSuccess = false;
          this.isLoading = false;

          if (error.status === 400) {
            this.message = 'Token inválido ou expirado.';
          } else {
            this.message = 'Erro ao redefinir senha. Tente novamente.';
          }
        },
      });
  }

  backToLogin(): void {
    this.router.navigate(['/login']);
  }

  getPasswordStrength(): number {
    if (!this.newPassword) return 0;

    let strength = 0;
    if (this.newPassword.length >= 8) strength += 25;
    if (/[a-z]/.test(this.newPassword)) strength += 25;
    if (/[A-Z]/.test(this.newPassword)) strength += 25;
    if (/[0-9]/.test(this.newPassword)) strength += 25;

    return strength;
  }

  getPasswordStrengthClass(): string {
    const strength = this.getPasswordStrength();
    if (strength < 50) return 'bg-danger text-danger';
    if (strength < 75) return 'bg-warning text-warning';
    return 'bg-success text-success';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    if (strength < 50) return 'Fraca';
    if (strength < 75) return 'Média';
    return 'Forte';
  }
}
