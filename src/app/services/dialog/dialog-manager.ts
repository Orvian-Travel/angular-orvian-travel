import { Injectable } from '@angular/core';
import { IDialogManager } from './dialog-manager.interface';
import { from, Observable } from 'rxjs';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class DialogManager implements IDialogManager {

  showNotificationAlert(options: { title: string, message: string, showIcon?: boolean, html?: string }): Observable<SweetAlertResult> {
    const swalPromise = Swal.fire({
      title: options.title,
      text: options.message,
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
      ...(options.html && { html: options.html }),
      ...(options.showIcon && { icon: 'info' })
    });

    return from(swalPromise);
  }

  showSuccessAlert(options: { title: string, message: string, showIcon?: boolean, html?: string }): Observable<SweetAlertResult> {
    const swalPromise = Swal.fire({
      title: options.title,
      text: options.message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#28a745',
      ...(options.html && { html: options.html }),
      ...(options.showIcon && { icon: 'success' })
    });

    return from(swalPromise);
  }

  showErrorAlert(options: { title: string, message: string, showIcon?: boolean, html?: string }): Observable<SweetAlertResult> {
    const swalPromise = Swal.fire({
      title: options.title,
      text: options.message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#dc3545',
      ...(options.html && { html: options.html }),
      ...(options.showIcon && { icon: 'error' })
    });

    return from(swalPromise);
  }

  showWarningAlert(options: { title: string, message: string, showIcon?: boolean, html?: string }): Observable<SweetAlertResult> {
    const swalPromise = Swal.fire({
      title: options.title,
      text: options.message,
      confirmButtonText: 'OK',
      confirmButtonColor: '#007bff',
      ...(options.html && { html: options.html }),
      ...(options.showIcon && { icon: 'warning' })
    });

    return from(swalPromise);
  }

  showConfirmationAlert(
    options: {
      title: string,
      message: string,
      confirmText?: string,
      cancelText?: string,
      showIcon?: boolean,
      html?: string
    }
  ): Observable<SweetAlertResult> {
    const swalPromise = Swal.fire({
      title: options.title,
      text: options.message,
      showCancelButton: true,
      confirmButtonText: options.confirmText,
      cancelButtonText: options.cancelText,
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#6c757d',
      reverseButtons: true,
      ...(options.html && { html: options.html }),
      ...(options.showIcon && { icon: 'question' })
    });

    return from(swalPromise);
  }

}
