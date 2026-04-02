import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', role: 'visitor' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', form);
      localStorage.setItem('user', JSON.stringify(data));
      toast.success('Registered successfully!');
      
      if (data.role === 'admin')    navigate('/admin/dashboard');
      else if (data.role === 'security') navigate('/security/dashboard');
      else                         navigate('/visitor/dashboard');
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-panel">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Register to manage the VMS System</p>
        <form onSubmit={handleSubmit}>
          {[
            { key:'name',     label:'Full Name', type:'text',     ph:'Enter your full name' },
            { key:'email',    label:'Email',     type:'email',    ph:'name@company.com' },
            { key:'phone',    label:'Phone',     type:'text',     ph:'+1 (555) 000-0000' },
            { key:'password', label:'Password',  type:'password', ph:'Create a secure password' },
          ].map(f => (
            <div key={f.key} className="form-group">
              <label className="form-label">{f.label}</label>
              <input 
                className="form-input" 
                type={f.type} 
                placeholder={f.ph}
                value={form[f.key]} 
                onChange={e => setForm({...form, [f.key]: e.target.value})} 
                required 
              />
            </div>
          ))}
          
          <div className="form-group">
              <label className="form-label">Account Role</label>
              <select 
                className="form-input"
                name="role"
                value={form.role}
                onChange={e => setForm({...form, role: e.target.value})}
              >
                <option value="visitor">Visitor</option>
                <option value="security">Security Officer</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

          <button className="btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Complete Registration'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;