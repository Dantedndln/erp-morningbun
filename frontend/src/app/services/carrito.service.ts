import { Injectable, signal, computed } from '@angular/core';
import { Producto } from '../models/producto.model';
import { ProductoCarrito } from '../models/paypal.model';

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

@Injectable({
  providedIn: 'root' // una sola instancia compartida en toda la aplicación
})
export class CarritoService {
  items = signal<ItemCarrito[]>([]);

  // computed recalcula el valor automáticamente cuando cambian los items
  total = computed(() =>
    this.items().reduce(
      (suma, item) => suma + Number(item.producto.precio) * item.cantidad,
      0
    )
  );

  cantidadArticulos = computed(() =>
    this.items().reduce((suma, item) => suma + item.cantidad, 0)
  );

  agregar(producto: Producto): void {
    const existente = this.items().find(i => i.producto.id === producto.id);

    if (existente) {
      this.aumentar(producto.id);
      return;
    }

    this.items.update(items => [...items, { producto, cantidad: 1 }]);
  }

  aumentar(productoId: number): void {
    this.items.update(items =>
      items.map(item => {
        // no se permite superar la existencia disponible
        if (item.producto.id === productoId && item.cantidad < item.producto.stock) {
          return { ...item, cantidad: item.cantidad + 1 };
        }
        return item;
      })
    );
  }

  disminuir(productoId: number): void {
    this.items.update(items =>
      items
        .map(item =>
          item.producto.id === productoId
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        // si la cantidad llega a cero, el producto sale del carrito
        .filter(item => item.cantidad > 0)
    );
  }

  eliminar(productoId: number): void {
    this.items.update(items => items.filter(i => i.producto.id !== productoId));
  }

  vaciar(): void {
    this.items.set([]);
  }

  // Formato que espera el backend
  paraBackend(): ProductoCarrito[] {
    return this.items().map(i => ({
      id: i.producto.id,
      cantidad: i.cantidad
    }));
  }
}