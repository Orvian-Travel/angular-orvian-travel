import { Observable } from "rxjs";
import { SweetAlertResult } from 'sweetalert2';

export interface IDialogManager {
  showNotificationAlert(options: { title: string, message: string, showIcon?: boolean, html?: string }): Observable<SweetAlertResult>

  showSuccessAlert(options: { title: string, message: string, showIcon?: boolean, html?: string }): Observable<SweetAlertResult>

  showErrorAlert(options: { title: string, message: string, showIcon?: boolean, html?: string }): Observable<SweetAlertResult>

  showWarningAlert(options: { title: string, message: string, showIcon?: boolean, html?: string }): Observable<SweetAlertResult>

  showConfirmationAlert(options: { title: string, message: string, confirmText?: string, cancelText?: string, showIcon?: boolean, html?: string }): Observable<SweetAlertResult>
}
