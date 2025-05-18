const API_BASE = "http://localhost:5000";

export async function fetchUsuarios() {
  const res = await fetch(`${API_BASE}/mantenedor_usuario`);
  return await res.json();
}

export async function fetchRoles() {
  const res = await fetch(`${API_BASE}/api/roles`);
  const data = await res.json();
  return data.roles;
}

export async function crearUsuario(usuario) {
  const res = await fetch(`${API_BASE}/mantenedor_usuario/crear_usuario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario)
  });
  return await res.json();
}

export async function editarUsuario(id, usuario) {
  const res = await fetch(`${API_BASE}/mantenedor_usuario/editar_usuario?id=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario)
  });
  return await res.json();
}

export async function eliminarUsuario(id) {
  const res = await fetch(`${API_BASE}/mantenedor_usuario/eliminar_usuario?id=${id}`, {
    method: "DELETE"
  });
  return await res.json();
}
