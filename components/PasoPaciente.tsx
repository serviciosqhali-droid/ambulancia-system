interface Props {
  paciente: string;
  tipoServicio: string;
  setPaciente: (value: string) => void;
  edad: string;
  setEdad: (value: string) => void;
  peso: string;
  setPeso: (value: string) => void;
  siguientePaso: () => void;
  anteriorPaso: () => void;
}

export default function PasoPaciente({
  paciente,
  tipoServicio,
  setPaciente,
  edad,
  setEdad,
  peso,
  setPeso,
  siguientePaso,
  anteriorPaso,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow p-8 mt-8">
      <h2 className="text-2xl font-bold mb-8">
        {tipoServicio === "Evento" ? "Información del Cliente / Evento" : "Información del Paciente"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-medium text-gray-700">{tipoServicio === "Evento" ? "Empresa u organizador *" : "Nombre completo del paciente *"}</label>
          <input
            type="text"
            placeholder={tipoServicio === "Evento" ? "Ej: Empresa Eventos S.A." : "Ej: Juan Pérez"}
            value={paciente}
            onChange={(e) => setPaciente(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">{tipoServicio === "Evento" ? "Edad (opcional)" : "Edad (Años) *"}</label>
          <input
            type="number"
            placeholder="Ej: 45"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500"
            required={tipoServicio === "Traslado"}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Peso (kg) (Opcional)</label>
          <input
            type="number"
            placeholder="Ej: 70"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <button
          onClick={anteriorPaso}
          className="border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
        >
          ← Atrás
        </button>
        <button
          onClick={siguientePaso}
          className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Continuar →
        </button>
      </div>
    </div>
  );
}