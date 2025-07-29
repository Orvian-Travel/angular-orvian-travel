import { Injectable } from '@angular/core';
import { ITravelerService } from './traveler-service.interface';
import { Observable } from 'rxjs';
import {
  TravelerDetail,
  SaveTravelerRequest,
  SaveTravelerResponse,
  UpdateTravelerRequest
} from '../../entities/traveler.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TravelerService implements ITravelerService {
  constructor(private http: HttpClient) { }

  private readonly baseUrl = `${environment.apiUrl}/travelers`;

  getAllTravelers(): Observable<TravelerDetail[]> {
    return this.http.get<TravelerDetail[]>(this.baseUrl);
  }

  getTravelerById(id: string): Observable<TravelerDetail> {
    return this.http.get<TravelerDetail>(`${this.baseUrl}/${id}`);
  }

  createTraveler(saveTravelerRequest: SaveTravelerRequest): Observable<SaveTravelerResponse> {
    return this.http.post<SaveTravelerResponse>(this.baseUrl, saveTravelerRequest);
  }

  updateTraveler(id: string, updateTravelerRequest: UpdateTravelerRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, updateTravelerRequest);
  }

  deleteTraveler(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}
