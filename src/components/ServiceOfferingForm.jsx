// src/components/ServiceOfferingForm.jsx
import { useEffect, useRef, useState } from "react";
import { professionService, serviceOfferingService } from "../services";


function ProfessionSelect({ value, onChange, options, placeholder = "Selecciona una profesión…" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find((o) => o.id === value) || null;

  // Cerrar cuando se hace click fuera
  useEffect(() => {
    const onDocClick = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Teclado básico
  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((v) => !v);
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="relative" ref={ref}>
      {/* Botón del listbox (visible siempre) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
        className="w-full rounded-md border border-brand-border bg-white px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-brand-accent"
      >
        <span className={selected ? "text-black" : "text-slate-500"}>
          {selected ? selected.name : placeholder}
        </span>
        <span className="float-right text-slate-500">▾</span>
      </button>

      {/* Lista desplegable */}
      {open && (
        <div
          className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md border border-slate-300 bg-white shadow-lg"
          role="listbox"
        >
          {/* Placeholder como primera opción */}
          <div
            role="option"
            aria-selected={!selected}
            className="cursor-pointer px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
            onMouseDown={() => {
              onChange("");
              setOpen(false);
            }}
          >
            {placeholder}
          </div>

          {/* Opciones con texto negro */}
          {options.map((o) => (
            <div
              key={o.id}
              role="option"
              aria-selected={o.id === value}
              className={`cursor-pointer px-3 py-2 text-sm hover:bg-slate-100 ${
                o.id === value ? "bg-slate-100 text-black" : "text-black"
              }`}
              onMouseDown={() => {
                onChange(o.id);
                setOpen(false);
              }}
            >
              {o.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===========================================================================
   Formulario de Service Offering
=========================================================================== */
export default function ServiceOfferingForm({ item, onCancel, onSuccess }) {
  const [form, setForm] = useState({
    description: item?.description || "",
    estimated_price: item?.estimated_price ?? 0,
    estimated_duration: item?.estimated_duration ?? 60,
    active: item?.active ?? true,
    id_profession: item?.id_profession || item?.profession?.id || "",
  });

  const [professions, setProfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        // Pide solo activas (cambia a true si quieres incluir inactivas en el popup)
        const list = await professionService.getAll(false);
        setProfessions(list.filter((p) => p.active));
      } catch (e) {
        setError(e.message || "Error al cargar profesiones");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (error) setError("");
  };

  const submit = async () => {
    if (saving) return;
    if (!form.id_profession) return setError("Selecciona una profesión.");
    if (!form.description.trim()) return setError("La descripción es requerida.");
    if (Number(form.estimated_price) < 0) return setError("Precio inválido.");
    if (Number(form.estimated_duration) <= 0) return setError("Duración inválida.");

    try {
      setSaving(true);
      const payload = {
        ...form,
        estimated_price: Number(form.estimated_price),
        estimated_duration: Number(form.estimated_duration),
      };
      const saved = item
        ? await serviceOfferingService.update(item.id, payload)
        : await serviceOfferingService.create(payload);

      onSuccess(saved, !!item);
    } catch (e) {
      setError(e.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter") submit();
    if (e.key === "Escape") onCancel();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
      onKeyDown={onKey}
    >
      <div className="w-full max-w-lg rounded-xl border border-brand-border bg-brand-card shadow-2xl">
        <div className="p-6">
          <h2 className="text-xl font-bold text-brand-text mb-4">
            {item ? "Editar Servicio" : "Nuevo Servicio"}
          </h2>

          {error && (
            <div
              role="alert"
              className="mb-4 rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-red-300"
            >
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-brand-muted">Cargando profesiones…</div>
          ) : (
            <div className="space-y-4">
              {/* Profesión (listbox custom) */}
              <div>
                <label className="block text-sm font-medium text-brand-muted mb-1">
                  Profesión *
                </label>
                <ProfessionSelect
                  value={form.id_profession}
                  onChange={(val) => setForm((prev) => ({ ...prev, id_profession: val }))}
                  options={professions}
                  placeholder="Selecciona una profesión…"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-brand-muted mb-1">
                  Descripción *
                </label>
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  className="w-full rounded-md bg-transparent border border-brand-border px-3 py-2 text-brand-text placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  maxLength={120}
                  placeholder="Ej: Instalación de grifería"
                />
              </div>

              {/* Precio y Duración */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-muted mb-1">
                    Precio estimado *
                  </label>
                  <input
                    type="number"
                    name="estimated_price"
                    step="0.01"
                    value={form.estimated_price}
                    onChange={onChange}
                    className="w-full rounded-md bg-transparent border border-brand-border px-3 py-2 text-brand-text placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-muted mb-1">
                    Duración (horas) *
                  </label>
                  <input
                    type="number"
                    name="estimated_duration"
                    value={form.estimated_duration}
                    onChange={onChange}
                    className="w-full rounded-md bg-transparent border border-brand-border px-3 py-2 text-brand-text placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  />
                </div>
              </div>

              {/* Activo */}
              <label className="inline-flex items-center gap-2 select-none">
                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={onChange}
                  className="h-4 w-4 accent-brand-accent"
                />
                <span className="text-sm text-brand-muted">Activo</span>
              </label>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium rounded-md border border-brand-border bg-transparent text-brand-muted hover:text-brand-text hover:bg-brand-border/20 disabled:opacity-50"
              disabled={saving}
              type="button"
            >
              Cancelar
            </button>
            <button
              onClick={submit}
              disabled={saving || loading}
              className="px-4 py-2 text-sm font-medium rounded-md bg-brand-accent hover:bg-brand-accentHover text-black/90 disabled:opacity-50"
              type="button"
            >
              {saving ? "Guardando…" : item ? "Actualizar" : "Crear"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
