import { useEffect, useState } from 'react';
import { AuthCtx } from './auth-ctx';
import { api } from '../lib/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { user } = await api.me();
        if (active) setUser(user);
      } catch {
        /* not logged in */
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  async function login(email, password) {
    setError('');
    const { user } = await api.login({ email, password });
    setUser(user);
    return user;
  }

  async function signup(email, password, name) {
    setError('');
    const { user } = await api.signup({ email, password, name });
    setUser(user);
    return user;
  }

  async function logout() {
    await api.logout();
    setUser(null);
  }

  const value = { user, loading, error, setError, login, signup, logout };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
