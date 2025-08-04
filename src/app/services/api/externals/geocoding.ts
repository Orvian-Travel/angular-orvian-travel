import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

export interface GeocodingResult {
  lat: number;
  lon: number;
  display_name: string;
}

@Injectable({
  providedIn: 'root'
})

export class Geocoding {
  private readonly nominatimUrl = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient){}

  getCoordinates(destination: string): Observable<GeocodingResult | null>{
    const params = {
      q: destination,
      format: 'json',
      limit: 1,
      addressdetails: '1'
    };

    return this.http.get<any[]>(this.nominatimUrl, { params }).pipe(
      map(results => {
        if (results && results.length > 0) {
          const result = results[0];
          return {
            lat: parseFloat(result.lat),
            lon: parseFloat(result.lon),
            display_name: result.display_name
        };
      }
      return null;
      }),
      catchError(error => {
        console.error('Erro ao buscar coordenadas:', error);
        return of(null);
      })
    );
  }
}
