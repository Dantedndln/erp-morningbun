import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';
import { Login } from './page/login/login';
import { Registro } from './page/registro/registro';
import { SinAcceso } from './page/sin-acceso/sin-acceso';
import { Privacidad } from './page/privacidad/privacidad';
import { Terminos } from './page/terminos/terminos';
import { Catalogo } from './page/catalogo/catalogo';
import { Contabilidad } from './page/contabilidad/contabilidad';
import { Inventario } from './page/inventario/inventario';
import { Ventas } from './page/ventas/ventas';
import { Compras } from './page/compras/compras';
import { Rrhh } from './page/rrhh/rrhh';

export const routes: Routes = [
  // Rutas públicas
  { path: '', component: Login },
  { path: 'registro', component: Registro },
  { path: 'privacidad', component: Privacidad },
  { path: 'terminos', component: Terminos },
  { path: 'sin-acceso', component: SinAcceso },

  // rutas para el cliente 
  {
    path: 'catalogo',
    component: Catalogo,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['cliente', 'administrador'] }
  },

  // rutas para el admin
  {
    path: 'contabilidad',
    component: Contabilidad,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['administrador'] }
  },
  {
    path: 'inventario',
    component: Inventario,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['administrador'] }
  },
  {
    path: 'ventas',
    component: Ventas,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['administrador'] }
  },
  {
    path: 'compras',
    component: Compras,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['administrador'] }
  },
  {
    path: 'rrhh',
    component: Rrhh,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['administrador'] }
  }
];