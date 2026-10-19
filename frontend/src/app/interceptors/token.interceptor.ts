import { HttpInterceptorFn } from '@angular/common/http';
// middleware del lado del cliente: intercepta las peticiones salientes y les agrega el token para que el servidor pueda 
// validarlo
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req);
};