"use client";

import { useEffect, useState } from "react";

interface Paciente {
  id: number;
  nombres: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
  direccion: string;
}

export default function PatientTable({
  refresh,
}: {
  refresh: boolean;
}) {

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    fetch("/api/pacientes")
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo cargar pacientes");
        }
        return response.json();
      })
      .then((data: Paciente[]) => {
        if (!ignore) {
          setPacientes(data);
          setError("");
        }
      })
      .catch((err) => {
        console.error("Error al obtener pacientes", err);
        if (!ignore) {
          setError("No se pudo cargar la lista de pacientes.");
        }
      });

    return () => {
      ignore = true;
    };
  }, [refresh]);

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const term = searchTerm.toLowerCase();
    return (
      paciente.nombres.toLowerCase().includes(term) ||
      paciente.numeroDocumento.toLowerCase().includes(term) ||
      paciente.telefono.toLowerCase().includes(term) ||
      paciente.direccion.toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-8">

      <div className="flex justify-between items-center mb-6">

        <input
          type="text"
          placeholder="Buscar paciente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 w-80 outline-none"
        />

        <span className="text-sm font-medium text-gray-400">
          {pacientesFiltrados.length} pacientes
        </span>

      </div>

      <table className="w-full">

        <thead>
          <tr className="text-left border-b">

            <th className="py-3">
              ID
            </th>

            <th>
              Nombres
            </th>

            <th>
              Documento
            </th>

            <th>
              Teléfono
            </th>

            <th>
              Dirección
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
          ) : pacientesFiltrados.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-8 text-center text-gray-400">
                No se encontraron pacientes.
              </td>
            </tr>
          ) : (
          pacientesFiltrados.map((paciente) => (
            <tr
              key={paciente.id}
              className="border-b hover:bg-gray-50"
            >

              <td className="py-4">
                {paciente.id}
              </td>

              <td>
                {paciente.nombres}
              </td>

              <td>
                {paciente.tipoDocumento} {paciente.numeroDocumento}
              </td>

              <td>
                {paciente.telefono}
              </td>

              <td>
                {paciente.direccion}
              </td>

            </tr>
          )))}

        </tbody>

      </table>

    </div>
  );
}