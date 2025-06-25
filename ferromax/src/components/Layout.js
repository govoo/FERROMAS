// src/components/Layout.js
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import ferromasLogo from '../img/ferromas_logo.svg';
import '../styles/navbar.css'; // Asegúrate de crear este archivo

function Layout() {
  return (
    <>
      <Navbar expand="lg" className="ferromas-navbar" sticky="top">
        <Container fluid>
          <Navbar.Brand as={Link} to="./home" className="d-flex align-items-center text-white">
            <img
              src={ferromasLogo}
              alt="Ferromas Logo"
              width="40"
              height="40"
              className="me-2"
            />
            FERROMAS
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" className="bg-warning" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="./bodega">Bodega</Nav.Link>
              <Nav.Link as={Link} to="./producto">Productos</Nav.Link>
              <Nav.Link as={Link} to="./usuario">Usuarios</Nav.Link>
              <Nav.Link as={Link} to="./venta">Ventas</Nav.Link>
              <Nav.Link as={Link} to="/">Cerrar sesión</Nav.Link>
              <Nav.Link as={Link} to="/catalogo">Vista cliente</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Outlet />
      </Container>
    </>
  );
}

export default Layout;
