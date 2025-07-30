import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '../services/auth/auth-state-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authStateService = inject(AuthStateService);
  const router = inject(Router);

  if (!authStateService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  if (!authStateService.isAdmin()) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
