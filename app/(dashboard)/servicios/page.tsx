import prisma from "@/lib/prisma";
import ServiciosList from "@/components/ServiciosList";
import Link from "next/link";
import { Plus } from "lucide-react";

function todayRange() {
  const inicio = new Date();
  inicio.setHours(0, 0, 0, 0);

  const fin = new Date(inicio);
  fin.setDate(fin.getDate() + 1);

  return { inicio, fin };
}

function serviceDateWhere(inicio: Date, fin: Date) {
  return {
    OR: [
      { fechaHora: { gte: inicio, lt: fin } },
      { createdAt: { gte: inicio, lt: fin } },
    ],
  };
}

export default async function ServiciosPage() {
  const { inicio, fin } = todayRange();
  const filtroHoy = serviceDateWhere(inicio, fin);

  const servicios = await prisma.servicio.findMany({
    where: filtroHoy,
    orderBy: {
      createdAt: "desc",
    },
  });

  const serviciosFormateados = servicios.map((s) => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt ? s.updatedAt.toISOString() : null,
    fechaHora: s.fechaHora ? s.fechaHora.toISOString() : null,
    horaSalidaBase: s.horaSalidaBase ? s.horaSalidaBase.toISOString() : null,
    horaLlegadaRecojo: s.horaLlegadaRecojo ? s.horaLlegadaRecojo.toISOString() : null,
    horaInicioTraslado: s.horaInicioTraslado ? s.horaInicioTraslado.toISOString() : null,
    horaLlegadaDestino: s.horaLlegadaDestino ? s.horaLlegadaDestino.toISOString() : null,
    horaTermino: s.horaTermino ? s.horaTermino.toISOString() : null,
    horaSalidaBase2: s.horaSalidaBase2 ? s.horaSalidaBase2.toISOString() : null,
    horaLlegadaRecojo2: s.horaLlegadaRecojo2 ? s.horaLlegadaRecojo2.toISOString() : null,
    horaInicioTraslado2: s.horaInicioTraslado2 ? s.horaInicioTraslado2.toISOString() : null,
    horaLlegadaDestino2: s.horaLlegadaDestino2 ? s.horaLlegadaDestino2.toISOString() : null,
    horaTermino2: s.horaTermino2 ? s.horaTermino2.toISOString() : null,
  }));

  return (
    <>
    <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800">
            Servicios
          </h1>
          <p className="text-gray-500 mt-2">
            Operación diaria: servicios e ingresos contabilizados de hoy.
          </p>
        </div>

        <Link
          href="/nuevo-servicio"
          className="bg-red-600 hover:bg-red-500 text-white px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-red-100 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={20} />
          Nuevo Servicio
        </Link>
      </div>

      <ServiciosList initialServicios={serviciosFormateados} />
    </>
  );
}
