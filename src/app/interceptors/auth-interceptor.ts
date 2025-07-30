import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthStateService } from '../services/auth/auth-state-service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authStateService = inject(AuthStateService);
  const router = inject(Router);

  const token = authStateService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        authStateService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};