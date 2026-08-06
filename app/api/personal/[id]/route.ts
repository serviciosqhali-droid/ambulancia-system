import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : null;
}

function optionalDate(value: unknown) {
  return typeof value === "string" && value
    ? new Date(value)
    : null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const personal = await prisma.personalQhaliKay.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!personal) {
    return NextResponse.json(
      { error: "Personal no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(personal);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const personal = await prisma.personalQhaliKay.update({
    where: {
      id: Number(id),
    },
    data: {
      nombres: body.nombres,
      cargo: optionalString(body.cargo),
      tipoDocumento: optionalString(body.tipoDocumento),
      documento: optionalString(body.documento),
      celular: body.celular,
      cuentaBancaria: optionalString(body.cuentaBancaria),
      cci: optionalString(body.cci),
      banco: optionalString(body.banco),
      yape: optionalString(body.yape),
      fechaNacimiento: optionalDate(body.fechaNacimiento),
      contactoEmergencia: optionalString(body.contactoEmergencia),
      direccion: optionalString(body.direccion),
      cvArchivo: optionalString(body.cvArchivo),
      certificadosArchivo: optionalString(body.certificadosArchivo),
    },
  });

  return NextResponse.json(personal);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.personalQhaliKay.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error eliminando:", error);

    return NextResponse.json(
      {
        error: "No se pudo eliminar",
      },
      {
        status: 500,
      }
    );
  }
}