"use client";

import { useEffect, useState } from "react";
import {
  Truck,
  Plus,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Trash2,
  AlertCircle,
  Pencil,
} from "lucide-react";

interface Ambulancia {
  id: number;
  placa: string;
  modelo: string;
  tipo: string;
  estado: string;
  createdAt: string;
}

const DEFAULT_TIPO = "Tipo I (Traslado Simple)";
const DEFAULT_ESTADO = "Disponible";

export default function AmbulanciasPage() {
  const [ambulancias, setAmbulancias] = useState<Ambulancia[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState("");
  const [tipo, setTipo] = useState(DEFAULT_TIPO);
  const [estado, setEstado] = useState(DEFAULT_ESTADO);

  useEffect(() => {
    fetchAmbulancias();
  }, []);

  async function fetchAmbulancias() {
    try {
      setLoading(true);
      const res = await fetch("/api/ambulancias");
      if (res.ok) {
        const data = await res.json();
        setAmbulancias(data);
      }
    } catch (err) {
      console.error("Error al cargar ambulancias", err);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEditingId(null);
    setPlaca("");
    setModelo("");
    setTipo(DEFAULT_TIPO);
    setEstado(DEFAULT_ESTADO);
    setError("");
  }

  function openCreateModal() {
    resetForm();
    setShowModal(true);
  }

  function openEditModal(amb: Ambulancia) {
    setEditingId(amb.id);
    setPlaca(amb.placa);
    setModelo(amb.modelo);
    setTipo(amb.tipo);
    setEstado(amb.estado);
    setError("");
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!placa.trim() || !modelo.trim()) {
      setError("Todos los campos obligatorios deben ser completados.");
      return;
    }

    setSaving(true);
    try {
      const payload = { placa, modelo, tipo, estado };
      const res = await fetch(
        editingId ? `/api/ambulancias/${editingId}` : "/api/ambulancias",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (editingId) {
          setAmbulancias((current) =>
            current.map((item) => (item.id === data.id ? data : item))
          );
        } else {
          await fetchAmbulancias();
        }
        setShowModal(false);
        resetForm();
      } else {
        const errData = await res.json();
        setError(
          errData.error ||
            (editingId
              ? "Ocurrió un error al actualizar la ambulancia."
              : "Ocurrió un error al registrar la ambulancia.")
        );
      }
    } catch {
      setError("Error de conexión. Intente nuevamente.");
    } finally {
      setSaving(false);
    }
  }

  async function updateEstado(id: number, nuevoEstado: string) {
    try {
      const res = await fetch(`/api/ambulancias/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (res.ok) {
        setAmbulancias(
          ambulancias.map((a) => (a.id === id ? { ...a, estado: nuevoEstado } : a))
        );
      }
    } catch (err) {
      console.error("Error al actualizar estado", err);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("¿Está seguro de eliminar esta ambulancia de manera permanente?")) return;

    try {
      const res = await fetch(`/api/ambulancias/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setAmbulancias(ambulancias.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error("Error al eliminar ambulancia", err);
    }
  }

  const filteredAmbulancias = ambulancias.filter(
    (a) =>
      a.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = ambulancias.length;
  const disponibles = ambulancias.filter((a) => a.estado === "Disponible").length;
  const enServicio = ambulancias.filter((a) => a.estado === "En Servicio").length;
  const mantenimiento = ambulancias.filter((a) => a.estado === "Mantenimiento").length;

  return (
    <>
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <Truck size={36} className="text-red-600" />
            Ambulancias
          </h1>
          <p className="text-gray-500 mt-2">
            Administración del parque móvil, estados mecánicos y disponibilidad operativa.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-100 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus size={20} />
          Agregar Ambulancia
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Flota Total</p>
            <h2 className="text-3xl font-extrabold text-gray-800 mt-2">{total}</h2>
          </div>
          <div className="bg-gray-100 p-4 rounded-xl text-gray-600">
            <Truck size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Disponibles</p>
            <h2 className="text-3xl font-extrabold text-green-600 mt-2">{disponibles}</h2>
          </div>
          <div className="bg-green-50 p-4 rounded-xl text-green-600">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">En Servicio</p>
            <h2 className="text-3xl font-extrabold text-blue-600 mt-2">{enServicio}</h2>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl text-blue-600">
            <AlertCircle size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Mantenimiento</p>
            <h2 className="text-3xl font-extrabold text-yellow-600 mt-2">{mantenimiento}</h2>
          </div>
          <div className="bg-yellow-50 p-4 rounded-xl text-yellow-600">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mt-10">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por placa, modelo, tipo o estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 border border-gray-200 rounded-2xl w-full text-sm focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          <div className="text-sm text-gray-400 self-end md:self-center font-medium">
            Mostrando {filteredAmbulancias.length} ambulancias
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-500">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 font-medium">Cargando flota de ambulancias...</p>
          </div>
        ) : filteredAmbulancias.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <Truck size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="font-semibold text-lg">No se encontraron ambulancias</p>
            <p className="text-sm text-gray-400 mt-1">
              Prueba con un término de búsqueda distinto o agrega un nuevo vehículo.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold text-sm">
                  <th className="p-4 pl-6">Placa</th>
                  <th className="p-4">Modelo</th>
                  <th className="p-4">Tipo de Soporte</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4">Cambiar Estado</th>
                  <th className="p-4 pr-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-700 text-sm">
                {filteredAmbulancias.map((amb) => (
                  <tr key={amb.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6 font-bold text-gray-900 tracking-wider">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-xl border border-gray-200 text-xs">
                        {amb.placa}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-gray-800">{amb.modelo}</td>
                    <td className="p-4 text-gray-500">{amb.tipo}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          amb.estado === "Disponible"
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : amb.estado === "En Servicio"
                              ? "bg-blue-50 text-blue-700 border border-blue-100"
                              : "bg-yellow-50 text-yellow-700 border border-yellow-100"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            amb.estado === "Disponible"
                              ? "bg-green-500"
                              : amb.estado === "En Servicio"
                                ? "bg-blue-500"
                                : "bg-yellow-500"
                          }`}
                        />
                        {amb.estado}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={amb.estado}
                        onChange={(e) => updateEstado(amb.id, e.target.value)}
                        className="bg-white border border-gray-200 text-gray-600 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-red-500 transition-colors cursor-pointer"
                      >
                        <option value="Disponible">Disponible</option>
                        <option value="En Servicio">En Servicio</option>
                        <option value="Mantenimiento">Mantenimiento</option>
                      </select>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(amb)}
                          className="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Editar Ambulancia"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(amb.id)}
                          className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title="Eliminar Ambulancia"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-6 border border-gray-100 animate-slideUp">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Truck className="text-red-600" />
                {editingId ? "Editar Ambulancia" : "Registrar Ambulancia"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {error && (
                <div className="bg-red-50 text-red-700 text-xs font-semibold p-4 rounded-2xl border border-red-100 flex items-center gap-2">
                  <XCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Número de Placa *
                </label>
                <input
                  type="text"
                  placeholder="Ej: EUA-102"
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Modelo y Marca *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Mercedes-Benz Sprinter 2025"
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Tipo de Soporte Vital
                </label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors cursor-pointer bg-white"
                >
                  <option value="Tipo I (Traslado Simple)">Tipo I (Traslado Simple)</option>
                  <option value="Tipo II (Soporte Vital Básico)">
                    Tipo II (Soporte Vital Básico)
                  </option>
                  <option value="Tipo III (UCI / Soporte Avanzado)">
                    Tipo III (UCI / Soporte Avanzado)
                  </option>
                  <option value="SAMU (Soporte Vital Avanzado)">
                    SAMU (Soporte Vital Avanzado)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Estado de Disponibilidad
                </label>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 transition-colors cursor-pointer bg-white"
                >
                  <option value="Disponible">Disponible</option>
                  <option value="En Servicio">En Servicio</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                </select>
              </div>

              <div className="flex justify-between gap-4 mt-8 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold px-6 py-3 rounded-2xl transition-colors w-1/2 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-red-600 hover:bg-red-500 disabled:bg-red-300 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg shadow-red-100 hover:scale-[1.02] active:scale-[0.98] transition-all w-1/2 cursor-pointer"
                >
                  {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Registrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
