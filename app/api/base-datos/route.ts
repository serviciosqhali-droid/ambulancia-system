import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parseDateRange, serializeServicio, serviceRangeWhere } from "@/lib/base-datos";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = parseDateRange(searchParams);

    if ("error" in range) {
      return NextResponse.json({ error: range.error }, { status: 400 });
    }

    const servicios = await prisma.servicio.findMany({
      where: serviceRangeWhere(range.desde, range.hasta),
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      servicios: servicios.map(serializeServicio),
      total: servicios.length,
    });
  } catch (error) {
    console.error("Error consultando base de datos de servicios:", error);
    return NextResponse.json(
      { error: "Error al consultar la base de datos de servicios." },
      { status: 500 }
    );
  }
}
