"use client";
import NuevoServicioStepper from "@/components/NuevoServicioStepper";
import PasoPaciente from "@/components/PasoPaciente";
import { useState } from "react";
import {
  Ambulance,
  CalendarDays,
} from "lucide-react";
import PasoDirecciones from "@/components/PasoDirecciones";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import PasoMedico from "@/components/PasoMedico";
import PasoContactoCosto from "@/components/PasoContactoCosto";

export default function NuevoServicioPage() {

  const [pasoActual, setPasoActual] = useState(1);
  const [paciente, setPaciente] = useState("");
  const [tipoServicio, setTipoServicio] = useState("Emergencia");
  const [servicioSeleccionado, setServicioSeleccionado] = useState("");
  const [origen, setOrigen] = useState("");
  const [destinos, setDestinos] = useState([""]);
  const [prioridad, setPrioridad] = useState("Alta");
  const [ambulancia, setAmbulancia] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [contacto, setContacto] = useState("");

  const [telefono, setTelefono] = useState("");

  const [email, setEmail] = useState("");

  const [costo, setCosto] = useState("");

  const [metodoPago, setMetodoPago] =
    useState("Yape");

  const [estado, setEstado] =
    useState("Cotización");

  const [fechaHora, setFechaHora] =
    useState("");

  const [notas, setNotas] =
    useState("");

  function siguientePaso() {

  if (pasoActual === 2 && !paciente) {
    alert("Ingrese paciente");
    return;
  }

  if (pasoActual === 3 && !origen) {
    alert("Ingrese dirección de recojo");
    return;
  }

  setPasoActual(pasoActual + 1);
}

function anteriorPaso() {
  setPasoActual(pasoActual - 1);
}

  async function guardarServicio() {

    await fetch("/api/servicios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paciente,
        tipoServicio,
        origen,
        destinos,
        prioridad,
        ambulancia,
        observaciones,
        contacto,
        telefono,
        email,
        costo,
        metodoPago,
        estado,
        fechaHora,
        notas,
      }),
    });

    alert("Servicio registrado 🚑");

    setPaciente("");
    setOrigen("");
    setDestinos([""]);
    setAmbulancia("");
    setObservaciones("");
  }

  return (
  <DashboardLayout>

    <div>

      <h1 className="text-4xl font-bold text-gray-800">
        Nuevo Servicio
      </h1>

      <p className="text-gray-500 mt-2">
        Registro y despacho de servicios médicos
      </p>
      <NuevoServicioStepper pasoActual={pasoActual} />

    </div>

    {!servicioSeleccionado && (

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">

        <div
          onClick={() => {
            setServicioSeleccionado("Traslado");
            setPasoActual(2);
            setTipoServicio("Traslado");
          }}
          className="bg-white rounded-2xl shadow p-8 cursor-pointer hover:scale-105 transition"
        >

          <div className="bg-red-100 w-16 h-16 rounded-2xl flex items-center justify-center">

            <Ambulance
              className="text-red-600"
              size={32}
            />

          </div>

          <h2 className="text-3xl font-bold mt-6">
            Traslado de Paciente
          </h2>

          <p className="text-gray-500 mt-4">
            Transporte médico con atención al paciente.
          </p>

        </div>

        <div
          onClick={() => {
            setServicioSeleccionado("Evento");
            setPasoActual(2);
            setTipoServicio("Evento");
          }}
          className="bg-white rounded-2xl shadow p-8 cursor-pointer hover:scale-105 transition"
        >

          <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center">

            <CalendarDays
              className="text-blue-600"
              size={32}
            />

          </div>

          <h2 className="text-3xl font-bold mt-6">
            Alquiler para Evento
          </h2>

          <p className="text-gray-500 mt-4">
            Cobertura médica para eventos y actividades.
          </p>

        </div>

      </div>

    )}

    {servicioSeleccionado && pasoActual === 2 && (

      <PasoPaciente
      paciente={paciente}
      setPaciente={setPaciente}
      siguientePaso={siguientePaso}
      anteriorPaso={anteriorPaso}
      />
    )}
    {servicioSeleccionado && pasoActual === 3 && (

  <PasoDirecciones
    origen={origen}
    setOrigen={setOrigen}
    destinos={destinos}
    setDestinos={setDestinos}
    anteriorPaso={anteriorPaso}
    siguientePaso={siguientePaso}
  />
  

)}
{servicioSeleccionado && pasoActual === 4 && (

  <PasoMedico
    anteriorPaso={anteriorPaso}
    siguientePaso={siguientePaso}
  />

)}
{servicioSeleccionado && pasoActual === 5 && (

  <PasoContactoCosto
  anteriorPaso={anteriorPaso}
  guardarServicio={guardarServicio}
  tipoServicio={tipoServicio}
  paciente={paciente}
  origen={origen}
  destinos={destinos}
  />

)}

  </DashboardLayout>
);
}