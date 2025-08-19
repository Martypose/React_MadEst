// src/components/Login.js
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export default function Login() {
  const history = useHistory();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      await login(name, password);
      history.replace('/cubico');
    } catch {
      setErr('Usuario o contraseña incorrectos');
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: '80px auto', fontFamily: 'system-ui' }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <label>Usuario</label>
        <input value={name} onChange={(e) => setName(e.target.value)} autoFocus
               style={{ width: '100%', padding: 8, marginBottom: 8 }} />
        <label>Contraseña</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
               style={{ width: '100%', padding: 8, marginBottom: 12 }} />
        <button type="submit" style={{ width: '100%', padding: 10 }}>Acceder</button>
        {err && <p style={{ color: 'crimson' }}>{err}</p>}
      </form>
    </div>
  );
}
