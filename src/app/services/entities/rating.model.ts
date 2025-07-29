export interface RatingDetail {
  id: string;
  rate: number;
  comment: string;
  reservationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaveRatingRequest {
  rate: number;
  comment: string;
  reservationId: string;
}

export interface SaveRatingResponse {
  id: string;
  rate: number;
  comment: string;
  reservationId: string;
  createdAt: Date;
  updatedAt: Date;
}
