import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login             from './pages/Login';
import Register          from './pages/Register';
import VisitorDashboard  from './pages/visitor/Dashboard';
import SubmitRequest     from './pages/visitor/Submitrequest';
import VisitHistory      from './pages/visitor/VisitHistory';
import SecurityDashboard from './pages/security/DashBoard';
import ManageVisits      from './pages/security/ManageVisits';
import AdminDashboard    from './pages/admin/dashBoard';
import ManageUsers       from './pages/admin/manageUser';
import AllVisits         from './pages/admin/AllVisits';

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;
  return children;
};

const RootRoute = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'security') return <Navigate to="/security/dashboard" replace />;
  return <Navigate to="/visitor/dashboard" replace />;
};

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/"        element={<RootRoute />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/visitor/dashboard" element={<ProtectedRoute role="visitor"><VisitorDashboard /></ProtectedRoute>} />
        <Route path="/visitor/submit"    element={<ProtectedRoute role="visitor"><SubmitRequest /></ProtectedRoute>} />
        <Route path="/visitor/history"   element={<ProtectedRoute role="visitor"><VisitHistory /></ProtectedRoute>} />
        <Route path="/security/dashboard" element={<ProtectedRoute role="security"><SecurityDashboard /></ProtectedRoute>} />
        <Route path="/security/visits"    element={<ProtectedRoute role="security"><ManageVisits /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users"     element={<ProtectedRoute role="admin"><ManageUsers /></ProtectedRoute>} />
        <Route path="/admin/visits"    element={<ProtectedRoute role="admin"><AllVisits /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;