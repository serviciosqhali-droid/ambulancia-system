"use client";

import { useEffect, useState } from "react";

interface Paciente {
  id: number;
  nombres: string;
  dni: string;
  telefono: string;
  direccion: string;
}

export default function PatientTable({
  refresh,
}: {
  refresh: boolean;
}) {

  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  async function obtenerPacientes() {
    const response = await fetch("/api/pacientes");

    const data = await response.json();

    setPacientes(data);
  }

  useEffect(() => {
    obtenerPacientes();
}, [refresh]);

  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-8">

      <div className="flex justify-between items-center mb-6">

        <input
          type="text"
          placeholder="Buscar paciente..."
          className="border border-gray-300 rounded-xl px-4 py-2 w-80 outline-none"
        />

        <button className="bg-red-600 hover:bg-red-500 text-white px-5 py-2 rounded-xl">
          + Nuevo Paciente
        </button>

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
              DNI
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

          {pacientes.map((paciente) => (
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
                {paciente.dni}
              </td>

              <td>
                {paciente.telefono}
              </td>

              <td>
                {paciente.direccion}
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}