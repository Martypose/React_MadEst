// src/auth/AuthProvider.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import client from '../api/client';
import { getTokens, setTokens, clearTokens } from './tokenStorage';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const t = getTokens();
    return t?.username ? { username: t.username, role: t.role || null } : null;
  });

  useEffect(() => {
    const onLogout = () => setUser(null);
    window.addEventListener('auth:logout', onLogout);
    return () => window.removeEventListener('auth:logout', onLogout);
  }, []);

  async function login(name, password) {
    const res = await client.post('/login', { name, password }); // backend actual
    const t = setTokens(res.data || {});
    setUser(t?.username ? { username: t.username, role: t.role || null } : null);
    return t;
  }

  function logout() {
    clearTokens();
    setUser(null);
  }

  const value = useMemo(() => ({
    user, isAuthenticated: !!user, login, logout
  }), [user]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
