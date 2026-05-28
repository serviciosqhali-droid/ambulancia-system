interface Props {
  origen: string;
  setOrigen: (value: string) => void;
  referencia: string;
  setReferencia: (value: string) => void;
  destinos: string[];
  setDestinos: (value: string[]) => void;
  esIdaYVuelta: boolean;
  setEsIdaYVuelta: (value: boolean) => void;
  anteriorPaso: () => void;
  siguientePaso: () => void;
}

export default function PasoDirecciones({
  origen,
  setOrigen,
  referencia,
  setReferencia,
  destinos,
  setDestinos,
  esIdaYVuelta,
  setEsIdaYVuelta,
  anteriorPaso,
  siguientePaso,
}: Props) {
  function agregarDestino() {
    setDestinos([...destinos, ""]);
  }

  function eliminarDestino(index: number) {
    const nuevos = destinos.filter((_, i) => i !== index);
    setDestinos(nuevos);
  }

  function actualizarDestino(index: number, value: string) {
    const nuevos = [...destinos];
    nuevos[index] = value;
    setDestinos(nuevos);
  }

  return (
    <div className="bg-white rounded-2xl shadow p-8 mt-8">
      <h2 className="text-2xl font-bold mb-8">
        Direcciones del Servicio
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Dirección de Recojo *
          </label>
          <input
            type="text"
            placeholder="Ej: Las Gaviotas 123, Cercado"
            value={origen}
            onChange={(e) => setOrigen(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Referencia de Recojo (Opcional)
          </label>
          <input
            type="text"
            placeholder="Ej: Al costado de la Iglesia, portón azul"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="block mb-4 font-medium text-gray-700">
            Direcciones de Destino *
          </label>
          <div className="space-y-3">
            {destinos.map((destino, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  placeholder={`Destino ${index + 1}`}
                  value={destino}
                  onChange={(e) => actualizarDestino(index, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500"
                  required
                />
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => eliminarDestino(index)}
                    className="border border-gray-300 px-4 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={agregarDestino}
          className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl transition-colors cursor-pointer font-medium"
        >
          + Agregar Destino
        </button>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <input 
            type="checkbox" 
            id="esIdaYVuelta"
            checked={esIdaYVuelta}
            onChange={(e) => setEsIdaYVuelta(e.target.checked)}
            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
          />
          <label htmlFor="esIdaYVuelta" className="select-none cursor-pointer font-medium text-gray-700">
            Es viaje de ida y vuelta (Retorno al punto de recojo)
          </label>
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <button
          type="button"
          onClick={anteriorPaso}
          className="border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
        >
          ← Atrás
        </button>

        <button
          type="button"
          onClick={siguientePaso}
          className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Continuar →
        </button>
      </div>
    </div>
  );
}