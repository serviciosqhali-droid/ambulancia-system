import Link from "next/link";

import {
  Ambulance,
  Users,
  Siren,
  Truck,
  BriefcaseMedical,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-72 bg-red-700 text-white p-6 min-h-screen">

      <div className="flex items-center gap-3 mb-10">
        <Ambulance size={40} />

        <div>
          <h1 className="text-2xl font-bold">
            Qhali Kay
          </h1>

          <p className="text-sm text-red-100">
            Sistema Médico
          </p>
        </div>
      </div>

      <nav className="space-y-3">

        <Link
          href="/"
          className="w-full flex items-center gap-3 bg-red-600 hover:bg-red-500 p-3 rounded-xl transition"
        >
          <Siren />
          Dashboard
        </Link>

        <Link
          href="/pacientes"
          className="w-full flex items-center gap-3 hover:bg-red-600 p-3 rounded-xl transition"
        >
          <Users />
          Pacientes
        </Link>

        <Link href="/servicios" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-100" > 
        <BriefcaseMedical size={20} /> 
        Servicios 
        </Link>

        <Link
          href="/ambulancias"
          className="w-full flex items-center gap-3 hover:bg-red-600 p-3 rounded-xl transition"
        >
          <Truck />
          Ambulancias
        </Link>

        <Link
          href="/emergencias"
          className="w-full flex items-center gap-3 hover:bg-red-600 p-3 rounded-xl transition"
        >
          <Ambulance />
          Emergencias
        </Link>

      </nav>

    </aside>
  );
}