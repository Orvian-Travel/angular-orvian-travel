import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IAuthService } from '../../services/api/auth/auth-service.interface';
import { SERVICES_TOKEN } from '../../services/services-token';

import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/api/auth/auth-service';
import { AuthStateService } from '../../services/auth/auth-state-service';
import { DialogManager } from '@services/dialog/dialog-manager';
import { IDialogManager } from '@services/dialog/dialog-manager.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  providers: [
    { provide: SERVICES_TOKEN.HTTP.AUTH, useClass: AuthService },
    { provide: SERVICES_TOKEN.DIALOG, useClass: DialogManager },
  ],
})
export class Login implements OnInit {
  password: string = '';
  email: string = '';
  showPassword: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authStateService: AuthStateService,
    @Inject(SERVICES_TOKEN.HTTP.AUTH) private readonly authService: IAuthService,
    @Inject(SERVICES_TOKEN.DIALOG) private readonly dialogManager: IDialogManager,
  ) { }

  ngOnInit(): void {
    const from = this.route.snapshot.queryParams['from'];
    if (from) {
      this.authStateService.setRedirectUrl(from);
    }
  }

  returnPage(): void {
    this.router.navigate(['/']);
  }

  registerRedirect(): void {
    this.router.navigate(['/register']);
  }

  login(email: string, password: string): void {
    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('Response:', response);

        if (!response.token) {
          console.error('Invalid credentials:', response);
          alert('Credenciais inválidas.');
          return;
        }

        console.log('Login successful:', response);
        this.authStateService.login(response);

        const redirectUrl = this.authStateService.getRedirectUrl();
        console.log('Redirecting to:', redirectUrl);
        this.router.navigate([redirectUrl]);
      },
      error: (error) => {
        console.error('Login failed:', error);

        if (error.status === 401) {
          this.dialogManager.showErrorAlert({ title: 'Falha no login', message: 'Email ou senha incorretos', showIcon: false })
        } else if (error.status === 500) {
          this.dialogManager.showErrorAlert({ title: 'Erro', message: 'Erro no servidor. Tente novamente mais tarde.', showIcon: false })
        } else if (error.status === 404) {
          this.dialogManager.showErrorAlert({ title: 'Usuário não encontrado', message: 'Usuário não cadastrado.', showIcon: false })
        } else {
          this.dialogManager.showErrorAlert({ title: 'Erro no login', message: 'Erro no login. Verifique sua conexão.', showIcon: false })
        }
      },
    });
  }

  forgotPasswordRedirect(): void {
    this.router.navigate(['/forgot-password']);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
