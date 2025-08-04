import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RatingDetail, CreateRatingDTO } from '../../entities/rating.model';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiUrl = `${environment.apiUrl}/ratings`;

  constructor(private http: HttpClient) { }

  /**
   * Busca todos os ratings
   * Endpoint: GET /api/v1/ratings
   */
  getAllRatings(): Observable<RatingDetail[]> {
    return this.http.get<RatingDetail[]>(`${this.apiUrl}`);
  }

  /**
   * Busca ratings por pacote específico
   * Endpoint: GET /api/v1/ratings/package/{packageId}
   */
  getRatingsByPackage(packageId: string): Observable<RatingDetail[]> {
    return this.http.get<RatingDetail[]>(`${this.apiUrl}/package/${packageId}`);
  }

  /**
   * Busca rating por reserva específica
   * Endpoint: GET /api/v1/ratings/reservation/{reservationId}
   */
  getRatingByReservation(reservationId: string): Observable<RatingDetail> {
    return this.http.get<RatingDetail>(`${this.apiUrl}/reservation/${reservationId}`);
  }

  /**
   * Busca rating específico por ID
   * Endpoint: GET /api/v1/ratings/{id}
   */
  getRatingById(id: string): Observable<RatingDetail> {
    return this.http.get<RatingDetail>(`${this.apiUrl}/${id}`);
  }

  /**
   * Cria um novo rating
   * Endpoint: POST /api/v1/ratings
   */
  saveRating(rating: CreateRatingDTO): Observable<RatingDetail> {
    return this.http.post<RatingDetail>(this.apiUrl, rating);
  }

  /**
   * Deleta um rating
   * Endpoint: DELETE /api/v1/ratings/{id}
   */
  deleteRating(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Busca os melhores ratings (carrossel)
   * Busca todos e filtra no frontend
   */
  getTopRatings(limit: number = 6): Observable<RatingDetail[]> {
    return this.http.get<RatingDetail[]>(`${this.apiUrl}`);
  }

  /**
   * Testa se o endpoint de ratings está funcionando
   */
  testConnection(): Observable<boolean> {
    return new Observable(observer => {
      this.http.get<RatingDetail[]>(`${this.apiUrl}`).subscribe({
        next: () => {
          observer.next(true);
          observer.complete();
        },
        error: () => {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }
}
