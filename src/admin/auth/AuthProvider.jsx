import { createContext, useContext, useEffect, useState } from 'react';

import { ADMIN_AUTH_REQUIRED_EVENT, getSession, login, logout } from '../api/adminApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  async function checkSession() {
    try {
      const result = await getSession();

      if (result.ok) {
        setUser(result);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setChecking(false);
    }
  }

  async function signIn(password) {
    const result = await login(password);

    if (result.ok) {
      await checkSession();
    }

    return result;
  }

  async function signOut() {
    await logout();
    setUser(null);
  }

  useEffect(() => {
    function handleAuthRequired() {
      setUser(null);
      setChecking(false);
    }

    window.addEventListener(ADMIN_AUTH_REQUIRED_EVENT, handleAuthRequired);

    checkSession();

    return () => {
      window.removeEventListener(ADMIN_AUTH_REQUIRED_EVENT, handleAuthRequired);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        checking,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
