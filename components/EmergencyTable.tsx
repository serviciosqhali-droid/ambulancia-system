"use client";

import { useEffect, useState } from "react";

interface Emergencia {
  id: number;
  paciente: string;
  prioridad: string;
  estado: string;
  ubicacion: string;
  ambulancia: string;
}

export default function EmergencyTable({
  refresh,
}: {
  refresh: boolean;
}) {

  const [emergencias, setEmergencias] = useState<Emergencia[]>([]);

  async function obtenerEmergencias() {

    const response = await fetch("/api/emergencias");

    const data = await response.json();

    setEmergencias(data);
  }

  useEffect(() => {
    obtenerEmergencias();
  }, [refresh]);

  function colorPrioridad(prioridad: string) {

    if (prioridad === "Alta") {
      return "bg-red-100 text-red-700";
    }

    if (prioridad === "Media") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-green-100 text-green-700";
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-8">

      <h2 className="text-2xl font-bold mb-6">
        Emergencias Registradas
      </h2>

      <table className="w-full">

        <thead>

          <tr className="border-b text-left">

            <th className="py-3">
              Paciente
            </th>

            <th>
              Prioridad
            </th>

            <th>
              Estado
            </th>

            <th>
              Ubicación
            </th>

            <th>
              Ambulancia
            </th>

          </tr>

        </thead>

        <tbody>

          {emergencias.map((emergencia) => (

            <tr
              key={emergencia.id}
              className="border-b hover:bg-gray-50"
            >

              <td className="py-4">
                {emergencia.paciente}
              </td>

              <td>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${colorPrioridad(emergencia.prioridad)}`}
                >
                  {emergencia.prioridad}
                </span>

              </td>

              <td>
                {emergencia.estado}
              </td>

              <td>
                {emergencia.ubicacion}
              </td>

              <td>
                {emergencia.ambulancia}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}