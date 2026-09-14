import { Component, OnInit, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Navbar } from '../../navbar/navbar';
import { ContabilidadService } from '../../services/contabilidad.service';
import { Movimiento, Resumen } from '../../models/contabilidad.model';
@Component({
  imports: [Navbar, DatePipe],
  selector: 'app-contabilidad',
  styleUrl: './contabilidad.css',
  templateUrl: './contabilidad.html',
})
export class Contabilidad implements OnInit {
  seccion = signal<'resumen' | 'registro'>('resumen');
  movimientos = signal<Movimiento[]>([]);
  resumen = signal<Resumen>({ ingresos: 0, egresos: 0, balance: 0 });

  // computed crea un valor que se recalcula solo cuando cambia el signal del que depende
  // Aquí se usa para sacar la altura en píxeles de cada barra de la gráfica:
  // la cantidad mayor mide 180px y las demás se escalan en proporción a ella
  alturaIngresos = computed(() => this.calcularAltura(this.resumen().ingresos));
  alturaEgresos = computed(() => this.calcularAltura(this.resumen().egresos));

  constructor(private contabilidadService: ContabilidadService) {}

  ngOnInit(): void {
    this.contabilidadService.obtenerMovimientos().subscribe({
      next: (datos) => this.movimientos.set(datos),
      error: (error) => console.error('Error al cargar los movimientos', error)
    });

    this.contabilidadService.obtenerResumen().subscribe({
      next: (datos) => this.resumen.set(datos),
      error: (error) => console.error('Error al cargar el resumen', error)
    });
  }

  // Convierte un monto en una altura proporcional para la gráfica
  calcularAltura(monto: number): number {
    const mayor = Math.max(this.resumen().ingresos, this.resumen().egresos);
    if (mayor === 0) {
      return 0;
    }
    return (monto / mayor) * 180;
  }
}