import React, { useState } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import '../styles/main-content.css'; 
import { useEffect } from 'react';

function ProductoCrud() {
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    nombre_producto: '',
    precio_producto: '',
    bodega_idBodega: '',
  });
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    if (editIndex !== null) {
      const updated = [...productos];
      updated[editIndex] = { ...formData, idProducto: productos[editIndex].idProducto };
      setProductos(updated);
      setEditIndex(null);
    } else {
      setProductos([
        ...productos,
        {
          ...formData,
          idProducto: productos.length > 0 ? productos[productos.length - 1].idProducto + 1 : 1,
        },
      ]);
    }
    setFormData({ nombre_producto: '', precio_producto: '', bodega_idBodega: '' });
    setShowModal(false);
  };

  const handleEdit = index => {
    setFormData(productos[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDelete = id => {
    const filtrado = productos.filter(p => p.idProducto !== id);
    setProductos(filtrado);
  };

  return (
    <div className="main-content">
      <div className="main-box">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Gestión de Productos</h3>
          <Button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Crear Producto
          </Button>
        </div>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>ID Bodega</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p, index) => (
              <tr key={p.idProducto}>
                <td>{p.idProducto}</td>
                <td>{p.nombre_producto}</td>
                <td>{p.precio_producto}</td>
                <td>{p.bodega_idBodega}</td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(index)}>
                    Editar
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(p.idProducto)}>
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
          <Modal.Title>{editIndex !== null ? 'Editar Producto' : 'Crear Producto'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Producto</Form.Label>
              <Form.Control
                name="nombre_producto"
                type="text"
                value={formData.nombre_producto}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                name="precio_producto"
                type="text"
                value={formData.precio_producto}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>ID de Bodega</Form.Label>
              <Form.Control
                name="bodega_idBodega"
                type="number"
                value={formData.bodega_idBodega}
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

export default ProductoCrud;
