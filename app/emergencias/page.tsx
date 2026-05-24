"use client";

import { useState } from "react";

import DashboardLayout from "@/components/Layout/DashboardLayout";
import EmergencyForm from "@/components/EmergencyForm";
import EmergencyTable from "@/components/EmergencyTable";

export default function EmergenciasPage() {

  const [refresh, setRefresh] = useState(false);

  function actualizarTabla() {
    setRefresh(!refresh);
  }

  return (
    <DashboardLayout>

      <div>

        <h1 className="text-4xl font-bold text-gray-800">
          Emergencias
        </h1>

        <p className="text-gray-500 mt-2">
          Gestión de emergencias médicas
        </p>

      </div>

      <EmergencyForm onSaved={actualizarTabla} />

      <EmergencyTable refresh={refresh} />

    </DashboardLayout>
  );
}