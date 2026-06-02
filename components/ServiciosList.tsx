"use client";

import { type ReactNode, useMemo, useState } from "react";
import { AlertCircle, Calendar, Clock, Edit3, Eye, FileText, Phone, Search, Stethoscope, User } from "lucide-react";

interface Servicio {
  id: number;
  paciente: string;
  edad: number | null;
  peso: number | null;
  tipoServicio: string;
  origen: string;
  referencia: string | null;
  destinos: string;
  esIdaYVuelta: boolean | null;
  diagnostico: string | null;
  enfermedadFondo: string | null;
  sintomas: string | null;
  tratamientoActual: string | null;
  requiereOxigeno: string | null;
  litrosOxigeno: number | null;
  prioridad: string | null;
  ambulancia: string | null;
  observaciones: string | null;
  contacto: string | null;
  telefono: string | null;
  email: string | null;
  costo: number | null;
  metodoPago: string | null;
  estado: string | null;
  fechaHora: string | null;
  comprobanteTipo: string | null;
  comprobanteNumero: string | null;
  horaSalidaBase: string | null;
  horaLlegadaRecojo: string | null;
  horaInicioTraslado: string | null;
  horaLlegadaDestino: string | null;
  horaTermino: string | null;
  minutosEspera: number | null;
  costoEspera: number | null;
  alquilerCamilla: boolean;
  camillaHoras: number | null;
  costoCamilla: number | null;
  descuento: number | null;
  direccionEvento: string | null;
  horaSalidaBase2: string | null;
  horaLlegadaRecojo2: string | null;
  horaInicioTraslado2: string | null;
  horaLlegadaDestino2: string | null;
  horaTermino2: string | null;
  notas: string | null;
  createdAt: string;
}

interface Props {
  initialServicios: Servicio[];
}

type EditForm = Record<
  | "paciente" | "edad" | "peso" | "tipoServicio" | "origen" | "referencia" | "destinos"
  | "diagnostico" | "enfermedadFondo" | "sintomas" | "tratamientoActual" | "requiereOxigeno"
  | "litrosOxigeno" | "prioridad" | "ambulancia" | "observaciones" | "contacto" | "telefono"
  | "email" | "costo" | "metodoPago" | "estado" | "fechaHora" | "comprobanteTipo"
  | "comprobanteNumero" | "horaSalidaBase" | "horaLlegadaRecojo" | "horaInicioTraslado"
  | "horaLlegadaDestino" | "horaTermino" | "horaSalidaBase2" | "horaLlegadaRecojo2" | "horaInicioTraslado2" | "horaLlegadaDestino2" | "horaTermino2" | "minutosEspera" | "camillaHoras" | "descuento" | "direccionEvento" | "notas",
  string
> & {
  esIdaYVuelta: boolean;
  alquilerCamilla: boolean;
};

const camillaCostos: Record<string, number> = { "4": 350, "6": 400, "12": 750 };
const estadosServicio = ["Cotización", "Confirmado", "En Curso", "Completado", "Cancelado"];

function parseDestinos(destinosStr: string): string[] {
  try {
    const parsed = JSON.parse(destinosStr);
    return Array.isArray(parsed) ? parsed : [destinosStr];
  } catch {
    return [destinosStr];
  }
}

