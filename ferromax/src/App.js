import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/home.js';

function App() {
  return (
    //Definicion rutas React
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
      </Routes>
    </Router>
  )
}

export default App