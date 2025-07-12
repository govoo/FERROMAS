import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Pagination } from 'react-bootstrap';
import '../styles/main-content.css';
import '../styles/bodega.css';

import {
  fetchBodegas,
  crearBodega,
  editarBodega,
  eliminarBodega
} from '../services/bodegaService';

function BodegaCrud() {
  const [bodegas, setBodegas] = useState([]);
  const [formData, setFormData] = useState({
    cantidad_productos: '',
    fecha_vencimiento: '',
    estado_producto: ''
  });
  const [bodegaVer, setBodegaVer] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showVerModal, setShowVerModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmEdit, setShowConfirmEdit] = useState(false);
  const [bodegaPendiente, setBodegaPendiente] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const bodegasPorPagina = 6;

  const [mensajeAlerta, setMensajeAlerta] = useState(null);
  const [tipoAlerta, setTipoAlerta] = useState('success');

  const mostrarAlerta = (tipo, mensaje) => {
    setTipoAlerta(tipo);
    setMensajeAlerta(mensaje);
    setTimeout(() => setMensajeAlerta(null), 4000);
  };

  useEffect(() => {
    cargarBodegas();
  }, []);

  const cargarBodegas = async () => {
    const data = await fetchBodegas();
    setBodegas(data);
  };

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setShowModal(false);
    setShowConfirmEdit(true);
  };

  const confirmarEdicion = async () => {

      const datos = {
    cantidad_productos: parseInt(formData.cantidad_productos),
    fecha_vencimiento: formData.fecha_vencimiento,
    estado_producto: parseInt(formData.estado_producto)
  };

  console.log("📤 Datos que se enviarán al backend:", datos);
  console.log("📊 Tipos:", {
    cantidad_productos: typeof datos.cantidad_productos,
    fecha_vencimiento: typeof datos.fecha_vencimiento,
    estado_producto: typeof datos.estado_producto
  });
    let res;
    if (editIndex !== null) {
      const id = bodegas[editIndex].id;
      res = await editarBodega(id, formData);
      if (res.ok) {
        mostrarAlerta('success', 'Bodega actualizada exitosamente');
      } else {
        mostrarAlerta('danger', res.mensaje || 'Error al actualizar bodega');
      }
    } else {
      res = await crearBodega(formData);
      if (res.ok) {
        mostrarAlerta('success', 'Bodega creada exitosamente');
      } else {
        mostrarAlerta('danger', res.mensaje || 'Error al crear bodega');
      }
    }

    cerrarModales();
    cargarBodegas();
  };

  const cerrarModales = () => {
    setShowModal(false);
    setShowConfirmEdit(false);
    setEditIndex(null);
    setFormData({
      cantidad_productos: '',
      fecha_vencimiento: '',
      estado_producto: ''
    });
  };

  const handleEdit = index => {
    const globalIndex = (currentPage - 1) * bodegasPorPagina + index;
    const bodega = bodegas[globalIndex];
    setFormData({
      cantidad_productos: bodega.cantidad_producto,
      fecha_vencimiento: bodega.fecha_vencimiento,
      estado_producto: bodega.estado_producto
    });
    setEditIndex(globalIndex);
    setShowModal(true);
  };

  const handleDelete = bodega => {
    setBodegaPendiente(bodega);
    setShowConfirmDelete(true);
  };

  const confirmarEliminacion = async () => {
    const res = await eliminarBodega(bodegaPendiente.id);
    if (res.ok) {
      mostrarAlerta('success', 'Bodega eliminada exitosamente');
    } else {
      mostrarAlerta('danger', res.mensaje || 'Error al eliminar bodega');
    }

    setShowConfirmDelete(false);
    setBodegaPendiente(null);
    cargarBodegas();
  };

  const handleVer = bodega => {
    setBodegaVer(bodega);
    setShowVerModal(true);
  };

  const indexUltimo = currentPage * bodegasPorPagina;
  const indexPrimero = indexUltimo - bodegasPorPagina;
  const bodegasPaginadas = bodegas.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(bodegas.length / bodegasPorPagina);

  return (
    <div className="main-content">
      {mensajeAlerta && (
        <div className={`alert alert-${tipoAlerta} alert-flotante`} role="alert">
          {mensajeAlerta}
        </div>
      )}

      <div className="bodega-box">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Gestión de Bodegas</h3>
          <Button variant="outline-primary" onClick={() => {
            setShowModal(true);
            setFormData({
              cantidad_productos: '',
              fecha_vencimiento: '',
              estado_producto: ''
            });
            setEditIndex(null);
          }}>
            + Ingresar Bodega
          </Button>
        </div>

        <div className="bodega-table-container">
          <Table className="bodega-table" striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cantidad</th>
                <th>Fecha Vencimiento</th>
                <th>Estado</th>
                <th>Producto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {bodegasPaginadas.map((b, index) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.cantidad_producto}</td>
                  <td>{b.fecha_vencimiento}</td>
                  <td>{b.estado_producto}</td>
                  <td>{b.nombre_producto}</td>
                  <td>
                    <Button variant="info" size="sm" className="me-2" onClick={() => handleVer(b)}>Ver</Button>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(index)}>Editar</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(b)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <div className="bodega-paginacion d-flex justify-content-center">
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
          <Modal.Title>{editIndex !== null ? 'Editar Bodega' : 'Crear Bodega'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Cantidad de Producto</Form.Label>
              <Form.Control
                name="cantidad_productos"
                type="number"
                value={formData.cantidad_productos}
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
              <Form.Label>ID Estado del Producto</Form.Label>
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
        <Modal.Body>¿Estás seguro de guardar los cambios en esta bodega?</Modal.Body>
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
          <Modal.Title>¿Eliminar Bodega?</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar esta bodega?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>Cancelar</Button>
          <Button variant="danger" onClick={confirmarEliminacion}>Eliminar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Ver */}
      <Modal show={showVerModal} onHide={() => setShowVerModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalle de Bodega</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bodegaVer && (
            <>
              <p><strong>ID:</strong> {bodegaVer.id}</p>
              <p><strong>Cantidad:</strong> {bodegaVer.cantidad_producto}</p>
              <p><strong>Fecha Vencimiento:</strong> {bodegaVer.fecha_vencimiento}</p>
              <p><strong>Estado:</strong> {bodegaVer.estado_producto}</p>
              <p><strong>Producto:</strong> {bodegaVer.nombre_producto}</p>
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

export default BodegaCrud;
