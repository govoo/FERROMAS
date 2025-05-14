import React, { useState } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import '../styles/main-content.css';
import { useEffect } from 'react';

function VentasCrud() {
  const [ventas, setVentas] = useState([
    {
      id: 1,
      usuario: 'Juan',
      cantidad_productos: 4,
      fecha_venta: '2024-05-10',
      total: 15000,
      estado: 'pendiente'
    }
  ]);

  const cambiarEstado = (id, nuevoEstado) => {
    const actualizadas = ventas.map(venta =>
      venta.id === id ? { ...venta, estado: nuevoEstado } : venta
    );
    setVentas(actualizadas);
  };

  const badgeColor = (estado) => {
    switch (estado) {
      case 'aprobada': return 'success';
      case 'rechazada': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="main-content">
      <div className="main-box">
        <h3 className="mb-3">Gestión de Ventas</h3>
        <Table bordered hover responsive>
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
            {ventas.map((venta) => (
              <tr key={venta.id}>
                <td>{venta.id}</td>
                <td>{venta.usuario}</td>
                <td>{venta.cantidad_productos}</td>
                <td>{venta.fecha_venta}</td>
                <td>${venta.total.toLocaleString()}</td>
                <td>
                  <Badge bg={badgeColor(venta.estado)}>{venta.estado}</Badge>
                </td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    className="me-2"
                    onClick={() => cambiarEstado(venta.id, 'aprobada')}
                    disabled={venta.estado !== 'pendiente'}
                  >
                    Aprobar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => cambiarEstado(venta.id, 'rechazada')}
                    disabled={venta.estado !== 'pendiente'}
                  >
                    Rechazar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default VentasCrud;
