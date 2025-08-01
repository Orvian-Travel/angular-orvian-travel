import { Injectable } from '@angular/core';
import { TokenModel } from '../../entities/token-model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IAuthService } from './auth-service.interface';
import { ConfigService } from '../../config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements IAuthService {
  constructor(private http: HttpClient, private configService: ConfigService) { }

  private get baseUrl() { return `${this.configService.getApiUrl()}/auth`; }

  login(email: string, password: string): Observable<TokenModel> {
    const loginRequest = { email, password };
    return this.http.post<TokenModel>(`${this.baseUrl}/login`, loginRequest);
  }
  
}
