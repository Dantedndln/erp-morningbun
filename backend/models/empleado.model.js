// Define la estructura de un empleado tal como existe en la tabla "empleados"
class Empleado {
  constructor(id, nombre, puesto, salario, telefono, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.puesto = puesto;
    this.salario = salario;
    this.telefono = telefono;
    this.imagen = imagen;
  }
}

module.exports = Empleado;