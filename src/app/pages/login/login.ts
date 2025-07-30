import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IAuthService } from '../../services/api/auth/auth-service.interface';
import { SERVICES_TOKEN } from '../../services/services-token';

import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/api/auth/auth-service';
import { AuthStateService } from '../../services/auth/auth-state-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  providers: [{ provide: SERVICES_TOKEN.HTTP.AUTH, useClass: AuthService }],
})
export class Login implements OnInit {
  password: string = '';
  email: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authStateService: AuthStateService,
    @Inject(SERVICES_TOKEN.HTTP.AUTH) private readonly authService: IAuthService
  ) {}

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
          alert('Email ou senha incorretos');
        } else if (error.status === 500) {
          alert('Erro no servidor. Tente novamente mais tarde.');
        } else if (error.status === 404) {
          alert('Usuário não cadastrado.');
        } else {
          alert('Erro no login. Verifique sua conexão.');
        }
      },
    });
  }
}
