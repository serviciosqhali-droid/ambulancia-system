export type TrasladoHorario = {
  destino: string;
  salidaBase: string;
  llegadaRecojo: string;
  inicioTraslado: string;
  llegadaDestino: string;
  termino: string;
};

export type ServicioCostosInput = {
  costo: number | null;
  costoEspera: number | null;
  costoCamilla: number | null;
  costoOxigeno?: number | null;
  costoDestinoAdicional?: number | null;
  descuento: number | null;
  minutosEspera?: number | null;
  destinos?: string | null;
  horaSalidaBase?: string | Date | null;
  horaLlegadaRecojo?: string | Date | null;
  horaInicioTraslado?: string | Date | null;
  horaLlegadaDestino?: string | Date | null;
  horaTermino?: string | Date | null;
  horaSalidaBase2?: string | Date | null;
  horaLlegadaRecojo2?: string | Date | null;
  horaInicioTraslado2?: string | Date | null;
  horaLlegadaDestino2?: string | Date | null;
  horaTermino2?: string | Date | null;
  trasladosExtra?: string | null;
};

function toDatetimeLocal(value: string | Date | null | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function parseDestinos(destinosStr: string | null | undefined): string[] {
  if (!destinosStr) return [];
  try {
    const parsed = JSON.parse(destinosStr);
    return Array.isArray(parsed) ? parsed.map(String) : [destinosStr];
  } catch {
    return [destinosStr];
  }
}

export function minutesBetween(start: string, end: string) {
  if (!start || !end) return 0;
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  if (Number.isNaN(startTime) || Number.isNaN(endTime) || endTime <= startTime) return 0;
  return Math.ceil((endTime - startTime) / 60000);
}

export function parseTrasladosExtra(value: string | null | undefined): TrasladoHorario[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      destino: typeof item?.destino === "string" ? item.destino : "",
      salidaBase: typeof item?.salidaBase === "string" ? item.salidaBase : "",
      llegadaRecojo: typeof item?.llegadaRecojo === "string" ? item.llegadaRecojo : "",
      inicioTraslado: typeof item?.inicioTraslado === "string" ? item.inicioTraslado : "",
      llegadaDestino: typeof item?.llegadaDestino === "string" ? item.llegadaDestino : "",
      termino: typeof item?.termino === "string" ? item.termino : "",
    }));
  } catch {
    return [];
  }
}

export function buildTrasladosFromServicio(servicio: ServicioCostosInput): TrasladoHorario[] {
  const first: TrasladoHorario = {
    destino: "",
    salidaBase: toDatetimeLocal(servicio.horaSalidaBase),
    llegadaRecojo: toDatetimeLocal(servicio.horaLlegadaRecojo),
    inicioTraslado: toDatetimeLocal(servicio.horaInicioTraslado),
    llegadaDestino: toDatetimeLocal(servicio.horaLlegadaDestino),
    termino: toDatetimeLocal(servicio.horaTermino),
  };

  const extras = parseTrasladosExtra(servicio.trasladosExtra);
  if (extras.length > 0) {
    return [first, ...extras];
  }

  const second: TrasladoHorario = {
    destino: "",
    salidaBase: toDatetimeLocal(servicio.horaSalidaBase2),
    llegadaRecojo: toDatetimeLocal(servicio.horaLlegadaRecojo2),
    inicioTraslado: toDatetimeLocal(servicio.horaInicioTraslado2),
    llegadaDestino: toDatetimeLocal(servicio.horaLlegadaDestino2),
    termino: toDatetimeLocal(servicio.horaTermino2),
  };
  const hasSecond = [
    second.salidaBase,
    second.llegadaRecojo,
    second.inicioTraslado,
    second.llegadaDestino,
    second.termino,
  ].some(Boolean);

  return [first, ...(hasSecond ? [second] : [])];
}

export function calcularEsperaMinutos(traslados: TrasladoHorario[]) {
  return traslados.reduce(
    (total, traslado) => total + minutesBetween(traslado.llegadaDestino, traslado.termino),
    0
  );
}

export function costoEsperaFromMinutos(minutos: number) {
  return minutos > 0 ? Math.ceil(minutos / 30) * 50 : 0;
}

export function calcularTotalesServicio(servicio: ServicioCostosInput) {
  const destinosBase = parseDestinos(servicio.destinos).filter((destino) => destino.trim());
  const traslados = buildTrasladosFromServicio(servicio);
  const destinosTraslados = traslados
    .slice(1)
    .map((traslado) => traslado.destino.trim())
    .filter(Boolean);
  const destinos = Array.from(new Set([...destinosBase, ...destinosTraslados]));

  const minutosDesdeHorarios = calcularEsperaMinutos(traslados);
  const minutosEspera =
    minutosDesdeHorarios > 0 ? minutosDesdeHorarios : servicio.minutosEspera || 0;
  const costoEspera =
    minutosDesdeHorarios > 0
      ? costoEsperaFromMinutos(minutosDesdeHorarios)
      : servicio.costoEspera || 0;
  const destinosExtraCount = Math.max(destinos.length - 1, 0);
  const costoDestinosExtra = destinosExtraCount * (servicio.costoDestinoAdicional || 0);
  const costoBase = servicio.costo || 0;
  const costoCamilla = servicio.costoCamilla || 0;
  const costoOxigeno = servicio.costoOxigeno || 0;
  const descuento = servicio.descuento || 0;
  const total = Math.max(
    costoBase + costoEspera + costoCamilla + costoOxigeno + costoDestinosExtra - descuento,
    0
  );

  return {
    costoBase,
    minutosEspera,
    costoEspera,
    costoCamilla,
    costoOxigeno,
    destinosExtraCount,
    costoDestinoUnitario: servicio.costoDestinoAdicional || 0,
    costoDestinosExtra,
    descuento,
    total,
  };
}

export function money(value: number | null | undefined) {
  return "S/. " + (value || 0).toFixed(2);
}
