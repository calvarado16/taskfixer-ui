// src/components/ProfessionForm.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { professionService } from "../services";

const ProfessionForm = ({ item, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    active: item?.active ?? true,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { validateToken } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (error) setError("");
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!validateToken()) return;

    if (!formData.name.trim()) {
      setError("El nombre es requerido");
      return;
    }
    const pattern = /^[0-9A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/;
    if (!pattern.test(formData.name)) {
      setError(
        "El nombre solo puede contener letras, números, espacios, apóstrofes y guiones"
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const saved = item
        ? await professionService.update(item.id, formData)
        : await professionService.create(formData);
      onSuccess(saved, !!item);
    } catch (e) {
      setError(e.message || "Error al guardar la profesión");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !isSubmitting) handleSubmit();
    if (e.key === "Escape") onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md rounded-xl border border-brand-border bg-brand-card shadow-2xl">
        <div className="p-6">
          <h2 className="text-xl font-bold text-brand-text mb-4">
            {item ? "Editar profesión" : "Nueva profesión"}
          </h2>

          {error && (
            <div
              role="alert"
              className="mb-4 rounded-md border border-red-400/50 bg-red-500/10 px-3 py-2 text-red-300"
            >
              ❌ {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-brand-muted">
                Nombre *
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                onKeyDown={handleKey}
                className="w-full rounded-md bg-transparent border border-brand-border px-3 py-2 text-brand-text placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-accent"
                placeholder="Ej: Plomería"
                maxLength={100}
                autoFocus
              />
            </div>

            <label className="flex items-center gap-2 text-brand-muted">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="h-4 w-4 accent-brand-accent"
              />
              Activo
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md border border-brand-border bg-transparent text-brand-muted hover:text-brand-text hover:bg-brand-border/20 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md bg-brand-accent hover:bg-brand-accentHover text-black/90 font-medium disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionForm;


