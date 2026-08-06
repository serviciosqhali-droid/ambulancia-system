import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function optionalDate(value: unknown) {
  return typeof value === "string" && value ? new Date(value) : null;
}

function optionalNumber(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const resolvedParams = "then" in params ? await params : params;
    const id = Number(resolvedParams.id);

    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const servicio = await prisma.servicio.findUnique({
      where: { id },
    });

    if (!servicio) {
      return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 });
    }

    return NextResponse.json(servicio);
  } catch (error) {
    console.error("Error obteniendo servicio:", error);
    return NextResponse.json(
      { error: "Error al obtener el servicio" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const resolvedParams = "then" in params ? await params : params;
    const id = Number(resolvedParams.id);
    const body = await request.json();

    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const servicioActual = await prisma.servicio.findUnique({
      where: { id },
    });

    if (!servicioActual) {
      return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 });
    }

    const destinos = Array.isArray(body.destinos)
      ? body.destinos.filter((destino: unknown) => typeof destino === "string" && destino.trim())
      : undefined;

    const nuevoEstado = optionalString(body.estado);
    const nuevaAmbulancia = optionalString(body.ambulancia);
    const data: Prisma.ServicioUpdateInput = {
      paciente: optionalString(body.paciente) ?? servicioActual.paciente,
      edad: optionalNumber(body.edad),
      peso: optionalNumber(body.peso),
      tipoServicio: optionalString(body.tipoServicio) ?? servicioActual.tipoServicio,
      origen: optionalString(body.origen) ?? servicioActual.origen,
      referencia: optionalString(body.referencia),
      destinos: destinos ? JSON.stringify(destinos) : servicioActual.destinos,
      esIdaYVuelta: Boolean(body.esIdaYVuelta),
      diagnostico: optionalString(body.diagnostico),
      enfermedadFondo: optionalString(body.enfermedadFondo),
      sintomas: optionalString(body.sintomas),
      tratamientoActual: optionalString(body.tratamientoActual),
      requiereOxigeno: optionalString(body.requiereOxigeno) ?? "No",
      litrosOxigeno: optionalNumber(body.litrosOxigeno),
      prioridad: optionalString(body.prioridad),
      ambulancia: nuevaAmbulancia,
      observaciones: optionalString(body.observaciones),
      contacto: optionalString(body.contacto),
      telefono: optionalString(body.telefono),
      email: optionalString(body.email),
      costo: optionalNumber(body.costo),
      metodoPago: optionalString(body.metodoPago),
      estado: nuevoEstado,
      fechaHora: optionalDate(body.fechaHora),
      comprobanteTipo: optionalString(body.comprobanteTipo),
      comprobanteNumero: optionalString(body.comprobanteNumero),
      direccionEvento: optionalString(body.direccionEvento),
      horaSalidaBase: optionalDate(body.horaSalidaBase),
      horaLlegadaRecojo: optionalDate(body.horaLlegadaRecojo),
      horaInicioTraslado: optionalDate(body.horaInicioTraslado),
      horaLlegadaDestino: optionalDate(body.horaLlegadaDestino),
      horaTermino: optionalDate(body.horaTermino),
      horaSalidaBase2: optionalDate(body.horaSalidaBase2),
      horaLlegadaRecojo2: optionalDate(body.horaLlegadaRecojo2),
      horaInicioTraslado2: optionalDate(body.horaInicioTraslado2),
      horaLlegadaDestino2: optionalDate(body.horaLlegadaDestino2),
      horaTermino2: optionalDate(body.horaTermino2),
      minutosEspera: optionalNumber(body.minutosEspera) ?? 0,
      costoEspera: optionalNumber(body.costoEspera) ?? 0,
      descuento: optionalNumber(body.descuento) ?? 0,
      costoOxigeno: optionalNumber(body.costoOxigeno) ?? 0,
      costoDestinoAdicional: optionalNumber(body.costoDestinoAdicional) ?? 0,
      alquilerCamilla: Boolean(body.alquilerCamilla),
      camillaHoras: optionalNumber(body.camillaHoras),
      costoCamilla: optionalNumber(body.costoCamilla) ?? 0,
      notas: optionalString(body.notas),
    };

    const servicioActualizado = await prisma.servicio.update({
      where: { id },
      data,
    });

    if (servicioActual.ambulancia && servicioActual.ambulancia !== nuevaAmbulancia) {
      await prisma.ambulancia.updateMany({
        where: { placa: servicioActual.ambulancia },
        data: { estado: "Disponible" },
      });
    }

    const nuevoEstadoAmbulancia =
      nuevoEstado === "En Curso"
        ? "En Servicio"
        : nuevoEstado === "Completado" || nuevoEstado === "Cancelado"
          ? "Disponible"
          : null;

    if (nuevaAmbulancia && nuevoEstadoAmbulancia) {
      await prisma.ambulancia.updateMany({
        where: { placa: nuevaAmbulancia },
        data: { estado: nuevoEstadoAmbulancia },
      });
    }

    return NextResponse.json(servicioActualizado);
  } catch (error) {
    console.error("Error actualizando servicio:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Error al actualizar el servicio" },
      { status: 500 }
    );
  }
}
