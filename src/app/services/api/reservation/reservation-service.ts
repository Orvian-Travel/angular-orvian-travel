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
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { transformPagedResponse } from '../../../shared/utils/transform-page-utils';
import { ConfigService } from '../../config.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService implements IReservationService {
  constructor(private http: HttpClient, private configService: ConfigService) { }

  private get baseUrl() { return `${this.configService.getApiUrl()}/reservations`; }

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

  getAllReservationsWithPaginationWithStatus(
    pageNumber: number,
    pageSize: number,
    userId?: string,
    status?: string
  ) {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (userId) {
      params = params.set('userId', userId);
    }

    if (status && status !== 'todas') {
      params = params.set('status', status);
    }

    console.log('URL da requisição:', `${this.baseUrl}/search?${params.toString()}`);

    return this.http.get<any>(`${this.baseUrl}/search`, { params }).pipe(
      map(response => transformPagedResponse<ReservationDetail>(response, 'reservationSearchResultDTOList')) // Mudança aqui
    );
  }

  getReservationById(id: string): Observable<ReservationDetail> {
    return this.http.get<ReservationDetail>(`${this.baseUrl}/${id}`);
  }

  createReservation(saveReservationRequest: SaveReservationRequest): Observable<SaveReservationResponse> {
    const token = localStorage.getItem('orvian_token');

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
      console.log('Token enviado na requisição de reserva:', token);
    } else {
      console.warn('Nenhum token encontrado para criar reserva');
    }

    return this.http.post<SaveReservationResponse>(this.baseUrl, saveReservationRequest, { headers });
  }

  updateReservation(id: string, updateReservationRequest: UpdateReservationRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, updateReservationRequest);
  }

}
