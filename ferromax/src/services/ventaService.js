// src/services/ventaService.js

export async function fetchVentas() {
  const res = await fetch('http://localhost:5000/mantenedor_venta');
  const data = await res.json();
  return data.ventas.map(v => ({
    id: v.id,
    usuario: v.usuario,
    cantidad_productos: v.cantidad_productos,
    fecha_venta: v.fecha_venta,
    total: v.total,
    estado: 'pendiente' // puedes ajustar si el backend lo devuelve realmente
  }));
}

export async function crearVenta(venta) {
  const res = await fetch('http://localhost:5000/mantenedor_venta/crear_venta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(venta)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || 'No se pudo crear la venta');
  }

  return await res.json();
}

export async function editarVenta(id, venta) {
  const res = await fetch(`http://localhost:5000/mantenedor_venta/editar_venta?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(venta)
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || 'No se pudo editar la venta');
  }

  return await res.json();
}

export async function eliminarVenta(id) {
  const res = await fetch(`http://localhost:5000/mantenedor_venta/eliminar_venta?id=${id}`, {
    method: 'DELETE'
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || 'No se pudo eliminar la venta');
  }

  return await res.json();
}

export async function fetchDetalleProductos(idVenta) {
  const res = await fetch(`http://localhost:5000/mantenedor_venta/detalle_productos?id=${idVenta}`);
  const data = await res.json();
  return data.productos;
}

export async function fetchUsuarios() {
  try {
    const res = await fetch('http://localhost:5000/mantenedor_venta/usuarios');
    if (!res.ok) {
      throw new Error('No se pudo obtener la lista de usuarios');
    }
    const data = await res.json();
    return data.usuarios || [];
  } catch (error) {
    console.error('Error en fetchUsuarios:', error);
    return [];
  }
}
