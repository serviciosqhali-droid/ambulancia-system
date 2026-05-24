"use client";

import { useState } from "react";

export default function PatientForm({
  onSaved,
}: {
  onSaved: () => void;
}) {

  const [nombres, setNombres] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("DNI");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  async function guardarPaciente() {

    const response = await fetch("/api/pacientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombres,
        tipoDocumento,
        numeroDocumento,
        telefono,
        direccion,
      }),
    });

    const data = await response.json();

    console.log(data);

   onSaved();

    setNombres("");
    setNumeroDocumento("");
    setTelefono("");
    setDireccion("");
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-8">

      <h2 className="text-2xl font-bold mb-6">
        Nuevo Paciente
      </h2>

      <div className="grid grid-cols-2 gap-6">

        <div>
          <label className="block mb-2 text-sm font-medium">
            Nombres
          </label>

          <input
            type="text"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
            placeholder="Ingrese nombres"
          />
        </div>

        <div>

  <label className="block mb-2 text-sm font-medium">
    Tipo Documento
  </label>

  <select
    value={tipoDocumento}
    onChange={(e) => {
    setTipoDocumento(e.target.value);
    setNumeroDocumento("");
    }}
    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
  >
    <option>DNI</option>
    <option>RUC</option>
    <option>Pasaporte</option>
    <option>Carnet de Extranjería</option>
  </select>

</div>

<div>

  <label className="block mb-2 text-sm font-medium">
    Número Documento
  </label>

  <input
    type="text"
    value={numeroDocumento}
    onChange={(e) => {

      let value = e.target.value;

      if (tipoDocumento === "DNI") {
        value = value.replace(/\D/g, "").slice(0, 8);
      }

      if (tipoDocumento === "RUC") {
        value = value.replace(/\D/g, "").slice(0, 11);
      }

      if (tipoDocumento === "Pasaporte") {
        value = value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 9);
      }

      if (tipoDocumento === "Carnet de Extranjería") {
        value = value.slice(0, 12);
      }

      setNumeroDocumento(value);

    }}
    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
    placeholder="Ingrese documento"
  />

</div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Teléfono
          </label>

          <input
            type="text"
            value={telefono}
            onChange={(e) => {
  const value = e.target.value
    .replace(/\D/g, "")
    .slice(0, 9);

  setTelefono(value);
}}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
            placeholder="Ingrese teléfono"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Dirección
          </label>

          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
            placeholder="Ingrese dirección"
          />
        </div>

      </div>

      <button
        onClick={guardarPaciente}
        className="mt-8 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl"
      >
        Guardar Paciente
      </button>

    </div>
  );
}