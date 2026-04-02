import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar';
import API from '../../api';

function SecurityDashboard() {
  const [visits, setVisits] = useState([]);

  const fetchVisits = () => {
    API.get('/security/visits').then(r => setVisits(r.data)).catch(() => {});
  };

  useEffect(() => { fetchVisits(); }, []);

  const action = async (type, id) => {
    try { await API.put(`/security/${type}/${id}`); fetchVisits(); } catch(e) {}
  };

  const counts = {
    total:     visits.length,
    pending:   visits.filter(v => v.status==='pending').length,
    approved:  visits.filter(v => v.status==='approved').length,
    checkedIn: visits.filter(v => v.status==='checked-in').length,
  };

  return (
    <div style={{ background:'#0f172a', minHeight:'100vh' }}>
      <Navbar />
      <div style={s.container}>
        <h2 style={s.heading}>🛡️ Security Dashboard</h2>
        <div style={s.grid4}>
          {[
            { label:'Total',      value:counts.total,     color:'#3b82f6' },
            { label:'Pending',    value:counts.pending,   color:'#f59e0b' },
            { label:'Approved',   value:counts.approved,  color:'#22c55e' },
            { label:'Checked In', value:counts.checkedIn, color:'#a855f7' },
          ].map(c => (
            <div key={c.label} style={s.statCard}>
              <div style={{ fontSize:'32px', fontWeight:'700', color:c.color }}>{c.value}</div>
              <div style={{ color:'#94a3b8', fontSize:'13px', marginTop:'4px' }}>{c.label}</div>
            </div>
          ))}
        </div>
        {['pending','approved','checked-in'].map(status => (
          <div key={status} style={{ ...s.card, marginBottom:'16px' }}>
            <h3 style={s.cardTitle}>
              {status==='pending' ? '⏳ Pending Approvals' : status==='approved' ? '✅ Ready for Check-In' : '🟢 Currently Inside'}
              ({visits.filter(v => v.status===status).length})
            </h3>
            {visits.filter(v => v.status===status).length === 0 ?
              <p style={{ color:'#94a3b8', fontSize:'14px' }}>No records.</p> :
              visits.filter(v => v.status===status).map(v => (
                <div key={v._id} style={s.row}>
                  <div style={s.rowLeft}>
                    <div style={s.vName}>👤 {v.visitor?.name}</div>
                    <div style={s.vMeta}>📧 {v.visitor?.email} | 🏢 {v.hostName} — {v.department}</div>
                    <div style={s.vMeta}>📌 {v.purpose} | 📅 {new Date(v.visitDate).toLocaleString()}</div>
                  </div>
                  <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                    {v.status==='pending' && <>
                      <button style={s.btnG} onClick={() => action('approve', v._id)}>✅ Approve</button>
                      <button style={s.btnR} onClick={() => action('reject',  v._id)}>❌ Reject</button>
                    </>}
                    {v.status==='approved'   && <button style={s.btnB} onClick={() => action('checkin',  v._id)}>🟢 Check In</button>}
                    {v.status==='checked-in' && <button style={s.btnS} onClick={() => action('checkout', v._id)}>🔴 Check Out</button>}
                  </div>
                </div>
              ))
            }
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  container: { maxWidth:'1100px', margin:'0 auto', padding:'24px 16px' },
  heading:   { color:'#f1f5f9', fontSize:'22px', marginBottom:'20px' },
  grid4:     { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'16px', marginBottom:'20px' },
  statCard:  { background:'#1e293b', borderRadius:'12px', padding:'20px', textAlign:'center' },
  card:      { background:'#1e293b', borderRadius:'12px', padding:'20px' },
  cardTitle: { color:'#f1f5f9', fontSize:'16px', marginBottom:'16px' },
  row:       { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px', background:'#0f172a', borderRadius:'10px', marginBottom:'10px', flexWrap:'wrap', gap:'12px' },
  rowLeft:   { flex:1 },
  vName:     { color:'#f1f5f9', fontSize:'15px', fontWeight:'600', marginBottom:'4px' },
  vMeta:     { color:'#94a3b8', fontSize:'12px', marginBottom:'2px' },
  btnG:      { padding:'6px 14px', background:'#166534', color:'#86efac', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'12px' },
  btnR:      { padding:'6px 14px', background:'#7f1d1d', color:'#fca5a5', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'12px' },
  btnB:      { padding:'6px 14px', background:'#1e3a8a', color:'#93c5fd', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'12px' },
  btnS:      { padding:'6px 14px', background:'#334155', color:'#cbd5e1', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'12px' },
};

export default SecurityDashboard;