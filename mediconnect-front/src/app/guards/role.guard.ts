import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppRole } from '../models/auth.models';

export function roleGuard(allowedRoles: AppRole[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isLoggedIn()) {
      router.navigate(['/signin']);
      return false;
    }

    const role = auth.role();
    if (role && allowedRoles.includes(role)) return true;

    router.navigate(['/unauthorized']);
    return false;
  };
}
