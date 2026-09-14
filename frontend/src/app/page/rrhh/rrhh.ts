import { Component, OnInit, signal} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Navbar } from '../../navbar/navbar';
import { EmpleadoService } from '../../services/empleado.service';
import { Empleado, Asistencia, Pago } from '../../models/empleado.model';

@Component({
  imports: [Navbar, DatePipe],// DatePipe se usa para formatear las fechas en el HTML
  selector: 'app-rrhh',
  styleUrl: './rrhh.css',
  templateUrl: './rrhh.html',
})
export class Rrhh implements OnInit {

  // Signal controla qué sección se está mostrando
  // Empieza en 'empleados' porque es la primera pestaña
  seccion = signal<'empleados' | 'credenciales' | 'asistencia' | 'pagos'>('empleados');

  // Los datos que llegan del backend
  // Se usan signals para que la vista se actualice sola cuando cambian
  empleados = signal<Empleado[]>([]);
  asistencia = signal<Asistencia[]>([]);
  pagos = signal<Pago[]>([]);

  // Angular inyecta automáticamente el servicio al crear el componente
  constructor(private empleadoService: EmpleadoService) {}

  // ngOnInit se ejecuta una sola vez, justo después de crear el componente
  // Es el lugar habitual para pedir los datos iniciales
  ngOnInit(): void {

    // Cada petición es asíncrona: el .subscribe recibe la respuesta cuando llega
    // next dice qué hacer si todo salió bien
    // error dice qué hacer si el backend falló o no está encendido
    this.empleadoService.obtenerEmpleados().subscribe({
      next: (datos) => this.empleados.set(datos),
      error: (error) => console.error('Error al cargar los empleados', error)
    });

    this.empleadoService.obtenerAsistencia().subscribe({
      next: (datos) => this.asistencia.set(datos),
      error: (error) => console.error('Error al cargar la asistencia', error)
    });

    this.empleadoService.obtenerPagos().subscribe({
      next: (datos) => this.pagos.set(datos),
      error: (error) => console.error('Error al cargar los pagos', error)
    });
  }
}
