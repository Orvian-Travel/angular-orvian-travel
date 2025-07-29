import { Injectable } from '@angular/core';
import { IReservationService } from './reservation-service.interface';
import { map, Observable } from 'rxjs';
import { PagedResponse } from '../../entities/paged-response.model';
import {
  ReservationDetail,
  SaveReservationRequest,
  SaveReservationResponse,
  UpdateReservationRequest
} from '../../entities/reservation.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { transformPagedResponse } from '../../../shared/utils/transform-page-utils';

@Injectable({
  providedIn: 'root'
})
export class ReservationService implements IReservationService {
  constructor(private http: HttpClient) { }

  private readonly baseUrl = `${environment.apiUrl}/reservations`;

  getAllReservations(): Observable<ReservationDetail[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(response => transformPagedResponse<ReservationDetail>(response, 'ReservationSearchResultDTOList')),
      map(pagedResponse => pagedResponse._embedded.DTOList)
    );
  }

  getAllReservationsWithPagination(pageNumber: number, pageSize: number): Observable<PagedResponse<ReservationDetail>> {
    return this.http.get<any>(`${this.baseUrl}?page=${pageNumber}&size=${pageSize}`).pipe(
      map(response => transformPagedResponse<ReservationDetail>(response, 'ReservationSearchResultDTOList'))
    );
  }

  getReservationById(id: string): Observable<ReservationDetail> {
    return this.http.get<ReservationDetail>(`${this.baseUrl}/${id}`);
  }

  createReservation(saveReservationRequest: SaveReservationRequest): Observable<SaveReservationResponse> {
    return this.http.post<SaveReservationResponse>(this.baseUrl, saveReservationRequest);
  }

  updateReservation(id: string, updateReservationRequest: UpdateReservationRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, updateReservationRequest);
  }

}
