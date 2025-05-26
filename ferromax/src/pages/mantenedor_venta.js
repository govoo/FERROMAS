import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Badge, Pagination } from 'react-bootstrap';
import '../styles/main-content.css';
import '../styles/venta.css';

import {
  fetchVentas,
  eliminarVenta,
} from '../services/ventaService';

function VentasCrud() {
  const [ventas, setVentas] = useState([]);
  const [ventaVer, setVentaVer] = useState(null);
  const [ventaPendiente, setVentaPendiente] = useState(null);
  const [showVerModal, setShowVerModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ventasPorPagina = 6;

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    const data = await fetchVentas();
    setVentas(data);
  };

  const cambiarEstado = (id, nuevoEstado) => {
    const actualizadas = ventas.map(venta =>
      venta.id === id ? { ...venta, estado: nuevoEstado } : venta
    );
    setVentas(actualizadas);
  };

  const handleVer = venta => {
    setVentaVer(venta);
    setShowVerModal(true);
  };

  const handleDelete = venta => {
    setVentaPendiente(venta);
    setShowConfirmDelete(true);
  };

  const confirmarEliminacion = async () => {
    await eliminarVenta(ventaPendiente.id);
    setShowConfirmDelete(false);
    setVentaPendiente(null);
    cargarVentas();
  };

  const badgeColor = (estado) => {
    switch (estado) {
      case 'aprobada': return 'success';
      case 'rechazada': return 'danger';
      default: return 'secondary';
    }
  };

  const indexUltimo = currentPage * ventasPorPagina;
  const indexPrimero = indexUltimo - ventasPorPagina;
  const ventasPaginadas = ventas.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(ventas.length / ventasPorPagina);

  return (
    <div className="main-content">
      <div className="venta-box">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Gestión de Ventas</h3>
        </div>

        <div className="venta-table-container">
          <Table className="venta-table" striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Cantidad</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventasPaginadas.map((venta) => (
                <tr key={venta.id}>
                  <td>{venta.id}</td>
                  <td>{venta.usuario}</td>
                  <td>{venta.cantidad_productos}</td>
                  <td>{venta.fecha_venta}</td>
                  <td>${venta.total.toLocaleString()}</td>
                  <td><Badge bg={badgeColor(venta.estado)}>{venta.estado}</Badge></td>
                  <td>
                    <Button variant="info" size="sm" className="me-2" onClick={() => handleVer(venta)}>Ver</Button>
                    {/* Botón eliminado */}
                    {/* <Button variant="secondary" size="sm" className="me-2" onClick={() => handleVerDetalle(venta)}>Detalle</Button> */}
                    <Button variant="success" size="sm" className="me-2"
                      onClick={() => cambiarEstado(venta.id, 'aprobada')}
                      disabled={venta.estado !== 'pendiente'}>
                      Aprobar
                    </Button>
                    <Button variant="danger" size="sm" className="me-2"
                      onClick={() => cambiarEstado(venta.id, 'rechazada')}
                      disabled={venta.estado !== 'pendiente'}>
                      Rechazar
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(venta)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <div className="venta-paginacion d-flex justify-content-center">
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

      {/* Modal Ver Venta */}
      <Modal show={showVerModal} onHide={() => setShowVerModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalle de Venta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ventaVer && (
            <>
              <p><strong>ID:</strong> {ventaVer.id}</p>
              <p><strong>Usuario:</strong> {ventaVer.usuario}</p>
              <p><strong>Cantidad:</strong> {ventaVer.cantidad_productos}</p>
              <p><strong>Fecha:</strong> {ventaVer.fecha_venta}</p>
              <p><strong>Total:</strong> ${ventaVer.total.toLocaleString()}</p>
              <p><strong>Estado:</strong> {ventaVer.estado}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVerModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Confirmar Eliminación */}
      <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>¿Eliminar Venta?</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar esta venta?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>Cancelar</Button>
          <Button variant="danger" onClick={confirmarEliminacion}>Eliminar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default VentasCrud;
