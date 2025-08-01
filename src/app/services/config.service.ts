import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  
  getApiUrl(): string {

    if (typeof window !== 'undefined') {
      // Runtime - configurado via Azure App Service
      const runtimeApiUrl = (window as any)['env']?.['API_URL'];
      if (runtimeApiUrl) {
        return runtimeApiUrl;
      }
    }

    return environment.apiUrl;
  }
}
