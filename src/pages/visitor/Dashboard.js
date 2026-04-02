import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/navbar';
import API from '../../api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function VisitorDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    API.get('/visits/my').then(r => setVisits(r.data)).catch(() => {});
  }, []);

  const counts = {
    total:    visits.length,
    pending:  visits.filter(v => v.status === 'pending').length,
    approved: visits.filter(v => v.status === 'approved').length,
    rejected: visits.filter(v => v.status === 'rejected').length,
  };

  const badgeColors = {
    pending: { bg: 'rgba(245, 158, 11, 0.2)', text: '#fcd34d' },
    approved: { bg: 'rgba(34, 197, 94, 0.2)', text: '#86efac' },
    rejected: { bg: 'rgba(239, 68, 68, 0.2)', text: '#fca5a5' },
    'checked-in': { bg: 'rgba(59, 130, 246, 0.2)', text: '#93c5fd' },
    'checked-out': { bg: 'rgba(148, 163, 184, 0.2)', text: '#cbd5e1' }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Visits Report - ${user?.name || 'Visitor'}`, 14, 20);
    
    const tableColumn = ["Host", "Purpose", "Department", "Date", "Status"];
    const tableRows = [];

    visits.forEach(v => {
      const row = [
        v.hostName,
        v.purpose,
        v.department,
        new Date(v.visitDate).toLocaleDateString(),
        v.status.toUpperCase()
      ];
      tableRows.push(row);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });
    
    doc.save(`visits_report_${new Date().getTime()}.pdf`);
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">
        <h2 className="dashboard-title">Welcome, {user?.name}! 👋</h2>
        
        <div className="grid-4">
          {[
            { label:'Total Visits',  value:counts.total,    color:'#60a5fa' },
            { label:'Pending',       value:counts.pending,  color:'#fbbf24' },
            { label:'Approved',      value:counts.approved, color:'#34d399' },
            { label:'Rejected',      value:counts.rejected, color:'#f87171' },
          ].map(c => (
            <div key={c.label} className="stat-card">
              <div className="stat-num" style={{ color:c.color }}>{c.value}</div>
              <div className="stat-lbl">{c.label}</div>
            </div>
          ))}
        </div>

        <div className="grid-3">
          <Link to="/visitor/submit" className="action-card" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #312e81 100%)' }}>
            <div className="action-icon">📝</div>
            <div className="action-title">Submit Request</div>
            <div className="action-sub">Request a new visit</div>
          </Link>
          <Link to="/visitor/history" className="action-card" style={{ background: 'linear-gradient(135deg, #0f766e 0%, #064e3b 100%)' }}>
            <div className="action-icon">📋</div>
            <div className="action-title">View History</div>
            <div className="action-sub">Track all your visits</div>
          </Link>
          <div onClick={exportPDF} className="action-card" style={{ background: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)', cursor: 'pointer' }}>
            <div className="action-icon">📄</div>
            <div className="action-title">Export PDF</div>
            <div className="action-sub">Download your record</div>
          </div>
        </div>

        <div className="table-card glass-panel">
          <h3 className="table-title">Recent Visits</h3>
          {visits.length === 0 ? (
            <p className="auth-subtitle" style={{textAlign: 'left'}}>No visits yet. <Link to="/visitor/submit" className="auth-link">Submit your first request!</Link></p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>{['Host','Purpose','Department','Date','Status'].map(h => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {visits.slice(0,5).map(v => (
                  <tr key={v._id}>
                    <td>{v.hostName}</td>
                    <td>{v.purpose}</td>
                    <td>{v.department}</td>
                    <td>{new Date(v.visitDate).toLocaleDateString()}</td>
                    <td>
                      <span className="status-badge" style={{ 
                        background: badgeColors[v.status]?.bg || badgeColors['pending'].bg,
                        color: badgeColors[v.status]?.text || badgeColors['pending'].text,
                        border: `1px solid ${badgeColors[v.status]?.text || '#fff'}40`
                      }}>
                        {v.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default VisitorDashboard;