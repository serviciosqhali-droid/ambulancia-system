import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const MAX_PERSONAL = 5;

function startOfDayFromInput(value: string | null) {
  const source = value ? new Date(`${value}T00:00:00`) : new Date();
  source.setHours(0, 0, 0, 0);
  return source;
}

function parsePersonal(body: Record<string, unknown>) {
  const fromArray = Array.isArray(body.personal)
    ? body.personal
    : [
        body.piloto,
        body.licenciado,
        body.medico,
        ...(Array.isArray(body.personalAdicional) ? body.personalAdicional : []),
      ];

  return fromArray
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim())
    .slice(0, MAX_PERSONAL);
}

function mapPersonalToFields(personal: string[]) {
  return {
    piloto: personal[0] || "",
    licenciado: personal[1] || null,
    medico: personal[2] || null,
    personalAdicional: JSON.stringify(personal.slice(3)),
  };
}

function serializeTripulacion(tripulacion: {
  personalAdicional: string | null;
  piloto: string;
  licenciado: string | null;
  medico: string | null;
  [key: string]: unknown;
}) {
  const personalAdicional = tripulacion.personalAdicional
    ? JSON.parse(tripulacion.personalAdicional)
    : [];
  return {
    ...tripulacion,
    personalAdicional,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fecha = startOfDayFromInput(searchParams.get("fecha"));

    const tripulaciones = await prisma.tripulacionDiaria.findMany({
      where: { fecha },
      orderBy: { nombre: "asc" },
    });

    return NextResponse.json(tripulaciones.map(serializeTripulacion));
  } catch (error) {
    console.error("Error obteniendo tripulaciones:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2021" || error.code === "P2022")
    ) {
      return NextResponse.json(
        {
          error:
            "La tabla de tripulaciones no existe en tu base local. Ejecuta: npx prisma db push y reinicia npm run dev.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: "Error al obtener tripulaciones" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const personal = parsePersonal(body);

    if (!body.fecha || !body.nombre?.trim() || !body.ambulancia?.trim()) {
      return NextResponse.json(
        { error: "Fecha, nombre y ambulancia son obligatorios." },
        { status: 400 }
      );
    }

    if (personal.length === 0) {
      return NextResponse.json(
        { error: "Debes ingresar al menos un nombre de personal." },
        { status: 400 }
      );
    }

    if (personal.length > MAX_PERSONAL) {
      return NextResponse.json(
        { error: "Cada tripulación puede tener máximo 5 integrantes." },
        { status: 400 }
      );
    }

    const fields = mapPersonalToFields(personal);
    const tripulacion = await prisma.tripulacionDiaria.create({
      data: {
        fecha: startOfDayFromInput(body.fecha),
        nombre: body.nombre.trim(),
        ambulancia: body.ambulancia.trim(),
        ...fields,
        notas: body.notas?.trim() || null,
      },
    });

    return NextResponse.json(serializeTripulacion(tripulacion), { status: 201 });
  } catch (error) {
    console.error("Error registrando tripulación:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe una tripulación con ese nombre para la fecha seleccionada." },
        { status: 409 }
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2021" || error.code === "P2022")
    ) {
      return NextResponse.json(
        {
          error:
            "La tabla de tripulaciones no existe en tu base local. Ejecuta: npx prisma db push y reinicia npm run dev.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: "Error al guardar la tripulación" }, { status: 500 });
  }
}
