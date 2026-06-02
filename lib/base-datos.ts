import { Prisma, type Servicio } from "@prisma/client";

export const MAX_RANGE_DAYS = 366;

export function defaultDateRange() {
  const hasta = new Date();
  hasta.setHours(23, 59, 59, 999);

  const desde = new Date(hasta);
  desde.setDate(desde.getDate() - 30);
  desde.setHours(0, 0, 0, 0);

  return { desde, hasta };
}

export function parseDateRange(searchParams: URLSearchParams) {
  const defaults = defaultDateRange();
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const desde = from ? new Date(`${from}T00:00:00`) : defaults.desde;
  const hasta = to ? new Date(`${to}T23:59:59.999`) : defaults.hasta;

  if (Number.isNaN(desde.getTime()) || Number.isNaN(hasta.getTime())) {
    return { error: "Rango de fechas inválido." } as const;
  }

  if (desde > hasta) {
    return { error: "La fecha inicial no puede ser mayor que la fecha final." } as const;
  }

  const diffDays = Math.ceil((hasta.getTime() - desde.getTime()) / 86400000);
  if (diffDays > MAX_RANGE_DAYS) {
    return { error: "El rango máximo permitido para exportar o consultar es de 1 año." } as const;
  }

  return { desde, hasta } as const;
}

export function serviceRangeWhere(desde: Date, hasta: Date): Prisma.ServicioWhereInput {
  return {
    OR: [
      { fechaHora: { gte: desde, lte: hasta } },
      { fechaHora: null, createdAt: { gte: desde, lte: hasta } },
    ],
  };
}

export type ServicioForExport = Servicio;

export function totalServicio(servicio: {
  costo: number | null;
  costoEspera: number | null;
  costoCamilla: number | null;
  descuento: number | null;
}) {
  return (servicio.costo || 0) + (servicio.costoEspera || 0) + (servicio.costoCamilla || 0) - (servicio.descuento || 0);
}

export function formatDateTime(value: Date | string | null) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("es-PE", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function parseDestinos(destinos: string) {
  try {
    const parsed = JSON.parse(destinos);
    return Array.isArray(parsed) ? parsed.join(" | ") : destinos;
  } catch {
    return destinos;
  }
}

export function serializeServicio(servicio: ServicioForExport) {
  return {
    id: servicio.id,
    codigo: `SRV-${String(servicio.id).padStart(3, "0")}`,
    paciente: servicio.paciente,
    tipoServicio: servicio.tipoServicio,
    estado: servicio.estado || "",
    prioridad: servicio.prioridad || "",
    origen: servicio.origen,
    destinos: parseDestinos(servicio.destinos),
    contacto: servicio.contacto || "",
    telefono: servicio.telefono || "",
    email: servicio.email || "",
    ambulancia: servicio.ambulancia || "",
    fechaProgramada: formatDateTime(servicio.fechaHora),
    fechaRegistro: formatDateTime(servicio.createdAt),
    costoBase: servicio.costo || 0,
    costoEspera: servicio.costoEspera || 0,
    costoCamilla: servicio.costoCamilla || 0,
    descuento: servicio.descuento || 0,
    total: totalServicio(servicio),
    metodoPago: servicio.metodoPago || "",
    direccionEvento: servicio.direccionEvento || "",
    comprobanteTipo: servicio.comprobanteTipo || "",
    comprobanteNumero: servicio.comprobanteNumero || "",
    diagnostico: servicio.diagnostico || "",
    sintomas: servicio.sintomas || "",
    enfermedadFondo: servicio.enfermedadFondo || "",
    tratamientoActual: servicio.tratamientoActual || "",
    requiereOxigeno: servicio.requiereOxigeno || "",
    litrosOxigeno: servicio.litrosOxigeno || "",
    observaciones: servicio.observaciones || "",
    notas: servicio.notas || "",
  };
}
