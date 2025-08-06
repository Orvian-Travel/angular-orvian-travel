import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any = null;

  constructor(private http: HttpClient) {}

  loadConfig(): Observable<any> {
    if (this.config) {
      return of(this.config);
    }

    return this.http.get('/api/config').pipe(
      tap(config => {
        this.config = config;
        const configObj = config as any;
        console.log('Configuração carregada:', { ...configObj, azureAiApiKey: configObj.azureAiApiKey ? '***' : 'não definida' });
      }),
      catchError(error => {
        console.error('Erro ao carregar configuração:', error);
        // Fallback para configuração padrão
        const fallbackConfig = {
          production: true,
          apiUrl: 'https://orvian-travel-api.azurewebsites.net/api/v1',
          azureAiApiKey: null
        };
        this.config = fallbackConfig;
        return of(fallbackConfig);
      })
    );
  }

  getApiUrl(): string {
    if (typeof window !== 'undefined') {
      const runtimeApiUrl = (window as any)['env']?.['API_URL'];
      if (runtimeApiUrl) {
        return runtimeApiUrl;
      }
    }

    return this.config?.apiUrl || 'https://orvian-travel-api.azurewebsites.net/api/v1';
  }

  getAzureAiApiKey(): string | null {
    return this.config?.azureAiApiKey || null;
  }

  isProduction(): boolean {
    return this.config?.production ?? true;
  }
}

