import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const MAX_PERSONAL_ADICIONAL = 3;

function startOfDayFromInput(value: string | null) {
  const source = value ? new Date(`${value}T00:00:00`) : new Date();
  source.setHours(0, 0, 0, 0);
  return source;
}

function parsePersonalAdicional(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim())
    .slice(0, MAX_PERSONAL_ADICIONAL);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fecha = startOfDayFromInput(searchParams.get("fecha"));

    const tripulaciones = await prisma.tripulacionDiaria.findMany({
      where: { fecha },
      orderBy: { nombre: "asc" },
    });

    return NextResponse.json(
      tripulaciones.map((tripulacion) => ({
        ...tripulacion,
        personalAdicional: tripulacion.personalAdicional
          ? JSON.parse(tripulacion.personalAdicional)
          : [],
      }))
    );
  } catch (error) {
    console.error("Error obteniendo tripulaciones:", error);
    return NextResponse.json(
      { error: "Error al obtener tripulaciones" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const personalAdicional = parsePersonalAdicional(body.personalAdicional);
    const totalIntegrantes = [
      body.piloto,
      body.licenciado,
      body.medico,
      ...personalAdicional,
    ].filter((item) => typeof item === "string" && item.trim()).length;

    if (
      !body.fecha ||
      !body.nombre?.trim() ||
      !body.ambulancia?.trim() ||
      !body.piloto?.trim()
    ) {
      return NextResponse.json(
        { error: "Fecha, nombre, ambulancia y piloto son obligatorios." },
        { status: 400 }
      );
    }

    if (totalIntegrantes > 5) {
      return NextResponse.json(
        { error: "Cada tripulación puede tener máximo 5 integrantes." },
        { status: 400 }
      );
    }

    const tripulacion = await prisma.tripulacionDiaria.create({
      data: {
        fecha: startOfDayFromInput(body.fecha),
        nombre: body.nombre.trim(),
        ambulancia: body.ambulancia.trim(),
        piloto: body.piloto.trim(),
        licenciado: body.licenciado?.trim() || null,
        medico: body.medico?.trim() || null,
        personalAdicional: JSON.stringify(personalAdicional),
        notas: body.notas?.trim() || null,
      },
    });

    return NextResponse.json(
      {
        ...tripulacion,
        personalAdicional,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registrando tripulación:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Ya existe una tripulación con ese nombre para la fecha seleccionada." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Error al guardar la tripulación" },
      { status: 500 }
    );
  }
}
