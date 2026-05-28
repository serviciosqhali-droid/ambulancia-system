import prisma from "@/lib/prisma";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import ServiciosList from "@/components/ServiciosList";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function ServiciosPage() {
  // 1. Obtener estadísticas dinámicas de la base de datos
  const totalServicios = await prisma.servicio.count();
  
  const enCurso = await prisma.servicio.count({
    where: {
      estado: "En Curso",
    },
  });

  const traslados = await prisma.servicio.count({
    where: {
      tipoServicio: "Traslado",
    },
  });

  const ingresosResult = await prisma.servicio.aggregate({
    where: {
      estado: "Completado",
    },
    _sum: {
      costo: true,
    },
  });
  
  const ingresos = ingresosResult._sum.costo || 0;

  // 2. Obtener todos los servicios ordenados por fecha de creación descendente
  const servicios = await prisma.servicio.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // Mapeamos los servicios a un formato plano compatible para pasar al Client Component
  const serviciosFormateados = servicios.map((s) => ({
    ...s,
    // Convertir fechas a string de forma segura para evitar problemas de serialización en Server Components
    createdAt: s.createdAt.toISOString(),
    fechaHora: s.fechaHora ? s.fechaHora.toISOString() : null,
  }));

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800">
            Servicios
          </h1>
          <p className="text-gray-500 mt-2">
            Gestión y despacho integral de traslados y alquileres.
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

      {/* Tarjetas de Resumen Operativo de Servicios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-500 text-sm font-semibold">Total Servicios</p>
          <h2 className="text-4xl font-black mt-4 text-gray-800">
            {totalServicios}
          </h2>
          <p className="text-xs text-gray-400 mt-2 font-medium">Registrados en historial</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-500 text-sm font-semibold">En Curso</p>
          <h2 className="text-4xl font-black mt-4 text-orange-500">
            {enCurso}
          </h2>
          <p className="text-xs text-gray-400 mt-2 font-medium">Activos en este momento</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-500 text-sm font-semibold">Traslados</p>
          <h2 className="text-4xl font-black mt-4 text-blue-600">
            {traslados}
          </h2>
          <p className="text-xs text-gray-400 mt-2 font-medium">Traslados asistidos</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-gray-500 text-sm font-semibold">Ingresos Totales</p>
          <h2 className="text-3xl font-black mt-4 text-green-600">
            S/. {ingresos.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <p className="text-xs text-gray-400 mt-2 font-medium">Servicios completados</p>
        </div>
      </div>

      {/* Renderizado de la lista interactiva de Servicios */}
      <ServiciosList initialServicios={serviciosFormateados as any} />
    </DashboardLayout>
  );
}