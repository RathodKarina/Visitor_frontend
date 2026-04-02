import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar';
import API from '../../api';

const statusColor = { pending:'#f59e0b', approved:'#22c55e', rejected:'#ef4444', 'checked-in':'#3b82f6', 'checked-out':'#94a3b8' };

function AllVisits() {
  const [visits, setVisits] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchVisits = () => {
    API.get('/admin/visits').then(r => setVisits(r.data)).catch(() => {});
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const action = async (type, id) => {
    try { 
      await API.put(`/security/${type}/${id}`); 
      fetchVisits(); 
    } catch(e) {}
  };

  const filtered = visits
    .filter(v => filter==='all' || v.status===filter)
    .filter(v => {
      const q = search.toLowerCase();
      return !q || v.visitor?.name?.toLowerCase().includes(q) || v.hostName?.toLowerCase().includes(q) || v.purpose?.toLowerCase().includes(q);
    });

  return (
    <div>
      <Navbar />
      <div className="page-container">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap:'wrap', gap:'12px' }}>
          <h2 className="dashboard-title" style={{ marginBottom: 0 }}>📋 All Visitor Requests</h2>
          <input className="form-input" style={{ width:'300px', margin: 0 }} placeholder="Search visitor or host..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'16px' }}>
          {['all','pending','approved','rejected','checked-in','checked-out'].map(st => (
            <button key={st} onClick={() => setFilter(st)}
              style={{
                padding:'8px 16px', borderRadius:'99px', cursor:'pointer', fontSize:'13px', fontWeight:'500', transition:'all 0.2s',
                border: filter === st ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                background: filter === st ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                color: filter === st ? '#fff' : '#94a3b8'
              }}>
              {st.charAt(0).toUpperCase() + st.slice(1)} ({st==='all' ? visits.length : visits.filter(v=>v.status===st).length})
            </button>
          ))}
        </div>

        <div className="table-card glass-panel">
          <table className="data-table">
            <thead>
              <tr>{['Visitor','Host','Dept','Purpose','Date','Status','Check In','Check Out','Approved By', 'Actions'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.length === 0 ?
                <tr><td colSpan="10" style={{ textAlign:'center', color:'#94a3b8', padding:'40px' }}>No records found.</td></tr> :
                filtered.map(v => (
                  <tr key={v._id}>
                    <td>
                      <div style={{ color:'#f1f5f9', fontWeight:'500' }}>{v.visitor?.name}</div>
                      <div style={{ color:'#64748b', fontSize:'11px' }}>{v.visitor?.email}</div>
                    </td>
                    <td>{v.hostName}</td>
                    <td>{v.department}</td>
                    <td style={{ maxWidth:'140px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{v.purpose}</td>
                    <td>{new Date(v.visitDate).toLocaleDateString()}</td>
                    <td>
                      <span className="status-badge" style={{ 
                          background: `${statusColor[v.status]}33`,
                          color: statusColor[v.status],
                          border: `1px solid ${statusColor[v.status]}80`
                      }}>
                        {v.status.toUpperCase()}
                      </span>
                    </td>
                    <td>{v.checkInTime  ? new Date(v.checkInTime).toLocaleTimeString()  : '—'}</td>
                    <td>{v.checkOutTime ? new Date(v.checkOutTime).toLocaleTimeString() : '—'}</td>
                    <td>{v.approvedBy?.name || '—'}</td>
                    <td>
                      <div style={{ display:'flex', gap:'8px', flexWrap:'nowrap' }}>
                        {v.status==='pending' && (
                          <>
                            <button className="btn-primary" style={{ padding:'6px 12px', fontSize:'12px', background:'#16a34a', width:'auto' }} onClick={()=>action('approve',v._id)}>✅ Approve</button>
                            <button className="btn-logout" style={{ padding:'6px 12px', fontSize:'12px', width:'auto' }} onClick={()=>action('reject',v._id)}>❌ Reject</button>
                          </>
                        )}
                        {v.status==='approved'   && <button className="btn-primary" style={{ padding:'6px 12px', fontSize:'12px', background:'#2563eb', width:'auto' }} onClick={()=>action('checkin',v._id)}>🟢 Check-in</button>}
                        {v.status==='checked-in' && <button className="btn-logout" style={{ padding:'6px 12px', fontSize:'12px', background:'#1e293b', width:'auto' }} onClick={()=>action('checkout',v._id)}>🔴 Check-out</button>}
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AllVisits;