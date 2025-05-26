import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Container, Spinner, Button, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavbarCatalogo from '../components/NavbarCliente';
import '../styles/main-content.css';

function CatalogoCliente() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado del carrito inicial desde localStorage
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  // Guardar el carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  // Cargar productos desde backend
  const cargarProductos = async () => {
    try {
      const res = await fetch('http://localhost:5000/mantenedor_producto');
      const data = await res.json();
      console.log('Productos cargados:', data.producto); // Verifica que cada producto sea único
      setProductos(data.producto || []);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find((p) => p.id === producto.id);
    if (existe) {
      setCarrito(
        carrito.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const quitarDelCarrito = (producto) => {
    const existe = carrito.find((p) => p.id === producto.id);
    if (existe.cantidad === 1) {
      setCarrito(carrito.filter((p) => p.id !== producto.id));
    } else {
      setCarrito(
        carrito.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad - 1 } : p
        )
      );
    }
  };

  const eliminarProducto = (id) => {
    setCarrito(carrito.filter((p) => p.id !== id));
  };

  const totalCarrito = carrito.reduce(
    (total, item) => total + item.precio_producto * item.cantidad,
    0
  );

  const cantidadTotalItems = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  const pagar = () => {
    alert('¡Gracias por tu compra!');
    setCarrito([]);
    localStorage.removeItem('carrito');
  };

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('carrito');
    navigate('/');
  };

  return (
    <>
      <NavbarCatalogo
        usuario={usuario}
        cantidadTotalItems={cantidadTotalItems}
        cerrarSesion={cerrarSesion}
      />

      <Container className="mt-4">
        <h2 className="mb-4 text-center">Catálogo de Productos</h2>

        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {productos.map((producto) => (
              <Col key={producto.id}>
                <Card className="h-100 shadow-sm">
                  {producto.imagen_url ? (
                    <Card.Img
                      variant="top"
                      src={producto.imagen_url}
                      alt={producto.nombre_producto}
                      style={{ objectFit: 'cover', height: '200px' }}
                    />
                  ) : (
                    <div
                      style={{
                        height: '200px',
                        backgroundColor: '#eee'
                      }}
                      className="d-flex align-items-center justify-content-center"
                    >
                      Sin imagen
                    </div>
                  )}
                  <Card.Body>
                    <Card.Title>{producto.nombre_producto}</Card.Title>
                    <Card.Text>
                      <strong>Precio:</strong> ${producto.precio_producto}
                    </Card.Text>
                    <Button
                      variant="primary"
                      onClick={() => agregarAlCarrito(producto)}
                    >
                      Agregar al Carrito
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
}

export default CatalogoCliente;
