import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// valida el acceso a las rutas protegidas al cambiar de URL
export const authGuard: CanActivateFn = (route, state) => {
  // inject permite usar dependencias sin declararlas en el constructor
  const authService = inject(AuthService);
  const router = inject(Router);

  // verificamos si el usuario tiene sesión
  if (authService.estaAutenticado()) {
    return true; // permitimos el acceso
  }

  // si no la tiene, lo enviamos al login
  return router.createUrlTree(['/']);
};
