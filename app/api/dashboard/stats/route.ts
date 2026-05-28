import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const totalPacientes = await prisma.paciente.count();
    const totalEmergencias = await prisma.emergencia.count();
    const totalAmbulancias = await prisma.ambulancia.count();
    
    // Obtener fecha de inicio del día de hoy
    const inicioHoy = new Date();
    inicioHoy.setHours(0, 0, 0, 0);

    const serviciosHoy = await prisma.servicio.count({
      where: {
        createdAt: {
          gte: inicioHoy,
        },
      },
    });

    return NextResponse.json({
      pacientes: totalPacientes,
      emergencias: totalEmergencias,
      ambulancias: totalAmbulancias,
      serviciosHoy: serviciosHoy,
    });
  } catch (error) {
    console.error("Error al obtener estadísticas del dashboard:", error);
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}