function toDatetimeLocal(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function formatDate(value: string | null) {
  if (!value) return "No registrado";
  return new Date(value).toLocaleString("es-PE", { dateStyle: "short", timeStyle: "short" });
}

function money(value: number | null | undefined) {
  return "S/. " + (value || 0).toFixed(2);
}

function minutesBetween(start: string, end: string) {
  if (!start || !end) return 0;
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  if (Number.isNaN(startTime) || Number.isNaN(endTime) || endTime <= startTime) return 0;
  return Math.ceil((endTime - startTime) / 60000);
}

function buildEditForm(servicio: Servicio): EditForm {
  return {
    paciente: servicio.paciente || "",
    edad: servicio.edad?.toString() || "",
    peso: servicio.peso?.toString() || "",
    tipoServicio: servicio.tipoServicio || "Traslado",
    origen: servicio.origen || "",
    referencia: servicio.referencia || "",
    destinos: parseDestinos(servicio.destinos).join("\n"),
    esIdaYVuelta: Boolean(servicio.esIdaYVuelta),
    diagnostico: servicio.diagnostico || "",
    enfermedadFondo: servicio.enfermedadFondo || "",
    sintomas: servicio.sintomas || "",
    tratamientoActual: servicio.tratamientoActual || "",
    requiereOxigeno: servicio.requiereOxigeno || "No",
    litrosOxigeno: servicio.litrosOxigeno?.toString() || "",
    prioridad: servicio.prioridad || "Alta",
    ambulancia: servicio.ambulancia || "",
    observaciones: servicio.observaciones || "",
    contacto: servicio.contacto || "",
    telefono: servicio.telefono || "",
    email: servicio.email || "",
    costo: servicio.costo?.toString() || "0",
    metodoPago: servicio.metodoPago || "Yape",
    estado: servicio.estado || "Cotización",
    fechaHora: toDatetimeLocal(servicio.fechaHora),
    comprobanteTipo: servicio.comprobanteTipo || "",
    comprobanteNumero: servicio.comprobanteNumero || "",
    direccionEvento: servicio.direccionEvento || "",
    horaSalidaBase: toDatetimeLocal(servicio.horaSalidaBase),
    horaLlegadaRecojo: toDatetimeLocal(servicio.horaLlegadaRecojo),
    horaInicioTraslado: toDatetimeLocal(servicio.horaInicioTraslado),
    horaLlegadaDestino: toDatetimeLocal(servicio.horaLlegadaDestino),
    horaTermino: toDatetimeLocal(servicio.horaTermino),
    horaSalidaBase2: toDatetimeLocal(servicio.horaSalidaBase2),
    horaLlegadaRecojo2: toDatetimeLocal(servicio.horaLlegadaRecojo2),
    horaInicioTraslado2: toDatetimeLocal(servicio.horaInicioTraslado2),
    horaLlegadaDestino2: toDatetimeLocal(servicio.horaLlegadaDestino2),
    horaTermino2: toDatetimeLocal(servicio.horaTermino2),
    minutosEspera: servicio.minutosEspera?.toString() || "0",
    alquilerCamilla: servicio.alquilerCamilla,
    camillaHoras: servicio.camillaHoras?.toString() || "",
    descuento: servicio.descuento?.toString() || "0",
    notas: servicio.notas || "",
  };
}

export default function ServiciosList({ initialServicios }: Props) {
  const [servicios, setServicios] = useState(initialServicios);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [sortBy, setSortBy] = useState("Fecha");
  const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(null);
  const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const sortedServicios = [...servicios.filter((servicio) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      servicio.paciente.toLowerCase().includes(term) ||
      Boolean(servicio.contacto?.toLowerCase().includes(term)) ||
      Boolean(servicio.telefono?.includes(searchTerm)) ||
      ("SRV-" + servicio.id).toLowerCase().includes(term);
    return matchesSearch && (filterEstado === "Todos" || servicio.estado === filterEstado);
  })].sort((a, b) => {
    if (sortBy === "Costo") return (b.costo || 0) - (a.costo || 0);
    if (sortBy === "ID") return b.id - a.id;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const costosEdicion = useMemo(() => {
    if (!editForm) return { espera: 0, camilla: 0, total: 0 };
    const base = Number(editForm.costo) || 0;
    const minutosEspera = minutesBetween(editForm.horaLlegadaDestino, editForm.horaTermino);
    const espera = minutosEspera > 0 ? Math.ceil(minutosEspera / 30) * 50 : 0;
    const camilla = editForm.alquilerCamilla ? camillaCostos[editForm.camillaHoras] || 0 : 0;
    const descuento = Number(editForm.descuento) || 0;
    return { espera, camilla, descuento, minutosEspera, total: Math.max(base + espera + camilla - descuento, 0) };
  }, [editForm]);

  function openEdit(servicio: Servicio) {
    setSelectedServicio(null);
    setEditingServicio(servicio);
    setEditForm(buildEditForm(servicio));
    setError("");
  }

  function updateForm<K extends keyof EditForm>(key: K, value: EditForm[K]) {
    setEditForm((current) => current ? { ...current, [key]: value } : current);
  }

  async function cambiarEstadoRapido(servicio: Servicio, nuevoEstado: string) {
    try {
      const response = await fetch("/api/servicios/" + servicio.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...servicio,
          estado: nuevoEstado,
          destinos: parseDestinos(servicio.destinos),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "No se pudo actualizar el estado del servicio.");
        return;
      }

      const updatedServicio = data as Servicio;
      setServicios((current) => current.map((item) => item.id === updatedServicio.id ? updatedServicio : item));
      setSelectedServicio((current) => current?.id === updatedServicio.id ? updatedServicio : current);
      setEditingServicio((current) => current?.id === updatedServicio.id ? updatedServicio : current);
    } catch (err) {
      console.error("Error actualizando estado rápido", err);
      alert("Error de conexión al actualizar el estado.");
    }
  }

  async function guardarEdicion() {
    if (!editingServicio || !editForm) return;
    setSaving(true);
    setError("");

    try {
      const destinos = editForm.destinos.split("\n").map((destino) => destino.trim()).filter(Boolean);
      const response = await fetch("/api/servicios/" + editingServicio.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editForm,
          destinos,
          edad: editForm.edad ? Number(editForm.edad) : null,
          peso: editForm.peso ? Number(editForm.peso) : null,
          litrosOxigeno: editForm.litrosOxigeno ? Number(editForm.litrosOxigeno) : null,
          costo: Number(editForm.costo) || 0,
          minutosEspera: costosEdicion.minutosEspera,
          costoEspera: costosEdicion.espera,
          camillaHoras: editForm.alquilerCamilla && editForm.camillaHoras ? Number(editForm.camillaHoras) : null,
          costoCamilla: costosEdicion.camilla,
          descuento: Number(editForm.descuento) || 0,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "No se pudo actualizar el servicio.");
        return;
      }

      const updatedServicio = data as Servicio;
      setServicios((current) => current.map((servicio) => servicio.id === updatedServicio.id ? updatedServicio : servicio));
      setEditingServicio(null);
      setEditForm(null);
      setSelectedServicio(updatedServicio);
    } catch (err) {
      console.error("Error actualizando servicio", err);
      setError("Error de conexión. Intente nuevamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-10">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="relative w-full lg:w-[450px]">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input type="text" placeholder="Buscar por paciente, contacto, teléfono o ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-12 pr-4 py-3 border border-gray-200 rounded-2xl w-full text-sm focus:outline-none focus:border-red-500 transition-colors" />
          </div>
          <div className="flex gap-4 self-end lg:self-center w-full lg:w-auto">
            <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} className="w-1/2 lg:w-44 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 bg-white cursor-pointer">
              <option value="Todos">Todos los Estados</option>
              <option value="Cotización">Cotización</option>
              <option value="Confirmado">Confirmado</option>
              <option value="En Curso">En Curso</option>
              <option value="Completado">Completado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-1/2 lg:w-40 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 bg-white cursor-pointer">
              <option value="Fecha">Ordenar por Fecha</option>
              <option value="Costo">Ordenar por Costo</option>
              <option value="ID">Ordenar por ID</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-400 font-medium mt-6">{sortedServicios.length} servicios registrados en detalle</div>
        <div className="space-y-6 mt-8">
          {sortedServicios.length === 0 ? (
            <div className="py-20 text-center text-gray-400">
              <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="font-semibold text-lg">No se encontraron servicios</p>
              <p className="text-sm text-gray-400 mt-1">Pruebe modificando los términos de búsqueda o filtros.</p>
            </div>
          ) : sortedServicios.map((servicio) => {
            const destinos = parseDestinos(servicio.destinos);
            const totalServicio = (servicio.costo || 0) + (servicio.costoEspera || 0) + (servicio.costoCamilla || 0) - (servicio.descuento || 0);
            return (
              <div key={servicio.id} className="bg-white border border-gray-100 hover:border-red-100 rounded-3xl p-6 transition-all hover:shadow-md">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4 flex-1">
                    <div className={(servicio.tipoServicio === "Traslado" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600") + " p-4 rounded-2xl flex items-center justify-center font-bold text-2xl"}>🚑</div>
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-black text-gray-800">{servicio.paciente}</h2>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-100">{servicio.tipoServicio}</span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-50 text-gray-700 border border-gray-100">{servicio.estado}</span>
                      </div>
                      <p className="text-gray-600 text-sm font-semibold"><span className="text-red-500 font-bold">Recojo:</span> {servicio.origen}</p>
                      <p className="text-gray-500 text-sm font-medium"><span className="text-blue-500 font-bold">Destino:</span> {destinos.join(" -> ")}</p>
                      <div className="flex flex-wrap gap-4 pt-2 text-xs text-gray-400 font-semibold">
                        <span className="bg-gray-50 px-2 py-1 rounded-lg">SRV-{String(servicio.id).padStart(3, "0")}</span>
                        {servicio.contacto && <span className="flex items-center gap-1"><User size={12} /> {servicio.contacto}</span>}
                        {servicio.telefono && <span className="flex items-center gap-1"><Phone size={12} /> {servicio.telefono}</span>}
                        {servicio.ambulancia && <span className="bg-red-50 text-red-600 px-2 py-1 rounded-lg">Unidad {servicio.ambulancia}</span>}
                        {servicio.comprobanteNumero && <span className="bg-green-50 text-green-700 px-2 py-1 rounded-lg">{servicio.comprobanteTipo}: {servicio.comprobanteNumero}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between self-stretch lg:self-auto gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-black text-green-600">{money(totalServicio)}</p>
                      <p className="text-xs text-gray-400 font-semibold mt-1 flex items-center gap-1 justify-end"><Calendar size={12} />{servicio.fechaHora ? new Date(servicio.fechaHora).toLocaleDateString() : new Date(servicio.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                      <select
                        value={servicio.estado || "Cotización"}
                        onChange={(e) => cambiarEstadoRapido(servicio, e.target.value)}
                        className="border border-gray-200 bg-white text-gray-700 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none focus:border-red-500"
                        title="Cambiar estado rápido"
                      >
                        {estadosServicio.map((estado) => (
                          <option key={estado} value={estado}>{estado}</option>
                        ))}
                      </select>
                      <button onClick={() => setSelectedServicio(servicio)} className="border border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"><Eye size={14} /> Ver</button>
                      <button onClick={() => openEdit(servicio)} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"><Edit3 size={14} /> Editar</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedServicio && <DetalleModal servicio={selectedServicio} onClose={() => setSelectedServicio(null)} onEdit={() => openEdit(selectedServicio)} />}
      {editingServicio && editForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl p-6 border border-gray-100 max-h-[92vh] overflow-y-auto animate-slideUp">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-2xl font-extrabold text-gray-800">Editar servicio SRV-{String(editingServicio.id).padStart(3, "0")}</h3>
              <button onClick={() => setEditingServicio(null)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer">X</button>
            </div>
            {error && <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Paciente / Cliente" value={editForm.paciente} onChange={(value) => updateForm("paciente", value)} />
              <SelectField label="Tipo de servicio" value={editForm.tipoServicio} onChange={(value) => updateForm("tipoServicio", value)} options={["Traslado", "Evento"]} />
              <Field label="Edad" type="number" value={editForm.edad} onChange={(value) => updateForm("edad", value)} />
              <Field label="Peso" type="number" value={editForm.peso} onChange={(value) => updateForm("peso", value)} />
              <Field label="Origen / punto de recojo" value={editForm.origen} onChange={(value) => updateForm("origen", value)} />
              <Field label="Referencia" value={editForm.referencia} onChange={(value) => updateForm("referencia", value)} />
              <TextAreaField label="Destinos (uno por línea)" value={editForm.destinos} onChange={(value) => updateForm("destinos", value)} />
              <TextAreaField label="Observaciones" value={editForm.observaciones} onChange={(value) => updateForm("observaciones", value)} />
              <Field label="Contacto" value={editForm.contacto} onChange={(value) => updateForm("contacto", value)} />
              <Field label="Teléfono" value={editForm.telefono} onChange={(value) => updateForm("telefono", value.replace(/\D/g, "").slice(0, 9))} />
              <Field label="Email" type="email" value={editForm.email} onChange={(value) => updateForm("email", value)} />
              <Field label="Ambulancia asignada" value={editForm.ambulancia} onChange={(value) => updateForm("ambulancia", value.toUpperCase())} />
              <SelectField label="Prioridad" value={editForm.prioridad} onChange={(value) => updateForm("prioridad", value)} options={["Alta", "Media", "Baja", "Crítica"]} />
              <SelectField label="Estado" value={editForm.estado} onChange={(value) => updateForm("estado", value)} options={estadosServicio} />
              <Field label="Fecha y hora programada" type="datetime-local" value={editForm.fechaHora} onChange={(value) => updateForm("fechaHora", value)} />
              <SelectField label="Método de pago" value={editForm.metodoPago} onChange={(value) => updateForm("metodoPago", value)} options={["Yape", "Transferencia", "Efectivo", "Tarjeta"]} />
            </div>

            <SectionTitle title="Información médica" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Diagnóstico" value={editForm.diagnostico} onChange={(value) => updateForm("diagnostico", value)} />
              <Field label="Enfermedad de fondo" value={editForm.enfermedadFondo} onChange={(value) => updateForm("enfermedadFondo", value)} />
              <TextAreaField label="Síntomas" value={editForm.sintomas} onChange={(value) => updateForm("sintomas", value)} />
              <TextAreaField label="Tratamiento actual" value={editForm.tratamientoActual} onChange={(value) => updateForm("tratamientoActual", value)} />
              <SelectField label="Requiere oxígeno" value={editForm.requiereOxigeno} onChange={(value) => updateForm("requiereOxigeno", value)} options={["No", "Si"]} />
              <Field label="Litros de oxígeno" type="number" value={editForm.litrosOxigeno} onChange={(value) => updateForm("litrosOxigeno", value)} />
            </div>

            <SectionTitle title="Tiempos del servicio" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Field label="Salida de ambulancia a recojo" type="datetime-local" value={editForm.horaSalidaBase} onChange={(value) => updateForm("horaSalidaBase", value)} />
              <Field label="Llegada al punto de recojo" type="datetime-local" value={editForm.horaLlegadaRecojo} onChange={(value) => updateForm("horaLlegadaRecojo", value)} />
              <Field label="Inicio del traslado" type="datetime-local" value={editForm.horaInicioTraslado} onChange={(value) => updateForm("horaInicioTraslado", value)} />
              <Field label="Llegada al destino" type="datetime-local" value={editForm.horaLlegadaDestino} onChange={(value) => updateForm("horaLlegadaDestino", value)} />
              <Field label="Término del servicio" type="datetime-local" value={editForm.horaTermino} onChange={(value) => updateForm("horaTermino", value)} />
              <div className="rounded-2xl bg-yellow-50 border border-yellow-100 p-4">
                <p className="text-sm font-bold text-yellow-800">Espera calculada</p>
                <p className="text-2xl font-black text-yellow-700 mt-2">{costosEdicion.minutosEspera} min</p>
                <p className="text-xs text-yellow-700 mt-1">Desde llegada al destino hasta término del servicio.</p>
              </div>
            </div>

            <SectionTitle title="Segundo traslado (opcional)" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Field label="Salida de ambulancia a segundo recojo" type="datetime-local" value={editForm.horaSalidaBase2} onChange={(value) => updateForm("horaSalidaBase2", value)} />
              <Field label="Llegada al segundo recojo" type="datetime-local" value={editForm.horaLlegadaRecojo2} onChange={(value) => updateForm("horaLlegadaRecojo2", value)} />
              <Field label="Inicio segundo traslado" type="datetime-local" value={editForm.horaInicioTraslado2} onChange={(value) => updateForm("horaInicioTraslado2", value)} />
              <Field label="Llegada segundo destino" type="datetime-local" value={editForm.horaLlegadaDestino2} onChange={(value) => updateForm("horaLlegadaDestino2", value)} />
              <Field label="Término segundo servicio" type="datetime-local" value={editForm.horaTermino2} onChange={(value) => updateForm("horaTermino2", value)} />
            </div>

            <SectionTitle title="Costos adicionales y comprobante" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Field label="Costo base del servicio" type="number" value={editForm.costo} onChange={(value) => updateForm("costo", value)} />
              <SelectField label="Alquiler de camilla" value={editForm.alquilerCamilla ? editForm.camillaHoras : ""} onChange={(value) => { updateForm("alquilerCamilla", Boolean(value)); updateForm("camillaHoras", value); }} options={["", "4", "6", "12"]} optionLabels={{ "": "No alquila camilla", "4": "4 horas - S/. 350", "6": "6 horas - S/. 400", "12": "12 horas - S/. 750" }} />
              <SelectField label="Tipo de comprobante" value={editForm.comprobanteTipo} onChange={(value) => updateForm("comprobanteTipo", value)} options={["", "Boleta", "Factura"]} optionLabels={{ "": "Sin comprobante", Boleta: "Boleta", Factura: "Factura" }} />
              <Field label="Número de comprobante" value={editForm.comprobanteNumero} onChange={(value) => updateForm("comprobanteNumero", value)} />
              <Field label="Descuento (S/.)" type="number" value={editForm.descuento} onChange={(value) => updateForm("descuento", value)} />
              <TextAreaField label="Notas internas" value={editForm.notas} onChange={(value) => updateForm("notas", value)} />
              <div className="rounded-2xl bg-green-50 border border-green-100 p-4">
                <p className="text-sm font-bold text-green-800">Resumen de cobro</p>
                <p className="text-xs text-green-700 mt-2">Espera: {money(costosEdicion.espera)}</p>
                <p className="text-xs text-green-700">Camilla: {money(costosEdicion.camilla)}</p>
                <p className="text-xs text-green-700">Descuento: -{money(costosEdicion.descuento)}</p>
                <p className="text-2xl font-black text-green-700 mt-2">Total: {money(costosEdicion.total)}</p>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => setEditingServicio(null)} className="border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold px-6 py-3 rounded-2xl transition-colors cursor-pointer">Cancelar</button>
              <button type="button" disabled={saving} onClick={guardarEdicion} className="bg-red-600 hover:bg-red-500 disabled:bg-red-300 text-white font-semibold px-6 py-3 rounded-2xl transition-colors cursor-pointer">{saving ? "Guardando..." : "Guardar cambios"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetalleModal({ servicio, onClose, onEdit }: { servicio: Servicio; onClose: () => void; onEdit: () => void }) {
  const total = (servicio.costo || 0) + (servicio.costoEspera || 0) + (servicio.costoCamilla || 0) - (servicio.descuento || 0);
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl p-6 border border-gray-100 max-h-[90vh] overflow-y-auto animate-slideUp">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 gap-4">
          <h3 className="text-2xl font-extrabold text-gray-800">Detalles del Servicio <span className="text-sm bg-gray-100 text-gray-500 font-bold px-2 py-1 rounded-lg">SRV-{String(servicio.id).padStart(3, "0")}</span></h3>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onEdit} className="bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-2">
              <Edit3 size={16} /> Editar servicio
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer">X</button>
          </div>
        </div>
        <div className="mt-6 space-y-6 text-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Info title="Paciente / Cliente" lines={[servicio.paciente, servicio.edad ? "Edad: " + servicio.edad + " años" : "", servicio.peso ? "Peso: " + servicio.peso + " kg" : ""]} />
            <Info title="Estado y programación" lines={[servicio.estado || "No registrado", "Fecha: " + formatDate(servicio.fechaHora), servicio.ambulancia ? "Unidad: " + servicio.ambulancia : ""]} />
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
            <p><span className="font-bold text-red-600">Recojo:</span> {servicio.origen}</p>
            {servicio.referencia && <p className="text-sm text-gray-500">Referencia: {servicio.referencia}</p>}
            <p><span className="font-bold text-blue-600">Destinos:</span> {parseDestinos(servicio.destinos).join(" -> ")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
            <Info icon={<Stethoscope size={14} />} title="Información médica" lines={["Diagnóstico: " + (servicio.diagnostico || "No registrado"), "Síntomas: " + (servicio.sintomas || "No registrado"), "Enfermedad de fondo: " + (servicio.enfermedadFondo || "No registrada"), "Tratamiento actual: " + (servicio.tratamientoActual || "No registrado"), "Oxígeno: " + (servicio.requiereOxigeno || "No") + (servicio.litrosOxigeno ? " (" + servicio.litrosOxigeno + " LPM)" : "")]} />
            <Info icon={<Clock size={14} />} title="Tiempos operativos" lines={["Salida base: " + formatDate(servicio.horaSalidaBase), "Llegada recojo: " + formatDate(servicio.horaLlegadaRecojo), "Inicio traslado: " + formatDate(servicio.horaInicioTraslado), "Llegada destino: " + formatDate(servicio.horaLlegadaDestino), "Término: " + formatDate(servicio.horaTermino)]} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
            <Info title="Contacto despacho" lines={[servicio.contacto || "No especificado", "Tel: " + (servicio.telefono || "No especificado"), servicio.email || ""]} />
            <Info icon={<FileText size={14} />} title="Facturación y costos" lines={["Total: " + money(total), "Servicio base: " + money(servicio.costo), "Espera: " + (servicio.minutosEspera || 0) + " min - " + money(servicio.costoEspera), "Camilla: " + (servicio.alquilerCamilla ? String(servicio.camillaHoras) + "h - " + money(servicio.costoCamilla) : "No"), "Descuento: -" + money(servicio.descuento), "Comprobante: " + (servicio.comprobanteTipo && servicio.comprobanteNumero ? servicio.comprobanteTipo + " " + servicio.comprobanteNumero : "No registrado")]} />
          </div>
          {servicio.observaciones && <p className="border-t border-gray-100 pt-4 text-sm text-gray-700 italic">{servicio.observaciones}</p>}
          <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-100">
            <button type="button" onClick={onEdit} className="bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-2xl transition-colors cursor-pointer flex items-center gap-2"><Edit3 size={16} /> Editar servicio</button>
            <button type="button" onClick={onClose} className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-2xl transition-colors cursor-pointer">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ title, lines, icon }: { title: string; lines: string[]; icon?: ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-gray-400 font-bold uppercase flex items-center gap-1">{icon}{title}</p>
      {lines.filter(Boolean).map((line) => <p key={line} className="text-sm text-gray-700">{line}</p>)}
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h4 className="mt-8 mb-4 text-lg font-black text-gray-800 border-t border-gray-100 pt-6">{title}</h4>;
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="block"><span className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</span><input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-red-500" /></label>;
}

function TextAreaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block"><span className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</span><textarea value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm h-28 focus:outline-none focus:border-red-500" /></label>;
}

function SelectField({ label, value, onChange, options, optionLabels }: { label: string; value: string; onChange: (value: string) => void; options: string[]; optionLabels?: Record<string, string> }) {
  return <label className="block"><span className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</span><select value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-red-500 bg-white">{options.map((option) => <option key={option} value={option}>{optionLabels?.[option] || option}</option>)}</select></label>;
}
