import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

// valida que el usuario tenga el rol requerido por la ruta
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // obtener los roles permitidos declarados en la ruta
  const rolesPermitidos: string[] = route.data['roles'] ?? [];

  // verifica que exista una sesión antes
  if (!authService.estaAutenticado()) {
    return router.createUrlTree(['/']);
  }

  // verificar si el usuario tiene permisos
  if (authService.tieneRol(rolesPermitidos)) {
    return true;
  }

  // usuario autenticado pero no tiene permisos
  return router.createUrlTree(['/sin-acceso']);
};