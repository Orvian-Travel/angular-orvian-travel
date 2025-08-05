import { Observable } from "rxjs";
import { SweetAlertResult } from 'sweetalert2';

export interface IDialogManager {
  showNotificationAlert(title: string, message: string, showIcon: boolean): Observable<SweetAlertResult>

  showSuccessAlert(title: string, message: string, showIcon: boolean): Observable<SweetAlertResult>

  showErrorAlert(title: string, message: string, showIcon: boolean): Observable<SweetAlertResult>

  showWarningAlert(title: string, message: string, showIcon: boolean): Observable<SweetAlertResult>

  showConfirmationAlert(title: string, message: string, confirmText: string, cancelText: string, showIcon: boolean): Observable<SweetAlertResult>
}
