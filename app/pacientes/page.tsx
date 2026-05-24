"use client";

import { useState } from "react";

import DashboardLayout from "@/components/Layout/DashboardLayout";
import PatientTable from "@/components/PatientTable";
import PatientForm from "@/components/PatientForm";

export default function PacientesPage() {

  const [refresh, setRefresh] = useState(false);

  function actualizarTabla() {
    setRefresh(!refresh);
  }

  return (
    <DashboardLayout>

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Pacientes
          </h1>

          <p className="text-gray-500 mt-2">
            Gestión de pacientes del sistema
          </p>
        </div>

      </div>

      <PatientForm onSaved={actualizarTabla} />

      <PatientTable refresh={refresh} />

    </DashboardLayout>
  );
}