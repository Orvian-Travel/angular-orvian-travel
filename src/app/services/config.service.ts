import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  
  getApiUrl(): string {
    // 1. Primeiro: Verifica variável de ambiente do Azure (produção)
    if (typeof window !== 'undefined') {
      const runtimeApiUrl = (window as any)['env']?.['API_URL'];
      if (runtimeApiUrl) {
        return runtimeApiUrl;
      }
    }

    // 2. Segundo: Detecção automática por hostname
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8080/api/v1';
      } else if (hostname.includes('azurewebsites.net')) {
        return 'https://orvian-travel-api.azurewebsites.net/api/v1';
      }
    }

    // 3. Fallback padrão
    return 'https://orvian-travel-api.azurewebsites.net/api/v1';
  }
}

