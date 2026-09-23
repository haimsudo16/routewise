import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { getToken, registerApiHandlers, setToken } from '../services/api';
import { useToast } from './ToastContext.jsx';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  const logout = useCallback(
    (message) => {
      setToken(null);
      setUser(null);
      if (message) toast.info(message);
      navigate('/login');
    },
    [navigate, toast]
  );

  useEffect(() => {
    registerApiHandlers({
      unauthorized: () => logout('Your session expired. Please log in again.'),
      networkError: () => toast.error('Cannot reach the RouteWise server. Is the backend running?'),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    userService
      .getMe()
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await authService.register(payload);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const refreshUser = useCallback(async () => {
    const me = await userService.getMe();
    setUser(me);
    return me;
  }, []);

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: !!user, login, register, logout, refreshUser, setUser }),
    [user, loading, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
