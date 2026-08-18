import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

function hasOwn(body: Record<string, unknown>, key: string) {
  return Object.prototype.hasOwnProperty.call(body, key);
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function optionalDate(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function optionalNumber(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function optionalBoolean(value: unknown, fallback: boolean) {
  if (typeof value === "boolean") return value;
  if (value === null || value === undefined || value === "") return fallback;
  return Boolean(value);
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
    const body = (await request.json()) as Record<string, unknown>;

    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const servicioActual = await prisma.servicio.findUnique({
      where: { id },
    });

    if (!servicioActual) {
      return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 });
    }

    const data: Prisma.ServicioUpdateInput = {};

    if (hasOwn(body, "paciente")) {
      data.paciente = optionalString(body.paciente) ?? servicioActual.paciente;
    }
    if (hasOwn(body, "edad")) data.edad = optionalNumber(body.edad);
    if (hasOwn(body, "peso")) data.peso = optionalNumber(body.peso);
    if (hasOwn(body, "tipoServicio")) {
      data.tipoServicio = optionalString(body.tipoServicio) ?? servicioActual.tipoServicio;
    }
    if (hasOwn(body, "origen")) {
      data.origen = optionalString(body.origen) ?? servicioActual.origen;
    }
    if (hasOwn(body, "referencia")) data.referencia = optionalString(body.referencia);
    if (hasOwn(body, "destinos")) {
      const destinos = Array.isArray(body.destinos)
        ? body.destinos.filter((destino): destino is string => typeof destino === "string" && Boolean(destino.trim()))
        : null;
      if (destinos) {
        data.destinos = JSON.stringify(destinos);
      }
    }
    if (hasOwn(body, "esIdaYVuelta")) {
      data.esIdaYVuelta = optionalBoolean(body.esIdaYVuelta, false);
    }
    if (hasOwn(body, "diagnostico")) data.diagnostico = optionalString(body.diagnostico);
    if (hasOwn(body, "enfermedadFondo")) data.enfermedadFondo = optionalString(body.enfermedadFondo);
    if (hasOwn(body, "sintomas")) data.sintomas = optionalString(body.sintomas);
    if (hasOwn(body, "tratamientoActual")) data.tratamientoActual = optionalString(body.tratamientoActual);
    if (hasOwn(body, "requiereOxigeno")) {
      data.requiereOxigeno = optionalString(body.requiereOxigeno) ?? "No";
    }
    if (hasOwn(body, "litrosOxigeno")) data.litrosOxigeno = optionalNumber(body.litrosOxigeno);
    if (hasOwn(body, "prioridad")) data.prioridad = optionalString(body.prioridad);
    if (hasOwn(body, "ambulancia")) data.ambulancia = optionalString(body.ambulancia);
    if (hasOwn(body, "observaciones")) data.observaciones = optionalString(body.observaciones);
    if (hasOwn(body, "contacto")) data.contacto = optionalString(body.contacto);
    if (hasOwn(body, "telefono")) data.telefono = optionalString(body.telefono);
    if (hasOwn(body, "email")) data.email = optionalString(body.email);
    if (hasOwn(body, "costo")) data.costo = optionalNumber(body.costo);
    if (hasOwn(body, "metodoPago")) data.metodoPago = optionalString(body.metodoPago);
    if (hasOwn(body, "estado")) data.estado = optionalString(body.estado);
    if (hasOwn(body, "fechaHora")) data.fechaHora = optionalDate(body.fechaHora);
    if (hasOwn(body, "comprobanteTipo")) data.comprobanteTipo = optionalString(body.comprobanteTipo);
    if (hasOwn(body, "comprobanteNumero")) data.comprobanteNumero = optionalString(body.comprobanteNumero);
    if (hasOwn(body, "direccionEvento")) data.direccionEvento = optionalString(body.direccionEvento);
    if (hasOwn(body, "horaSalidaBase")) data.horaSalidaBase = optionalDate(body.horaSalidaBase);
    if (hasOwn(body, "horaLlegadaRecojo")) data.horaLlegadaRecojo = optionalDate(body.horaLlegadaRecojo);
    if (hasOwn(body, "horaInicioTraslado")) data.horaInicioTraslado = optionalDate(body.horaInicioTraslado);
    if (hasOwn(body, "horaLlegadaDestino")) data.horaLlegadaDestino = optionalDate(body.horaLlegadaDestino);
    if (hasOwn(body, "horaTermino")) data.horaTermino = optionalDate(body.horaTermino);
    if (hasOwn(body, "horaSalidaBase2")) data.horaSalidaBase2 = optionalDate(body.horaSalidaBase2);
    if (hasOwn(body, "horaLlegadaRecojo2")) data.horaLlegadaRecojo2 = optionalDate(body.horaLlegadaRecojo2);
    if (hasOwn(body, "horaInicioTraslado2")) data.horaInicioTraslado2 = optionalDate(body.horaInicioTraslado2);
    if (hasOwn(body, "horaLlegadaDestino2")) data.horaLlegadaDestino2 = optionalDate(body.horaLlegadaDestino2);
    if (hasOwn(body, "horaTermino2")) data.horaTermino2 = optionalDate(body.horaTermino2);
    if (hasOwn(body, "trasladosExtra")) data.trasladosExtra = optionalString(body.trasladosExtra);
    if (hasOwn(body, "minutosEspera")) data.minutosEspera = optionalNumber(body.minutosEspera) ?? 0;
    if (hasOwn(body, "costoEspera")) data.costoEspera = optionalNumber(body.costoEspera) ?? 0;
    if (hasOwn(body, "descuento")) data.descuento = optionalNumber(body.descuento) ?? 0;
    if (hasOwn(body, "costoOxigeno")) data.costoOxigeno = optionalNumber(body.costoOxigeno) ?? 0;
    if (hasOwn(body, "costoDestinoAdicional")) {
      data.costoDestinoAdicional = optionalNumber(body.costoDestinoAdicional) ?? 0;
    }
    if (hasOwn(body, "alquilerCamilla")) {
      data.alquilerCamilla = optionalBoolean(body.alquilerCamilla, false);
    }
    if (hasOwn(body, "camillaHoras")) data.camillaHoras = optionalNumber(body.camillaHoras);
    if (hasOwn(body, "costoCamilla")) data.costoCamilla = optionalNumber(body.costoCamilla) ?? 0;
    if (hasOwn(body, "notas")) data.notas = optionalString(body.notas);

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No hay datos para actualizar" }, { status: 400 });
    }

    const servicioActualizado = await prisma.servicio.update({
      where: { id },
      data,
    });

    const nuevaAmbulancia = hasOwn(body, "ambulancia")
      ? optionalString(body.ambulancia)
      : servicioActual.ambulancia;
    const nuevoEstado = hasOwn(body, "estado")
      ? optionalString(body.estado)
      : servicioActual.estado;

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
