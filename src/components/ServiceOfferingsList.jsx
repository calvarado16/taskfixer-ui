// src/components/ServiceOfferingsList.jsx
import { useEffect, useState } from "react";
import Layout from "./Layout";
import { serviceOfferingService } from "../services";
import ServiceOfferingForm from "./ServiceOfferingForm";

const ServiceOfferingsList = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null); // id en eliminación
  const [editor, setEditor] = useState({ open: false, item: null });

  const openCreate = () => setEditor({ open: true, item: null });
  const openEdit = (item) => setEditor({ open: true, item });
  const closeEditor = () => setEditor({ open: false, item: null });

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await serviceOfferingService.getAll();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Error al cargar servicios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSaved = (saved, isEdit) => {
    if (isEdit) {
      setItems((prev) => prev.map((x) => (x.id === saved.id ? saved : x)));
    } else {
      setItems((prev) => [saved, ...prev]);
    }
    closeEditor();
  };

  const handleDelete = async (it) => {
    if (!window.confirm(`¿Eliminar el servicio "${it.description}"?`)) return;
    try {
      setDeleting(it.id);
      setError("");
      await serviceOfferingService.remove(it.id); // DELETE /service_offering/:id
      setItems((prev) => prev.filter((x) => x.id !== it.id));
    } catch (e) {
      setError(e.message || "No se pudo eliminar el servicio");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-200">Servicios</h1>
        <button
          className="bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          onClick={openCreate}
        >
          + Nuevo Servicio
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-400/40 text-red-300 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-brand-panel shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-brand-panel/70">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Profesión
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Duración (min)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                  Cargando…
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                  Sin registros
                </td>
              </tr>
            ) : (
              items.map((it) => (
                <tr key={it.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 text-sm text-gray-200">
                    {it.description}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-200">
                    {it.profession?.name ?? "—"}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-200">
                    L. {Number(it.estimated_price).toFixed(2)}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-200">
                    {it.estimated_duration}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        it.active
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-red-500/15 text-red-300"
                      }`}
                    >
                      {it.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-sky-300 hover:text-sky-200 mr-4"
                      onClick={() => openEdit(it)}
                    >
                      Editar
                    </button>

                    <button
                      className="text-rose-300 hover:text-rose-200 disabled:opacity-50"
                      onClick={() => handleDelete(it)}
                      disabled={deleting === it.id}
                    >
                      {deleting === it.id ? "Eliminando…" : "Eliminar"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editor.open && (
        <ServiceOfferingForm
          item={editor.item}
          onCancel={closeEditor}
          onSuccess={handleSaved}
        />
      )}
    </Layout>
  );
};

export default ServiceOfferingsList;

