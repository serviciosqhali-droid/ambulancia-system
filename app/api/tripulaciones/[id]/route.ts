import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> | { id: string } };

const MAX_PERSONAL_ADICIONAL = 2;

function parsePersonalAdicional(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim())
    .slice(0, MAX_PERSONAL_ADICIONAL);
}

function startOfDay(value: string) {
  const date = new Date(`${value}T00:00:00`);
  date.setHours(0, 0, 0, 0);
  return date;
}

async function resolveId(params: RouteContext["params"]) {
  const resolved = "then" in params ? await params : params;
  return Number(resolved.id);
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const id = await resolveId(params);
    const body = await request.json();
    const personalAdicional = parsePersonalAdicional(body.personalAdicional);
    const totalIntegrantes = [body.piloto, body.licenciado, body.medico, ...personalAdicional]
      .filter((item) => typeof item === "string" && item.trim()).length;

    if (Number.isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    if (!body.fecha || !body.nombre?.trim() || !body.ambulancia?.trim() || !body.piloto?.trim() || !body.licenciado?.trim()) {
      return NextResponse.json({ error: "Fecha, nombre, ambulancia, piloto y licenciado son obligatorios." }, { status: 400 });
    }
    if (totalIntegrantes > 5) {
      return NextResponse.json({ error: "Cada tripulación puede tener máximo 5 integrantes." }, { status: 400 });
    }

    const tripulacion = await prisma.tripulacionDiaria.update({
      where: { id },
      data: {
        fecha: startOfDay(body.fecha),
        nombre: body.nombre.trim(),
        ambulancia: body.ambulancia.trim(),
        piloto: body.piloto.trim(),
        licenciado: body.licenciado.trim(),
        medico: body.medico?.trim() || null,
        personalAdicional: JSON.stringify(personalAdicional),
        notas: body.notas?.trim() || null,
      },
    });

    return NextResponse.json({ ...tripulacion, personalAdicional });
  } catch (error) {
    console.error("Error actualizando tripulación:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Tripulación no encontrada" }, { status: 404 });
    }
    return NextResponse.json({ error: "Error al actualizar la tripulación" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const id = await resolveId(params);
    if (Number.isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    await prisma.tripulacionDiaria.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error eliminando tripulación:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Tripulación no encontrada" }, { status: 404 });
    }
    return NextResponse.json({ error: "Error al eliminar la tripulación" }, { status: 500 });
  }
}
