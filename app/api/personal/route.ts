import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function optionalDate(value: unknown) {
  return typeof value === "string" && value ? new Date(value) : null;
}

export async function GET() {
  try {
    const personal = await prisma.personalQhaliKay.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(personal);
  } catch (error) {
    console.error("Error obteniendo personal:", error);
    return NextResponse.json({ error: "Error al obtener personal" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.nombres?.trim() || !body.celular?.trim()) {
      return NextResponse.json({ error: "Nombre y celular son obligatorios." }, { status: 400 });
    }
    const personal = await prisma.personalQhaliKay.create({
      data: {
        nombres: body.nombres.trim(),
        tipoDocumento: optionalString(body.tipoDocumento),
        documento: optionalString(body.documento),
        celular: body.celular.trim(),
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
    return NextResponse.json(personal, { status: 201 });
  } catch (error) {
    console.error("Error guardando personal:", error);
    return NextResponse.json({ error: "Error al guardar personal" }, { status: 500 });
  }
}
