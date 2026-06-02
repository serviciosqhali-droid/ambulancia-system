import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const pacientes = await prisma.paciente.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(pacientes);
  } catch (error) {
    console.error("Error obteniendo clientes:", error);
    return NextResponse.json({ error: "Error al obtener clientes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const numeroDocumento = body.numeroDocumento?.trim() || null;
    const tipoDocumento = body.tipoDocumento?.trim() || null;

    if (!body.nombres?.trim() || !body.telefono?.trim() || !body.direccion?.trim()) {
      return NextResponse.json(
        { error: "Nombres y apellidos, teléfono de contacto y dirección domicilio son obligatorios." },
        { status: 400 }
      );
    }

    if (numeroDocumento && !tipoDocumento) {
      return NextResponse.json(
        { error: "Seleccione el tipo de documento para registrar el número." },
        { status: 400 }
      );
    }

    const nuevoPaciente = await prisma.paciente.create({
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

    return NextResponse.json(nuevoPaciente, { status: 201 });
  } catch (error) {
    console.error("Error registrando cliente:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Ya existe un cliente registrado con ese documento." }, { status: 409 });
    }

    return NextResponse.json({ error: "Error al guardar el cliente" }, { status: 500 });
  }
}
