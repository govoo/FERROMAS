import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Pagination } from 'react-bootstrap';
import '../styles/main-content.css';
import '../styles/producto.css';

import {
  fetchProductos,
  crearProducto,
  editarProducto,
  eliminarProducto
} from '../services/productoService';

function ProductoCrud() {
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    nombre_producto: '',
    precio_producto: '',
    bodega_idBodega: ''
  });
  const [productoVer, setProductoVer] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showVerModal, setShowVerModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmEdit, setShowConfirmEdit] = useState(false);
  const [productoPendiente, setProductoPendiente] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productosPorPagina = 6;

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = () => {
    fetchProductos()
      .then(setProductos)
      .catch(err => console.error("Error al obtener productos:", err));
  };

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setShowModal(false);
    setShowConfirmEdit(true);
  };

  const confirmarEdicion = async () => {
    if (editIndex !== null) {
      const id = productos[editIndex].idProducto;
      await editarProducto(id, formData);
    } else {
      await crearProducto(formData);
    }
    cerrarModales();
    cargarProductos();
  };

  const cerrarModales = () => {
    setShowModal(false);
    setShowConfirmEdit(false);
    setEditIndex(null);
    setFormData({
      nombre_producto: '',
      precio_producto: '',
      bodega_idBodega: ''
    });
  };

  const handleEdit = index => {
    const globalIndex = (currentPage - 1) * productosPorPagina + index;
    const producto = productos[globalIndex];
    setFormData(producto);
    setEditIndex(globalIndex);
    setShowModal(true);
  };

  const handleDelete = id => {
    const producto = productos.find(p => p.idProducto === id);
    setProductoPendiente(producto);
    setShowConfirmDelete(true);
  };

  const confirmarEliminacion = async () => {
    await eliminarProducto(productoPendiente.idProducto);
    setShowConfirmDelete(false);
    setProductoPendiente(null);
    cargarProductos();
  };

  const handleVer = (producto) => {
    setProductoVer(producto);
    setShowVerModal(true);
  };

  const indexUltimo = currentPage * productosPorPagina;
  const indexPrimero = indexUltimo - productosPorPagina;
  const productosPaginados = productos.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(productos.length / productosPorPagina);

  return (
    <div className="main-content">
      <div className="producto-box">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Gestión de Productos</h3>
          <Button variant="outline-primary" onClick={() => {
            setShowModal(true);
            setFormData({
              nombre_producto: '',
              precio_producto: '',
              bodega_idBodega: ''
            });
            setEditIndex(null);
          }}>
            + Ingresar Producto
          </Button>
        </div>

        <div className="producto-table-container">
          <Table className="producto-table" striped bordered hover responsive>
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
              {productosPaginados.map((p, index) => (
                <tr key={p.idProducto}>
                  <td>{p.idProducto}</td>
                  <td>{p.nombre_producto}</td>
                  <td>{p.precio_producto}</td>
                  <td>{p.bodega_idBodega}</td>
                  <td>
                    <Button variant="info" size="sm" className="me-2" onClick={() => handleVer(p)}>
                      Ver
                    </Button>
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

        <div className="producto-paginacion">
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
                disabled
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Guardar
            </Button>
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
        <Modal.Body>
          ¿Estás seguro de guardar los cambios en este producto?
        </Modal.Body>
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
          <Modal.Title>¿Eliminar Producto?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar este producto?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmarEliminacion}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Ver */}
      <Modal show={showVerModal} onHide={() => setShowVerModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalle del Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productoVer && (
            <>
              <p><strong>ID:</strong> {productoVer.idProducto}</p>
              <p><strong>Nombre:</strong> {productoVer.nombre_producto}</p>
              <p><strong>Precio:</strong> ${productoVer.precio_producto}</p>
              <p><strong>ID Bodega:</strong> {productoVer.bodega_idBodega}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVerModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProductoCrud;
