import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../hooks/useAuth.jsx';
import { useToast } from '../components/Toast.jsx';
import { applySEO } from '../utils/seo.js';

export default function AdminLogin() {
  const { admin, login, setup } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [checking, setChecking] = useState(true);
  const [setupRequired, setSetupRequired] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    applySEO({ title: 'Admin Login', robots: 'noindex,nofollow' });
  }, []);

  useEffect(() => {
    api.auth.status()
      .then(r => setSetupRequired(!!r.setupRequired))
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (admin && !checking) navigate('/admin', { replace: true });
  }, [admin, checking, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    if (!username || !password) { toast.error('Please fill all fields'); return; }
    if (setupRequired && password !== confirm) { toast.error('Passwords do not match'); return; }
    if (setupRequired && password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      if (setupRequired) {
        await setup(username, password);
        toast.success('Admin account created');
      } else {
        await login(username, password);
        toast.success('Welcome back');
      }
      navigate('/admin', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return <div className="login-page"><div className="spinner" /></div>;
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>{setupRequired ? 'Set Up Admin' : 'Admin Login'}</h1>
        <p className="sub">{setupRequired ? 'Create the first admin account.' : 'Sign in to manage the website.'}</p>
        <form onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="u">Username</label>
            <input id="u" value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" required />
          </div>
          <div className="form-group">
            <label htmlFor="p">Password</label>
            <input id="p" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete={setupRequired ? 'new-password' : 'current-password'} required />
          </div>
          {setupRequired && (
            <div className="form-group">
              <label htmlFor="cp">Confirm Password</label>
              <input id="cp" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" required />
            </div>
          )}
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Please wait...' : setupRequired ? 'Create Admin Account' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
