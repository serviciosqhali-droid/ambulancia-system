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
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    fetch("/api/emergencias")
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo cargar emergencias");
        }
        return response.json();
      })
      .then((data: Emergencia[]) => {
        if (!ignore) {
          setEmergencias(data);
          setError("");
        }
      })
      .catch((err) => {
        console.error("Error al obtener emergencias", err);
        if (!ignore) {
          setError("No se pudo cargar la lista de emergencias.");
        }
      });

    return () => {
      ignore = true;
    };
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

          {error ? (
            <tr>
              <td colSpan={5} className="py-8 text-center text-red-600">
                {error}
              </td>
            </tr>
          ) : emergencias.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-8 text-center text-gray-400">
                No se encontraron emergencias.
              </td>
            </tr>
          ) : (
          emergencias.map((emergencia) => (

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

          )))}

        </tbody>

      </table>

    </div>
  );
}