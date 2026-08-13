"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Ambulance, CalendarDays, Clock, Phone, Users } from "lucide-react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import NuevoServicioStepper from "@/components/NuevoServicioStepper";
import PasoPaciente from "@/components/PasoPaciente";
import PasoDirecciones from "@/components/PasoDirecciones";
import PasoMedico from "@/components/PasoMedico";
import PasoContactoCosto from "@/components/PasoContactoCosto";

export default function NuevoServicioPage() {
  const router = useRouter();

  const [pasoActual, setPasoActual] = useState(1);
  const [servicioSeleccionado, setServicioSeleccionado] = useState("");
  const [tipoServicio, setTipoServicio] = useState("Traslado");

  const [paciente, setPaciente] = useState("");
  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");

  const [origen, setOrigen] = useState("");
  const [referencia, setReferencia] = useState("");
  const [destinos, setDestinos] = useState([""]);
  const [esIdaYVuelta, setEsIdaYVuelta] = useState(false);

  const [diagnostico, setDiagnostico] = useState("");
  const [enfermedadFondo, setEnfermedadFondo] = useState("");
  const [sintomas, setSintomas] = useState("");
  const [tratamientoActual, setTratamientoActual] = useState("");
  const [requiereOxigeno, setRequiereOxigeno] = useState("No");
  const [litrosOxigeno, setLitrosOxigeno] = useState("");

  const [contacto, setContacto] = useState("");
  const [email, setEmail] = useState("");
  const [telefonos, setTelefonos] = useState([""]);
  const [costo, setCosto] = useState("");
  const [metodoPago, setMetodoPago] = useState("Yape");
  const [estadoServicio, setEstadoServicio] = useState("Cotización");
  const [fechaHora, setFechaHora] = useState("");
  const [notas, setNotas] = useState("");
  const [prioridad, setPrioridad] = useState("Alta");
  const [ambulancia, setAmbulancia] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [eventoNombre, setEventoNombre] = useState("");
  const [eventoTipo, setEventoTipo] = useState("");
  const [eventoLugar, setEventoLugar] = useState("");
  const [eventoDireccion, setEventoDireccion] = useState("");
  const [eventoDuracion, setEventoDuracion] = useState("");
  const [eventoUnidad, setEventoUnidad] = useState("Horas");
  const [requiereMedico, setRequiereMedico] = useState(false);
  const [requiereParamedico, setRequiereParamedico] = useState(false);
  const [requierePiloto, setRequierePiloto] = useState(false);
  const [detallePersonal, setDetallePersonal] = useState("");
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [rucEmpresa, setRucEmpresa] = useState("");

  const esEvento = tipoServicio === "Evento";

  function seleccionarServicio(tipo: "Traslado" | "Evento") {
    setServicioSeleccionado(tipo);
    setTipoServicio(tipo);
    setEstadoServicio(tipo === "Evento" ? "Por cotizar" : "Cotización");
    setPasoActual(2);
  }

  function siguientePaso() {
    if (esEvento) {
      if (pasoActual === 2 && (!eventoNombre.trim() || !eventoTipo.trim() || !eventoLugar.trim())) {
        alert("Complete nombre, tipo y lugar del evento.");
        return;
      }

      if (pasoActual === 3 && (!fechaHora || !eventoDuracion.trim() || Number(eventoDuracion) <= 0)) {
        alert("Ingrese fecha, hora y duración del evento.");
        return;
      }

      if (pasoActual === 4 && (!requiereMedico || !requiereParamedico || !requierePiloto)) {
        alert("Debe seleccionar Médico, Paramédico y Conductor para continuar.");
        return;
      }

      setPasoActual(pasoActual + 1);
      return;
    }

    if (pasoActual === 2) {
      if (!paciente.trim()) {
        alert("Por favor, ingrese el nombre completo del paciente.");
        return;
      }
      if (!edad.trim()) {
        alert("Por favor, ingrese la edad del paciente.");
        return;
      }
    }

    if (pasoActual === 3) {
      if (!origen.trim()) {
        alert("Por favor, ingrese la dirección de recojo.");
        return;
      }
      const destinosValidos = destinos.filter((destino) => destino.trim() !== "");
      if (destinosValidos.length === 0) {
        alert("Por favor, ingrese al menos una dirección de destino válida.");
        return;
      }
    }

    if (pasoActual === 4 && requiereOxigeno === "Si" && !litrosOxigeno.trim()) {
      alert("Por favor, indique los litros de oxígeno por minuto (LPM).");
      return;
    }

    setPasoActual(pasoActual + 1);
  }

  function anteriorPaso() {
    if (pasoActual === 2) {
      setServicioSeleccionado("");
      setPasoActual(1);
      return;
    }

    setPasoActual(pasoActual - 1);
  }

  function buildEventoNotas() {
    const personal = [
      requiereMedico ? "Médico" : "",
      requiereParamedico ? "Paramédico" : "",
      requierePiloto ? "Piloto / Conductor" : "",
    ].filter(Boolean);

    return [
      `Evento: ${eventoNombre}`,
      `Tipo de evento: ${eventoTipo}`,
      `Duración: ${eventoDuracion} ${eventoUnidad}`,
      `Personal requerido: ${personal.join(" / ") || "No especificado"}`,
      detallePersonal ? `Detalle de personal: ${detallePersonal}` : "",
      nombreEmpresa.trim() ? `Nombre de la empresa: ${nombreEmpresa.trim()}` : "",
      rucEmpresa.trim() ? `RUC: ${rucEmpresa.trim()}` : "",
      observaciones ? `Observaciones: ${observaciones}` : "",
      notas,
    ].filter(Boolean).join("\n");
  }

  async function guardarServicio() {
    if (!contacto.trim()) {
      alert("Por favor, ingrese el nombre del contacto.");
      return;
    }

    const telefonosValidos = telefonos.filter((telefono) => telefono.trim() !== "");
    if (telefonosValidos.length === 0) {
      alert("Por favor, ingrese al menos un teléfono de contacto.");
      return;
    }

    if (!esEvento && (!costo.trim() || isNaN(Number(costo)))) {
      alert("Por favor, ingrese un costo válido para el servicio.");
      return;
    }

    if (!esEvento && !ambulancia) {
      alert("Por favor, asigne una ambulancia para este servicio.");
      return;
    }

    const payload = esEvento
      ? {
          paciente: eventoNombre,
          edad: null,
          peso: null,
          tipoServicio,
          origen: eventoDireccion || eventoLugar,
          referencia: eventoTipo,
          direccionEvento: eventoDireccion,
          destinos: [eventoLugar],
          esIdaYVuelta: false,
          diagnostico: `Cobertura médica para evento: ${eventoTipo}`,
          enfermedadFondo: "",
          sintomas: "",
          tratamientoActual: "",
          requiereOxigeno: "No",
          litrosOxigeno: null,
          prioridad: "Media",
          ambulancia: ambulancia || null,
          observaciones,
          contacto,
          telefono: telefonosValidos.join(" / "),
          email,
          costo: Number(costo || 0),
          metodoPago: metodoPago || "Transferencia",
          estado: "Por cotizar",
          fechaHora,
          notas: buildEventoNotas(),
        }
      : {
          paciente,
          edad: Number(edad),
          peso: peso ? Number(peso) : null,
          tipoServicio,
          origen,
          referencia,
          destinos: destinos.filter((destino) => destino.trim() !== ""),
          esIdaYVuelta,
          diagnostico,
          enfermedadFondo,
          sintomas,
          tratamientoActual,
          requiereOxigeno,
          litrosOxigeno: litrosOxigeno ? Number(litrosOxigeno) : null,
          prioridad,
          ambulancia,
          observaciones,
          contacto,
          telefono: telefonosValidos.join(" / "),
          email,
          costo: Number(costo),
          metodoPago,
          estado: estadoServicio,
          fechaHora,
          notas,
        };

    try {
      const res = await fetch("/api/servicios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("¡Servicio registrado exitosamente!");
        router.push("/servicios");
      } else {
        const errData = await res.json();
        alert(`Error al registrar servicio: ${errData.error || "Error desconocido"}`);
      }
    } catch (error) {
      console.error("Error de conexión al registrar servicio", error);
      alert("Error de conexión al servidor. Intente nuevamente.");
    }
  }

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Nuevo Servicio</h1>
        <p className="text-gray-500 mt-2">
          {esEvento ? "Alquiler para evento — registre los detalles" : "Despacho y cotización de traslados médicos."}
        </p>
        <NuevoServicioStepper pasoActual={pasoActual} tipoServicio={tipoServicio} />
      </div>

      {!servicioSeleccionado && pasoActual === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div onClick={() => seleccionarServicio("Traslado")} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
            <div className="bg-red-100 w-16 h-16 rounded-2xl flex items-center justify-center">
              <Ambulance className="text-red-600" size={32} />
            </div>
            <h2 className="text-3xl font-bold mt-6 text-gray-800">Traslado de Paciente</h2>
            <p className="text-gray-500 mt-4 leading-relaxed">Transporte médico con soporte asistencial, camilla y paramédicos.</p>
          </div>

          <div onClick={() => seleccionarServicio("Evento")} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center">
              <CalendarDays className="text-blue-600" size={32} />
            </div>
            <h2 className="text-3xl font-bold mt-6 text-gray-800">Alquiler para Evento</h2>
            <p className="text-gray-500 mt-4 leading-relaxed">Cobertura médica preventiva para eventos, conciertos o deportes.</p>
          </div>
        </div>
      )}

      {servicioSeleccionado && esEvento && pasoActual === 2 && (
        <PasoEventoInformacion
          eventoNombre={eventoNombre}
          setEventoNombre={setEventoNombre}
          eventoTipo={eventoTipo}
          setEventoTipo={setEventoTipo}
          eventoLugar={eventoLugar}
          setEventoLugar={setEventoLugar}
          eventoDireccion={eventoDireccion}
          setEventoDireccion={setEventoDireccion}
          anteriorPaso={anteriorPaso}
          siguientePaso={siguientePaso}
        />
      )}

      {servicioSeleccionado && esEvento && pasoActual === 3 && (
        <PasoEventoDuracion
          fechaHora={fechaHora}
          setFechaHora={setFechaHora}
          eventoDuracion={eventoDuracion}
          setEventoDuracion={setEventoDuracion}
          eventoUnidad={eventoUnidad}
          setEventoUnidad={setEventoUnidad}
          anteriorPaso={anteriorPaso}
          siguientePaso={siguientePaso}
        />
      )}

      {servicioSeleccionado && esEvento && pasoActual === 4 && (
        <PasoEventoPersonal
          requiereMedico={requiereMedico}
          setRequiereMedico={setRequiereMedico}
          requiereParamedico={requiereParamedico}
          setRequiereParamedico={setRequiereParamedico}
          requierePiloto={requierePiloto}
          setRequierePiloto={setRequierePiloto}
          detallePersonal={detallePersonal}
          setDetallePersonal={setDetallePersonal}
          anteriorPaso={anteriorPaso}
          siguientePaso={siguientePaso}
        />
      )}

      {servicioSeleccionado && esEvento && pasoActual === 5 && (
        <PasoEventoContacto
          contacto={contacto}
          setContacto={setContacto}
          telefono={telefonos[0] || ""}
          setTelefono={(value) => setTelefonos([value.replace(/\D/g, "").slice(0, 9)])}
          email={email}
          setEmail={setEmail}
          nombreEmpresa={nombreEmpresa}
          setNombreEmpresa={setNombreEmpresa}
          rucEmpresa={rucEmpresa}
          setRucEmpresa={setRucEmpresa}
          estadoServicio={estadoServicio}
          setEstadoServicio={setEstadoServicio}
          observaciones={observaciones}
          setObservaciones={setObservaciones}
          anteriorPaso={anteriorPaso}
          guardarServicio={guardarServicio}
        />
      )}

      {servicioSeleccionado && !esEvento && pasoActual === 2 && (
        <PasoPaciente
          paciente={paciente}
          tipoServicio={tipoServicio}
          setPaciente={setPaciente}
          edad={edad}
          setEdad={setEdad}
          peso={peso}
          setPeso={setPeso}
          siguientePaso={siguientePaso}
          anteriorPaso={anteriorPaso}
        />
      )}

      {servicioSeleccionado && !esEvento && pasoActual === 3 && (
        <PasoDirecciones
          origen={origen}
          setOrigen={setOrigen}
          referencia={referencia}
          setReferencia={setReferencia}
          destinos={destinos}
          setDestinos={setDestinos}
          esIdaYVuelta={esIdaYVuelta}
          setEsIdaYVuelta={setEsIdaYVuelta}
          anteriorPaso={anteriorPaso}
          siguientePaso={siguientePaso}
        />
      )}

      {servicioSeleccionado && !esEvento && pasoActual === 4 && (
        <PasoMedico
          diagnostico={diagnostico}
          setDiagnostico={setDiagnostico}
          enfermedadFondo={enfermedadFondo}
          setEnfermedadFondo={setEnfermedadFondo}
          sintomas={sintomas}
          setSintomas={setSintomas}
          tratamientoActual={tratamientoActual}
          setTratamientoActual={setTratamientoActual}
          requiereOxigeno={requiereOxigeno}
          setRequiereOxigeno={setRequiereOxigeno}
          litrosOxigeno={litrosOxigeno}
          setLitrosOxigeno={setLitrosOxigeno}
          anteriorPaso={anteriorPaso}
          siguientePaso={siguientePaso}
        />
      )}

      {servicioSeleccionado && !esEvento && pasoActual === 5 && (
        <PasoContactoCosto
          anteriorPaso={anteriorPaso}
          guardarServicio={guardarServicio}
          tipoServicio={tipoServicio}
          paciente={paciente}
          edad={edad}
          origen={origen}
          destinos={destinos}
          esIdaYVuelta={esIdaYVuelta}
          diagnostico={diagnostico}
          enfermedadFondo={enfermedadFondo}
          sintomas={sintomas}
          tratamientoActual={tratamientoActual}
          requiereOxigeno={requiereOxigeno}
          litrosOxigeno={litrosOxigeno}
          contacto={contacto}
          setContacto={setContacto}
          email={email}
          setEmail={setEmail}
          telefonos={telefonos}
          setTelefonos={setTelefonos}
          costo={costo}
          setCosto={setCosto}
          metodoPago={metodoPago}
          setMetodoPago={setMetodoPago}
          estadoServicio={estadoServicio}
          setEstadoServicio={setEstadoServicio}
          fechaHora={fechaHora}
          setFechaHora={setFechaHora}
          notas={notas}
          setNotas={setNotas}
          prioridad={prioridad}
          setPrioridad={setPrioridad}
          ambulancia={ambulancia}
          setAmbulancia={setAmbulancia}
          observaciones={observaciones}
          setObservaciones={setObservaciones}
        />
      )}
    </DashboardLayout>
  );
}

