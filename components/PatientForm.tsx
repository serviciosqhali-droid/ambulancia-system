"use client";

import { type FormEvent, useState } from "react";

export default function PatientForm({ onSaved }: { onSaved: () => void }) {
  const [nombres, setNombres] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nombreContacto, setNombreContacto] = useState("");
  const [direccion, setDireccion] = useState("");
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function guardarPaciente(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const response = await fetch("/api/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombres,
          tipoDocumento,
          numeroDocumento,
          telefono,
          nombreContacto,
          direccion,
          correo,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "No se pudo guardar el cliente.");
        return;
      }

      onSaved();
      setNombres("");
      setTipoDocumento("");
      setNumeroDocumento("");
      setTelefono("");
      setNombreContacto("");
      setDireccion("");
      setCorreo("");
    } catch (err) {
      console.error("Error de conexión al guardar cliente", err);
      setError("Error de conexión. Intente nuevamente.");
    } finally {
      setSaving(false);
    }
  }

  function handleDocumento(value: string) {
    let nextValue = value;
    if (tipoDocumento === "DNI") nextValue = nextValue.replace(/\D/g, "").slice(0, 8);
    if (tipoDocumento === "RUC") nextValue = nextValue.replace(/\D/g, "").slice(0, 11);
    if (tipoDocumento === "Pasaporte") nextValue = nextValue.replace(/[^a-zA-Z0-9]/g, "").slice(0, 9);
    if (tipoDocumento === "Carnet de Extranjería") nextValue = nextValue.slice(0, 12);
    setNumeroDocumento(nextValue);
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6">Ingresar Cliente</h2>

      <form onSubmit={guardarPaciente}>
        {error && <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label>
            <span className="block mb-2 text-sm font-medium">Nombres y Apellidos *</span>
            <input value={nombres} onChange={(e) => setNombres(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none" placeholder="Ingrese nombres y apellidos" required />
          </label>

          <label>
            <span className="block mb-2 text-sm font-medium">Tipo Documento (opcional)</span>
            <select value={tipoDocumento} onChange={(e) => { setTipoDocumento(e.target.value); setNumeroDocumento(""); }} className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none bg-white">
              <option value="">Sin documento</option>
              <option value="DNI">DNI</option>
              <option value="RUC">RUC</option>
              <option value="Pasaporte">Pasaporte</option>
              <option value="Carnet de Extranjería">Carnet de Extranjería</option>
            </select>
          </label>

          <label>
            <span className="block mb-2 text-sm font-medium">Número de Documento (opcional)</span>
            <input value={numeroDocumento} onChange={(e) => handleDocumento(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none" placeholder="Ingrese documento" disabled={!tipoDocumento} />
          </label>

          <label>
            <span className="block mb-2 text-sm font-medium">Teléfono de contacto *</span>
            <input value={telefono} onChange={(e) => setTelefono(e.target.value.replace(/\D/g, "").slice(0, 9))} maxLength={9} className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none" placeholder="Ingrese teléfono" required />
          </label>

          <label>
            <span className="block mb-2 text-sm font-medium">Nombre del contacto (opcional)</span>
            <input value={nombreContacto} onChange={(e) => setNombreContacto(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none" placeholder="Familiar o contacto" />
          </label>

          <label>
            <span className="block mb-2 text-sm font-medium">Correo (opcional)</span>
            <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none" placeholder="cliente@correo.com" />
          </label>

          <label className="md:col-span-2">
            <span className="block mb-2 text-sm font-medium">Dirección domicilio *</span>
            <input value={direccion} onChange={(e) => setDireccion(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none" placeholder="Ingrese dirección de domicilio" required />
          </label>
        </div>

        <button type="submit" disabled={saving} className="mt-8 bg-red-600 hover:bg-red-500 disabled:bg-red-300 text-white px-6 py-3 rounded-xl">
          {saving ? "Guardando..." : "Guardar Cliente"}
        </button>
      </form>
    </div>
  );
}
