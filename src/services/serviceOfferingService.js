// src/services/serviceOfferingService.js
import { API_BASE_URL, handleResponse } from "./api.js";

// --- token & headers ---
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

// --- normalizador: tolera profession como objeto o solo nombre ---
const normalize = (x) => ({
  id: x.id ?? x._id ?? x._id?.$oid ?? String(x.id || x._id || ""),
  description: x.description,
  estimated_price: Number(x.estimated_price),
  estimated_duration: Number(x.estimated_duration),
  active: Boolean(x.active),

  profession: x.profession
    ? {
        id: x.profession.id ?? x.profession._id ?? x.profession?._id?.$oid ?? "",
        name: x.profession.name,
        active: x.profession.active ?? true,
      }
    : x.profession_name
    ? { id: "", name: x.profession_name, active: true }
    : null,

  id_profession:
    x.id_profession ||
    x.profession?.id ||
    x.profession?._id ||
    x.profession?._id?.$oid ||
    "",
});

export const serviceOfferingService = {
  // GET /service_offering/
  getAll: async (params) => {
    const qs = params
      ? "?" +
        new URLSearchParams(
          Object.fromEntries(
            Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
          )
        ).toString()
      : "";
    const res = await fetch(`${API_BASE_URL}/service_offering/${qs}`, {
      headers: authHeaders(),
    });
    const data = await handleResponse(res);
    const arr = Array.isArray(data) ? data : data.items || [];
    return arr.map(normalize);
  },

  // POST /service_offering/
  create: async (payload) => {
    const body = {
      description: payload.description,
      estimated_price: Number(payload.estimated_price),
      estimated_duration: Number(payload.estimated_duration),
      active: Boolean(payload.active),
      id_profession: payload.id_profession, // asociación
    };
    const res = await fetch(`${API_BASE_URL}/service_offering/`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify(body),
    });
    const data = await handleResponse(res);
    return normalize(data);
  },

  // PUT /service_offering/:id
  update: async (id, payload) => {
    const body = {
      description: payload.description,
      estimated_price: Number(payload.estimated_price),
      estimated_duration: Number(payload.estimated_duration),
      active: Boolean(payload.active),
      id_profession: payload.id_profession,
    };
    const res = await fetch(`${API_BASE_URL}/service_offering/${id}`, {
      method: "PUT",
      headers: jsonHeaders(),
      body: JSON.stringify(body),
    });
    const data = await handleResponse(res);
    return normalize(data);
  },

  // DELETE /service_offering/:id
  remove: async (id) => {
    const res = await fetch(`${API_BASE_URL}/service_offering/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    return handleResponse(res);
  },
};


