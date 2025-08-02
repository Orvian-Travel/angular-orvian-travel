import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '../services/auth/auth-state-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authStateService = inject(AuthStateService);
  const router = inject(Router);

  if (!authStateService.isLoggedIn()) {
    router.parseUrl('/login');
    return false;
  }

  if (!(authStateService.isAdmin() || authStateService.isAttendant())) {
    router.parseUrl('/login');
    return false;
  }

  return true;
};
