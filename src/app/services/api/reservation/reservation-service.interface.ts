import { Observable } from "rxjs";
import { PagedResponse } from "../../entities/paged-response.model";
import { ReservationDetail, SaveReservationRequest, SaveReservationResponse, UpdateReservationRequest } from "../../entities/reservation.model";

export interface IReservationService {

  getAllReservations(): Observable<ReservationDetail[]>;

  getAllReservationsWithPagination(pageNumber: number, pageSize: number): Observable<PagedResponse<ReservationDetail>>;

  getReservationById(id: string): Observable<ReservationDetail>;

  createReservation(saveReservationRequest: SaveReservationRequest): Observable<SaveReservationResponse>;

  updateReservation(id: string, updateReservationRequest: UpdateReservationRequest): Observable<void>;

}
