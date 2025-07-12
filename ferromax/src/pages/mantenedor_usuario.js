import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Pagination } from 'react-bootstrap';
import '../styles/main-content.css';
import '../styles/usuario.css';
import {
  fetchUsuarios,
  crearUsuario,
  editarUsuario,
  eliminarUsuario,
  fetchRoles
} from '../services/usuarioService';

function UsuarioCrud() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    segundo_nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    contrasena: '',
    rol_id: ''
  });
  const [usuarioVer, setUsuarioVer] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showVerModal, setShowVerModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmEdit, setShowConfirmEdit] = useState(false);
  const [usuarioPendiente, setUsuarioPendiente] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usuariosPorPagina = 6;

  const [mensajeAlerta, setMensajeAlerta] = useState(null);
  const [tipoAlerta, setTipoAlerta] = useState('success');

  const mostrarAlerta = (tipo, mensaje) => {
    setTipoAlerta(tipo);
    setMensajeAlerta(mensaje);
    setTimeout(() => setMensajeAlerta(null), 4000);
  };

  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
  }, []);

  const cargarUsuarios = async () => {
    const data = await fetchUsuarios();
    const usuariosOrdenados = (data.usuarios || []).sort((a, b) => a.id - b.id);
    setUsuarios(usuariosOrdenados);
  };

  const cargarRoles = async () => {
    const data = await fetchRoles();
    setRoles(data || []);
  };

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setShowModal(false);
    setShowConfirmEdit(true);
  };

  const confirmarEdicion = async () => {
    let res;
    if (editIndex !== null) {
      const id = usuarios[editIndex].id;
      res = await editarUsuario(id, formData);
      if (res.ok) {
        mostrarAlerta('success', 'Usuario actualizado exitosamente');
      } else {
        mostrarAlerta('danger', res.mensaje || 'Error al actualizar usuario');
      }
    } else {
      res = await crearUsuario(formData);
      if (res.ok) {
        mostrarAlerta('success', 'Usuario creado exitosamente');
      } else {
        mostrarAlerta('danger', res.mensaje || 'Error al crear usuario');
      }
    }

    cerrarModales();
    cargarUsuarios();
  };

  const cerrarModales = () => {
    setShowModal(false);
    setShowConfirmEdit(false);
    setEditIndex(null);
    setFormData({
      nombre: '',
      segundo_nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      contrasena: '',
      rol_id: ''
    });
  };

  const handleEdit = index => {
    const globalIndex = (currentPage - 1) * usuariosPorPagina + index;
    const usuario = usuarios[globalIndex];
    setFormData({
      nombre: usuario.nombre,
      segundo_nombre: usuario.segundo_nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      telefono: usuario.telefono,
      contrasena: usuario.contrasena,
      rol_id: usuario.rol_id
    });
    setEditIndex(globalIndex);
    setShowModal(true);
  };

  const handleDelete = usuario => {
    setUsuarioPendiente(usuario);
    setShowConfirmDelete(true);
  };

  const confirmarEliminacion = async () => {
    const res = await eliminarUsuario(usuarioPendiente.id);
    if (res.ok) {
      mostrarAlerta('success', 'Usuario eliminado exitosamente');
    } else {
      mostrarAlerta('danger', res.mensaje || 'Error al eliminar usuario');
    }

    setShowConfirmDelete(false);
    setUsuarioPendiente(null);
    cargarUsuarios();
  };

  const handleVer = usuario => {
    setUsuarioVer(usuario);
    setShowVerModal(true);
  };

  const indexUltimo = currentPage * usuariosPorPagina;
  const indexPrimero = indexUltimo - usuariosPorPagina;
  const usuariosPaginados = usuarios.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(usuarios.length / usuariosPorPagina);

  return (
    <div className="main-content">
      {mensajeAlerta && (
        <div className={`alert alert-${tipoAlerta} alert-flotante`} role="alert">
          {mensajeAlerta}
        </div>
      )}

      <div className="usuario-box">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Gestión de Usuarios</h3>
          <Button variant="outline-primary" onClick={() => {
            setShowModal(true);
            setFormData({
              nombre: '',
              segundo_nombre: '',
              apellido: '',
              correo: '',
              telefono: '',
              contrasena: '',
              rol_id: ''
            });
            setEditIndex(null);
          }}>
            + Ingresar Usuario
          </Button>
        </div>

        <div className="usuario-table-container">
          <Table className="usuario-table" striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Primer Nombre</th>
                <th>Segundo Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosPaginados.map((u, index) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.nombre}</td>
                  <td>{u.segundo_nombre}</td>
                  <td>{u.apellido}</td>
                  <td>{u.correo}</td>
                  <td>{u.telefono}</td>
                  <td>{u.rol_nombre}</td>
                  <td>
                    <Button variant="info" size="sm" className="me-2" onClick={() => handleVer(u)}>Ver</Button>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(index)}>Editar</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(u)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <div className="usuario-paginacion d-flex justify-content-center">
          <Pagination>
            {Array.from({ length: totalPaginas }, (_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      </div>

      {/* Modal Crear/Editar */}
      <Modal show={showModal && !showConfirmEdit} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editIndex !== null ? 'Editar Usuario' : 'Crear Usuario'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control name="nombre" type="text" value={formData.nombre} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Segundo Nombre</Form.Label>
              <Form.Control name="segundo_nombre" type="text" value={formData.segundo_nombre} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control name="apellido" type="text" value={formData.apellido} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control name="correo" type="email" value={formData.correo} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control name="telefono" type="text" value={formData.telefono} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control name="contrasena" type="password" value={formData.contrasena} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select name="rol_id" value={formData.rol_id} onChange={handleChange} required>
                <option value="">Selecciona un rol</option>
                {roles.map(r => (
                  <option key={r.idRol_usuario} value={r.idRol_usuario}>{r.nombre_rol}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button type="submit" variant="primary">Guardar</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Confirmar Edición */}
      <Modal show={showConfirmEdit} onHide={() => {
        setShowConfirmEdit(false);
        setShowModal(true);
      }} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>¿Confirmar Cambios?</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de guardar los cambios en este usuario?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowConfirmEdit(false);
            setShowModal(true);
          }}>Cancelar</Button>
          <Button variant="success" onClick={confirmarEdicion}>Confirmar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Confirmar Eliminación */}
      <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>¿Eliminar Usuario?</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar este usuario?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>Cancelar</Button>
          <Button variant="danger" onClick={confirmarEliminacion}>Eliminar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Ver Usuario */}
      <Modal show={showVerModal} onHide={() => setShowVerModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalle del Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {usuarioVer && (
            <>
              <p><strong>ID:</strong> {usuarioVer.id}</p>
              <p><strong>Nombre:</strong> {usuarioVer.nombre}</p>
              <p><strong>Segundo Nombre:</strong> {usuarioVer.segundo_nombre}</p>
              <p><strong>Apellido:</strong> {usuarioVer.apellido}</p>
              <p><strong>Correo:</strong> {usuarioVer.correo}</p>
              <p><strong>Teléfono:</strong> {usuarioVer.telefono}</p>
              <p><strong>Rol:</strong> {usuarioVer.rol_nombre}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVerModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UsuarioCrud;