function EventCard({ children }: { children: ReactNode }) {
  return <div className="bg-white rounded-2xl shadow p-8 mt-8 border border-gray-100">{children}</div>;
}

function StepActions({ anteriorPaso, siguientePaso, submitLabel = "Continuar" }: { anteriorPaso: () => void; siguientePaso: () => void; submitLabel?: string }) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100">
      <button type="button" onClick={anteriorPaso} className="border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors">← Atrás</button>
      <button type="button" onClick={siguientePaso} className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-3 rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all">{submitLabel} →</button>
    </div>
  );
}

function PasoEventoInformacion({ eventoNombre, setEventoNombre, eventoTipo, setEventoTipo, eventoLugar, setEventoLugar, eventoDireccion, setEventoDireccion, anteriorPaso, siguientePaso }: {
  eventoNombre: string;
  setEventoNombre: (value: string) => void;
  eventoTipo: string;
  setEventoTipo: (value: string) => void;
  eventoLugar: string;
  setEventoLugar: (value: string) => void;
  eventoDireccion: string;
  setEventoDireccion: (value: string) => void;
  anteriorPaso: () => void;
  siguientePaso: () => void;
}) {
  return (
    <EventCard>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><CalendarDays className="text-red-600" size={22} /> Información del Evento</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <label className="md:col-span-2 block"><span className="block mb-2 font-semibold text-gray-700">Nombre del Evento *</span><input value={eventoNombre} onChange={(e) => setEventoNombre(e.target.value)} placeholder="Ej: Maratón Lima 2026" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500" /></label>
        <label className="block"><span className="block mb-2 font-semibold text-gray-700">Tipo de Evento *</span><input value={eventoTipo} onChange={(e) => setEventoTipo(e.target.value)} placeholder="Ej: Evento deportivo, Concierto" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500" /></label>
        <label className="block"><span className="block mb-2 font-semibold text-gray-700">Lugar del Evento *</span><input value={eventoLugar} onChange={(e) => setEventoLugar(e.target.value)} placeholder="Ej: Estadio Nacional" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500" /></label>
        <label className="md:col-span-2 block"><span className="block mb-2 font-semibold text-gray-700">Dirección (opcional)</span><input value={eventoDireccion} onChange={(e) => setEventoDireccion(e.target.value)} placeholder="Ej: Av. Javier Prado 123" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500" /></label>
      </div>
      <StepActions anteriorPaso={anteriorPaso} siguientePaso={siguientePaso} />
    </EventCard>
  );
}

