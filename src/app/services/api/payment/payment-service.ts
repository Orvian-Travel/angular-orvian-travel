import { Injectable } from '@angular/core';
import { IPaymentService } from './payment-service.interface';
import { delay, Observable, of } from 'rxjs';
import {
  PaymentDetail,
  SavePaymentRequest,
  SavePaymentResponse,
  UpdatePaymentRequest
} from '../../entities/payment.model';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../config.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService implements IPaymentService {
  constructor(private http: HttpClient, private configService: ConfigService) { }

  private get baseUrl() { return `${this.configService.getApiUrl()}/payments`; }

  authorizePayment(paymentMethod: string): Observable<any>{
    const isApproved = paymentMethod === 'CREDITO' || paymentMethod === 'PIX';
    const mockResponse = {
      authorize: isApproved,
      method: paymentMethod,
      status: isApproved ? 'APROVADO' : 'PENDENTE',
    };

    return of(mockResponse).pipe(delay(1000));
  }

  getAllPayments(): Observable<PaymentDetail[]> {
    return this.http.get<PaymentDetail[]>(this.baseUrl);
  }

  getPaymentById(id: string): Observable<PaymentDetail> {
    return this.http.get<PaymentDetail>(`${this.baseUrl}/${id}`);
  }

  createPayment(savePaymentRequest: SavePaymentRequest): Observable<SavePaymentResponse> {
    return this.http.post<SavePaymentResponse>(this.baseUrl, savePaymentRequest);
  }

  updatePayment(id: string, updatePaymentRequest: UpdatePaymentRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, updatePaymentRequest);
  }

  deletePayment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}
