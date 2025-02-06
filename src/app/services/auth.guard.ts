import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard = (): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.user$.pipe(
    take(1),  // Prendre la première émission
    map(user => {
      if (user) {
        // L'utilisateur est authentifié
        return true;
      }
      // Sinon, redirection vers /login
      return router.parseUrl('/login');
    })
  );
};