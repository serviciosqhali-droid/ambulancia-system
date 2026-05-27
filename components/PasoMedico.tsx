"use client";

import { useState } from "react";

interface Props {
  anteriorPaso: () => void;
  siguientePaso: () => void;
}

export default function PasoMedico({
  anteriorPaso,
  siguientePaso,
}: Props) {

  const [requiereOxigeno, setRequiereOxigeno] =
    useState("No");

  return (

    <div className="bg-white rounded-2xl shadow p-8 mt-8">

      <h2 className="text-2xl font-bold mb-8">
        Información Médica
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>

          <label className="block mb-2 font-medium">
            Diagnóstico
          </label>

          <input
            type="text"
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
            placeholder="Diagnóstico del paciente"
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Enfermedad de Fondo
          </label>

          <input
            type="text"
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
            placeholder="Hipertensión, diabetes..."
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Síntomas
          </label>

          <textarea
            className="w-full border border-gray-300 rounded-xl px-4 py-3 h-28"
            placeholder="Síntomas actuales"
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Tratamiento Actual
          </label>

          <textarea
            className="w-full border border-gray-300 rounded-xl px-4 py-3 h-28"
            placeholder="Medicamentos o tratamiento"
          />

        </div>

      </div>

      <div className="mt-8">

        <label className="block mb-3 font-medium">
          ¿Requiere Oxígeno?
        </label>

        <select
          value={requiereOxigeno}
          onChange={(e) =>
            setRequiereOxigeno(e.target.value)
          }
          className="border border-gray-300 rounded-xl px-4 py-3"
        >
          <option>No</option>
          <option>Si</option>
        </select>

      </div>

      {requiereOxigeno === "Si" && (

        <div className="mt-6">

          <label className="block mb-2 font-medium">
            Litros de Oxígeno
          </label>

          <input
            type="number"
            placeholder="Ej: 3"
            className="border border-gray-300 rounded-xl px-4 py-3 w-full md:w-64"
          />

        </div>

      )}

      <div className="flex justify-between mt-10">

        <button
          onClick={anteriorPaso}
          className="border border-gray-300 px-6 py-3 rounded-xl"
        >
          ← Atrás
        </button>

        <button
          onClick={siguientePaso}
          className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl"
        >
          Continuar →
        </button>

      </div>

    </div>
  );
}