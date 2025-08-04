import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  
  getApiUrl(): string {
    if (typeof window !== 'undefined') {
      const runtimeApiUrl = (window as any)['env']?.['API_URL'];
      if (runtimeApiUrl) {
        return runtimeApiUrl;
      }
    }

    return 'https://orvian-travel-api.azurewebsites.net/api/v1';
  }
}

