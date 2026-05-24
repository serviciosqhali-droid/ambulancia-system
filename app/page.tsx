import DashboardLayout from "@/components/Layout/DashboardLayout";
import StatCard from "@/components/StatCard";

export default function Home() {
  return (
    <DashboardLayout>

      <div className="flex justify-between items-center mb-10">

        <div>
          <h2 className="text-4xl font-bold text-gray-800">
            Dashboard Médico
          </h2>

          <p className="text-gray-500 mt-2">
            Bienvenido al sistema de ambulancias
          </p>
        </div>

        <button className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl shadow">
          Nueva Emergencia
        </button>

      </div>

      <div className="grid grid-cols-4 gap-6">

        <StatCard title="Pacientes" value="120" />
        <StatCard title="Ambulancias" value="8" />
        <StatCard title="Emergencias" value="32" />
        <StatCard title="Conductores" value="15" />

      </div>

    </DashboardLayout>
  );
}