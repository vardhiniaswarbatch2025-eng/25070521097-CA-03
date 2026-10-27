import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useApp } from '../ctx';
import { Err } from '../components';
export default function Auth({ mode }) {
  const reg = mode === 'register', nav = useNavigate(), { login, notify } = useApp();
  const [f, setF] = useState({ name: '', email: '', password: '', college: '' }), [err, setErr] = useState(''), [busy, setBusy] = useState(false);
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const submit = async e => { e.preventDefault(); setErr(''); setBusy(true); try { login(await api('/auth/' + mode, { method: 'POST', body: f })); notify(reg ? 'Account created' : 'Welcome back'); nav('/dashboard'); } catch (x) { setErr(x.message); } setBusy(false); };
  return (<form className="box narrow" onSubmit={submit}><h2>{reg ? 'Create your account' : 'Log in'}</h2>
    {reg && <label>Name<input value={f.name} onChange={set('name')} required /></label>}
    <label>Email<input type="email" value={f.email} onChange={set('email')} required /></label>
    <label>Password<input type="password" value={f.password} onChange={set('password')} minLength={reg ? 6 : 1} required /></label>
    {reg && <label>College (optional)<input value={f.college} onChange={set('college')} /></label>}
    <Err msg={err} /><button className="btn" disabled={busy}>{busy ? 'Please wait…' : reg ? 'Sign up' : 'Log in'}</button>
    <p className="muted">{reg ? <>Already registered? <Link to="/login">Log in</Link></> : <>New here? <Link to="/register">Create an account</Link></>}</p></form>);
}
