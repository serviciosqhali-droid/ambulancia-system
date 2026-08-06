"use client";

import { useEffect, useState } from "react";

type Paciente = { id: number; nombres: string; tipoDocumento: string | null; numeroDocumento: string | null; telefono: string; nombreContacto: string | null; direccion: string; correo: string | null };

function emptyCliente(): Paciente {
  return { id: 0, nombres: "", tipoDocumento: "", numeroDocumento: "", telefono: "", nombreContacto: "", direccion: "", correo: "" };
}

export default function PatientTable({ refresh }: { refresh: boolean }) {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Paciente | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let ignore = false;
    fetch("/api/pacientes").then((response) => {
      if (!response.ok) throw new Error("No se pudo cargar clientes");
      return response.json();
    }).then((data: Paciente[]) => {
      if (!ignore) { setPacientes(data); setError(""); }
    }).catch((err) => {
      console.error("Error al obtener clientes", err);
      if (!ignore) setError("No se pudo cargar la lista de clientes.");
    });
    return () => { ignore = true; };
  }, [refresh]);

  const clientesFiltrados = pacientes.filter((paciente) => {
    const term = searchTerm.toLowerCase();
    return [paciente.nombres, paciente.numeroDocumento || "", paciente.telefono, paciente.direccion, paciente.nombreContacto || "", paciente.correo || ""].some((value) => value.toLowerCase().includes(term));
  });

  function updateEditing<K extends keyof Paciente>(key: K, value: Paciente[K]) {
    setEditing((current) => current ? { ...current, [key]: value } : current);
  }

  async function guardarCliente() {
    if (!editing) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/pacientes/" + editing.id, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
      const data = await response.json();
      if (!response.ok) { setError(data.error || "No se pudo actualizar el cliente."); return; }
      setPacientes((current) => current.map((item) => item.id === data.id ? data : item));
      setEditing(null);
    } catch (err) {
      console.error("Error actualizando cliente", err);
      setError("Error de conexión al actualizar cliente.");
    } finally {
      setSaving(false);
    }
  }

  async function anularCliente(paciente: Paciente) {
    if (!confirm(`¿Anular a ${paciente.nombres}? Se eliminará de la lista y de la base de datos.`)) return;
    setError("");
    try {
      const response = await fetch("/api/pacientes/" + paciente.id, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || "No se pudo anular el cliente.");
        return;
      }
      setPacientes((current) => current.filter((item) => item.id !== paciente.id));
      if (editing?.id === paciente.id) setEditing(null);
    } catch (err) {
      console.error("Error anulando cliente", err);
      setError("Error de conexión al anular cliente.");
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <input type="text" placeholder="Buscar cliente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border border-gray-300 rounded-xl px-4 py-2 w-80 outline-none" />
        <span className="text-sm font-medium text-gray-400">{clientesFiltrados.length} clientes</span>
      </div>
      {error && <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left border-b text-gray-500"><th className="py-3">ID</th><th>Cliente</th><th>Documento</th><th>Teléfono</th><th>Contacto</th><th>Correo</th><th>Dirección</th><th>Acciones</th></tr></thead><tbody>{clientesFiltrados.length === 0 ? <tr><td colSpan={8} className="py-8 text-center text-gray-400">No se encontraron clientes.</td></tr> : clientesFiltrados.map((paciente) => <tr key={paciente.id} className="border-b hover:bg-gray-50"><td className="py-4">{paciente.id}</td><td className="font-semibold text-gray-800">{paciente.nombres}</td><td>{paciente.numeroDocumento ? `${paciente.tipoDocumento || "Doc"} ${paciente.numeroDocumento}` : "-"}</td><td>{paciente.telefono}</td><td>{paciente.nombreContacto || "-"}</td><td>{paciente.correo || "-"}</td><td>{paciente.direccion}</td><td><div className="flex items-center gap-2"><button onClick={() => setEditing({ ...emptyCliente(), ...paciente })} className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50">Editar</button><button onClick={() => anularCliente(paciente)} className="rounded-xl border border-red-100 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50">Anular</button></div></td></tr>)}</tbody></table></div>

      {editing && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between border-b border-gray-100 pb-4"><h2 className="text-2xl font-black text-gray-800">Editar cliente</h2><button onClick={() => setEditing(null)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100">X</button></div><div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"><Field label="Nombres y Apellidos *" value={editing.nombres} onChange={(value) => updateEditing("nombres", value)} /><SelectField label="Tipo documento" value={editing.tipoDocumento || ""} onChange={(value) => updateEditing("tipoDocumento", value)} /><Field label="Número documento" value={editing.numeroDocumento || ""} onChange={(value) => updateEditing("numeroDocumento", value)} /><Field label="Teléfono *" value={editing.telefono} onChange={(value) => updateEditing("telefono", value.replace(/\D/g, "").slice(0, 9))} /><Field label="Nombre contacto" value={editing.nombreContacto || ""} onChange={(value) => updateEditing("nombreContacto", value)} /><Field label="Correo" value={editing.correo || ""} onChange={(value) => updateEditing("correo", value)} /><div className="md:col-span-2"><Field label="Dirección domicilio *" value={editing.direccion} onChange={(value) => updateEditing("direccion", value)} /></div></div><div className="mt-6 flex justify-end gap-3"><button onClick={() => setEditing(null)} className="rounded-2xl border border-gray-200 px-6 py-3 font-bold text-gray-600 hover:bg-gray-50">Cancelar</button><button onClick={guardarCliente} disabled={saving} className="rounded-2xl bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-500 disabled:bg-red-300">{saving ? "Guardando..." : "Guardar cambios"}</button></div></div></div>}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-semibold text-gray-700">{label}</span><input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-red-500 focus:outline-none" /></label>;
}

function SelectField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-semibold text-gray-700">{label}</span><select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-red-500 focus:outline-none"><option value="">Sin documento</option><option>DNI</option><option>RUC</option><option>Pasaporte</option><option>Carnet de Extranjería</option></select></label>;
}
