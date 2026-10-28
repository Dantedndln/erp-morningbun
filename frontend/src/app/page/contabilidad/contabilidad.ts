import { Component, OnInit, signal, computed } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Navbar } from '../../navbar/navbar';
import { ContabilidadService } from '../../services/contabilidad.service';
import { Movimiento, Resumen, PuntoGrafica } from '../../models/contabilidad.model';

@Component({
  selector: 'app-contabilidad',
  imports: [Navbar, DatePipe, DecimalPipe],
  templateUrl: './contabilidad.html',
  styleUrl: './contabilidad.css'
})
export class Contabilidad implements OnInit {
  seccion = signal<'resumen' | 'registro'>('resumen');

  //cada sección tiene su propio periodo
  periodoResumen = signal<string>(this.mesActual());
  periodoRegistro = signal<string>(this.mesActual());

  resumen = signal<Resumen>({ ingresos: 0, egresos: 0, balance: 0 });
  grafica = signal<PuntoGrafica[]>([]);
  movimientos = signal<Movimiento[]>([]);

  //el valor más alto de la gráfica, usado para escalar las barras
  maximo = computed(() => {
    const valores = this.grafica().flatMap(p => [Number(p.ingresos), Number(p.egresos)]);
    return valores.length > 0 ? Math.max(...valores) : 0;
  });

  constructor(private contabilidadService: ContabilidadService) {}

  ngOnInit(): void {
    this.cargarResumen();
    this.cargarRegistro();
  }

  //devuelve el mes en curso en formato aaaa-mm
  private mesActual(): string {
    const hoy = new Date();
    return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
  }

  //convierte un mes (aaaa-mm) en su primer y último día
  private rangoDelMes(mes: string): { desde: string; hasta: string } {
    const [anio, numeroMes] = mes.split('-').map(Number);
    const ultimoDia = new Date(anio, numeroMes, 0).getDate();

    return {
      desde: `${mes}-01`,
      hasta: `${mes}-${String(ultimoDia).padStart(2, '0')}`
    };
  }

  cambiarPeriodoResumen(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    if (!valor) { return; }
    this.periodoResumen.set(valor);
    this.cargarResumen();
  }

  cambiarPeriodoRegistro(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    if (!valor) { return; }
    this.periodoRegistro.set(valor);
    this.cargarRegistro();
  }

  cargarResumen(): void {
    const { desde, hasta } = this.rangoDelMes(this.periodoResumen());

    this.contabilidadService.obtenerResumen(desde, hasta).subscribe({
      next: (datos) => this.resumen.set(datos),
      error: (error) => console.error('Error al cargar el resumen', error)
    });

    this.contabilidadService.obtenerGrafica(desde, hasta).subscribe({
      next: (datos) => this.grafica.set(datos),
      error: (error) => console.error('Error al cargar la gráfica', error)
    });
  }

  cargarRegistro(): void {
    const { desde, hasta } = this.rangoDelMes(this.periodoRegistro());

    this.contabilidadService.obtenerMovimientos(desde, hasta).subscribe({
      next: (datos) => this.movimientos.set(datos),
      error: (error) => console.error('Error al cargar los movimientos', error)
    });
  }

  //convierte un monto en la altura proporcional de su barra
  altura(monto: number): number {
    const mayor = this.maximo();
    if (mayor === 0) { return 0; }
    return (Number(monto) / mayor) * 180;
  }
}