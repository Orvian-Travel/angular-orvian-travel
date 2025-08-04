export interface RatingDetail {
  id: string;
  rate: number;
  comment: string;
  reservationId: string;
  createdAt: Date;
  updatedAt: Date;
  userName?: string; // Nome do usuário que fez a avaliação
  userEmail?: string; // Email do usuário (opcional)
  packageName?: string; // Nome do pacote avaliado
  packageId?: string; // ID do pacote avaliado
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

// Corresponde ao CreateRatingDTO do backend
export interface CreateRatingDTO {
  rate: number;
  comment: string;
  reservationId: string;
}
