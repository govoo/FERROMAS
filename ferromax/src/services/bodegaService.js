// src/services/bodegaService.js

export async function fetchBodegas() {
  const res = await fetch("http://localhost:5000/mantenedor_bodega");
  const data = await res.json();
  return data; // ya es un array, no hace falta .bodega
}


export async function crearBodega(bodega) {
  const res = await fetch('http://localhost:5000/mantenedor_bodega/crear_bodega', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bodega)
  });

  const data = await res.json();
  console.log("Respuesta backend:", data);
  return {
    ok: res.ok,
    mensaje: data?.mensaje || data?.error || "Error desconocido"
  };
}


export async function editarBodega(id, bodega) {
  return await fetch(`http://localhost:5000/mantenedor_bodega/editar_bodega?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bodega)
  });
}

export async function eliminarBodega(id) {
  return await fetch(`http://localhost:5000/mantenedor_bodega/eliminar_bodega?id=${id}`, {
    method: 'DELETE'
  });
}
