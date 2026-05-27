interface Props {
  paciente: string;
  setPaciente: (value: string) => void;
  siguientePaso: () => void;
  anteriorPaso: () => void;
}

export default function PasoPaciente({
  paciente,
  setPaciente,
  siguientePaso,
  anteriorPaso,
}: Props) {

  return (

    <div className="bg-white rounded-2xl shadow p-8 mt-8">

      <h2 className="text-2xl font-bold mb-8">
        Información del Paciente
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <input
          type="text"
          placeholder="Nombre completo"
          value={paciente}
          onChange={(e) => setPaciente(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-3"
        />

        <input
          type="number"
          placeholder="Edad"
          className="border border-gray-300 rounded-xl px-4 py-3"
        />

        <input
          type="number"
          placeholder="Peso"
          className="border border-gray-300 rounded-xl px-4 py-3"
        />

      </div>

      <div className="flex justify-end mt-8">

        <button
          onClick={siguientePaso}
          className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl"
        >
          Continuar
        </button>

      </div>

    </div>
  );
}