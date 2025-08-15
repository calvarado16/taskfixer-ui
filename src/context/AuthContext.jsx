// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services";

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // inicia en true

  // Carga inicial desde localStorage
  useEffect(() => {
    const init = () => {
      const ok = authService.isAuthenticated();
      if (ok) {
        setUser(authService.getCurrentUser());
        setIsAuthenticated(true);
      } else {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      await authService.login(email, password);
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
      return true;
    } catch (error) {
      authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, lastname, email, password) => {
    setLoading(true);
    try {
      return await authService.register(name, lastname, email, password);
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Delegar validación al service (maneja URL-safe base64 y exp en s/ms)
  const validateToken = useCallback(() => {
    const ok = authService.isAuthenticated();
    if (!ok) logout();
    return ok;
  }, [logout]);

  const value = { user, isAuthenticated, loading, login, register, logout, validateToken };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
