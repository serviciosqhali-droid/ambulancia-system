import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const emergencias = await prisma.emergencia.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(emergencias);
  } catch (error) {
    console.error("Error obteniendo emergencias:", error);
    return NextResponse.json(
      { error: "Error al obtener emergencias" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      !body.paciente?.trim() ||
      !body.prioridad?.trim() ||
      !body.estado?.trim() ||
      !body.ubicacion?.trim()
    ) {
      return NextResponse.json(
        { error: "Paciente, prioridad, estado y ubicación son obligatorios." },
        { status: 400 }
      );
    }

    const nuevaEmergencia = await prisma.emergencia.create({
      data: {
        paciente: body.paciente.trim(),
        prioridad: body.prioridad.trim(),
        estado: body.estado.trim(),
        ubicacion: body.ubicacion.trim(),
        ambulancia: body.ambulancia?.trim() || "Por asignar",
      },
    });

    return NextResponse.json(nuevaEmergencia, { status: 201 });
  } catch (error) {
    console.error("Error registrando emergencia:", error);
    return NextResponse.json(
      { error: "Error al guardar la emergencia" },
      { status: 500 }
    );
  }
}