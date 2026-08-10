import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    tap({
      error: (error) => {
        const router = inject(Router);
        if (error?.status === 401) {
          router.navigate(['/signin']);
        }
      }
    })
  );
};
