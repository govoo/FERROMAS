import React, { useState } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import { useEffect } from 'react';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (formData.email === 'admin@ferromas.cl' && formData.password === 'admin123') {
        navigate('ferromas/home');
      } else {
        setError('Correo o contraseña incorrectos');
      }
    }, 1000);
  };

  return (
    <div className="login-wrapper d-flex justify-content-center align-items-center min-vh-100 w-100 m-0 p-0">
      <Card className="shadow p-4 animate__animated animate__fadeIn" style={{ maxWidth: '400px', width: '100%' }}>
        <h4 className="mb-3 text-center">Bienvenido a FERROMAS</h4>
        <p className="text-center text-muted">Inicia sesión con tu cuenta</p>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="ejemplo@correo.cl"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="********"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <div className="d-grid">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? <Spinner size="sm" animation="border" /> : 'Iniciar sesión'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
    