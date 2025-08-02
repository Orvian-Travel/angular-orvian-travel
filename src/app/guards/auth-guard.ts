import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStateService } from '../services/auth/auth-state-service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthStateService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    authService.setRedirectUrl(state.url);
    router.navigate(['/login']);
    return false
  }
};