// src/services/authService.js
import { API_BASE_URL, handleResponse } from "./api.js";

const TOKEN_KEY = "authToken";
const USER_KEY  = "userInfo";

export const authService = {
  login: async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await handleResponse(res);

      // Soporta ambos formatos: { idToken } o { token }
      const token = data?.idToken || data?.token;
      if (!token) throw new Error("El backend no devolvió un token");

      localStorage.setItem(TOKEN_KEY, token);

      // Si el backend manda user, úsalo; si no, decodifica del token
      const user =
        data?.user ??
        decodeToken(token);

      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return data;
    } catch (error) {
      console.error("Error en login", error);
      throw error;
    }
  },

  register: async (name, lastname, email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, lastname, email, password })
      });
      return await handleResponse(res);
    } catch (error) {
      console.error("Error en registro", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;
    try {
      const payload = decodeToken(token);
      const nowSec = Math.floor(Date.now() / 1000);
      const expNum = Number(payload?.exp);
      if (!expNum) return false;
      const expSec = expNum > 1e12 ? Math.floor(expNum / 1000) : expNum; // ms o s
      return expSec > nowSec;
    } catch {
      return false;
    }
  },

  getCurrentUser: () => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  getToken: () => localStorage.getItem(TOKEN_KEY),
};

// URL-safe JWT decode
function decodeToken(token) {
  const base64Url = token.split(".")[1];
  if (!base64Url) throw new Error("Token inválido");
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
}



