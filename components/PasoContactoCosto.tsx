"use client";

import { useEffect, useState } from "react";

interface Props {
  anteriorPaso: () => void;
  guardarServicio: () => void;

  tipoServicio: string;
  paciente: string;
  origen: string;
  destinos: string[];
}

export default function PasoContactoCosto({
  anteriorPaso,
  guardarServicio,
  tipoServicio,
  paciente,
  origen,
  destinos,
}: Props) {

  const [telefonos, setTelefonos] =
    useState([""]);

  const [metodoPago, setMetodoPago] =
    useState("Yape");

  const [costo, setCosto] =
    useState("");

  const [total, setTotal] =
    useState(0);

  const [fechaHora, setFechaHora] =
    useState("");

  const [mensajeWhatsapp, setMensajeWhatsapp] =
    useState(""); 

  useEffect(() => {

    const ahora = new Date();

    const fecha =
      ahora.toISOString().slice(0, 16);

    setFechaHora(fecha);

  }, []);

  useEffect(() => {

    const monto = Number(costo);

    if (metodoPago === "Tarjeta") {

      const recargo = monto * 0.05;

      setTotal(monto + recargo);

    } else {

      setTotal(monto);
    }

  }, [costo, metodoPago]);

  function agregarTelefono() {

    setTelefonos([
      ...telefonos,
      "",
    ]);
  }

  function eliminarTelefono(index: number) {

    const nuevos =
      telefonos.filter(
        (_, i) => i !== index
      );

    setTelefonos(nuevos);
  }

  function actualizarTelefono(
    index: number,
    value: string
  ) {

    const nuevos = [...telefonos];

    nuevos[index] = value;

    setTelefonos(nuevos);
  }
  function generarMensajeWhatsapp() {

  const mensaje = `🚑 *SERVICIO DE ${tipoServicio.toUpperCase()}*

*Paciente:* ${paciente}
*Edad:* 45 años

📍 *UBICACIONES*
*Recojo:* ${origen}
_Referencia: Casa azul con portón blanco_

*Traslado a:*
${destinos
  .map(
    (destino, index) =>
      `${index + 1}. ${destino}`
  )
  .join("\n")}

*Síntomas:* Dolor abdominal agudo

👤 *Contacto:* Carlos García
📞 *Teléfono:* ${telefonos[0]}

💰 *Costo:* S/. ${total}
`;

  setMensajeWhatsapp(mensaje);
}

  return (

    <div className="bg-white rounded-2xl shadow p-8 mt-8">

      <h2 className="text-2xl font-bold mb-8">
        Contacto y Costo
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>

          <label className="block mb-2 font-medium">
            Nombre del Contacto
          </label>

          <input
            type="text"
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Email (Opcional)
          </label>

          <input
            type="email"
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          />

        </div>

      </div>

      <div className="mt-8">

        <label className="block mb-4 font-medium">
          Teléfonos
        </label>

        <div className="space-y-3">

          {telefonos.map((telefono, index) => (

            <div
              key={index}
              className="flex gap-3"
            >

              <input
                type="text"
                value={telefono}
                onChange={(e) =>
                  actualizarTelefono(
                    index,
                    e.target.value.replace(/\D/g, "")
                  )
                }
                placeholder="999999999"
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
              />

              {index !== 0 && (

                <button
                  onClick={() =>
                    eliminarTelefono(index)
                  }
                  className="border border-gray-300 px-4 rounded-xl"
                >
                  ✕
                </button>

              )}

            </div>

          ))}

        </div>

        <button
          onClick={agregarTelefono}
          className="mt-4 border border-gray-300 px-4 py-2 rounded-xl"
        >
          + Agregar Teléfono
        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

        <div>

          <label className="block mb-2 font-medium">
            Costo del Servicio
          </label>

          <input
            type="number"
            value={costo}
            onChange={(e) =>
              setCosto(e.target.value)
            }
            placeholder="250"
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Método de Pago
          </label>

          <select
            value={metodoPago}
            onChange={(e) =>
              setMetodoPago(e.target.value)
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          >
            <option>Yape</option>
            <option>Transferencia</option>
            <option>Efectivo</option>
            <option>Tarjeta</option>
          </select>

        </div>

      </div>

      <div className="mt-6 bg-gray-100 rounded-xl p-4">

        <p className="font-medium">
          Total:
        </p>

        <p className="text-2xl font-bold text-red-600 mt-2">

          S/ {total.toFixed(2)}

        </p>

        {metodoPago === "Tarjeta" && (

          <p className="text-sm text-gray-500 mt-2">

            Incluye 5% adicional por pago con tarjeta

          </p>

        )}

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

        <div>

          <label className="block mb-2 font-medium">
            Estado del Servicio
          </label>

          <select
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          >
            <option>Cotización</option>
            <option>Confirmado</option>
            <option>En Curso</option>
            <option>Completado</option>
            <option>Cancelado</option>
          </select>

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Fecha y Hora
          </label>

          <input
            type="datetime-local"
            value={fechaHora}
            onChange={(e) =>
              setFechaHora(e.target.value)
            }
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          />

        </div>

      </div>

      <div className="mt-8">

  <label className="block mb-2 font-medium">
    Notas Adicionales
  </label>

  <textarea
    className="w-full border border-gray-300 rounded-xl px-4 py-3 h-32"
  />

</div>

<div className="mt-8">

  <button
    onClick={generarMensajeWhatsapp}
    className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl"
  >
    Generar Mensaje WhatsApp
  </button>

</div>

{mensajeWhatsapp && (

  <div className="mt-8">

    <label className="block mb-2 font-medium">
      Mensaje para WhatsApp
    </label>

    <textarea
      value={mensajeWhatsapp}
      readOnly
      className="w-full border border-gray-300 rounded-xl px-4 py-3 h-72"
    />

    <button
      onClick={() => {

        navigator.clipboard.writeText(
          mensajeWhatsapp
        );

        alert("Mensaje copiado para WhatsApp 🚑");

      }}
      className="mt-4 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl"
    >
      Copiar para WhatsApp
    </button>

  </div>

)}

      



      <div className="flex justify-between mt-10">

        <button
          onClick={anteriorPaso}
          className="border border-gray-300 px-6 py-3 rounded-xl"
        >
          ← Atrás
        </button>

        <button
          onClick={guardarServicio}
          className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl"
        >
          Registrar Nuevo Servicio
        </button>

      </div>

    </div>
  );
}