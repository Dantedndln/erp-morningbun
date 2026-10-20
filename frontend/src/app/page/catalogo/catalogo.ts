import { Component, OnInit, AfterViewInit, inject, NgZone, signal, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ProductoService } from '../../services/producto.service';
import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';
import { PaypalService } from '../../services/paypal.service';
import { Producto } from '../../models/producto.model';
import { ResultadoPago } from '../../models/paypal.model';

// El SDK de PayPal se carga desde index.html y expone esta variable global
declare const paypal: any;

@Component({
  selector: 'app-catalogo',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
  // Necesario porque <paypal-button> es un elemento personalizado que no forma parte de Angular
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Catalogo implements OnInit, AfterViewInit {

  private zone = inject(NgZone);
  // Signal controla qué sección se está mostrando, y aquí se usa para poder conservar los elementos del catálogo aunque 
  // se cambie de sección
  productos = signal<Producto[]>([]);
  categoriaActiva = signal<string>('');
  modal = signal<'carrito' | 'ticket' | null>(null);
  resultado = signal<ResultadoPago | null>(null);
  mensaje = signal('Preparando PayPal...');

  renglonesTicket = signal<{ nombre: string; cantidad: number; subtotal: number }[]>([]);

  // Sesión de pago creada por el SDK
  private sesionPago: any = null;

  constructor(
    private productoService: ProductoService,
    private authService: AuthService,
    private router: Router,
    public carritoService: CarritoService,
    private paypalService: PaypalService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  // Se inicializa el SDK una sola vez, al construirse la vista
  async ngAfterViewInit() {
    try {
      const sdk = await paypal.createInstance({
        clientId: 'BAANnFtv9bR_Ks_80qfulagzXg4R1f7uE2RPCTF7OQK1ISfRSPHw8TIwOMiVYBKcXYU9fsmQ5Ea1zcbjDY',
        components: ['paypal-payments'],
        pageType: 'checkout'
      });

      // Se consulta si PayPal está disponible para la moneda indicada
      const metodos = await sdk.findEligibleMethods({
        currencyCode: 'MXN'
      });

      if (!metodos.isEligible('paypal')) {
        this.mensaje.set('PayPal no está disponible');
        return;
      }

      // La sesión define qué ocurre en cada etapa del pago
      this.sesionPago = sdk.createPayPalOneTimePaymentSession({
        // El comprador aprobó el pago: se solicita la captura al backend
        onApprove: async (data: { orderId: string }) => {
          try {
            const respuesta = await firstValueFrom(
              this.paypalService.capturarOrden(data.orderId)
            );

            this.zone.run(() => {
              // Se conservan los renglones para mostrarlos en el ticket
              this.renglonesTicket.set(
                this.carritoService.items().map(i => ({
                  nombre: i.producto.nombre,
                  cantidad: i.cantidad,
                  subtotal: Number(i.producto.precio) * i.cantidad
                }))
              );

              this.resultado.set(respuesta);
              this.carritoService.vaciar();
              this.modal.set('ticket');

              // Se recargan los productos para reflejar la existencia descontada
              this.cargarProductos(this.categoriaActiva());
            });
          } catch {
            this.zone.run(() => {
              this.mensaje.set('Pago pendiente de verificación');
            });
          }
        },

        onCancel: () => {
          this.zone.run(() => {
            this.mensaje.set('Pago cancelado');
          });
        },

        onError: () => {
          this.zone.run(() => {
            this.mensaje.set('Error al procesar el pago');
          });
        }
      });

      this.mensaje.set('Selecciona PayPal para pagar');

    } catch {
      this.mensaje.set('No se pudo cargar PayPal');
    }
  }

  cargarProductos(categoria: string = ''): void {
    this.categoriaActiva.set(categoria);

    this.productoService.obtenerProductos(categoria).subscribe({
      next: (datos) => this.productos.set(datos),
      error: (error) => console.error('Error al cargar los productos', error)
    });
  }

  agregar(producto: Producto): void {
    if (producto.stock < 1) {
      return;
    }
    this.carritoService.agregar(producto);
  }

  abrirCarrito(): void {
    this.modal.set('carrito');

    // El botón vive dentro del modal, así que se configura una vez que el modal existe en el DOM
    setTimeout(() => this.configurarBoton(), 0);
  }

  cerrarModal(): void {
    this.modal.set(null);
  }

  // Muestra el botón de PayPal y define qué hace al presionarlo
  private configurarBoton(): void {
    const boton = document.querySelector('paypal-button');

    if (!boton || !this.sesionPago) {
      return;
    }

    boton.removeAttribute('hidden');

    boton.addEventListener('click', async () => {
      if (this.carritoService.items().length === 0) {
        return;
      }

      try {
        // El backend crea la orden y devuelve su identificador
        await this.sesionPago.start(
          { presentationMode: 'auto' },
          firstValueFrom(
            this.paypalService.crearOrden(
              this.carritoService.paraBackend(),
              this.authService.obtenerNombre() ?? 'Público general',
              this.authService.obtenerCorreo() ?? ''
            )
          ).then(orden => ({ orderId: orden.id }))
        );
      } catch {
        this.zone.run(() => {
          this.mensaje.set('No se pudo iniciar el pago');
        });
      }
    });
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/']);
  }
}