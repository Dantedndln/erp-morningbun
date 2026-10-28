import { Component, OnInit, signal } from '@angular/core';
import { Navbar } from '../../navbar/navbar';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-inventario',
  imports: [Navbar],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css'
})
export class Inventario implements OnInit {
   //signal se usa para no perder los datos del inventario cuando se cambia de sección y se regresa a la misma. Esto me estuvo 
  // pasando mucho y, de hecho, aquí fue el lugar donde empecé a usar signal, y me di cuenta de que era muy útil c:
  productos = signal<Producto[]>([]);
  modal = signal<'formulario' | 'detalle' | null>(null);
  editando = signal(false);
  seleccionado = signal<Producto | null>(null);
  error = signal('');
  exito = signal('');

  // Las categorías disponibles, las mismas que filtran el catálogo
  categorias = ['Café', 'Desayunos', 'Panadería', 'Malteadas', 'Helados', 'Granos', 'Extras'];

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (datos) => this.productos.set(datos),
      error: (error) => console.error('Error al cargar los productos', error)
    });
  }

  abrirNuevo(): void {
    this.seleccionado.set(null);
    this.editando.set(false);
    this.limpiarMensajes();
    this.modal.set('formulario');
  }

  abrirEditar(producto: Producto): void {
    this.seleccionado.set(producto);
    this.editando.set(true);
    this.limpiarMensajes();
    this.modal.set('formulario');
  }

  abrirDetalle(producto: Producto): void {
    this.seleccionado.set(producto);
    this.limpiarMensajes();
    this.modal.set('detalle');
  }

  cerrarModal(): void {
    this.modal.set(null);
    this.seleccionado.set(null);
    this.limpiarMensajes();
  }

  private limpiarMensajes(): void {
    this.error.set('');
    this.exito.set('');
  }

  guardar(event: Event): void {
    event.preventDefault();
    this.limpiarMensajes();

    const formulario = event.target as HTMLFormElement;
    const datos = new FormData(formulario);

    const producto = {
      nombre: datos.get('nombre') as string,
      categoria: datos.get('categoria') as string,
      descripcion: datos.get('descripcion') as string,
      precio: Number(datos.get('precio')),
      stock: Number(datos.get('stock')),
      imagen: datos.get('imagen') as string
    };

    // Validaciones antes de enviar al servidor
    if (!producto.nombre || !producto.categoria) {
      this.error.set('El nombre y la categoría son obligatorios');
      return;
    }
    if (producto.precio <= 0) {
      this.error.set('El precio debe ser mayor que cero');
      return;
    }
    if (producto.stock < 0) {
      this.error.set('La existencia no puede ser negativa');
      return;
    }

    // Al modificar se envía el registro anterior para darlo de baja
    const peticion = this.editando()
      ? this.productoService.modificarProducto(this.seleccionado()!.id, producto)
      : this.productoService.crearProducto(producto);

    peticion.subscribe({
      next: () => {
        this.cargarProductos();
        this.cerrarModal();
      },
      error: (error) => {
        this.error.set(error.error?.mensaje || 'No se pudo guardar el producto');
      }
    });
  }

  darDeBaja(): void {
    const producto = this.seleccionado();
    if (!producto) {
      return;
    }

    this.productoService.darDeBajaProducto(producto.id).subscribe({
      next: () => {
        this.cargarProductos();
        this.cerrarModal();
      },
      error: (error) => {
        this.error.set(error.error?.mensaje || 'No se pudo dar de baja el producto');
      }
    });
  }
}