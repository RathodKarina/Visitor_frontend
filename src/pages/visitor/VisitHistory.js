import React, { useEffect, useState } from 'react';
import Navbar from '../../components/navbar';
import API from '../../api';

const statusColor = { pending:'#f59e0b', approved:'#22c55e', rejected:'#ef4444', 'checked-in':'#3b82f6', 'checked-out':'#94a3b8' };

function VisitHistory() {
  const [visits, setVisits] = useState([]);
  const [filter, setFilter] = useState('all');

 useEffect(() => {
  const user = JSON.parse(localStorage.getItem('user'));

  API.get('/visits/my', {
    headers: {
      Authorization: `Bearer ${user.token}`
    }
  })
  .then(r => setVisits(r.data))
  .catch(err => console.log(err));
}, []);

  const filtered = filter === 'all' ? visits : visits.filter(v => v.status === filter);

  return (
    <div style={{ background:'#0f172a', minHeight:'100vh' }}>
      <Navbar />
      <div style={s.container}>
        <h2 style={s.heading}>📋 My Visit History</h2>
        <div style={s.tabs}>
          {['all','pending','approved','rejected','checked-in','checked-out'].map(st => (
            <button key={st} onClick={() => setFilter(st)}
              style={{ ...s.tab, ...(filter===st ? s.tabActive : {}) }}>
              {st.charAt(0).toUpperCase()+st.slice(1)}
            </button>
          ))}
        </div>
        {filtered.length === 0 ? <div style={s.empty}>No visits found.</div> : (
          <div style={s.list}>
            {filtered.map(v => (
              <div key={v._id} style={s.card}>
                <div style={s.cardTop}>
                  <div>
                    <div style={s.host}>🏢 {v.hostName}</div>
                    <div style={s.dept}>{v.department}</div>
                  </div>
                  <span style={{ padding:'4px 12px', borderRadius:'99px', fontSize:'12px', background:statusColor[v.status]+'22', color:statusColor[v.status] }}>
                    {v.status}
                  </span>
                </div>
                <div style={s.purpose}>📌 {v.purpose}</div>
                <div style={s.meta}>
                  <span>📅 {new Date(v.visitDate).toLocaleString()}</span>
                  {v.checkInTime  && <span>🟢 In: {new Date(v.checkInTime).toLocaleTimeString()}</span>}
                  {v.checkOutTime && <span>🔴 Out: {new Date(v.checkOutTime).toLocaleTimeString()}</span>}
                  {v.remarks      && <span>💬 {v.remarks}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  container: { maxWidth:'900px', margin:'0 auto', padding:'24px 16px' },
  heading:   { color:'#f1f5f9', fontSize:'22px', marginBottom:'20px' },
  tabs:      { display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'20px' },
  tab:       { padding:'6px 16px', borderRadius:'99px', border:'1px solid #334155', background:'transparent', color:'#94a3b8', cursor:'pointer', fontSize:'13px' },
  tabActive: { background:'#3b82f6', color:'#fff', border:'1px solid #3b82f6' },
  list:      { display:'flex', flexDirection:'column', gap:'12px' },
  card:      { background:'#1e293b', borderRadius:'12px', padding:'18px' },
  cardTop:   { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'10px' },
  host:      { color:'#f1f5f9', fontSize:'16px', fontWeight:'600' },
  dept:      { color:'#94a3b8', fontSize:'13px', marginTop:'2px' },
  purpose:   { color:'#cbd5e1', fontSize:'14px', marginBottom:'10px' },
  meta:      { display:'flex', gap:'16px', flexWrap:'wrap', color:'#64748b', fontSize:'12px' },
  empty:     { color:'#94a3b8', textAlign:'center', padding:'40px' },
};

export default VisitHistory;