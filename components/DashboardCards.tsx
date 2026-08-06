"use client";

import { useEffect, useState } from "react";
import {
  Ambulance,
  Users,
  Activity,
  ClipboardList,
} from "lucide-react";

interface DashboardStats {
  pacientes: number;
  emergencias: number;
  ambulancias: number;
  serviciosHoy: number;
}

export default function DashboardCards() {
  const [stats, setStats] = useState<DashboardStats>({
    pacientes: 0,
    emergencias: 0,
    ambulancias: 0,
    serviciosHoy: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Error al cargar estadísticas del dashboard", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const cards = [
    {
      title: "Pacientes Registrados",
      value: stats.pacientes,
      icon: Users,
      color: "bg-blue-500 shadow-blue-100",
      description: "Historial completo",
    },
    {
      title: "Emergencias Activas",
      value: stats.emergencias,
      icon: Activity,
      color: "bg-red-500 shadow-red-100",
      description: "Pendientes o en curso",
    },
    {
      title: "Unidades de Ambulancia",
      value: stats.ambulancias,
      icon: Ambulance,
      color: "bg-green-500 shadow-green-100",
      description: "Flota móvil en sistema",
    },
    {
      title: "Servicios Hoy",
      value: stats.serviciosHoy,
      icon: ClipboardList,
      color: "bg-yellow-500 shadow-yellow-100",
      description: "Traslados y coberturas hoy",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md p-6 flex items-center justify-between transition-all hover:scale-[1.02]"
          >
            <div className="space-y-1">
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                {card.title}
              </p>
              
              {loading ? (
                <div className="h-9 w-16 bg-gray-100 animate-pulse rounded-lg mt-2"></div>
              ) : (
                <h2 className="text-4xl font-black text-gray-800 mt-2">
                  {card.value}
                </h2>
              )}
              
              <p className="text-gray-400 text-xs font-semibold pt-1">
                {card.description}
              </p>
            </div>

            <div
              className={`${card.color} p-4 rounded-2xl text-white shadow-lg`}
            >
              <Icon size={28} />
            </div>
          </div>
        );
      })}
    </div>
  );
}