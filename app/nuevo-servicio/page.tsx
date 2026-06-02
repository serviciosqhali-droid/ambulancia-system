"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ambulance, CalendarDays } from "lucide-react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import NuevoServicioStepper from "@/components/NuevoServicioStepper";
import PasoPaciente from "@/components/PasoPaciente";
import PasoDirecciones from "@/components/PasoDirecciones";
import PasoMedico from "@/components/PasoMedico";
import PasoContactoCosto from "@/components/PasoContactoCosto";

export default function NuevoServicioPage() {
  const router = useRouter();

  // Estados globales del Stepper
  const [pasoActual, setPasoActual] = useState(1);
  const [servicioSeleccionado, setServicioSeleccionado] = useState("");
  const [tipoServicio, setTipoServicio] = useState("Traslado");

  // Paso 2: Paciente
  const [paciente, setPaciente] = useState("");
  const [edad, setEdad] = useState("");
  const [peso, setPeso] = useState("");

  // Paso 3: Direcciones
  const [origen, setOrigen] = useState("");
  const [referencia, setReferencia] = useState("");
  const [destinos, setDestinos] = useState([""]);
  const [esIdaYVuelta, setEsIdaYVuelta] = useState(false);

  // Paso 4: Información Médica
  const [diagnostico, setDiagnostico] = useState("");
  const [enfermedadFondo, setEnfermedadFondo] = useState("");
  const [sintomas, setSintomas] = useState("");
  const [tratamientoActual, setTratamientoActual] = useState("");
  const [requiereOxigeno, setRequiereOxigeno] = useState("No");
  const [litrosOxigeno, setLitrosOxigeno] = useState("");

  // Paso 5: Contacto y Costo
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

  function siguientePaso() {
    // Validar Paso 2 (Paciente)
    if (pasoActual === 2) {
      if (!paciente.trim()) {
        alert("Por favor, ingrese el nombre completo del paciente.");
        return;
      }
      if (tipoServicio === "Traslado" && !edad.trim()) {
        alert("Por favor, ingrese la edad del paciente.");
        return;
      }
    }

    // Validar Paso 3 (Direcciones)
    if (pasoActual === 3) {
      if (!origen.trim()) {
        alert("Por favor, ingrese la dirección de recojo.");
        return;
      }
      const destinosValidos = destinos.filter(d => d.trim() !== "");
      if (destinosValidos.length === 0) {
        alert("Por favor, ingrese al menos una dirección de destino válida.");
        return;
      }
    }

    // Validar Paso 4 (Médico)
    if (pasoActual === 4) {
      if (requiereOxigeno === "Si" && !litrosOxigeno.trim()) {
        alert("Por favor, indique los litros de oxígeno por minuto (LPM).");
        return;
      }
    }

    setPasoActual(pasoActual + 1);
  }

  function anteriorPaso() {
    if (pasoActual === 2) {
      // Regresa a la selección de tipo de servicio
      setServicioSeleccionado("");
      setPasoActual(1);
    } else {
      setPasoActual(pasoActual - 1);
    }
  }

  async function guardarServicio() {
    // Validaciones del paso final
    if (!contacto.trim()) {
      alert("Por favor, ingrese el nombre del contacto.");
      return;
    }
    const telefonosValidos = telefonos.filter(t => t.trim() !== "");
    if (telefonosValidos.length === 0) {
      alert("Por favor, ingrese al menos un teléfono de contacto.");
      return;
    }
    if (!costo.trim() || isNaN(Number(costo))) {
      alert("Por favor, ingrese un costo válido para el servicio.");
      return;
    }
    if (!ambulancia) {
      alert("Por favor, asigne una ambulancia para este servicio.");
      return;
    }

    try {
      const res = await fetch("/api/servicios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paciente,
          edad: edad ? Number(edad) : null,
          peso: peso ? Number(peso) : null,
          tipoServicio,
          origen,
          referencia,
          destinos: destinos.filter(d => d.trim() !== ""),
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
        }),
      });

      if (res.ok) {
        alert("¡Servicio registrado exitosamente! 🚑🎉");
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
        <h1 className="text-4xl font-bold text-gray-800">
          Nuevo Servicio
        </h1>
        <p className="text-gray-500 mt-2">
          Despacho y cotización de traslados médicos o coberturas para eventos.
        </p>
        <NuevoServicioStepper pasoActual={pasoActual} />
      </div>

      {/* Paso 1: Selección de Tipo de Servicio */}
      {!servicioSeleccionado && pasoActual === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div
            onClick={() => {
              setServicioSeleccionado("Traslado");
              setTipoServicio("Traslado");
              setPasoActual(2);
            }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <div className="bg-red-100 w-16 h-16 rounded-2xl flex items-center justify-center">
              <Ambulance className="text-red-600" size={32} />
            </div>
            <h2 className="text-3xl font-bold mt-6 text-gray-800">
              Traslado de Paciente
            </h2>
            <p className="text-gray-500 mt-4 leading-relaxed">
              Transporte médico con soporte asistencial, camilla y paramédicos para clínicas u hospitales.
            </p>
          </div>

          <div
            onClick={() => {
              setServicioSeleccionado("Evento");
              setTipoServicio("Evento");
              setPasoActual(2);
            }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center">
              <CalendarDays className="text-blue-600" size={32} />
            </div>
            <h2 className="text-3xl font-bold mt-6 text-gray-800">
              Alquiler para Evento
            </h2>
            <p className="text-gray-500 mt-4 leading-relaxed">
              Cobertura médica preventiva y estacionamiento de ambulancia para eventos, conciertos o deportes.
            </p>
          </div>
        </div>
      )}

      {/* Paso 2: Información del Paciente */}
      {servicioSeleccionado && pasoActual === 2 && (
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

      {/* Paso 3: Direcciones */}
      {servicioSeleccionado && pasoActual === 3 && (
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

      {/* Paso 4: Información Médica */}
      {servicioSeleccionado && pasoActual === 4 && (
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

      {/* Paso 5: Contacto y Costo */}
      {servicioSeleccionado && pasoActual === 5 && (
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