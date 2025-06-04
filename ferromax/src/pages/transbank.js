import React, { useState} from 'react';
import { Container, ListGroup, Button, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavbarCatalogo from '../components/NavbarCliente';
import '../styles/main-content.css';

function Transbank() {
  const navigate = useNavigate();

  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const totalCarrito = carrito.reduce(
    (total, item) => total + item.precio_producto * item.cantidad,
    0
  );

  const cantidadTotalItems = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  const eliminarProducto = (idProducto) => {
    const nuevoCarrito = carrito.filter((p) => p.idProducto !== idProducto);
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
  };

  const seguirComprando = () => {
    navigate('/catalogo');
  };

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    navigate('/');
  };

  const pagar = async () => {
    try {
      const response = await fetch('http://localhost:5000/pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monto: totalCarrito,
          usuario: usuario ? usuario.nombre_usuario : 'anon',
          timestamp: Date.now()
        }),
      });

      const data = await response.json();
      console.log('Respuesta Transbank:', data);

      if (data.url && data.token) {
        // Vaciar carrito y localStorage
        setCarrito([]);
        localStorage.removeItem('carrito');
        // Redirigir a la URL de pago
        window.location.href = `${data.url}?token_ws=${data.token}`;
      } else {
        alert('Error al iniciar pago. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error al procesar pago:', error);
      alert('Error al conectar con el servidor de pago.');
    }
  };

  return (
    <>
      <NavbarCatalogo
        usuario={usuario}
        cantidadTotalItems={cantidadTotalItems}
        cerrarSesion={cerrarSesion}
      />

      <Container className="mt-4">
        <Row>
          <Col md={8}>
            <h2 className="mb-4">Carrito de Compras</h2>

            {carrito.length === 0 ? (
              <p>No hay productos en el carrito.</p>
            ) : (
              <ListGroup>
                {carrito.map((item) => (
                  <ListGroup.Item
                    key={item.idProducto}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      {item.nombre_producto} - ${item.precio_producto} x {item.cantidad}
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => eliminarProducto(item.idProducto)}
                    >
                      Eliminar
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Col>

          <Col md={4}>
            <Card className="shadow-sm sticky-top">
              <Card.Body>
                <h4 className="mb-3">Resumen del Pedido</h4>
                <p className="mb-1">Productos: {cantidadTotalItems}</p>
                <h5 className="mb-3">Total a pagar: ${totalCarrito}</h5>
                <div className="d-grid gap-2">
                  <Button variant="secondary" onClick={seguirComprando}>
                    Seguir comprando
                  </Button>
                  <Button variant="success" onClick={pagar} disabled={carrito.length === 0}>
                    Pagar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Transbank;
