import { Injectable } from '@angular/core';
import { IDialogManager } from './dialog-manager.interface';
import { from, Observable } from 'rxjs';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class DialogManager implements IDialogManager {

  showNotificationAlert(title: string, message: string, showIcon: boolean = false): Observable<SweetAlertResult> {
    const swalPromise = Swal.fire({
      title: title,
      text: message,
      timer: 3000,
      showConfirmButton: false,
      position: 'top-end',
      width: '400px',
      background: '#f8f9fa',
      toast: true,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      ...(showIcon && { icon: 'info' })
    });

    return from(swalPromise);
  }

  showSuccessAlert(title: string, message: string, showIcon: boolean = true): Observable<SweetAlertResult> {
    const swalPromise = Swal.fire({
      title: title,
      text: message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#28a745',
      ...(showIcon && { icon: 'success' })
    });

    return from(swalPromise);
  }

  showErrorAlert(title: string, message: string, showIcon: boolean = true): Observable<SweetAlertResult> {
    const swalPromise = Swal.fire({
      title: title,
      text: message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#dc3545',
      ...(showIcon && { icon: 'error' })
    });

    return from(swalPromise);
  }

  showConfirmationAlert(
    title: string,
    message: string,
    confirmText: string = 'Sim',
    cancelText: string = 'Não',
    showIcon: boolean = true
  ): Observable<SweetAlertResult> {
    const swalPromise = Swal.fire({
      title: title,
      text: message,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#6c757d',
      reverseButtons: true,
      ...(showIcon && { icon: 'question' })
    });

    return from(swalPromise);
  }

}
