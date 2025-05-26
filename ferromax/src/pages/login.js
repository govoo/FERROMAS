import React, { useState } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js'; // ¡Asegúrate de tenerlo instalado!
import '../styles/login.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const claveSecreta = 'clave-temporal-frontend'; // ⚠️ ¡NO USAR EN PRODUCCIÓN!

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Encriptar la contraseña antes de enviarla
    const passwordCifrada = CryptoJS.AES.encrypt(formData.password, claveSecreta).toString();

    // 👉 Mostrar el texto cifrado en la consola para verificar
    console.log('Contraseña cifrada:', passwordCifrada);

    try {
      const res = await fetch('http://localhost:5000/mantenedor_usuario/login_usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: passwordCifrada, // Ahora enviamos la contraseña cifrada
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        navigate('/ferromas/home');
      } else {
        setError(data.message || 'Credenciales inválidas');
      }
    } catch (err) {
      console.error(err);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
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
