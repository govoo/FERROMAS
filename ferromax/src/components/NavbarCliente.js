// src/components/NavbarCatalogo.js
import { Navbar, Container, Nav, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ferromasLogo from '../img/ferromas_logo.svg';

function NavbarCatalogo({ usuario, cantidadTotalItems, cerrarSesion }) {
  const navigate = useNavigate();

  const irAlCarrito = () => {
    navigate('/transbank');
  };

  const volverAlCatalogo = () => {
    navigate('/catalogo');
  };

  return (
    <Navbar expand="lg" className="ferromas-navbar" sticky="top">
      <Container fluid>
        <Navbar.Brand className="d-flex align-items-center text-white">
          <img
            src={ferromasLogo}
            alt="Ferromas Logo"
            width="40"
            height="40"
            className="me-2"
          />
          FERROMAS - Bienvenido {usuario?.p_nombre_usuario || 'Usuario'}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" className="bg-warning" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto d-flex align-items-center">
            <Button
              variant="outline-light"
              className="me-2"
              onClick={volverAlCatalogo}
            >
              Catalogo
            </Button>
            <Button
              variant="outline-light"
              className="me-3 position-relative"
              onClick={irAlCarrito}
            >
              🛒
              {cantidadTotalItems > 0 && (
                <Badge
                  bg="danger"
                  pill
                  className="position-absolute top-0 start-100 translate-middle"
                >
                  {cantidadTotalItems}
                </Badge>
              )}
            </Button>
            <Button variant="outline-light" onClick={cerrarSesion}>
              Cerrar sesión
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarCatalogo;
