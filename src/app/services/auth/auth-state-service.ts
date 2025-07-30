import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TokenModel } from '../entities/token-model';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private readonly TOKEN_KEY = 'orvian_token';
  private readonly USER_KEY = 'orvian_user';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasValidToken()
  );
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.checkAuthState();
  }

  login(tokenData: TokenModel): void {
    localStorage.setItem(this.TOKEN_KEY, tokenData.token);

    const userData = { name: tokenData.name };
    localStorage.setItem(this.USER_KEY, JSON.stringify(userData));

    this.isAuthenticatedSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): any {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  isLoggedIn(): boolean {
    return this.hasValidToken();
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  private checkAuthState(): void {
    this.isAuthenticatedSubject.next(this.hasValidToken());
  }

}
