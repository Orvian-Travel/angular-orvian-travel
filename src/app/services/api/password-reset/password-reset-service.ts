import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPasswordResetService } from './password-reset-service.interface';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService implements IPasswordResetService {
  private baseUrl = 'http://localhost:8080/api/v1/auth';

  constructor(private http: HttpClient) {}

  requestPasswordReset(email: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/request-password-reset`, null, {
      params: { email }
    });
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/reset-password/${token}`, null, {
      params: { newPassword }
    });
  }
}