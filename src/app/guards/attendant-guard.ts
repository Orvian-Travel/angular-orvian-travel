import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '../services/auth/auth-state-service';
import { inject } from '@angular/core';

export const attendantGuard: CanActivateFn = (route, state) => {
  const authStateService = inject(AuthStateService);
  const router = inject(Router);

  if (!authStateService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  if (!authStateService.isAttendant()) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
