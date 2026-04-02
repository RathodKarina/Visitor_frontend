import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/navbar';
import API from '../../api';

function SubmitRequest() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ hostName:'', purpose:'', department:'', visitDate:'' });
  const [loading, setLoading] = useState(false);

  const departments = ['HR','IT','Finance','Operations','Marketing','Admin','Security','Management'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));

        await API.post('/visits', form, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
      toast.success('Visit request submitted!');
      navigate('/visitor/history');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ background:'#0f172a', minHeight:'100vh' }}>
      <Navbar />
      <div style={s.container}>
        <h2 style={s.heading}>📝 Submit Visit Request</h2>
        <div style={s.card}>
          <form onSubmit={handleSubmit}>
            <div style={s.grid2}>
              <div style={s.field}>
                <label style={s.label}>Host Name *</label>
                <input style={s.input} placeholder="Person you are visiting"
                  value={form.hostName} onChange={e => setForm({...form, hostName:e.target.value})} required />
              </div>
              <div style={s.field}>
                <label style={s.label}>Department *</label>
                <select style={s.input} value={form.department}
                  onChange={e => setForm({...form, department:e.target.value})} required>
                  <option value="">Select department</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div style={s.field}>
              <label style={s.label}>Purpose of Visit *</label>
              <textarea style={{ ...s.input, height:'100px', resize:'vertical' }}
                placeholder="Describe the purpose..."
                value={form.purpose} onChange={e => setForm({...form, purpose:e.target.value})} required />
            </div>
            <div style={s.field}>
              <label style={s.label}>Visit Date *</label>
              <input style={s.input} type="datetime-local"
                value={form.visitDate} onChange={e => setForm({...form, visitDate:e.target.value})} required />
            </div>
            <div style={{ display:'flex', gap:'12px', marginTop:'8px' }}>
              <button type="submit" style={s.btnPrimary} disabled={loading}>
                {loading ? 'Submitting...' : '✅ Submit Request'}
              </button>
              <button type="button" style={s.btnSecondary} onClick={() => navigate('/visitor/dashboard')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const s = {
  container:    { maxWidth:'700px', margin:'0 auto', padding:'24px 16px' },
  heading:      { color:'#f1f5f9', fontSize:'22px', marginBottom:'20px' },
  card:         { background:'#1e293b', borderRadius:'12px', padding:'28px' },
  grid2:        { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' },
  field:        { marginBottom:'18px' },
  label:        { display:'block', color:'#cbd5e1', fontSize:'14px', marginBottom:'6px' },
  input:        { width:'100%', padding:'10px 14px', borderRadius:'8px', border:'1px solid #334155', background:'#0f172a', color:'#f1f5f9', fontSize:'14px', boxSizing:'border-box' },
  btnPrimary:   { padding:'11px 28px', background:'#3b82f6', color:'#fff', border:'none', borderRadius:'8px', fontSize:'14px', fontWeight:'600', cursor:'pointer' },
  btnSecondary: { padding:'11px 28px', background:'#334155', color:'#cbd5e1', border:'none', borderRadius:'8px', fontSize:'14px', cursor:'pointer' },
};

export default SubmitRequest;