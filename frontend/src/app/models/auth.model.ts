// Credenciales enviadas al backend
export interface Credenciales {
  usuario: string;
  contrasena: string;
}

// Respuesta que devuelve el backend al autenticar
export interface RespuestaLogin {
  token: string;
  nombre: string;
  correo: string;
  rol: string;
}