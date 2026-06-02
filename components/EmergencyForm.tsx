"use client";

import { type FormEvent, useState } from "react";

export default function EmergencyForm({
  onSaved,
}: {
  onSaved: () => void;
}) {
  const [paciente, setPaciente] = useState("");
  const [prioridad, setPrioridad] = useState("Alta");
  const [estado, setEstado] = useState("Pendiente");
  const [ubicacion, setUbicacion] = useState("");
  const [ambulancia, setAmbulancia] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function guardarEmergencia(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const response = await fetch("/api/emergencias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paciente,
          prioridad,
          estado,
          ubicacion,
          ambulancia,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "No se pudo registrar la emergencia.");
        return;
      }

      onSaved();
      setPaciente("");
      setUbicacion("");
      setAmbulancia("");
    } catch (err) {
      console.error("Error de conexión al guardar emergencia", err);
      setError("Error de conexión. Intente nuevamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-8">

      <h2 className="text-2xl font-bold mb-6">
        Nueva Emergencia
      </h2>

      <form onSubmit={guardarEmergencia}>
        {error && (
          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">

        <input
          type="text"
          placeholder="Paciente"
          value={paciente}
          onChange={(e) => setPaciente(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-3"
          required
        />

        <select
          value={prioridad}
          onChange={(e) => setPrioridad(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-3"
          required
        >
          <option>Alta</option>
          <option>Media</option>
          <option>Baja</option>
        </select>

        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-3"
          required
        >
          <option>Pendiente</option>
          <option>En camino</option>
          <option>Atendido</option>
        </select>

        <input
          type="text"
          placeholder="Ubicación"
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-3"
          required
        />

        <input
          type="text"
          placeholder="Ambulancia"
          value={ambulancia}
          onChange={(e) => setAmbulancia(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-3"
        />

        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-8 bg-red-600 hover:bg-red-500 disabled:bg-red-300 text-white px-6 py-3 rounded-xl"
        >
          {saving ? "Registrando..." : "Registrar Emergencia"}
        </button>
      </form>

    </div>
  );
}