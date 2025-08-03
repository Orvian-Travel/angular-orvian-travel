import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPasswordResetService } from './password-reset-service.interface';
import { ConfigService } from '../../config.service';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService implements IPasswordResetService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  private get baseUrl() { return `${this.configService.getApiUrl()}/auth`; }

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