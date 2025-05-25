import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Container, Spinner } from 'react-bootstrap';
import '../styles/main-content.css';

function CatalogoCliente() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarProductos = async () => {
    try {
      const res = await fetch('http://localhost:5000/mantenedor_producto');
      const data = await res.json();
      setProductos(data.producto); // Asegúrate de que 'producto' es la clave correcta
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Catálogo de Productos</h2>

      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {productos.map((producto) => (
            <Col key={producto.idProducto}>
              <Card className="h-100 shadow-sm">
                {producto.imagen_url && (
                  <Card.Img
                    variant="top"
                    src={producto.imagen_url}
                    alt={producto.nombre_producto}
                    style={{ objectFit: 'cover', height: '200px' }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{producto.nombre_producto}</Card.Title>
                  <Card.Text>
                    <strong>Precio:</strong> ${producto.precio_producto}<br />
                    <strong>ID Bodega:</strong> {producto.bodega_idBodega}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default CatalogoCliente;
