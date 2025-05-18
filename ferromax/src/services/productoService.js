// src/services/productoService.js

export async function fetchProductos() {
  const res = await fetch('/mantenedor_producto');
  const data = await res.json();
  return data.producto.map(p => ({
    idProducto: p.id,
    nombre_producto: p.nombre_producto,
    precio_producto: p.precio_producto,
    bodega_idBodega: p.bodega,
  }));
}

export async function crearProducto(producto) {
  return await fetch('/mantenedor_producto/crear_producto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto),
  });
}

export async function editarProducto(id, producto) {
  return await fetch(`/mantenedor_producto/editar_producto?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(producto),
  });
}

export async function eliminarProducto(id) {
  return await fetch(`/mantenedor_producto/eliminar_producto?id=${id}`, {
    method: 'DELETE',
  });
}
