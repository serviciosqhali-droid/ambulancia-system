import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> | { id: string } };

async function resolveId(params: RouteContext["params"]) {
  const resolved = "then" in params ? await params : params;
  return Number(resolved.id);
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const id = await resolveId(params);
    const body = await request.json();
    const numeroDocumento = body.numeroDocumento?.trim() || null;
    const tipoDocumento = body.tipoDocumento?.trim() || null;

    if (Number.isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    if (!body.nombres?.trim() || !body.telefono?.trim() || !body.direccion?.trim()) {
      return NextResponse.json({ error: "Nombres, teléfono y dirección son obligatorios." }, { status: 400 });
    }

    const cliente = await prisma.paciente.update({
      where: { id },
      data: {
        nombres: body.nombres.trim(),
        tipoDocumento,
        numeroDocumento,
        telefono: body.telefono.trim(),
        nombreContacto: body.nombreContacto?.trim() || null,
        direccion: body.direccion.trim(),
        correo: body.correo?.trim() || null,
      },
    });

    return NextResponse.json(cliente);
  } catch (error) {
    console.error("Error actualizando cliente:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Ya existe un cliente con ese documento." }, { status: 409 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Cliente no encontrado." }, { status: 404 });
    }
    return NextResponse.json({ error: "Error al actualizar cliente." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const id = await resolveId(params);
    if (Number.isNaN(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    await prisma.paciente.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Cliente anulado con éxito" });
  } catch (error) {
    console.error("Error anulando cliente:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ error: "Cliente no encontrado." }, { status: 404 });
    }
    return NextResponse.json({ error: "Error al anular cliente." }, { status: 500 });
  }
}
