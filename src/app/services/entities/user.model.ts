export interface UserDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaveUserRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  document: string;
  birthDate: Date;
}

export interface SaveUserResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  birthDate: Date;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  phone: string;
  document: string;
  role: string;
}

export interface UpdateUserResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
