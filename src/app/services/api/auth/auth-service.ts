import { Injectable } from '@angular/core';
import { TokenModel } from '../../entities/token-model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { IAuthService } from './auth-service.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements IAuthService {
  constructor(private http: HttpClient) { }

  private readonly baseUrl = `${environment.apiUrl}/auth`;

  login(email: string, password: string): Observable<TokenModel> {
    const loginRequest = { email, password };
    return this.http.post<TokenModel>(`${this.baseUrl}/login`, loginRequest);
  }
  
}
