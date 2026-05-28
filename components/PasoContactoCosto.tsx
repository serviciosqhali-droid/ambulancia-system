"use client";

import { useEffect, useState } from "react";
import { Truck } from "lucide-react";

interface Props {
  anteriorPaso: () => void;
  guardarServicio: () => void;
  tipoServicio: string;
  paciente: string;
  edad: string;
  origen: string;
  destinos: string[];
  contacto: string;
  setContacto: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  telefonos: string[];
  setTelefonos: (value: string[]) => void;
  costo: string;
  setCosto: (value: string) => void;
  metodoPago: string;
  setMetodoPago: (value: string) => void;
  estadoServicio: string;
  setEstadoServicio: (value: string) => void;
  fechaHora: string;
  setFechaHora: (value: string) => void;
  notas: string;
  setNotas: (value: string) => void;
  prioridad: string;
  setPrioridad: (value: string) => void;
  ambulancia: string;
  setAmbulancia: (value: string) => void;
  observaciones: string;
  setObservaciones: (value: string) => void;
}

interface Ambulancia {
  id: number;
  placa: string;
  modelo: string;
  tipo: string;
  estado: string;
}

export default function PasoContactoCosto({
  anteriorPaso,
  guardarServicio,
  tipoServicio,
  paciente,
  edad,
  origen,
  destinos,
  contacto,
  setContacto,
  email,
  setEmail,
  telefonos,
  setTelefonos,
  costo,
  setCosto,
  metodoPago,
  setMetodoPago,
  estadoServicio,
  setEstadoServicio,
  fechaHora,
  setFechaHora,
  notas,
  setNotas,
  prioridad,
  setPrioridad,
  ambulancia,
  setAmbulancia,
  observaciones,
  setObservaciones,
}: Props) {
  const [ambulanciasDisponibles, setAmbulanciasDisponibles] = useState<Ambulancia[]>([]);
  const [total, setTotal] = useState(0);
  const [mensajeWhatsapp, setMensajeWhatsapp] = useState("");

  // Cargar ambulancias desde la API
  useEffect(() => {
    async function loadAmbulancias() {
      try {
        const res = await fetch("/api/ambulancias");
        if (res.ok) {
          const data = await res.json();
          // Filtrar preferiblemente las disponibles, o mostrar todas indicando su estado
          setAmbulanciasDisponibles(data);
          
          // Si no hay ambulancia seleccionada, elegir la primera disponible por defecto
          if (!ambulancia && data.length > 0) {
            const disponible = data.find((a: Ambulancia) => a.estado === "Disponible");
            setAmbulancia(disponible ? disponible.placa : data[0].placa);
          }
        }
      } catch (err) {
        console.error("Error al cargar ambulancias en el stepper", err);
      }
    }
    loadAmbulancias();
  }, []);

  // Calcular total con recargo por tarjeta (5%)
  useEffect(() => {
    const monto = Number(costo) || 0;
    if (metodoPago === "Tarjeta") {
      const recargo = monto * 0.05;
      setTotal(monto + recargo);
    } else {
      setTotal(monto);
    }
  }, [costo, metodoPago]);

  // Establecer fecha por defecto si está vacía
  useEffect(() => {
    if (!fechaHora) {
      const ahora = new Date();
      // Formato YYYY-MM-DDThh:mm
      const fecha = ahora.toISOString().slice(0, 16);
      setFechaHora(fecha);
    }
  }, [fechaHora, setFechaHora]);

  function agregarTelefono() {
    setTelefonos([...telefonos, ""]);
  }

  function eliminarTelefono(index: number) {
    const nuevos = telefonos.filter((_, i) => i !== index);
    setTelefonos(nuevos);
  }

  function actualizarTelefono(index: number, value: string) {
    const nuevos = [...telefonos];
    nuevos[index] = value;
    setTelefonos(nuevos);
  }

  function generarMensajeWhatsapp() {
    const mensaje = `🚑 *SERVICIO DE ${tipoServicio.toUpperCase()}*

*Paciente:* ${paciente}
*Edad:* ${edad ? `${edad} años` : "No especificado"}

📍 *UBICACIONES*
*Recojo:* ${origen}
${observaciones ? `*Observaciones de recojo:* ${observaciones}\n` : ""}
*Traslado a:*
${destinos
  .map((destino, index) => `${index + 1}. ${destino}`)
  .join("\n")}

👤 *Contacto:* ${contacto || "No especificado"}
*Teléfono:* ${telefonos.filter(Boolean).join(" / ") || "No especificado"}
*Ambulancia Asignada:* ${ambulancia || "Por asignar"}

💰 *Costo:* S/. ${total.toFixed(2)} (${metodoPago})
`;

    setMensajeWhatsapp(mensaje);
  }

  return (
    <div className="bg-white rounded-2xl shadow p-8 mt-8">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">
        Contacto, Asignación y Costo
      </h2>

      {/* Bloque Asignación y Prioridad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-red-50/50 rounded-2xl border border-red-100/50">
        <div className="md:col-span-2">
          <label className="block mb-2 font-semibold text-gray-700 flex items-center gap-1.5">
            <Truck size={18} className="text-red-600" />
            Asignar Ambulancia *
          </label>
          <select
            value={ambulancia}
            onChange={(e) => setAmbulancia(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-red-500"
            required
          >
            <option value="">-- Seleccionar Ambulancia --</option>
            {ambulanciasDisponibles.map((amb) => (
              <option key={amb.id} value={amb.placa}>
                {amb.placa} - {amb.modelo} ({amb.estado})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Prioridad *
          </label>
          <select
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-red-500"
            required
          >
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
            <option value="Crítica">Crítica</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Nombre del Contacto *
          </label>
          <input
            type="text"
            value={contacto}
            onChange={(e) => setContacto(e.target.value)}
            placeholder="Ej: Carlos García"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Email (Opcional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ej: contacto@correo.com"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Listado de teléfonos dinámico */}
      <div className="mt-8">
        <label className="block mb-4 font-semibold text-gray-700">
          Teléfonos de Contacto *
        </label>
        <div className="space-y-3">
          {telefonos.map((tel, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                value={tel}
                onChange={(e) => actualizarTelefono(index, e.target.value.replace(/\D/g, ""))}
                placeholder="Ej: 999888777"
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500"
                required
              />
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => eliminarTelefono(index)}
                  className="border border-gray-300 px-4 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={agregarTelefono}
          className="mt-4 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl transition-colors font-medium cursor-pointer"
        >
          + Agregar Teléfono
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Costo del Servicio (S/.) *
          </label>
          <input
            type="number"
            value={costo}
            onChange={(e) => setCosto(e.target.value)}
            placeholder="Ej: 250"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Método de Pago
          </label>
          <select
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-red-500"
          >
            <option value="Yape">Yape</option>
            <option value="Transferencia">Transferencia</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Tarjeta">Tarjeta</option>
          </select>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 rounded-xl p-5 border border-gray-100">
        <p className="font-semibold text-gray-500">Monto Total a Cobrar:</p>
        <p className="text-3xl font-black text-red-600 mt-2">
          S/ {total.toFixed(2)}
        </p>
        {metodoPago === "Tarjeta" && (
          <p className="text-xs text-gray-400 mt-2 font-medium">
            * Incluye 5% adicional por comisión de pago con tarjeta.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Estado Inicial del Servicio
          </label>
          <select
            value={estadoServicio}
            onChange={(e) => setEstadoServicio(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-red-500"
          >
            <option value="Cotización">Cotización</option>
            <option value="Confirmado">Confirmado</option>
            <option value="En Curso">En Curso</option>
            <option value="Completado">Completado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Fecha y Hora Programada *
          </label>
          <input
            type="datetime-local"
            value={fechaHora}
            onChange={(e) => setFechaHora(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500"
            required
          />
        </div>
      </div>

      <div className="mt-8">
        <label className="block mb-2 font-medium text-gray-700">
          Observaciones del Traslado (Opcional)
        </label>
        <input
          type="text"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Ej: Paciente en silla de ruedas, bajar del 3er piso"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 mb-6"
        />

        <label className="block mb-2 font-medium text-gray-700">
          Notas Adicionales Internas (Opcional)
        </label>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Notas internas que no se enviarán al cliente por WhatsApp"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 h-28 focus:outline-none focus:border-red-500"
        />
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={generarMensajeWhatsapp}
          className="bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          💬 Generar Mensaje WhatsApp
        </button>
      </div>

      {mensajeWhatsapp && (
        <div className="mt-6 bg-green-50/50 border border-green-100 p-5 rounded-2xl animate-fadeIn">
          <label className="block mb-2 font-semibold text-green-800">
            Vista Previa del Mensaje para el Cliente:
          </label>
          <textarea
            value={mensajeWhatsapp}
            readOnly
            className="w-full border border-green-200 bg-white rounded-xl px-4 py-3 h-72 text-sm text-gray-700 font-mono focus:outline-none"
          />

          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(mensajeWhatsapp);
              alert("Mensaje copiado al portapapeles 📋🚑");
            }}
            className="mt-4 bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            Copiar Mensaje
          </button>
        </div>
      )}

      <div className="flex justify-between mt-12 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={anteriorPaso}
          className="border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
        >
          ← Atrás
        </button>

        <button
          type="button"
          onClick={guardarServicio}
          className="bg-red-600 hover:bg-red-500 text-white font-extrabold px-8 py-3 rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          Registrar Nuevo Servicio 🚑
        </button>
      </div>
    </div>
  );
}