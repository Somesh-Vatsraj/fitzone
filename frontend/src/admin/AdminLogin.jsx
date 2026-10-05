import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../data/StoreContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { Field, Input } from '../components/Form.jsx';

const DEMO_EMAIL = 'admin@fitzone.com';
const DEMO_PASSWORD = 'admin123';

export default function AdminLogin() {
  const { auth, setAuth } = useStore();
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => { if (auth) navigate('/admin/dashboard', { replace: true }); }, [auth, navigate]);

  const submit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError('Enter both email and password'); return; }
    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      setError('Invalid credentials. Use demo login below.'); toast.error('Login failed'); return;
    }
    setError(''); setAuth(true); toast.success('Welcome, Admin!');
    navigate('/admin/dashboard', { replace: true });
  };

  return (
    <div className="login">
      <div className="login__glow" aria-hidden="true" />
      <form className="login__card" onSubmit={submit}>
        <Link to="/" className="brand brand--center">
          <span className="brand__mark">FZ</span>
          <span className="brand__text">FITZONE<small>Admin Panel</small></span>
        </Link>
        <h1 className="login__title">Admin Sign In</h1>
        <p className="login__sub">Sign in to manage your gym.</p>
        {error ? <div className="alert alert--error">{error}</div> : null}
        <Field label="Email"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label="Password">
          <div className="input-with-btn">
            <Input type={show ? 'text' : 'password'} value={password}
              onChange={(e) => setPassword(e.target.value)} />
            <button type="button" className="input-with-btn__btn" onClick={() => setShow((s) => !s)}>
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
        </Field>
        <button type="submit" className="btn btn--primary btn--lg btn--block">Sign In</button>
        <div className="login__demo">
          <strong>Demo credentials</strong>
          <span>Email: {DEMO_EMAIL}</span>
          <span>Password: {DEMO_PASSWORD}</span>
        </div>
        <Link to="/" className="login__back">← Back to website</Link>
      </form>
    </div>
  );
}
