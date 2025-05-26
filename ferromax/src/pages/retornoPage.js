import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function RetornoPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token_ws');

    if (token) {
      // Hacer un POST al backend para procesar la venta
      fetch(`http://localhost:5000/retorno?token_ws=${token}`, {
        method: 'POST',
      })
        .then((res) => res.text())
        .then((data) => {
          console.log('Respuesta backend:', data);

          // ✅ Redirigir al catálogo después de procesar
          navigate('/catalogo');
        })
        .catch((err) => {
          console.error('Error al procesar el pago:', err);
          navigate('/catalogo');
        });
    } else {
      // Si no hay token, redirigir directo al catálogo
      navigate('/catalogo');
    }
  }, [location, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <h2>Procesando pago, por favor espera...</h2>
    </div>
  );
}

export default RetornoPage;
