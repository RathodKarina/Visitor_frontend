import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../../components/navbar';
import API from '../../api';

function ManageUsers() {
  const [users,    setUsers]    = useState([]);
  const [filter,   setFilter]   = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState({ name:'', email:'', password:'', phone:'' });
  const [loading,  setLoading]  = useState(false);

  const fetchUsers = () => {
    API.get('/admin/users').then(r => setUsers(r.data)).catch(() => {});
  };

  useEffect(() => { fetchUsers(); }, []);

  const createOfficer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/admin/create-officer', form);
      toast.success('Officer created!');
      setShowForm(false);
      setForm({ name:'', email:'', password:'', phone:'' });
      fetchUsers();
    } catch (err) {
      console.error('Officer creation error:', err.response?.data || err);
      toast.error(err.response?.data?.message || 'Failed to create officer');
    }
    setLoading(false);
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      toast.success('Deleted!');
      fetchUsers();
    } catch { toast.error('Failed to delete'); }
  };

  const filtered  = filter==='all' ? users : users.filter(u => u.role===filter);
  const badgeColors = {
    visitor: { bg: 'rgba(59, 130, 246, 0.2)', text: '#93c5fd' },
    security: { bg: 'rgba(168, 85, 247, 0.2)', text: '#d8b4fe' },
    admin: { bg: 'rgba(245, 158, 11, 0.2)', text: '#fcd34d' }
  };

  return (
    <div>
      <Navbar />
      <div className="page-container">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 className="dashboard-title" style={{ marginBottom: 0 }}>👤 Manage Users</h2>
          <button className="btn-primary" style={{ width: 'auto', marginTop: 0 }} onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Add Officer'}
          </button>
        </div>

        {showForm && (
          <div className="auth-card glass-panel" style={{ maxWidth: '100%', marginBottom: '24px' }}>
            <h3 className="auth-title" style={{ textAlign: 'left', fontSize:'22px' }}>🛡️ Create Security Officer</h3>
            <p className="auth-subtitle" style={{ textAlign: 'left' }}>Add a new security officer account</p>
            <form onSubmit={createOfficer}>
              <div className="grid-2">
                {[
                  { key:'name',     label:'Full Name', type:'text',     ph:'Enter name' },
                  { key:'email',    label:'Email',     type:'email',    ph:'Enter email' },
                  { key:'phone',    label:'Phone',     type:'text',     ph:'Enter phone' },
                  { key:'password', label:'Password',  type:'password', ph:'Set password' },
                ].map(f => (
                  <div key={f.key} className="form-group">
                    <label className="form-label">{f.label}</label>
                    <input 
                      className="form-input" 
                      type={f.type} 
                      placeholder={f.ph}
                      value={form[f.key]} 
                      onChange={e => setForm({...form, [f.key]:e.target.value})} 
                      required 
                    />
                  </div>
                ))}
              </div>
              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '200px' }}>
                {loading ? 'Creating...' : '✅ Create Officer'}
              </button>
            </form>
          </div>
        )}

        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'16px' }}>
          {['all','visitor','security','admin'].map(r => (
            <button key={r} onClick={() => setFilter(r)}
              style={{
                padding:'8px 16px', borderRadius:'99px', cursor:'pointer', fontSize:'13px', fontWeight:'500', transition:'all 0.2s',
                border: filter === r ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                background: filter === r ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                color: filter === r ? '#fff' : '#94a3b8'
              }}>
              {r.charAt(0).toUpperCase() + r.slice(1)} ({r==='all' ? users.length : users.filter(u=>u.role===r).length})
            </button>
          ))}
        </div>

        <div className="table-card glass-panel">
          <table className="data-table">
            <thead>
              <tr>{['Name','Email','Phone','Role','Joined','Action'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone||'N/A'}</td>
                  <td>
                    <span className="status-badge" style={{ 
                      background: badgeColors[u.role]?.bg || '#334155',
                      color: badgeColors[u.role]?.text || '#cbd5e1',
                      border: `1px solid ${badgeColors[u.role]?.text || '#fff'}40`
                    }}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    {u.email !== JSON.parse(localStorage.getItem('user'))?.email && (
                      <button className="btn-logout" onClick={() => deleteUser(u._id)} style={{ padding: '6px 12px', fontSize: '12px' }}>
                        🗑 Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;