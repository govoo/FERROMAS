import React, { useState } from 'react';
import { Table, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import '../styles/main-content.css';
import {useEffect } from 'react';

function UsuarioCrud() {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    p_nombre_usuario: '',
    s_nombre_usuario: '',
    apellido_usuario: '',
    correo_usuario: '',
    telefono_usuario: '',
  });
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (editIndex !== null) {
      const updated = [...usuarios];
      updated[editIndex] = { ...formData, idUsuario: usuarios[editIndex].idUsuario };
      setUsuarios(updated);
      setEditIndex(null);
    } else {
      setUsuarios([
        ...usuarios,
        {
          ...formData,
          idUsuario: usuarios.length > 0 ? usuarios[usuarios.length - 1].idUsuario + 1 : 1,
        },
      ]);
    }
    setFormData({
      p_nombre_usuario: '',
      s_nombre_usuario: '',
      apellido_usuario: '',
      correo_usuario: '',
      telefono_usuario: '',
    });
    setShowModal(false);
  };

  const handleEdit = index => {
    setFormData(usuarios[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDelete = id => {
    const filtrado = usuarios.filter(u => u.idUsuario !== id);
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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u, index) => (
              <tr key={u.idUsuario}>
                <td>{u.idUsuario}</td>
                <td>{u.p_nombre_usuario}</td>
                <td>{u.s_nombre_usuario}</td>
                <td>{u.apellido_usuario}</td>
                <td>{u.correo_usuario}</td>
                <td>{u.telefono_usuario}</td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(index)}>
                    Editar
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(u.idUsuario)}>
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
                    name="p_nombre_usuario"
                    type="text"
                    value={formData.p_nombre_usuario}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Segundo Nombre</Form.Label>
                  <Form.Control
                    name="s_nombre_usuario"
                    type="text"
                    value={formData.s_nombre_usuario}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                name="apellido_usuario"
                type="text"
                value={formData.apellido_usuario}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                name="correo_usuario"
                type="email"
                value={formData.correo_usuario}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                name="telefono_usuario"
                type="number"
                value={formData.telefono_usuario}
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
