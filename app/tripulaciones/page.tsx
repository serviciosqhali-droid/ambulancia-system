"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Ambulance, CalendarDays, Edit3, Plus, Trash2, Users } from "lucide-react";

type Ambulancia = { id: number; placa: string; modelo: string; estado: string };
type Tripulacion = { id: number; fecha: string; nombre: string; ambulancia: string; piloto: string; licenciado: string | null; medico: string | null; personalAdicional: string[]; notas: string | null };

type FormState = { nombre: string; ambulancia: string; piloto: string; licenciado: string; medico: string; notas: string };

function todayInput() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

const emptyForm: FormState = { nombre: "Tripulación 1", ambulancia: "", piloto: "", licenciado: "", medico: "", notas: "" };

export default function TripulacionesPage() {
  const [fecha, setFecha] = useState(todayInput());
  const [ambulancias, setAmbulancias] = useState<Ambulancia[]>([]);
  const [tripulaciones, setTripulaciones] = useState<Tripulacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [personalAdicional, setPersonalAdicional] = useState<string[]>([]);

  const totalIntegrantes = useMemo(() => [form.piloto, form.licenciado, form.medico, ...personalAdicional].filter((item) => item.trim()).length, [form, personalAdicional]);

  useEffect(() => {
    fetch("/api/ambulancias")
      .then((response) => response.ok ? response.json() : [])
      .then((data: Ambulancia[]) => {
        setAmbulancias(data);
        const disponible = data.find((amb) => amb.estado === "Disponible") || data[0];
        if (disponible) setForm((current) => ({ ...current, ambulancia: current.ambulancia || disponible.placa }));
      })
      .catch((err) => console.error("Error cargando ambulancias", err));
  }, []);

  useEffect(() => {
    let ignore = false;
    fetch("/api/tripulaciones?fecha=" + fecha)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "No se pudo cargar tripulaciones");
        return data;
      })
      .then((data: Tripulacion[]) => { if (!ignore) setTripulaciones(data); })
      .catch((err) => { console.error("Error cargando tripulaciones", err); if (!ignore) setError("No se pudo cargar la tripulación del día."); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [fecha]);

  function setField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setEditingId(null);
    setForm({ ...emptyForm, nombre: "Tripulación " + (tripulaciones.length + 1), ambulancia: form.ambulancia });
    setPersonalAdicional([]);
  }

  function agregarPersonal() {
    if (totalIntegrantes >= 5) return;
    setPersonalAdicional((current) => [...current, ""]);
  }

  function actualizarPersonal(index: number, value: string) {
    setPersonalAdicional((current) => current.map((item, itemIndex) => itemIndex === index ? value : item));
  }

  function eliminarPersonal(index: number) {
    setPersonalAdicional((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function editarTripulacion(tripulacion: Tripulacion) {
    setEditingId(tripulacion.id);
    setForm({ nombre: tripulacion.nombre, ambulancia: tripulacion.ambulancia, piloto: tripulacion.piloto, licenciado: tripulacion.licenciado || "", medico: tripulacion.medico || "", notas: tripulacion.notas || "" });
    setPersonalAdicional(tripulacion.personalAdicional || []);
  }

  async function eliminarTripulacion(id: number) {
    if (!confirm("¿Eliminar esta tripulación?")) return;
    const response = await fetch("/api/tripulaciones/" + id, { method: "DELETE" });
    if (response.ok) setTripulaciones((current) => current.filter((item) => item.id !== id));
  }

  async function guardarTripulacion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    if (!form.piloto.trim() || !form.licenciado.trim()) {
      setError("Piloto y Licenciado son obligatorios.");
      setSaving(false);
      return;
    }
    if (totalIntegrantes > 5) {
      setError("Cada tripulación puede tener máximo 5 integrantes.");
      setSaving(false);
      return;
    }

    try {
      const url = editingId ? "/api/tripulaciones/" + editingId : "/api/tripulaciones";
      const response = await fetch(url, { method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fecha, ...form, personalAdicional }) });
      const data = await response.json();
      if (!response.ok) { setError(data.error || "No se pudo guardar la tripulación."); return; }
      if (editingId) setTripulaciones((current) => current.map((item) => item.id === data.id ? data : item));
      else setTripulaciones((current) => [...current, data]);
      resetForm();
    } catch (err) {
      console.error("Error guardando tripulación", err);
      setError("Error de conexión. Intente nuevamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3"><Users className="text-red-600" size={36} />Ingrese tripulación</h1>
          <p className="text-gray-500 mt-2">Asignación diaria de piloto, licenciado, médico y personal adicional por ambulancia.</p>
        </div>
        <label className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-center gap-3 shadow-sm"><CalendarDays size={18} className="text-red-600" /><input type="date" value={fecha} onChange={(e) => { setLoading(true); setFecha(e.target.value); }} className="outline-none font-semibold text-gray-700" /></label>
      </div>

      <form onSubmit={guardarTripulacion} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mt-8 space-y-6">
        <div className="flex items-center gap-2 text-gray-800"><Plus className="text-red-600" /><h2 className="text-2xl font-black">{editingId ? "Editar tripulación" : "Nueva tripulación"}</h2></div>
        {error && <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Field label="Nombre de tripulación" value={form.nombre} onChange={(value) => setField("nombre", value)} required />
          <label className="block"><span className="block text-sm font-semibold text-gray-700 mb-1.5">Ambulancia asignada *</span><select value={form.ambulancia} onChange={(e) => setField("ambulancia", e.target.value)} className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 bg-white" required><option value="">Seleccionar ambulancia</option>{ambulancias.map((amb) => <option key={amb.id} value={amb.placa}>{amb.placa} - {amb.modelo} ({amb.estado})</option>)}</select></label>
          <Field label="Piloto *" value={form.piloto} onChange={(value) => setField("piloto", value)} required />
          <Field label="Licenciado *" value={form.licenciado} onChange={(value) => setField("licenciado", value)} required />
          <Field label="Médico" value={form.medico} onChange={(value) => setField("medico", value)} />
          <Field label="Notas" value={form.notas} onChange={(value) => setField("notas", value)} />
        </div>
        <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4"><div className="flex items-center justify-between gap-4"><div><p className="font-bold text-gray-800">Personal adicional</p><p className="text-sm text-gray-500">Máximo 5 integrantes en total. Actual: {totalIntegrantes}/5</p></div><button type="button" onClick={agregarPersonal} disabled={totalIntegrantes >= 5} className="border border-gray-200 disabled:opacity-50 hover:bg-white px-4 py-2 rounded-xl text-sm font-bold text-gray-700">+ Agregar personal</button></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">{personalAdicional.map((persona, index) => <div key={index} className="flex gap-2"><input value={persona} onChange={(e) => actualizarPersonal(index, e.target.value)} placeholder="Nombre del personal" className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-500" /><button type="button" onClick={() => eliminarPersonal(index)} className="border border-gray-200 px-3 rounded-xl hover:bg-white">X</button></div>)}</div></div>
        <div className="flex gap-3"><button type="submit" disabled={saving || totalIntegrantes > 5} className="bg-red-600 hover:bg-red-500 disabled:bg-red-300 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-red-100">{saving ? "Guardando..." : editingId ? "Guardar cambios" : "Guardar tripulación"}</button>{editingId && <button type="button" onClick={resetForm} className="border border-gray-200 px-6 py-3 rounded-2xl font-bold text-gray-600 hover:bg-gray-50">Cancelar edición</button>}</div>
      </form>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mt-8"><h2 className="text-2xl font-black text-gray-800 mb-6">Tripulaciones registradas</h2>{loading ? <p className="text-gray-400 py-10 text-center">Cargando tripulaciones...</p> : tripulaciones.length === 0 ? <p className="text-gray-400 py-10 text-center">No hay tripulaciones registradas para esta fecha.</p> : <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">{tripulaciones.map((tripulacion) => <div key={tripulacion.id} className="border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition-all"><div className="flex items-start justify-between gap-4"><div><h3 className="text-xl font-black text-gray-800">{tripulacion.nombre}</h3><p className="text-sm font-bold text-red-600 flex items-center gap-1 mt-1"><Ambulance size={14} /> {tripulacion.ambulancia}</p></div><div className="flex gap-2"><button onClick={() => editarTripulacion(tripulacion)} className="rounded-xl border border-gray-200 px-3 py-2 text-gray-600 hover:bg-gray-50"><Edit3 size={16} /></button><button onClick={() => eliminarTripulacion(tripulacion.id)} className="rounded-xl border border-red-100 px-3 py-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button></div></div><div className="mt-4 space-y-1 text-sm text-gray-600"><p><span className="font-bold">Piloto:</span> {tripulacion.piloto}</p>{tripulacion.licenciado && <p><span className="font-bold">Licenciado:</span> {tripulacion.licenciado}</p>}{tripulacion.medico && <p><span className="font-bold">Médico:</span> {tripulacion.medico}</p>}{tripulacion.personalAdicional.length > 0 && <p><span className="font-bold">Adicional:</span> {tripulacion.personalAdicional.join(" / ")}</p>}{tripulacion.notas && <p className="text-gray-400 italic pt-2">{tripulacion.notas}</p>}</div></div>)}</div>}</div>
    </DashboardLayout>
  );
}

function Field({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <label className="block"><span className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</span><input value={value} onChange={(e) => onChange(e.target.value)} required={required} className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-red-500" /></label>;
}
