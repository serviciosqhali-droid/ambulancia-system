interface Props {
  origen: string;
  setOrigen: (value: string) => void;

  destinos: string[];
  setDestinos: (value: string[]) => void;

  anteriorPaso: () => void;
  siguientePaso: () => void;
}

export default function PasoDirecciones({
  origen,
  setOrigen,
  destinos,
  setDestinos,
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

  function actualizarDestino(
    index: number,
    value: string
  ) {

    const nuevos = [...destinos];

    nuevos[index] = value;

    setDestinos(nuevos);
  }

  return (

    <div className="bg-white rounded-2xl shadow p-8 mt-8">

      <h2 className="text-2xl font-bold mb-8">
        Direcciones
      </h2>

      <div className="space-y-6">

        <div>

          <label className="block mb-2 font-medium">
            Dirección de Recojo *
          </label>

          <input
            type="text"
            placeholder="Ej: Las Gaviotas, Cercado"
            value={origen}
            onChange={(e) => setOrigen(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Referencia de Recojo
          </label>

          <input
            type="text"
            placeholder="Ej: Al costado de la Iglesia"
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          />

        </div>

        <div>

          <label className="block mb-4 font-medium">
            Direcciones de Destino *
          </label>

          <div className="space-y-3">

            {destinos.map((destino, index) => (

              <div
                key={index}
                className="flex gap-3"
              >

                <input
                  type="text"
                  placeholder={`Destino ${index + 1}`}
                  value={destino}
                  onChange={(e) =>
                    actualizarDestino(
                      index,
                      e.target.value
                    )
                  }
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
                />

                {index !== 0 && (

                <button
                    onClick={() => eliminarDestino(index)}
                    className="border border-gray-300 px-4 rounded-xl"
                >
                    ✕
                </button>

)}

              </div>

            ))}

          </div>

        </div>

        <button
          onClick={agregarDestino}
          className="border border-gray-300 px-4 py-2 rounded-xl"
        >
          + Agregar Destino
        </button>

        <div className="flex items-center gap-3">

          <input type="checkbox" />

          <span>
            Es ida y vuelta
          </span>

        </div>

      </div>

      <div className="flex justify-between mt-10">

        <button
          onClick={anteriorPaso}
          className="border border-gray-300 px-6 py-3 rounded-xl"
        >
          ← Atrás
        </button>

        <button
          onClick={siguientePaso}
          className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl"
        >
          Continuar →
        </button>

      </div>

    </div>
  );
}