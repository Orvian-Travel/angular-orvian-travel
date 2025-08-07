export enum PaymentStatus {
  APROVADO = 'APROVADO',
  CANCELADO = 'CANCELADO',
  PENDENTE = 'PENDENTE',
}

export enum PaymentMethod {
  CREDITO = 'CREDITO',
  DEBITO = 'DEBITO',
  BOLETO = 'BOLETO',
  PIX = 'PIX',
}

export interface PaymentDetail {
  id: string;
  valuePaid: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  paymentApprovedAt: Date;
  tax: number;
  installment: number;
  installmentAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SavePaymentRequest {
  valuePaid: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  paymentApprovedAt: Date;
  tax: number;
  installment: number;
  installmentAmount: number;
}

export interface SavePaymentResponse {
  id: string;
  valuePaid: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  paymentApprovedAt: Date;
  tax: number;
  installment: number;
  installmentAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdatePaymentRequest {
  valuePaid: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  paymentApprovedAt: Date;
  tax: number;
  installment: number;
  installmentAmount: number;
}
