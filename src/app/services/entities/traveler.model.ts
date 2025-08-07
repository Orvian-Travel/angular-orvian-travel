export interface TravelerDetail {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  birthDate: Date;
}

export interface SaveTravelerRequest {
  nome: string;
  email: string;
  cpf: string;
  birthDate: Date;
}

export interface SaveTravelerResponse {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  birthDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateTravelerRequest {
  nome: string;
  email: string;
  cpf: string;
  birthDate: Date;
}
