import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/home.js';
import MantenedorUsuario from './pages/mantenedor_usuario.js';
import MantenedorProducto from './pages/mantenedor_producto.js';
import MantenedorVenta from './pages/mantenedor_venta.js';
import MantenedorBodega from './pages/mantenedor_bodega.js';

function App() {
  return (
    //Definicion rutas React
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/mantenedor_usuario" element={<MantenedorUsuario />}/>
        <Route path="/mantenedor_producto" element={<MantenedorProducto />}/>
        <Route path="/mantenedor_venta" element={<MantenedorVenta />}/>
        <Route path="/mantenedor_bodega" element={<MantenedorBodega />}/>
      </Routes>
    </Router>
  )
}

export default App