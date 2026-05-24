"use client";

import { useState } from "react";

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

  async function guardarEmergencia() {

    await fetch("/api/emergencias", {
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

    onSaved();

    setPaciente("");
    setUbicacion("");
    setAmbulancia("");
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-8">

      <h2 className="text-2xl font-bold mb-6">
        Nueva Emergencia
      </h2>

      <div className="grid grid-cols-2 gap-6">

        <input
          type="text"
          placeholder="Paciente"
          value={paciente}
          onChange={(e) => setPaciente(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-3"
        />

        <select
          value={prioridad}
          onChange={(e) => setPrioridad(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-3"
        >
          <option>Alta</option>
          <option>Media</option>
          <option>Baja</option>
        </select>

        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-3"
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
        onClick={guardarEmergencia}
        className="mt-8 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl"
      >
        Registrar Emergencia
      </button>

    </div>
  );
}