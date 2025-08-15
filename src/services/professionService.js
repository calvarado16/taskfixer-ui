// src/services/professionService.js
import { API_BASE_URL, handleResponse } from "./api.js";

// Token (lee varias claves comunes)
const getToken = () =>
  localStorage.getItem("authToken") ||
  localStorage.getItem("token") ||
  localStorage.getItem("access_token") ||
  "";

const jsonHeaders = () => {
  const t = getToken();
  return t
    ? { "Content-Type": "application/json", Authorization: `Bearer ${t}` }
    : { "Content-Type": "application/json" };
};

const authHeaders = () => {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

// Normaliza documentos de profesión
const normalize = (x) => ({
  id: x.id ?? x._id ?? x._id?.$oid ?? String(x.id || x._id || ""),
  name: x.name,
  active: Boolean(x.active),
});


const buildQuery = (arg) => {
  const params =
    typeof arg === "boolean" || typeof arg === "undefined"
      ? { include_inactive: Boolean(arg) }
      : { include_inactive: Boolean(arg?.include_inactive), ...arg };

  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") usp.set(k, String(v));
  });
  return usp.toString();
};

export const professionService = {
  // GET /profession/?include_inactive=false|true&...
  getAll: async (opts) => {
    const qs = buildQuery(opts);
    const url = `${API_BASE_URL}/profession/${qs ? "?" + qs : ""}`;
    const res = await fetch(url, { headers: authHeaders() });
    const data = await handleResponse(res);
    const arr = Array.isArray(data) ? data : data.items || [];
    return arr.map(normalize);
  },

  // POST /profession/
  create: async ({ name, active = true }) => {
    const res = await fetch(`${API_BASE_URL}/profession/`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({ name, active }),
    });
    const data = await handleResponse(res);
    return normalize(data);
  },

  // PUT /profession/:id
  update: async (id, { name, active }) => {
    const res = await fetch(`${API_BASE_URL}/profession/${id}`, {
      method: "PUT",
      headers: jsonHeaders(),
      body: JSON.stringify({ name, active }),
    });
    const data = await handleResponse(res);
    return normalize(data);
  },

  // DELETE /profession/:id
  remove: async (id) => {
    const res = await fetch(`${API_BASE_URL}/profession/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    return handleResponse(res);
  },
};
