import { Observable } from "rxjs";
import { PaymentDetail, SavePaymentRequest, SavePaymentResponse, UpdatePaymentRequest } from "../../entities/payment.model";

export interface IPaymentService {

  authorizePayment(paymentMethod: string): Observable<any>;

  getAllPayments(): Observable<PaymentDetail[]>;

  getPaymentById(id: string): Observable<PaymentDetail>;

  createPayment(savePaymentRequest: SavePaymentRequest): Observable<SavePaymentResponse>;

  updatePayment(id: string, updatePaymentRequest: UpdatePaymentRequest): Observable<void>;

  deletePayment(id: string): Observable<void>;
}
