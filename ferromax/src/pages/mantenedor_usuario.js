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
    clave: ''
  });
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ Obtener usuarios al cargar el componente
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
      const updated = [...usuarios];
      updated[editIndex] = { ...formData, id: usuarios[editIndex].id };
      setUsuarios(updated);
      setEditIndex(null);
    } else {
      setUsuarios([
        ...usuarios,
        {
          ...formData,
          id: usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1,
        },
      ]);
    }
    setFormData({
      nombre: '',
      segundo_nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      clave: ''
    });
    setShowModal(false);
  };

  const handleEdit = index => {
    setFormData(usuarios[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDelete = id => {
    const filtrado = usuarios.filter(u => u.id !== id);
    setUsuarios(filtrado);
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
              <th>Clave</th>
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
                <td>{u.clave}</td>
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
              <Form.Label>Clave</Form.Label>
              <Form.Control
                name="clave"
                type="password"
                value={formData.clave}
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
