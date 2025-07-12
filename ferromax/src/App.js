import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/login';
import Home from './pages/home';
import Usuario from './pages/mantenedor_usuario';
import Producto from './pages/mantenedor_producto';
import Ventas from './pages/mantenedor_venta';
import Bodega from './pages/mantenedor_bodega';
import CatalogoCliente from './pages/cliente';
import Transbank from './pages/transbank';
import RetornoPage from './pages/retornoPage';
import PrivateRoute from './components/PrivateRoute';
import './styles/main-content.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública de login */}
        <Route path="/" element={<Login />} />

        {/* Rutas privadas independientes */}
        <Route path="/catalogo" element={
          <PrivateRoute>
            <CatalogoCliente />
          </PrivateRoute>
        } />
        <Route path="/transbank" element={
          <PrivateRoute>
            <Transbank />
          </PrivateRoute>
        } />

        {/* Rutas privadas agrupadas bajo /ferromas */}
        <Route path="/ferromas" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route path="home" element={<Home />} />
          <Route path="usuario" element={<Usuario />} />
          <Route path="producto" element={<Producto />} />
          <Route path="venta" element={<Ventas />} />
          <Route path="bodega" element={<Bodega />} />
          <Route path="pago" element={<Transbank />} />
        </Route>

        {/* Ruta pública de retorno Webpay */}
        <Route path="/retorno" element={<RetornoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
