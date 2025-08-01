import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  
  getApiUrl(): string {
    // Prioridade: 
    // 1. Variável de ambiente do Azure (runtime)
    // 2. Environment file (build time)
    
    if (typeof window !== 'undefined') {
      // Runtime - configurado via Azure App Service
      const runtimeApiUrl = (window as any)['env']?.['API_URL'];
      if (runtimeApiUrl) {
        return runtimeApiUrl;
      }
    }

    // Fallback para environment file
    return environment.apiUrl;
  }
}
