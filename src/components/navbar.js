import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="glass-nav">
      <div className="nav-content">
        <Link to="#" className="nav-brand">📩 VisitorMS</Link>

        <div className="nav-links">
          {/* Visitor Links */}
          {user?.role === 'visitor' && (
            <>
              <Link to="/visitor/dashboard" className="nav-link">🏠 Dashboard</Link>
              <Link to="/visitor/submit" className="nav-link">📝 Submit Request</Link>
              <Link to="/visitor/history" className="nav-link">📋 My Visits</Link>
            </>
          )}

          {/* Security Links */}
          {user?.role === 'security' && (
            <>
              <Link to="/security/dashboard" className="nav-link">🏠 Dashboard</Link>
              <Link to="/security/visits" className="nav-link">👥 Manage Visits</Link>
            </>
          )}

          {/* Admin Links */}
          {user?.role === 'admin' && (
            <>
              <Link to="/admin/dashboard" className="nav-link">🏠 Dashboard</Link>
              <Link to="/admin/users" className="nav-link">👤 Users</Link>
              <Link to="/admin/visits" className="nav-link">📋 All Visits</Link>
            </>
          )}
        </div>

        <div className="nav-right">
          {user && (
            <>
              <span className="nav-user">👤 {user.name}</span>
              <span className="nav-role">{user.role}</span>
              <button onClick={logout} className="btn-logout">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;