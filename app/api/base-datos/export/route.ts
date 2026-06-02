import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parseDateRange, serializeServicio, serviceRangeWhere } from "@/lib/base-datos";

const columns = [
  ["codigo", "Código"],
  ["paciente", "Paciente / Cliente"],
  ["tipoServicio", "Tipo"],
  ["estado", "Estado"],
  ["prioridad", "Prioridad"],
  ["origen", "Origen"],
  ["destinos", "Destinos"],
  ["direccionEvento", "Dirección evento"],
  ["contacto", "Contacto"],
  ["telefono", "Teléfono"],
  ["email", "Email"],
  ["ambulancia", "Ambulancia"],
  ["fechaProgramada", "Fecha programada"],
  ["fechaRegistro", "Fecha registro"],
  ["costoBase", "Costo base"],
  ["costoEspera", "Costo espera"],
  ["costoCamilla", "Costo camilla"],
  ["descuento", "Descuento"],
  ["total", "Total"],
  ["metodoPago", "Método pago"],
  ["comprobanteTipo", "Tipo comprobante"],
  ["comprobanteNumero", "Número comprobante"],
  ["diagnostico", "Diagnóstico"],
  ["sintomas", "Síntomas"],
  ["enfermedadFondo", "Enfermedad de fondo"],
  ["tratamientoActual", "Tratamiento actual"],
  ["requiereOxigeno", "Requiere oxígeno"],
  ["litrosOxigeno", "Litros oxígeno"],
  ["observaciones", "Observaciones"],
  ["notas", "Notas"],
] as const;

function csvCell(value: unknown) {
  const text = String(value ?? "").replace(/"/g, '""');
  return `"${text}"`;
}

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

    const rows = servicios.map(serializeServicio);
    const header = columns.map(([, label]) => csvCell(label)).join(";");
    const body = rows.map((row) => columns.map(([key]) => csvCell(row[key])).join(";")).join("\n");
    const csv = `\uFEFF${header}\n${body}`;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="base-datos-servicios.csv"',
      },
    });
  } catch (error) {
    console.error("Error exportando base de datos de servicios:", error);
    return NextResponse.json(
      { error: "Error al exportar la base de datos de servicios." },
      { status: 500 }
    );
  }
}
