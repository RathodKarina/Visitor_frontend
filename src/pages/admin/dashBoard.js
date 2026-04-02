import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/navbar';
import API from '../../api';

function AdminDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    API.get('/admin/stats').then(r => setStats(r.data)).catch(() => { });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h2 className="dashboard-title">⚙️ Admin Dashboard</h2>

        <div className="grid-4" style={{ marginBottom: '24px' }}>
          {[
            { label: 'Total Visitors', value: stats.totalVisitors, color: '#60a5fa', icon: '👤' },
            { label: 'Security Officers', value: stats.totalOfficers, color: '#a855f7', icon: '🛡️' },
            { label: 'Total Visits', value: stats.totalVisits, color: '#2dd4bf', icon: '📋' },
            { label: "Today's Visits", value: stats.todayVisits, color: '#fbbf24', icon: '📅' },
            { label: 'Pending', value: stats.pendingVisits, color: '#fbbf24', icon: '⏳' },
            { label: 'Approved', value: stats.approvedVisits, color: '#34d399', icon: '✅' },
            { label: 'Rejected', value: stats.rejectedVisits, color: '#f87171', icon: '❌' },
          ].map(c => (
            <div key={c.label} className="stat-card">
              <div style={{ fontSize: '24px', marginBottom: '6px' }}>{c.icon}</div>
              <div className="stat-num" style={{ color: c.color }}>{c.value ?? '—'}</div>
              <div className="stat-lbl">{c.label}</div>
            </div>
          ))}
        </div>

        <div className="grid-2">
          <Link to="/admin/users" className="action-card" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #312e81 100%)' }}>
            <div className="action-icon">👤</div>
            <div className="action-title">Manage Users</div>
            <div className="action-sub">View and create officers</div>
          </Link>
          <Link to="/admin/visits" className="action-card" style={{ background: 'linear-gradient(135deg, #0f766e 0%, #064e3b 100%)' }}>
            <div className="action-icon">📋</div>
            <div className="action-title">All Visit Records</div>
            <div className="action-sub">Monitor and approve visits</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;