import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import LoginForm from './pages/auth/LoginForm.jsx';
import RegisterForm from './pages/auth/RegisterForm.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import MonedaList from './pages/moneda/MonedaList.jsx';
import MonedaForm from './pages/moneda/MonedaForm.jsx';
import UsuariosList from './pages/usuarios/UsuariosList.jsx';
import BilleteraList from './pages/billetera/BilleteraList.jsx';
import BilleteraForm from './pages/billetera/BilleteraForm.jsx';
import BilleteraOperaciones from './pages/billetera/BilleteraOperaciones.jsx';
import DepositoPage from './pages/operaciones/DepositoPage.jsx';
import RetiroPage from './pages/operaciones/RetiroPage.jsx';
import TransferenciaPage from './pages/operaciones/TransferenciaPage.jsx';
import ListaVentasDisponibles from './pages/operaciones/ListaVentasDisponibles.jsx';
import VentaPage from './pages/operaciones/VentaPage.jsx';
import MisVentasPage from './pages/operaciones/MIsVentasPage.jsx';
import MovimientosList from './pages/movimeintos/MovimientosList.jsx';
import UsuariosBilleterasList from './pages/usuarios/UsuariosBilleterasList.jsx';
import UsuariosMovimientosList from './pages/usuarios/UsuariosMovimientosList.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import AdminFormPage from './pages/auth/AdminFormPage.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/billeteras" element={<ProtectedRoute component={BilleteraList} requiredRole={1} />} />
        <Route path="/billeteras/crear" element={<ProtectedRoute component={BilleteraForm} requiredRole={1} />} />
        <Route path="/billeteras/operaciones/:id" element={<ProtectedRoute component={BilleteraOperaciones} requiredRole={1} />} />
        <Route path="/monedas" element={<ProtectedRoute component={MonedaList} requiredRole={2} />} />
        <Route path="/monedas/crear" element={<ProtectedRoute component={MonedaForm} requiredRole={2} />} />
        <Route path="/monedas/editar/:id" element={<ProtectedRoute component={MonedaForm} requiredRole={2} />} />
        <Route path="/deposito/:id" element={<ProtectedRoute component={DepositoPage} requiredRole={1} />} />
        <Route path="/retiro/:id" element={<ProtectedRoute component={RetiroPage} requiredRole={1} />} />
        <Route path="/transferencia/:id" element={<ProtectedRoute component={TransferenciaPage} requiredRole={1} />} />
        <Route path="/misventas" element={<ProtectedRoute component={MisVentasPage} requiredRole={1} />} />
        <Route path="/venta/create/:id" element={<ProtectedRoute component={VentaPage} requiredRole={1} />} />
        <Route path="/ventas/disponibles" element={<ProtectedRoute component={ListaVentasDisponibles} requiredRole={1} />} />
        <Route path="/movimientos/:id" element={<ProtectedRoute component={MovimientosList} requiredRole={1} />} />
        <Route path="/usuarios/list" element={<ProtectedRoute component={UsuariosList} requiredRole={2} />} />
        <Route path="/usuarios/billeteras/:id" element={<ProtectedRoute component={UsuariosBilleterasList} requiredRole={2} />} />
        <Route path="/usuarios/movimientos/:id" element={<ProtectedRoute component={UsuariosMovimientosList} requiredRole={2} />} />
        <Route path="/admini/crear" element={<ProtectedRoute component={AdminFormPage} requiredRole={2} />} />
        <Route path="*" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
