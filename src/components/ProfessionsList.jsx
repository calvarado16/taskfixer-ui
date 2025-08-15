import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { professionService } from "../services";
import Layout from "./Layout";
import ProfessionForm from "./ProfessionForm";

const ProfessionsList = () => {
  const { validateToken } = useAuth();
  const [items, setItems] = useState([]);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [highlight, setHighlight] = useState(null);

  const load = async () => {
    if (!validateToken()) return;
    setLoading(true);
    setError("");
    try {
      const data = await professionService.getAll(includeInactive);
      setItems(data);
    } catch (e) {
      setError(e.message || "Error al cargar profesiones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-line */ }, [includeInactive]);
  useEffect(() => { if (highlight) setTimeout(() => setHighlight(null), 2000); }, [highlight]);
  useEffect(() => { if (success) setTimeout(() => setSuccess(""), 3000); }, [success]);

  const handleCreate = () => { setEditing(null); setShowForm(true); };
  const handleEdit = (it) => { setEditing(it); setShowForm(true); };

  const handleDelete = async (it) => {
    if (!validateToken()) return;
    if (!window.confirm(`¿Desactivar la profesión "${it.name}"?`)) return;
    try {
      const res = await professionService.remove(it.id);
      await load();
      setSuccess(res.message || (res.softDisabled ? "Se desactivó (en uso)" : "Eliminado"));
    } catch (e) {
      setError(e.message || "Error al eliminar profesión");
    }
  };

  const onFormSuccess = async (saved, isEdit) => {
    await load();
    setHighlight(saved.id);
    setSuccess(isEdit ? "Profesión actualizada" : "Profesión creada");
    setShowForm(false);
    setEditing(null);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[50vh] flex items-center justify-center text-brand-muted">
          Cargando profesiones…
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header + acciones */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-text">Profesiones</h1>

        <div className="flex items-center gap-4">
          <label className="text-sm text-brand-muted flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeInactive}
              onChange={(e) => setIncludeInactive(e.target.checked)}
              className="h-4 w-4 accent-brand-accent"
            />
            Incluir inactivas
          </label>

          <button
            onClick={handleCreate}
            className="rounded-md bg-brand-accent hover:bg-brand-accentHover text-black/90 px-4 py-2 font-medium transition-colors"
          >
            + Nueva
          </button>
        </div>
      </div>

      {/* Mensajes */}
      {success && (
        <div className="mb-4 rounded-md border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-emerald-300">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-red-300">
          ❌ {error}
        </div>
      )}

      {/* Tabla */}
      <div className="rounded-lg border border-brand-border bg-brand-card shadow-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-brand-border/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-brand-muted uppercase">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold tracking-wide text-brand-muted uppercase">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold tracking-wide text-brand-muted uppercase">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-brand-border/60">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-6 text-center text-brand-muted"
                >
                  Sin registros
                </td>
              </tr>
            ) : (
              items.map((it) => (
                <tr
                  key={it.id}
                  className={`transition-colors ${
                    highlight === it.id
                      ? "bg-emerald-500/10"
                      : "hover:bg-brand-border/20"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-text">
                    {it.name}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        it.active
                          ? "bg-green-500/15 text-emerald-300"
                          : "bg-red-500/15 text-red-300"
                      }`}
                    >
                      {it.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(it)}
                      className="text-sky-300 hover:text-sky-200 mr-4"
                    >
                      Editar
                    </button>

                    {it.active && (
                      <button
                        onClick={() => handleDelete(it)}
                        className="text-red-300 hover:text-red-200"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ProfessionForm
          item={editing}
          onSuccess={onFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}
    </Layout>
  );
};

export default ProfessionsList;
