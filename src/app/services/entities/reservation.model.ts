import { PackageDateDetail } from "./package-date.model";
import { PaymentDetail } from "./payment.model";
import { SaveTravelerRequest, TravelerDetail } from "./traveler.model";
import { SaveUserRequest, UserDetail, } from "./user.model";
import { RatingDetail } from "./rating.model";

export enum ReservationSituation {
  PENDENTE = 'PENDENTE',
  CONFIRMADA = 'CONFIRMADA',
  CANCELADA = 'CANCELADA',
  COMPLETED = 'COMPLETED',
}

export interface ReservationDetail {
  id: string;
  reservationDate: Date;
  situation: ReservationSituation;
  cancelDate?: Date;
  user: UserDetail;
  packageDate: PackageDateDetail;
  travelers: TravelerDetail[];
  payment: PaymentDetail;
  rating?: RatingDetail; // Rating opcional da reserva
  createdAt: Date;
  updatedAt: Date;
}

export interface SaveReservationRequest {
  situation: ReservationSituation;
  reservationDate: Date;
  user: SaveUserRequest;
  travelers: SaveTravelerRequest[];
  payment: PaymentDetail;
  packageDateId: string;
}

export interface SaveReservationResponse {
  id: string;
  situation: ReservationSituation;
  reservationDate: Date;
  cancelDate?: Date;
  user: UserDetail;
  packageDate: PackageDateDetail;
  travelers: TravelerDetail[];
  payment: PaymentDetail;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateReservationRequest {
  situation: ReservationSituation;
  reservationDate: Date;
  cancelDate?: Date;
  user: SaveUserRequest;
  travelers: SaveTravelerRequest[];
  payment: PaymentDetail;
  packageDateId: string;
}

export interface UpdateReservationCancelRequest {
  reservationSituation: ReservationSituation;
  reservationDate: Date;
}
