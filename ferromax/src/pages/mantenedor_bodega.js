import React, { useState } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import {useEffect } from 'react';
import '../styles/main-content.css';

function BodegaCrud() {
  const [formData, setFormData] = useState({
    cantidad_producto: '',
    fecha_vencimiento: '',
    estado_producto: '',
  });

  const [bodegas, setBodegas] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updated = [...bodegas];
      updated[editIndex] = { ...formData, id: bodegas[editIndex].id };
      setBodegas(updated);
      setEditIndex(null);
    } else {
      setBodegas([
        ...bodegas,
        { ...formData, id: bodegas.length > 0 ? bodegas[bodegas.length - 1].id + 1 : 1 },
      ]);
    }
    setFormData({ cantidad_producto: '', fecha_vencimiento: '', estado_producto: '' });
    setShowModal(false);
  };

  const handleEdit = (index) => {
    setFormData(bodegas[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const filtered = bodegas.filter((b) => b.id !== id);
    setBodegas(filtered);
  };

  return (
    <div className="main-content">
      <div className="main-box">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Bodega</h3>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Agregar nueva bodega
          </Button>
        </div>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cantidad</th>
              <th>Fecha Vencimiento</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {bodegas.map((bodega, index) => (
              <tr key={bodega.id}>
                <td>{bodega.id}</td>
                <td>{bodega.cantidad_producto}</td>
                <td>{bodega.fecha_vencimiento}</td>
                <td>{bodega.estado_producto}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEdit(index)}
                    className="me-2"
                  >
                    Editar
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(bodega.id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => { setShowModal(false); setEditIndex(null); }}>
        <Modal.Header closeButton>
          <Modal.Title>{editIndex !== null ? 'Editar Bodega' : 'Agregar Bodega'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Cantidad de Producto</Form.Label>
              <Form.Control
                name="cantidad_producto"
                type="number"
                value={formData.cantidad_producto}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de Vencimiento</Form.Label>
              <Form.Control
                name="fecha_vencimiento"
                type="date"
                value={formData.fecha_vencimiento}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Estado del Producto</Form.Label>
              <Form.Control
                name="estado_producto"
                type="text"
                value={formData.estado_producto}
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

export default BodegaCrud;
