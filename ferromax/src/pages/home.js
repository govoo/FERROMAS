import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useState,useEffect } from 'react';

function Home() {
  return (
    <Container className="d-flex vh-100 align-items-center justify-content-center text-center">
      <Row>
        <Col>
          <h1 className="mb-4">Bienvenido a FERROMAS</h1>
          <p className="mb-5">Sistema de gestión para bodegas, productos, usuarios y ventas.</p>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
