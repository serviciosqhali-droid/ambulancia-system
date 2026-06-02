import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const pacientes = await prisma.paciente.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(pacientes);
  } catch (error) {
    console.error("Error obteniendo pacientes:", error);
    return NextResponse.json(
      { error: "Error al obtener pacientes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      !body.nombres?.trim() ||
      !body.tipoDocumento?.trim() ||
      !body.numeroDocumento?.trim() ||
      !body.telefono?.trim() ||
      !body.direccion?.trim()
    ) {
      return NextResponse.json(
        { error: "Todos los campos del paciente son obligatorios." },
        { status: 400 }
      );
    }

    const nuevoPaciente = await prisma.paciente.create({
      data: {
        nombres: body.nombres.trim(),
        tipoDocumento: body.tipoDocumento.trim(),
        numeroDocumento: body.numeroDocumento.trim(),
        telefono: body.telefono.trim(),
        direccion: body.direccion.trim(),
      },
    });

    return NextResponse.json(nuevoPaciente, { status: 201 });
  } catch (error) {
    console.error("Error registrando paciente:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Ya existe un paciente registrado con ese documento." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Error al guardar el paciente" },
      { status: 500 }
    );
  }
}