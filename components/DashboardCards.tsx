"use client";

import {
  Ambulance,
  Users,
  Activity,
  ClipboardList,
} from "lucide-react";

export default function DashboardCards() {

  const cards = [
    {
      title: "Pacientes",
      value: 120,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Emergencias",
      value: 18,
      icon: Activity,
      color: "bg-red-500",
    },
    {
      title: "Ambulancias",
      value: 6,
      icon: Ambulance,
      color: "bg-green-500",
    },
    {
      title: "Servicios Hoy",
      value: 32,
      icon: ClipboardList,
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

      {cards.map((card, index) => {

        const Icon = card.icon;

        return (

          <div
            key={index}
            className="bg-white rounded-2xl shadow p-6 flex items-center justify-between"
          >

            <div>

              <p className="text-gray-500 text-sm">
                {card.title}
              </p>

              <h2 className="text-4xl font-bold mt-2">
                {card.value}
              </h2>

            </div>

            <div
              className={`${card.color} p-4 rounded-2xl text-white`}
            >
              <Icon size={32} />
            </div>

          </div>
        );
      })}

    </div>
  );
}