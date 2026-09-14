import { Routes } from '@angular/router';
import { Login } from './page/login/login';
import { Registro } from './page/registro/registro';
import { Contabilidad } from './page/contabilidad/contabilidad';
import { Inventario } from './page/inventario/inventario';
import { Ventas } from './page/ventas/ventas';
import { Compras } from './page/compras/compras';
import { Rrhh } from './page/rrhh/rrhh';
import { Catalogo } from './page/catalogo/catalogo';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'registro', component: Registro },
  { path: 'contabilidad', component: Contabilidad },
  { path: 'inventario', component: Inventario },
  { path: 'ventas', component: Ventas },
  { path: 'compras', component: Compras },
  { path: 'rrhh', component: Rrhh },
  { path: 'catalogo', component: Catalogo },
];