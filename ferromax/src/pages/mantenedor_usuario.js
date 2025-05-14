import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import '../styles/main-content.css';

function UsuarioCrud() {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    segundo_nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    contraseña: ''
  });
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/mantenedor_usuario')
      .then(res => res.json())
      .then(data => {
        if (data.usuarios) setUsuarios(data.usuarios);
      })
      .catch(err => console.error("Error al obtener usuarios:", err));
  }, []);

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();

    if (editIndex !== null) {
      const id = usuarios[editIndex].id;
      fetch(`http://localhost:5000/mantenedor_usuario/editar_usuario?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then(() => {
          const updated = [...usuarios];
          updated[editIndex] = { ...formData, id };
          setUsuarios(updated);
          setEditIndex(null);
          setShowModal(false);
        });
    } else {
      fetch('http://localhost:5000/mantenedor_usuario/crear_usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then((res) => {
          if (res.mensaje === "Usuario creado exitosamente") {
            // Opcional: volver a obtener lista actualizada
            fetch('http://localhost:5000/mantenedor_usuario')
              .then(res => res.json())
              .then(data => setUsuarios(data.usuarios));
          }
        });
    }

    setFormData({
      nombre: '',
      segundo_nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      contraseña: ''
    });
  };

  const handleEdit = index => {
    setFormData(usuarios[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDelete = id => {
    fetch(`http://localhost:5000/mantenedor_usuario/eliminar_usuario?id=${id}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() => {
        setUsuarios(prev => prev.filter(u => u.id !== id));
      });
  };

  return (
    <div className="main-content">
      <div className="main-box">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Gestión de Usuarios</h3>
          <Button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Crear Usuario
          </Button>
        </div>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Primer Nombre</th>
              <th>Segundo Nombre</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Contraseña</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u, index) => (
              <tr key={u.id || index}>
                <td>{u.id}</td>
                <td>{u.nombre}</td>
                <td>{u.segundo_nombre}</td>
                <td>{u.apellido}</td>
                <td>{u.correo}</td>
                <td>{u.telefono}</td>
                <td>{u.contraseña}</td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(index)}>
                    Editar
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(u.id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal de formulario */}
      <Modal show={showModal} onHide={() => { setShowModal(false); setEditIndex(null); }}>
        <Modal.Header closeButton>
          <Modal.Title>{editIndex !== null ? 'Editar Usuario' : 'Crear Usuario'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Primer Nombre</Form.Label>
                  <Form.Control
                    name="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Segundo Nombre</Form.Label>
                  <Form.Control
                    name="segundo_nombre"
                    type="text"
                    value={formData.segundo_nombre}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                name="apellido"
                type="text"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                name="correo"
                type="email"
                value={formData.correo}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                name="telefono"
                type="number"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                name="contraseña"
                type="password"
                value={formData.contraseña}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowModal(false); setEditIndex(null); }}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Guardar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default UsuarioCrud;
