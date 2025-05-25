import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/login';

import Home from './pages/home';
import Usuario from './pages/mantenedor_usuario';
import Producto from './pages/mantenedor_producto';
import Ventas from './pages/mantenedor_venta';
import Bodega from './pages/mantenedor_bodega';
import CatalogoCliente from './pages/cliente';
import './styles/main-content.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/ferromas" element={<Layout />}>
          <Route path="home" element={<Home />} />
          <Route path="usuario" element={<Usuario/>} />
          <Route path="producto" element={<Producto />} />
          <Route path="venta" element={<Ventas />} />
          <Route path="bodega" element={<Bodega />} />
          <Route path="catalogo" element={<CatalogoCliente />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