function PasoEventoDuracion({ fechaHora, setFechaHora, eventoDuracion, setEventoDuracion, eventoUnidad, setEventoUnidad, anteriorPaso, siguientePaso }: {
  fechaHora: string;
  setFechaHora: (value: string) => void;
  eventoDuracion: string;
  setEventoDuracion: (value: string) => void;
  eventoUnidad: string;
  setEventoUnidad: (value: string) => void;
  anteriorPaso: () => void;
  siguientePaso: () => void;
}) {
  return (
    <EventCard>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Clock className="text-red-600" size={22} /> Duración del Servicio</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <label className="block"><span className="block mb-2 font-semibold text-gray-700">Fecha y Hora de Inicio *</span><input type="datetime-local" value={fechaHora} onChange={(e) => setFechaHora(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500" /></label>
        <label className="block"><span className="block mb-2 font-semibold text-gray-700">Duración *</span><input type="number" min="1" value={eventoDuracion} onChange={(e) => setEventoDuracion(e.target.value)} placeholder="3" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500" /></label>
        <label className="block"><span className="block mb-2 font-semibold text-gray-700">Unidad</span><select value={eventoUnidad} onChange={(e) => setEventoUnidad(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-red-500"><option>Horas</option><option>Días</option></select></label>
      </div>
      <StepActions anteriorPaso={anteriorPaso} siguientePaso={siguientePaso} />
    </EventCard>
  );
}

function PasoEventoPersonal({ requiereMedico, setRequiereMedico, requiereParamedico, setRequiereParamedico, requierePiloto, setRequierePiloto, detallePersonal, setDetallePersonal, anteriorPaso, siguientePaso }: {
  requiereMedico: boolean;
  setRequiereMedico: (value: boolean) => void;
  requiereParamedico: boolean;
  setRequiereParamedico: (value: boolean) => void;
  requierePiloto: boolean;
  setRequierePiloto: (value: boolean) => void;
  detallePersonal: string;
  setDetallePersonal: (value: string) => void;
  anteriorPaso: () => void;
  siguientePaso: () => void;
}) {
  return (
    <EventCard>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Users className="text-red-600" size={22} /> Personal Requerido</h2>
      <p className="text-sm text-gray-500 mb-4">Debe seleccionar Médico, Paramédico y Conductor para continuar.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PersonalOption checked={requiereMedico} setChecked={setRequiereMedico} title="Médico *" description="Atención médica especializada" />
        <PersonalOption checked={requiereParamedico} setChecked={setRequiereParamedico} title="Paramédico *" description="Soporte de emergencia" />
        <PersonalOption checked={requierePiloto} setChecked={setRequierePiloto} title="Piloto / Conductor *" description="Conducción de la unidad" />
      </div>
      <label className="block mt-6"><span className="block mb-2 font-semibold text-gray-700">Detalle de Cantidad de Personal</span><input value={detallePersonal} onChange={(e) => setDetallePersonal(e.target.value)} placeholder="Ej: 1 piloto, 2 paramédicos y 1 médico" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500" /></label>
      <p className="text-sm text-gray-400 mt-2">Especifique cuántas personas de cada tipo necesita.</p>
      <StepActions anteriorPaso={anteriorPaso} siguientePaso={siguientePaso} />
    </EventCard>
  );
}

function PersonalOption({ checked, setChecked, title, description }: { checked: boolean; setChecked: (value: boolean) => void; title: string; description: string }) {
  return (
    <button type="button" onClick={() => setChecked(!checked)} className={`text-left border rounded-2xl p-4 transition-all ${checked ? "border-red-500 bg-red-50" : "border-gray-200 bg-white"}`}>
      <div className="flex items-start gap-3"><input type="checkbox" checked={checked} readOnly className="mt-1" /><div><p className="font-bold text-gray-800">{title}</p><p className="text-sm text-gray-500 mt-1">{description}</p></div></div>
    </button>
  );
}

function PasoEventoContacto({ contacto, setContacto, telefono, setTelefono, email, setEmail, nombreEmpresa, setNombreEmpresa, rucEmpresa, setRucEmpresa, estadoServicio, setEstadoServicio, observaciones, setObservaciones, anteriorPaso, guardarServicio }: {
  contacto: string;
  setContacto: (value: string) => void;
  telefono: string;
  setTelefono: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  nombreEmpresa: string;
  setNombreEmpresa: (value: string) => void;
  rucEmpresa: string;
  setRucEmpresa: (value: string) => void;
  estadoServicio: string;
  setEstadoServicio: (value: string) => void;
  observaciones: string;
  setObservaciones: (value: string) => void;
  anteriorPaso: () => void;
  guardarServicio: () => void;
}) {
  const estados = ["Por cotizar", "Confirmado", "En Curso", "Completado", "Cancelado"];

  return (
    <EventCard>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Phone className="text-red-600" size={22} /> Información de Contacto</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <label className="block"><span className="block mb-2 font-semibold text-gray-700">Nombre del Contacto *</span><input value={contacto} onChange={(e) => setContacto(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500" /></label>
        <label className="block"><span className="block mb-2 font-semibold text-gray-700">Teléfono *</span><input value={telefono} maxLength={9} onChange={(e) => setTelefono(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500" /></label>
        <label className="block"><span className="block mb-2 font-semibold text-gray-700">Nombre de la empresa (opcional)</span><input value={nombreEmpresa} onChange={(e) => setNombreEmpresa(e.target.value)} placeholder="Ej: Empresa SAC" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500" /></label>
        <label className="block"><span className="block mb-2 font-semibold text-gray-700">RUC (opcional)</span><input value={rucEmpresa} maxLength={11} onChange={(e) => setRucEmpresa(e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="11 dígitos" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500" /></label>
        <label className="md:col-span-2 block"><span className="block mb-2 font-semibold text-gray-700">Email para Cotización (opcional)</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500" /><span className="text-xs text-gray-400 mt-1 block">La cotización se enviará a este email o por WhatsApp</span></label>
      </div>
      <div className="mt-6">
        <p className="font-semibold text-gray-700 mb-3">Estado del Servicio</p>
        <p className="mb-3 text-sm text-gray-500">Al crear un evento inicia automáticamente en <span className="font-bold text-gray-700">Por cotizar</span>.</p>
        <div className="flex flex-wrap gap-2">
          {estados.map((estado) => (
            <button
              key={estado}
              type="button"
              disabled={estado !== "Por cotizar"}
              onClick={() => setEstadoServicio(estado)}
              className={`px-4 py-2 rounded-full border text-sm font-semibold ${
                estadoServicio === estado
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-gray-200 bg-gray-50 text-gray-400"
              } ${estado !== "Por cotizar" ? "cursor-not-allowed opacity-60" : ""}`}
            >
              {estado}
            </button>
          ))}
        </div>
      </div>
      <label className="block mt-6"><span className="block mb-2 font-semibold text-gray-700">Observaciones Adicionales</span><textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 h-28 focus:outline-none focus:border-red-500" /></label>
      <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100"><button type="button" onClick={anteriorPaso} className="border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors">← Atrás</button><button type="button" onClick={guardarServicio} className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-3 rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all">Registrar Solicitud</button></div>
    </EventCard>
  );
}
